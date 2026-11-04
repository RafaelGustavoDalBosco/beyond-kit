"use client";

// A paleta de busca (Ctrl K): um texto e grupos de resultados; quem busca é o
// consumidor, que passa os grupos, o carregando e o erro. A paleta cuida do
// Dialog, das setas, do Enter, do Esc, dos estados e do rodapé com as teclas.

import { X, type LucideIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Botao, Tecla } from "../ui/botao";
import { Busca } from "../ui/campo";
import { Erro } from "../ui/estados";

/** Uma linha da lista de resultados: o que mostra e o que faz ao ser escolhida. */
export type ItemDaPaleta = { chave: string; principal: ReactNode; secundario?: ReactNode; aoAbrir: () => void };
export type GrupoDaPaleta = { titulo: string; icone: LucideIcon; itens: ItemDaPaleta[] };

/** O texto depois da pausa na digitação (para buscar só quando o usuário para). */
export function usePausa(texto: string, ms = 250) {
  const [pausado, setPausado] = useState(texto);
  useEffect(() => {
    const t = setTimeout(() => setPausado(texto), ms);
    return () => clearTimeout(t);
  }, [texto, ms]);
  return pausado;
}

export function Paleta({
  grupos,
  texto,
  aoMudarTexto,
  carregando,
  erro,
  aberta,
  aoMudar,
  placeholder = "Buscar",
  titulo = "Buscar",
  minimo = 2,
}: {
  grupos: GrupoDaPaleta[];
  texto: string;
  aoMudarTexto: (texto: string) => void;
  carregando?: boolean;
  erro?: { frase: string; referencia?: string | null; tentar?: () => void } | null;
  aberta: boolean;
  aoMudar: (aberta: boolean) => void;
  placeholder?: string;
  titulo?: ReactNode;
  /** Quantos caracteres antes de buscar; abaixo disso a paleta diz "Digite para buscar". */
  minimo?: number;
}) {
  const vale = texto.trim().length >= minimo;
  const caixa = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const idDaLista = useId();

  const visiveis = useMemo(() => grupos.filter((g) => g.itens.length > 0), [grupos]);
  const lista = useMemo(() => visiveis.flatMap((g) => g.itens), [visiveis]);

  // O destaque volta ao primeiro a cada resultado novo e acompanha as setas.
  useEffect(() => setAtivo(0), [lista]);
  const mudarTexto = useRef(aoMudarTexto);
  mudarTexto.current = aoMudarTexto;
  useEffect(() => {
    if (!aberta) mudarTexto.current("");
  }, [aberta]);
  useEffect(() => {
    caixa.current?.parentElement?.querySelector<HTMLElement>(`[data-paleta-ativo="true"]`)?.scrollIntoView({ block: "nearest" });
  }, [ativo]);

  const escolher = (item: ItemDaPaleta) => {
    aoMudar(false);
    item.aoAbrir();
  };

  const teclas = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!lista.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((i) => (i + 1) % lista.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo((i) => (i - 1 + lista.length) % lista.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = lista[ativo];
      if (r) escolher(r);
    }
  };

  return (
    <Dialog.Root open={aberta} onOpenChange={aoMudar}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-entrar bg-(--veu) backdrop-blur-[3px]" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            caixa.current?.querySelector("input")?.focus();
          }}
          style={{ width: "min(640px, calc(100% - 32px))" }}
          className="fixed top-[12vh] left-1/2 z-50 flex max-h-[72vh] -translate-x-1/2 animate-subir flex-col overflow-hidden rounded-ficha border border-linha bg-superficie shadow-3 outline-none"
        >
          <div className="filete shrink-0" />
          <div className="flex shrink-0 items-center justify-between border-b border-linha px-6 py-4">
            <Dialog.Title className="titulo-secao m-0">{titulo}</Dialog.Title>
            <Dialog.Close asChild>
              <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Fechar">
                <X />
              </Botao>
            </Dialog.Close>
          </div>
          <div ref={caixa} className="shrink-0 px-6 pt-4 pb-3">
            <Busca
              placeholder={placeholder}
              value={texto}
              onChange={(e) => aoMudarTexto(e.target.value)}
              onKeyDown={teclas}
              role="combobox"
              aria-expanded={lista.length > 0}
              aria-controls={idDaLista}
              aria-autocomplete="list"
              autoComplete="off"
            />
          </div>
          <div id={idDaLista} role="listbox" className="min-h-0 flex-1 overflow-y-auto pb-2">
            {!vale && <p className="m-0 px-6 py-6 text-center text-sm text-texto-3">Digite para buscar</p>}
            {vale && erro && <Erro frase={erro.frase} referencia={erro.referencia} tentar={erro.tentar} />}
            {vale && !erro && carregando && lista.length === 0 && (
              <p className="m-0 px-6 py-6 text-center text-sm text-texto-3">Buscando…</p>
            )}
            {vale && !erro && !carregando && lista.length === 0 && (
              <p className="m-0 px-6 py-6 text-center text-sm text-texto-3">Nada encontrado</p>
            )}
            {visiveis.map((g) => (
              <section key={g.titulo} className="pt-3">
                <h3 className="titulo-secao m-0 mb-1 px-6">
                  <g.icone className="size-3.5 text-texto-3" />
                  {g.titulo}
                </h3>
                {g.itens.map((r) => {
                  const i = lista.indexOf(r);
                  const marcado = i === ativo;
                  return (
                    <button
                      key={r.chave}
                      type="button"
                      role="option"
                      aria-selected={marcado}
                      data-paleta-ativo={marcado || undefined}
                      onMouseEnter={() => setAtivo(i)}
                      onClick={() => escolher(r)}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center gap-3 px-6 py-2 text-left text-sm text-texto transition-colors",
                        marcado ? "bg-cobalto-suave" : "hover:bg-superficie-2",
                      )}
                    >
                      {marcado && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-cobalto" />}
                      <span className="min-w-0 flex-1 truncate">{r.principal}</span>
                      {r.secundario && <span className="flex shrink-0 items-center gap-3">{r.secundario}</span>}
                    </button>
                  );
                })}
              </section>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-4 border-t border-linha bg-superficie-2/60 px-6 py-2 text-xs text-texto-3">
            <span className="flex items-center gap-1">
              <Tecla>↑</Tecla>
              <Tecla>↓</Tecla> navegar
            </span>
            <span className="flex items-center gap-1">
              <Tecla>Enter</Tecla> abrir
            </span>
            <span className="flex items-center gap-1">
              <Tecla>Esc</Tecla> fechar
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const CAMPO_DE_TEXTO = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Ctrl K / Cmd K na janela abre a busca; dentro de um campo de texto a tecla é do campo. */
export function useAtalhoDaBusca(aoAbrir: () => void) {
  const fn = useRef(aoAbrir);
  fn.current = aoAbrir;
  useEffect(() => {
    const ouvir = (e: globalThis.KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return;
      const alvo = e.target as HTMLElement | null;
      if (alvo && (CAMPO_DE_TEXTO.has(alvo.tagName) || alvo.isContentEditable)) return;
      e.preventDefault();
      fn.current();
    };
    window.addEventListener("keydown", ouvir);
    return () => window.removeEventListener("keydown", ouvir);
  }, []);
}
