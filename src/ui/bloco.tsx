import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

/** O bloco: a unidade da tela (a grade bento é feita deles). */
export function Bloco({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-bloco border border-linha bg-superficie shadow-1", className)} {...props} />;
}

/** O alto do bloco: o ícone do assunto (opcional), o título, o detalhe e a ação à direita. */
export function CabecaDoBloco({
  titulo,
  detalhe,
  acao,
  icone: Icone,
}: {
  titulo: ReactNode;
  detalhe?: ReactNode;
  acao?: ReactNode;
  icone?: LucideIcon;
}) {
  return (
    <div className="flex min-h-12 items-center gap-3 border-b border-linha px-5 py-3">
      {Icone && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cobalto-suave text-cobalto">
          <Icone className="size-4" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{titulo}</div>
        {detalhe && <div className="text-xs text-texto-3">{detalhe}</div>}
      </div>
      {acao}
    </div>
  );
}

/** O número de destaque de um bloco: rótulo, valor e o que o qualifica. */
export function Destaque({
  rotulo,
  valor,
  selo,
  detalhe,
  tom = "texto",
  grande = false,
  emCaixa = false,
}: {
  rotulo: ReactNode;
  valor: ReactNode;
  selo?: ReactNode;
  detalhe?: ReactNode;
  tom?: "texto" | "cobalto" | "ganho" | "aviso" | "risco";
  grande?: boolean;
  /** Com borda, fundo e respiro, como um mini bloco. */
  emCaixa?: boolean;
}) {
  const cor = { texto: "text-texto", cobalto: "text-cobalto", ganho: "text-ganho", aviso: "text-aviso", risco: "text-risco" }[tom];
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", emCaixa && "rounded-xl border border-linha bg-superficie px-4 py-3")}>
      <span className="rotulo">{rotulo}</span>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "font-semibold tracking-[-0.02em] tabular-nums",
            grande ? "text-[34px] leading-[1.1]" : "text-[22px] leading-tight",
            cor,
          )}
        >
          {valor}
        </span>
        {selo}
      </div>
      {detalhe && <span className="text-xs text-texto-2">{detalhe}</span>}
    </div>
  );
}
