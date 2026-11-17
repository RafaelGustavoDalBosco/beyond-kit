"use client";

import { Slot } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import type { TomDoEmblema } from "./emblema";
import type { Tom } from "./selo";

// O quadro (os clientes por situação, as tarefas por etapa), que o Lastro não desenha, sobre os tokens dele: colunas
// na mesa, o ponto pequeno da cor da coluna, a contagem e a legenda de apoio, e os cartões de ficha com borda dentro.
// A troca Quadro/Lista é um `TrilhoDeAbas`.

const PONTO: Record<TomDoEmblema, string> = {
  neutro: "bg-neutro-500",
  acao: "bg-acao",
  positivo: "bg-positivo",
  destaque: "bg-destaque",
  atencao: "bg-atencao",
  erro: "bg-erro",
  andamento: "bg-estado-andamento",
};

/** As colunas do quadro, lado a lado a partir de `lg`. */
export function Quadro({ colunas = 3, className, children }: { colunas?: 2 | 3 | 4 | 5; className?: string; children: ReactNode }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3.5", { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[colunas], className)}>
      {children}
    </div>
  );
}

/** Uma coluna: o ponto da cor, o título, a contagem e a legenda; os cartões rolam dentro. */
export function ColunaDoQuadro({
  titulo,
  tom = "neutro",
  contagem,
  legenda,
  className,
  children,
}: {
  titulo: ReactNode;
  tom?: Exclude<Tom, "contorno"> | TomDoEmblema;
  contagem?: number | null;
  legenda?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col rounded-g bg-mesa p-2.5", className)}>
      <header className="mb-2.5 px-1.5 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="m-0 flex min-w-0 items-center gap-2 text-base font-forte">
            <span aria-hidden className={cn("size-2 shrink-0 rounded-full", PONTO[tom])} />
            <span className="truncate">{titulo}</span>
          </h2>
          {contagem != null && <span className="numero text-apoio text-texto-apoio">{contagem}</span>}
        </div>
        {legenda && <p className="m-0 mt-0.5 text-apoio text-texto-apoio">{legenda}</p>}
      </header>
      <div className="flex min-h-0 flex-col gap-2 overflow-y-auto">{children}</div>
    </section>
  );
}

/** Um cartão do quadro: ficha com borda e raio médio. Com `href` vira `<a>`, com `aoAbrir` vira botão e com `asChild`
 * o filho único (o `Link` do roteador) leva o visual. `acoes` (o "Pagar", o copiar) vão no pé, fora do clique do
 * cartão. */
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
    "block w-full rounded-m border border-borda bg-ficha px-3 py-2.5 text-left text-base text-texto no-underline hover:no-underline",
    (href || aoAbrir || asChild) && "cursor-pointer transition-[border-color,box-shadow] hover:border-borda-forte hover:shadow-p",
    acoes && "relative",
    className,
  );
  // Com ações, o clique é de um alvo esticado sobre o cartão inteiro e as ações ficam por cima dele.
  const estilo = acoes
    ? "block w-full cursor-pointer text-left text-texto no-underline hover:no-underline after:absolute after:inset-0 after:rounded-m"
    : cartao;
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
      <div className="relative z-10 mt-2.5 flex flex-wrap items-center gap-2 border-t border-borda-suave pt-2">{acoes}</div>
    </div>
  );
}
