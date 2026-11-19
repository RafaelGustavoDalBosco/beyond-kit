"use client";

// A seção que abre e fecha (o <details> com o indicador de abertura do `lastro.css`, a seta que gira): para o que a
// tarefa não pede o tempo todo (o histórico, as subtarefas, os dados técnicos). O teclado é o do próprio <summary>
// (Enter e Espaço). Várias em fila formam uma lista separada pelo fio.

import type { ReactNode } from "react";

import { cn } from "../lib/cn";

export function Expansivel({
  titulo,
  detalhe,
  aberto,
  aoMudar,
  padraoAberto,
  children,
  className,
}: {
  titulo: ReactNode;
  /** À direita do título, em texto de apoio: a contagem, o resumo do que está dentro. */
  detalhe?: ReactNode;
  /** Controlado pelo app; sem ele, o próprio <details> guarda o estado. */
  aberto?: boolean;
  aoMudar?: (aberto: boolean) => void;
  /** Começa aberta (sem `aberto`). */
  padraoAberto?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details
      open={aberto ?? padraoAberto}
      onToggle={(e) => {
        const agora = e.currentTarget.open;
        if (agora !== aberto) aoMudar?.(agora);
      }}
      className={cn("border-t border-borda-suave first:border-t-0", className)}
    >
      <summary className="flex items-center gap-2 py-2.5 font-medio text-texto select-none hover:text-acao-texto focus-visible:-outline-offset-2">
        <span className="min-w-0 flex-1">{titulo}</span>
        {detalhe != null && <span className="numero shrink-0 text-apoio font-normal text-texto-apoio">{detalhe}</span>}
      </summary>
      <div className="pb-3 pl-[1.4em]">{children}</div>
    </details>
  );
}
