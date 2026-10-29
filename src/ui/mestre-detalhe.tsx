"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** A lista à esquerda, o detalhe do escolhido à direita (o padrão de toda lista), em cartões como no cadastro do
 * ArchFlow: cada item é um cartão e o detalhe vem num cartão com o filete; abaixo de `lg`, um embaixo do outro. */
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
  /** O detalhe sem o cartão em volta: dentro de um `Bloco` ou de uma ficha, ou quando o detalhe monta os cartões
   * dele (o cabeçalho, as abas e as informações soltos, como no cadastro do ArchFlow). */
  embutido?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-5 lg:grid-cols-[var(--largura-da-lista)_minmax(0,1fr)]", className)}
      style={{ "--largura-da-lista": `${largura}px` } as CSSProperties}
    >
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        {cabeca && <div className="flex flex-col gap-3">{cabeca}</div>}
        {/* o respiro de 4px deixa o contorno do escolhido aparecer inteiro na rolagem */}
        <div className="-m-1 min-h-0 flex-1 overflow-y-auto p-1">
          <div className="flex flex-col gap-2">{lista}</div>
        </div>
        {rodape}
      </div>
      {embutido ? (
        <div className="flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto">{detalhe}</div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-bloco border border-linha bg-superficie shadow-1">
          <div className="filete shrink-0" />
          <div className="min-h-0 flex-1 overflow-y-auto">{detalhe}</div>
        </div>
      )}
    </div>
  );
}

/** Um cartão da lista do master/detail; o escolhido leva o contorno cobalto. Com `href` vira `<a>`; com `asChild`, o filho
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
      "flex w-full shrink-0 cursor-pointer rounded-xl border bg-superficie px-4 py-3 text-left shadow-1 transition-[border,box-shadow]",
      em === "linha" ? "flex-row items-center gap-3" : "flex-col gap-1",
      ativo ? "border-cobalto ring-1 ring-cobalto" : "border-linha hover:border-linha-forte hover:shadow-2",
    ),
  };
  if (asChild) return <Slot.Root {...comum}>{children}</Slot.Root>;
  if (href)
    return (
      <a href={href} {...comum}>
        {children}
      </a>
    );
  return (
    <button type="button" {...comum}>
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
    <div className="flex items-center justify-between px-1 text-xs text-texto-2">
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
