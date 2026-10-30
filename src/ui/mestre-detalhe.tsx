"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem as emContagem } from "../lib/formato";

import { Botao } from "./botao";

/** A lista à esquerda, o detalhe do escolhido à direita (o padrão de toda lista), em cartões como no cadastro do
 * ArchFlow: cada item é um cartão e o detalhe vem num cartão com o filete; abaixo de `lg`, um embaixo do outro. */
export function MestreDetalhe({
  titulo,
  contagem,
  cabeca,
  lista,
  rodape,
  detalhe,
  largura = 380,
  embutido = false,
  className,
}: {
  /** O título de seção da lista, com a `contagem` à direita; a `cabeca` (busca, filtros) vem embaixo. */
  titulo?: ReactNode;
  contagem?: number | null;
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
        {(titulo || contagem != null) && (
          <div className="flex items-center justify-between gap-3">
            <h2 className="titulo-secao m-0">{titulo}</h2>
            {contagem != null && <span className="numero text-xs text-texto-3">{emContagem(contagem)}</span>}
          </div>
        )}
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

/** O rótulo de um grupo entre os cartões da lista (o CFOP, o mês), com o valor opcional à direita. */
export function GrupoDaLista({ titulo, valor }: { titulo: ReactNode; valor?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 pt-3 first:pt-0">
      <span className="rotulo">{titulo}</span>
      {valor != null && <span className="numero text-xs font-semibold text-texto-2">{valor}</span>}
    </div>
  );
}

/** O "Carregar mais" da lista que vem aos pedaços (some quando não há mais); `emBloco` põe a linha em cima, para o pé
 * de um `Bloco` ou de uma tabela. */
export function CarregarMais({
  temMais,
  carregando,
  aoCarregar,
  emBloco,
  rotulo = "Carregar mais",
}: {
  temMais: boolean;
  carregando?: boolean;
  aoCarregar: () => void;
  emBloco?: boolean;
  rotulo?: ReactNode;
}) {
  if (!temMais) return null;
  return (
    <div className={cn("flex justify-center", emBloco ? "border-t border-linha p-3" : "pt-4")}>
      <Botao tamanho="sm" carregando={carregando} onClick={aoCarregar}>
        {rotulo}
      </Botao>
    </div>
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
