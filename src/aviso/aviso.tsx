"use client";

// Os avisos de ação (o toast): no canto superior direito, o cartão branco com o filete do tom à esquerda. Somem
// sozinhos em 5 s; o de erro fica até fechar. O resultado de uma ação leva a frase que o consumidor manda; a
// recusa, a frase do erro, que o consumidor pode trocar por `configurarAvisos`.

import { Check, CircleAlert, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "../lib/cn";
import { Emblema, type TomDoEmblema } from "../ui/emblema";

type Tipo = "sucesso" | "erro" | "aviso" | "info";

/** A ação de um aviso ("Desfazer"): o clique roda o `aoClicar` e fecha o aviso. */
export type AcaoDoAviso = { rotulo: string; aoClicar: () => void };

/** O que acompanha o título de um aviso: a frase embaixo e a ação. */
export type OpcoesDoAviso = { frase?: string; acao?: AcaoDoAviso };

type Aviso = OpcoesDoAviso & { id: number; tipo: Tipo; titulo: string };

// Quanto tempo o aviso fica na tela, em ms; o de erro não some sozinho.
const DURACAO = 5000;

let avisos: Aviso[] = [];
let proximo = 1;
const ouvintes = new Set<() => void>();
const mudou = () => ouvintes.forEach((f) => f());

function mostrar(tipo: Tipo, titulo: string, opcoes?: OpcoesDoAviso) {
  const id = proximo++;
  const novo: Aviso = { id, tipo, titulo, frase: opcoes?.frase, acao: opcoes?.acao };
  // O mesmo aviso repetido troca o que já está na tela, não empilha; o mais novo entra em cima.
  avisos = [novo, ...avisos.filter((a) => a.titulo !== titulo || a.frase !== novo.frase)].slice(0, 4);
  mudou();
  if (tipo !== "erro") setTimeout(() => fechar(id), DURACAO);
}

function fechar(id: number) {
  avisos = avisos.filter((a) => a.id !== id);
  mudou();
}

const config = {
  fraseDoErro: (erro: unknown): string => (erro instanceof Error ? erro.message : String(erro)),
};

/** O consumidor com erro próprio da API troca a frase que `avisar.erro` mostra. */
export function configurarAvisos(opcoes: { fraseDoErro?: (erro: unknown) => string }) {
  if (opcoes.fraseDoErro) config.fraseDoErro = opcoes.fraseDoErro;
}

/** A frase de uma recusa, a mesma que o `avisar.erro` mostraria (para a recusa que fica na tela, como a do login). */
export const fraseDoErro = (erro: unknown) => config.fraseDoErro(erro);

/**
 * O aviso do resultado de uma ação: o texto é o título e as opções trazem a frase de baixo e a ação
 * (`avisar.sucesso("3 correções rejeitadas", { acao: { rotulo: "Desfazer", aoClicar } })`). No `erro`, a frase do erro
 * é o título; com `titulo` nas opções, ela desce para a linha de baixo.
 */
export const avisar = {
  sucesso: (texto: string, opcoes?: OpcoesDoAviso) => mostrar("sucesso", texto, opcoes),
  erro: (erro: unknown, opcoes?: { titulo?: string; acao?: AcaoDoAviso }) => {
    const frase = config.fraseDoErro(erro);
    if (opcoes?.titulo) mostrar("erro", opcoes.titulo, { frase, acao: opcoes.acao });
    else mostrar("erro", frase, { acao: opcoes?.acao });
  },
  aviso: (texto: string, opcoes?: OpcoesDoAviso) => mostrar("aviso", texto, opcoes),
  info: (texto: string, opcoes?: OpcoesDoAviso) => mostrar("info", texto, opcoes),
};

const ICONE: Record<Tipo, LucideIcon> = { sucesso: Check, erro: CircleAlert, aviso: TriangleAlert, info: Info };
const TOM: Record<Tipo, TomDoEmblema> = { sucesso: "ganho", erro: "risco", aviso: "aviso", info: "cobalto" };
// O filete do tom, à esquerda do cartão.
const FILETE: Record<Tipo, string> = {
  sucesso: "border-ganho",
  erro: "border-risco",
  aviso: "border-aviso",
  info: "border-cobalto",
};

/** A pilha dos avisos, uma vez na raiz do app: o canto superior direito (no celular, a largura da tela). */
export function Avisos() {
  const lista = useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => avisos,
    () => avisos,
  );
  return (
    // `data-avisos` é como o `Modal` reconhece o clique num aviso (o × e a ação), que fica fora da árvore dele
    <div
      data-avisos
      aria-live="polite"
      className="pointer-events-none fixed top-4 right-4 z-[60] flex w-[380px] flex-col gap-2.5 celular:left-4 celular:w-auto"
    >
      {lista.map((a) => (
        <div
          key={a.id}
          role="status"
          className={cn(
            "pointer-events-auto flex animate-deslizar items-start gap-3 rounded-cartao border-l-4 bg-superficie py-3.5 pr-3.5 pl-4 shadow-3",
            FILETE[a.tipo],
          )}
        >
          <Emblema icone={ICONE[a.tipo]} tom={TOM[a.tipo]} tamanho="xs" />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="leading-snug font-extrabold [overflow-wrap:anywhere]">{a.titulo}</div>
            {a.frase && <div className="text-[13.5px] leading-[1.45] font-semibold text-texto-2 [overflow-wrap:anywhere]">{a.frase}</div>}
            {a.acao && (
              <button
                type="button"
                onClick={() => {
                  a.acao?.aoClicar();
                  fechar(a.id);
                }}
                className="mt-1.5 cursor-pointer py-0.5 text-[13px] font-extrabold text-cobalto hover:text-cobalto-forte"
              >
                {a.acao.rotulo}
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => fechar(a.id)}
            className="-mr-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-texto-3 hover:bg-superficie-2 hover:text-texto"
          >
            <X className="size-[15px]" />
          </button>
        </div>
      ))}
    </div>
  );
}
