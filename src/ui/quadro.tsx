"use client";

import { Slot } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import type { Tom } from "./selo";

// O quadro (os clientes por situação, as tarefas por etapa), como no ArchFlow: colunas cinza com o ponto da cor, a
// contagem e a legenda, e os cartões dentro. A troca Quadro/Lista é um `TrilhoDeAbas`.

const PONTO: Record<Exclude<Tom, "contorno">, string> = {
  neutro: "bg-texto-3",
  cobalto: "bg-cobalto",
  ganho: "bg-ganho",
  aviso: "bg-aviso",
  risco: "bg-risco",
};

/** As colunas do quadro, lado a lado a partir de `lg`. */
export function Quadro({ colunas = 3, className, children }: { colunas?: 2 | 3 | 4 | 5; className?: string; children: ReactNode }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4", { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[colunas], className)}>
      {children}
    </div>
  );
}

/** Uma coluna: o ponto da cor, o título, a contagem e a legenda; os cartões rolam dentro. */
export function ColunaDoQuadro({
  titulo,
  tom = "cobalto",
  contagem,
  legenda,
  className,
  children,
}: {
  titulo: ReactNode;
  tom?: Exclude<Tom, "contorno">;
  contagem?: number | null;
  legenda?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col rounded-bloco bg-superficie-2 p-3", className)}>
      <header className="mb-3 px-1">
        <div className="flex items-center justify-between gap-2">
          <h2 className="m-0 flex min-w-0 items-center gap-2 text-[13px] font-bold tracking-[0.08em] text-texto-2 uppercase">
            <span className={cn("size-2.5 shrink-0 rounded-full", PONTO[tom])} />
            <span className="truncate">{titulo}</span>
          </h2>
          {contagem != null && (
            <span className="numero rounded-full bg-superficie px-2 py-0.5 text-xs font-semibold text-texto-2 shadow-1">{contagem}</span>
          )}
        </div>
        {legenda && <p className="m-0 mt-1 text-xs text-texto-3">{legenda}</p>}
      </header>
      <div className="flex min-h-0 flex-col gap-2.5 overflow-y-auto pr-1">{children}</div>
    </section>
  );
}

/** Um cartão do quadro. Com `href` vira `<a>`, com `aoAbrir` vira botão e com `asChild` o filho único (o `Link` do
 * roteador) leva o visual. `acoes` (o "Pagar", o copiar) vão no pé, fora do clique do cartão. */
export function CartaoDoQuadro({
  href,
  aoAbrir,
  asChild,
  acoes,
  className,
  children,
}: {
  href?: string;
  aoAbrir?: () => void;
  asChild?: boolean;
  acoes?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const cartao = cn(
    "block w-full rounded-xl border border-linha bg-superficie p-3.5 text-left shadow-1",
    (href || aoAbrir || asChild) && "cursor-pointer transition-[border,box-shadow] hover:border-cobalto/40 hover:shadow-2",
    acoes && "relative",
    className,
  );
  // Com ações, o clique é de um alvo esticado sobre o cartão inteiro e as ações ficam por cima dele.
  const estilo = acoes ? "block w-full cursor-pointer text-left after:absolute after:inset-0 after:rounded-xl" : cartao;
  const alvo = asChild ? (
    <Slot.Root className={estilo}>{children}</Slot.Root>
  ) : href ? (
    <a href={href} className={estilo}>
      {children}
    </a>
  ) : aoAbrir ? (
    <button type="button" onClick={aoAbrir} className={estilo}>
      {children}
    </button>
  ) : (
    <div className={estilo}>{children}</div>
  );
  if (!acoes) return alvo;
  return (
    <div className={cartao}>
      {alvo}
      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2 border-t border-linha pt-2.5">{acoes}</div>
    </div>
  );
}
