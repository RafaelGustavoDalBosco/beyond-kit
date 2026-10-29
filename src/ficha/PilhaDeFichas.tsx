import { Check, ChevronRight, Link, X, type LucideIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Botao, Tecla } from "../ui/botao";

import type { Ficha, UsePilha } from "./pilha";

/** O que o consumidor diz de cada tipo de ficha: o ícone, o nome, o título curto da trilha e o conteúdo. */
export type DefinicaoDaFicha = {
  icone: LucideIcon;
  rotulo: string;
  /** O nome curto na trilha; sem ele, o rótulo e o id. */
  titulo?: (id: string) => ReactNode;
  render: (id: string) => ReactNode;
};

export type RegistroDeFichas<T extends string = string> = Record<T, DefinicaoDaFicha>;

// Até duas fichas aparecem atrás da do topo, recuadas; a faixa de cima de cada
// uma volta a ela num clique.
const RECUO = [
  "z-30",
  "z-20 max-h-28 -translate-y-5 scale-[0.965] opacity-85 cursor-pointer",
  "z-10 max-h-28 -translate-y-10 scale-[0.93] opacity-55 cursor-pointer",
];

/** O modal empilhado das fichas: a pilha vem do `usePilha` do adaptador e cada tipo, do registro `fichas`. */
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
        <Dialog.Overlay className="fixed inset-0 z-40 animate-entrar bg-(--veu) backdrop-blur-[3px]" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            voltar();
          }}
          onClick={(e) => e.target === e.currentTarget && voltar()}
          className="fixed inset-0 z-50 flex justify-center px-4 pt-[9vh] outline-none"
        >
          <Dialog.Title className="sr-only">Ficha</Dialog.Title>
          {pilha.map((f, i) => {
            const recuo = pilha.length - 1 - i;
            if (recuo > 2) return null;
            const def = fichas[f.tipo];
            if (!def) return null;
            return (
              <section
                key={`${i}-${f.tipo}-${f.id}`}
                onClick={recuo > 0 ? () => voltarPara(i) : undefined}
                className={cn(
                  "absolute flex max-h-[86vh] w-[min(980px,100%)] origin-top flex-col overflow-hidden rounded-ficha border border-linha bg-superficie shadow-3 transition-[transform,opacity,max-height] duration-300 ease-out",
                  recuo === 0 && "animate-subir",
                  RECUO[recuo],
                )}
              >
                <div className="filete shrink-0" />
                <Trilha pilha={pilha} ate={i} fichas={fichas} ativa={recuo === 0} aoVoltar={voltarPara} aoFechar={fechar} />
                <div className={cn("min-h-0 flex-1 overflow-y-auto", recuo > 0 && "pointer-events-none invisible")}>
                  {def.render(f.id)}
                </div>
              </section>
            );
          })}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Trilha<T extends string>({
  pilha,
  ate,
  fichas,
  ativa,
  aoVoltar,
  aoFechar,
}: {
  pilha: Ficha<T>[];
  ate: number;
  fichas: Record<T, DefinicaoDaFicha>;
  ativa: boolean;
  aoVoltar: (i: number) => void;
  aoFechar: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const caminho = pilha.slice(0, ate + 1);
  const copiar = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-linha bg-superficie-2/60 pr-2 pl-4">
      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {caminho.map((f, i) => {
          const def = fichas[f.tipo];
          if (!def) return null;
          const Icone = def.icone;
          const ultimo = i === caminho.length - 1;
          return (
            <span key={i} className="flex min-w-0 items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-texto-3" />}
              <button
                type="button"
                disabled={ultimo || !ativa}
                onClick={() => aoVoltar(i)}
                className={cn(
                  "flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-xs",
                  ultimo ? "font-semibold text-texto" : "cursor-pointer text-texto-2 hover:bg-superficie-3 hover:text-texto",
                )}
              >
                <Icone className="size-3.5 shrink-0" />
                <span className="truncate">
                  {def.titulo ? (
                    def.titulo(f.id)
                  ) : (
                    <>
                      {def.rotulo} <span className="numero">{f.id}</span>
                    </>
                  )}
                </span>
              </button>
            </span>
          );
        })}
      </nav>
      {ativa && (
        <>
          <span className="mr-1 hidden items-center gap-1 text-[11px] text-texto-3 md:flex">
            <Tecla>Esc</Tecla> volta
          </span>
          <Botao tipo="fantasma" tamanho="sm" onClick={copiar}>
            {copiado ? <Check /> : <Link />}
            {copiado ? "Copiado" : "Copiar o link"}
          </Botao>
          <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Fechar" onClick={aoFechar}>
            <X />
          </Botao>
        </>
      )}
    </header>
  );
}
