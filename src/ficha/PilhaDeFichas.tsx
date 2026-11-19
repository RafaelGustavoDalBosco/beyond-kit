"use client";

import { Check, Link, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "../lib/cn";
import { Botao } from "../ui/botao";

import type { Ficha, UsePilha } from "./pilha";

/** O que o consumidor diz de cada tipo de ficha: o nome, o título curto da lombada e o conteúdo. */
export type DefinicaoDaFicha = {
  /** @deprecated Sem efeito: os painéis empilhados do Lastro não levam ícone. */
  icone?: LucideIcon;
  rotulo: string;
  /** O nome curto na lombada; sem ele, o rótulo e o id. */
  titulo?: (id: string) => ReactNode;
  render: (id: string) => ReactNode;
};

export type RegistroDeFichas<T extends string = string> = Record<T, DefinicaoDaFicha>;

/** O nome de uma ficha na lombada: "Produto · Refrigerante cola 2 L", ou o rótulo e o id. */
function nomeDaFicha<T extends string>(def: DefinicaoDaFicha, f: Ficha<T>) {
  return def.titulo ? (
    <>
      {def.rotulo} · {def.titulo(f.id)}
    </>
  ) : (
    <>
      {def.rotulo} <span className="numero">{f.id}</span>
    </>
  );
}

/**
 * Os painéis empilhados do Lastro: a pilha vem do `usePilha` do adaptador (mora na URL) e cada tipo, do registro
 * `fichas`. Cada ficha abre num painel de 560px à direita, por cima da tela, sem trocá-la; as anteriores viram lombadas
 * à esquerda dele, e clicar numa volta até ela. Esc ou Alt ← volta um nível; o ✕ ou o clique fora fecham tudo. No
 * celular o painel ocupa a tela e as lombadas saem (o Voltar faz o papel delas).
 */
export function PilhaDeFichas<T extends string = string>({
  usePilha,
  fichas,
}: {
  usePilha: UsePilha<T>;
  fichas: Record<T, DefinicaoDaFicha>;
}) {
  const { pilha, voltar, voltarPara, fechar } = usePilha();
  const painel = useRef<HTMLElement>(null);
  const aberta = pilha.length > 0;
  // o portal só depois de montar: no servidor não há document
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // o `voltar` do adaptador muda a cada render: a tecla lê o de agora
  const voltarAgora = useRef(voltar);
  voltarAgora.current = voltar;

  // O foco entra no painel só quando a pilha abre, nunca a cada render (tiraria o foco de um campo da ficha). Ao
  // fechar tudo, volta para quem abriu (a linha, a referência da prévia), se ainda está na tela; os filtros, a
  // seleção e a rolagem da tela de origem não mudam, porque a pilha abre por cima dela.
  const origem = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!montado) return;
    if (aberta) {
      const ativo = document.activeElement;
      if (ativo instanceof HTMLElement && ativo !== document.body && !painel.current?.parentElement?.contains(ativo)) origem.current = ativo;
      painel.current?.focus({ preventScroll: true });
    } else if (origem.current) {
      if (origem.current.isConnected) origem.current.focus({ preventScroll: true });
      origem.current = null;
    }
  }, [aberta, montado]);

  useEffect(() => {
    if (!aberta) return;
    // Na captura da janela, antes da gaveta de baixo (que veria o Esc já atendido). O Esc dado com o foco num modal,
    // menu ou lista que abriu por cima fica com ele.
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.key !== "Escape" && !(e.altKey && e.key === "ArrowLeft")) return;
      const alvo = e.target instanceof Element ? e.target : null;
      const naPilha = alvo && painel.current?.parentElement?.contains(alvo);
      if (alvo && !naPilha && alvo.closest('[role="dialog"], [role="menu"], [role="listbox"]')) return;
      e.preventDefault();
      voltarAgora.current();
    };
    window.addEventListener("keydown", aoTeclar, true);
    return () => window.removeEventListener("keydown", aoTeclar, true);
  }, [aberta]);

  if (!aberta || !montado) return null;
  const topo = pilha.at(-1)!;
  const defDoTopo = fichas[topo.tipo];

  // o véu fica acima da folha da gaveta no celular (z 45) e abaixo dos modais (z 50)
  return createPortal(
    <div
      className="pilha-veu top-14 z-46 celular:top-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) fechar();
      }}
    >
      <div className="pilha" role="dialog" aria-modal="true" aria-label={defDoTopo?.rotulo ?? "Ficha"}>
        {pilha.slice(0, -1).map((f, i) => {
          const def = fichas[f.tipo];
          if (!def) return null;
          return (
            <button
              key={`${i}-${f.tipo}-${f.id}`}
              type="button"
              className="pilha-lombada celular:hidden"
              title="Voltar a esta ficha"
              onClick={() => voltarPara(i)}
            >
              <span>{nomeDaFicha(def, f)}</span>
            </button>
          );
        })}
        <section ref={painel} tabIndex={-1} className="pilha-painel outline-none celular:w-screen celular:max-w-none">
          <Topo nivel={pilha.length} aoVoltar={voltar} aoFechar={fechar} />
          {pilha.map((f, i) => {
            // As duas fichas logo abaixo da do topo ficam montadas, escondidas: voltar a elas não perde a aba nem o
            // que estava digitado.
            const recuo = pilha.length - 1 - i;
            if (recuo > 2) return null;
            const def = fichas[f.tipo];
            if (!def) return null;
            return (
              <div
                key={`${i}-${f.tipo}-${f.id}`}
                className={cn("pilha-corpo min-h-0 flex-1", recuo === 0 ? "animate-entrar" : "hidden")}
              >
                {def.render(f.id)}
              </div>
            );
          })}
        </section>
      </div>
    </div>,
    document.body,
  );
}

/** A linha do alto do painel: o Voltar (com mais de um nível), o nível, o copiar o link (a pilha mora na URL) e o ✕
 * que fecha tudo. */
function Topo({ nivel, aoVoltar, aoFechar }: { nivel: number; aoVoltar: () => void; aoFechar: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  return (
    <header className="pilha-topo">
      {nivel > 1 && (
        <Botao tipo="secundario" tamanho="sm" title="Voltar um nível (Esc ou Alt ←)" onClick={aoVoltar}>
          ‹ Voltar
        </Botao>
      )}
      <span className="pilha-nivel">
        Nível <span className="numero">{nivel}</span>
      </span>
      <Botao tipo="fantasma" tamanho="sm" className="ml-auto" aria-label={copiado ? "Copiado" : "Copiar o link"} onClick={copiar}>
        {copiado ? <Check /> : <Link />}
        <span className="celular:hidden">{copiado ? "Copiado" : "Copiar o link"}</span>
      </Botao>
      <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Fechar tudo" title="Fechar tudo" onClick={aoFechar}>
        <X />
      </Botao>
    </header>
  );
}
