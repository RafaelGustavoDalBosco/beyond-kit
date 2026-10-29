"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** A lista à esquerda, o detalhe do escolhido à direita (o padrão de toda lista); abaixo de `lg`, um embaixo do outro. */
export function MestreDetalhe({
  cabeca,
  lista,
  rodape,
  detalhe,
  largura = 380,
  embutido = false,
  className,
}: {
  cabeca?: ReactNode;
  lista: ReactNode;
  rodape?: ReactNode;
  detalhe: ReactNode;
  largura?: number;
  /** Sem o contorno, o fundo e a sombra do bloco (dentro de um `Bloco` ou de uma ficha). */
  embutido?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 overflow-hidden lg:grid-cols-[var(--largura-da-lista)_minmax(0,1fr)]",
        !embutido && "rounded-bloco border border-linha bg-superficie shadow-1",
        className,
      )}
      style={{ "--largura-da-lista": `${largura}px` } as CSSProperties}
    >
      <div className="flex min-h-0 min-w-0 flex-col border-b border-linha lg:border-r lg:border-b-0">
        {cabeca && <div className="flex flex-col gap-3 border-b border-linha p-4">{cabeca}</div>}
        <div className="min-h-0 flex-1 overflow-y-auto">{lista}</div>
        {rodape}
      </div>
      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="filete shrink-0" />
        <div className="min-h-0 flex-1 overflow-y-auto">{detalhe}</div>
      </div>
    </div>
  );
}

/** Uma linha da lista do master/detail; a escolhida leva a barra cobalto. Com `href` vira `<a>`; com `asChild`, o filho
 * único (o `Link` do roteador) leva o visual e a barra. `em="linha"` põe o conteúdo lado a lado (ícone, texto, seta). */
export function ItemDaLista({
  ativo,
  aoEscolher,
  href,
  asChild,
  em = "coluna",
  children,
}: {
  ativo: boolean;
  aoEscolher?: () => void;
  href?: string;
  asChild?: boolean;
  em?: "coluna" | "linha";
  children: ReactNode;
}) {
  const comum = {
    onClick: aoEscolher,
    "aria-current": ativo || undefined,
    className: cn(
      "relative flex w-full cursor-pointer border-b border-linha px-4 py-3 text-left transition-colors",
      em === "linha" ? "flex-row items-center gap-3" : "flex-col gap-1",
      ativo ? "bg-cobalto-suave" : "hover:bg-superficie-2",
    ),
  };
  const barra = ativo && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-cobalto" />;
  if (asChild)
    return (
      <Slot.Root {...comum}>
        {barra}
        <Slot.Slottable>{children}</Slot.Slottable>
      </Slot.Root>
    );
  if (href)
    return (
      <a href={href} {...comum}>
        {barra}
        {children}
      </a>
    );
  return (
    <button type="button" {...comum}>
      {barra}
      {children}
    </button>
  );
}

/** A paginação no pé da lista (a página vem do servidor). */
export function PaginasDaLista({
  page,
  page_size,
  total,
  aoMudar,
}: {
  page: number;
  page_size: number;
  total: number;
  aoMudar: (p: number) => void;
}) {
  if (total <= page_size) return null;
  const paginas = Math.ceil(total / page_size);
  return (
    <div className="flex items-center justify-between border-t border-linha px-4 py-2 text-xs text-texto-2">
      <Botao tipo="fantasma" tamanho="icone-sm" disabled={page <= 1} onClick={() => aoMudar(page - 1)}>
        <ChevronLeft />
      </Botao>
      <span className="numero">
        {page}/{paginas}
      </span>
      <Botao tipo="fantasma" tamanho="icone-sm" disabled={page >= paginas} onClick={() => aoMudar(page + 1)}>
        <ChevronRight />
      </Botao>
    </div>
  );
}
