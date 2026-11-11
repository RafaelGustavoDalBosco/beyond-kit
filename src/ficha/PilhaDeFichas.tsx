"use client";

import { ArrowLeft, Check, ChevronRight, Link, X, type LucideIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Botao } from "../ui/botao";

import type { Ficha, UsePilha } from "./pilha";

/** O que o consumidor diz de cada tipo de ficha: o nome, o título curto da trilha e o conteúdo. */
export type DefinicaoDaFicha = {
  /** @deprecated Sem efeito no modal: a trilha é só texto, e o ícone da ficha vai na `CabecaDaFicha`. */
  icone?: LucideIcon;
  rotulo: string;
  /** O nome curto na trilha; sem ele, o rótulo e o id. */
  titulo?: (id: string) => ReactNode;
  render: (id: string) => ReactNode;
};

export type RegistroDeFichas<T extends string = string> = Record<T, DefinicaoDaFicha>;

/** O modal de ficha: a pilha vem do `usePilha` do adaptador e cada tipo, do registro `fichas`. Um modal só, de até
 * 1180 × 880 (a tela toda no celular), com a trilha da pilha no alto e a ficha do topo embaixo; fecha pelo × e volta
 * pelo Voltar ou pelo Esc, nunca pelo clique fora. */
export function PilhaDeFichas<T extends string = string>({
  usePilha,
  fichas,
}: {
  usePilha: UsePilha<T>;
  fichas: Record<T, DefinicaoDaFicha>;
}) {
  const { pilha, voltar, voltarPara, fechar } = usePilha();

  return (
    <Dialog.Root open={pilha.length > 0} onOpenChange={(aberto) => !aberto && fechar()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-entrar bg-veu" />
        {/* a moldura cobre a tela e o véu em volta não fecha; o clique no que fica fora da árvore do modal (um aviso
            por cima, com o Desfazer e o ×) também não */}
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            voltar();
          }}
          className="fixed inset-0 z-50 grid place-items-center p-7 outline-none celular:p-0"
        >
          <Dialog.Title className="sr-only">Ficha</Dialog.Title>
          <section className="flex h-[min(880px,100%)] w-[min(1180px,100%)] animate-subir flex-col overflow-hidden rounded-ficha bg-cabeca-detalhe shadow-3 celular:size-full celular:rounded-none">
            <Trilha pilha={pilha} fichas={fichas} aoVoltar={voltar} aoVoltarPara={voltarPara} aoFechar={fechar} />
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
                  className={cn("min-h-0 flex-1 overflow-y-auto", recuo === 0 ? "animate-entrar" : "hidden")}
                >
                  {def.render(f.id)}
                </div>
              );
            })}
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Trilha<T extends string>({
  pilha,
  fichas,
  aoVoltar,
  aoVoltarPara,
  aoFechar,
}: {
  pilha: Ficha<T>[];
  fichas: Record<T, DefinicaoDaFicha>;
  aoVoltar: () => void;
  aoVoltarPara: (i: number) => void;
  aoFechar: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-fio bg-superficie px-[22px] py-2.5 text-[13px] font-bold text-texto-2 celular:px-3.5">
      {pilha.length > 1 && (
        <>
          <button type="button" onClick={aoVoltar} className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md text-cobalto hover:text-cobalto-forte">
            <ArrowLeft className="size-3.5" />
            Voltar
          </button>
          <span aria-hidden>·</span>
        </>
      )}
      <nav aria-label="Trilha" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden whitespace-nowrap">
        {pilha.map((f, i) => {
          const def = fichas[f.tipo];
          if (!def) return null;
          const ultimo = i === pilha.length - 1;
          const nome = def.titulo ? (
            def.titulo(f.id)
          ) : (
            <>
              {def.rotulo} <span className="numero">{f.id}</span>
            </>
          );
          return (
            <span key={i} className={cn("flex items-center gap-1.5", ultimo ? "min-w-0" : "shrink-0")}>
              {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 text-texto-3" />}
              {ultimo ? (
                <span aria-current="page" className="truncate text-texto">
                  {nome}
                </span>
              ) : (
                <button type="button" onClick={() => aoVoltarPara(i)} className="cursor-pointer rounded-md hover:text-cobalto">
                  {nome}
                </button>
              )}
            </span>
          );
        })}
      </nav>
      <Botao tipo="fantasma" tamanho="sm" aria-label={copiado ? "Copiado" : "Copiar o link"} onClick={copiar}>
        {copiado ? <Check /> : <Link />}
        <span className="celular:hidden">{copiado ? "Copiado" : "Copiar o link"}</span>
      </Botao>
      <Botao tipo="fantasma" tamanho="icone" aria-label="Fechar" title="Fechar" onClick={aoFechar} className="bg-superficie-2 text-neutro hover:bg-superficie-3">
        <X />
      </Botao>
    </header>
  );
}
