"use client";

import type { LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

import { Caixa } from "./campo";
import { Emblema, type TomDoEmblema } from "./emblema";

// A cor do valor quando ele carrega o significado (o imposto que cai em verde, o que pede ação em laranja).
const COR_DO_VALOR: Record<TomDoEmblema, string> = {
  cobalto: "text-cobalto",
  ganho: "text-ganho",
  aviso: "text-aviso",
  risco: "text-risco",
  neutro: "text-neutro",
  agua: "text-agua",
};

// As larguras de fábrica, em px: as linhas de uma lista só alinham com as colunas da direita de largura fixa.
const LARGURA_DA_COLUNA = 120;
const LARGURA_DO_VALOR = 118;
const LARGURA_DO_SELO = 118;

/** As linhas de uma lista dentro de um `Bloco`: separadas pelo fio, com o fio no alto quando vêm depois do título
 * ou das abas. */
export function ListaDeLinhas({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("flex flex-col border-t border-fio first:border-t-0", className)}>{children}</div>;
}

/** As props da `LinhaDeLista`. */
export type PropsDaLinhaDeLista = {
  /** O quadrado colorido à esquerda: o ícone da operação (saída, entrada) ou a `sigla` (ICMS, ST, PIS, NCM), no `tom`. */
  icone?: LucideIcon;
  sigla?: ReactNode;
  tom?: TomDoEmblema;
  titulo: ReactNode;
  /** A linha de apoio, embaixo do título. */
  apoio?: ReactNode;
  /** As colunas curtas (a data, o CFOP, o efeito), na ordem; somem no celular. */
  colunas?: ReactNode[];
  /** O valor à direita, em 800; `tomDoValor` o pinta pelo significado. */
  valor?: ReactNode;
  tomDoValor?: TomDoEmblema;
  /** O `Selo` no fim da linha. `null` guarda o lugar dele (a linha sem selo numa lista que tem). */
  selo?: ReactNode;
  /** As larguras, em px, das colunas da direita, quando as de fábrica não servem; as linhas de uma lista levam as mesmas. */
  larguras?: { colunas?: number[]; valor?: number; selo?: number };
  /** A linha aberta na gaveta ou no detalhe: azul claro, com a barra azul à esquerda. */
  escolhida?: boolean;
  aoAbrir?: () => void;
  href?: string;
  /** O filho único e vazio (o `Link` do roteador) vira a linha. */
  asChild?: boolean;
  children?: ReactNode;
  /** A caixa de seleção à esquerda (o lote): aparece com `aoSelecionar`. */
  selecionada?: boolean;
  aoSelecionar?: (marcada: boolean) => void;
  rotuloDaSelecao?: string;
  className?: string;
};

/**
 * A linha de uma lista: alta, com o quadrado colorido da sigla ou da operação, o título com a linha de apoio, as
 * colunas curtas, o valor e o selo. Abre por `aoAbrir`, `href` ou `asChild`; sem nenhum, é só leitura. No celular
 * as colunas curtas somem e o valor e o selo se empilham à direita.
 */
export function LinhaDeLista({
  icone,
  sigla,
  tom = "cobalto",
  titulo,
  apoio,
  colunas = [],
  valor,
  tomDoValor,
  selo,
  larguras,
  escolhida,
  aoAbrir,
  href,
  asChild,
  children,
  selecionada,
  aoSelecionar,
  rotuloDaSelecao = "Selecionar",
  className,
}: PropsDaLinhaDeLista) {
  const comEmblema = !!icone || sigla != null;
  const comValor = valor !== undefined;
  const comSelo = selo !== undefined;
  const empilha = comValor && comSelo;
  const clicavel = !!asChild || !!href || !!aoAbrir;

  const grade = [
    comEmblema && "40px",
    "minmax(0,1fr)",
    ...colunas.map((_, i) => `${larguras?.colunas?.[i] ?? LARGURA_DA_COLUNA}px`),
    comValor && `${larguras?.valor ?? LARGURA_DO_VALOR}px`,
    comSelo && `${larguras?.selo ?? LARGURA_DO_SELO}px`,
  ]
    .filter(Boolean)
    .join(" ");

  const comum = {
    onClick: aoAbrir,
    "aria-current": escolhida || undefined,
    style: { "--grade-da-linha": grade } as CSSProperties,
    className: cn(
      "grid min-w-0 flex-1 grid-cols-(--grade-da-linha) items-center gap-3.5 py-3 pr-[18px] text-left focus-visible:-outline-offset-2 celular:gap-x-3 celular:gap-y-[5px] celular:pr-3.5",
      comEmblema ? "celular:grid-cols-[40px_minmax(0,1fr)_auto]" : "celular:grid-cols-[minmax(0,1fr)_auto]",
      aoSelecionar ? "pl-3.5" : "pl-[18px] celular:pl-3.5",
      clicavel && "cursor-pointer",
    ),
  };

  const miolo = (
    <>
      {comEmblema && (
        <Emblema
          icone={icone}
          sigla={sigla}
          tom={tom}
          forma="quadrado"
          className={cn("size-10 text-[10.5px] [&_svg]:size-[18px]", empilha && "celular:row-span-2")}
        />
      )}
      <span className={cn("min-w-0", empilha && "celular:row-span-2")}>
        <span className="block truncate font-bold text-texto">{titulo}</span>
        {apoio != null && <span className="mt-px block truncate text-[12.5px] font-semibold text-texto-2">{apoio}</span>}
      </span>
      {colunas.map((coluna, i) => (
        <span key={i} className="truncate font-semibold text-neutro celular:hidden">
          {coluna}
        </span>
      ))}
      {comValor && (
        <span
          className={cn(
            "numero text-right font-extrabold whitespace-nowrap celular:col-start-[-2] celular:row-start-1",
            tomDoValor ? COR_DO_VALOR[tomDoValor] : "text-texto",
          )}
        >
          {valor}
        </span>
      )}
      {comSelo && (
        <span
          className={cn(
            "flex min-w-0 celular:col-start-[-2] celular:justify-self-end",
            empilha ? "celular:row-start-2" : "celular:row-start-1",
          )}
        >
          {selo}
        </span>
      )}
    </>
  );

  const linha = asChild ? (
    <Slot.Root {...comum}>
      <Slot.Slottable>{children}</Slot.Slottable>
      {miolo}
    </Slot.Root>
  ) : href ? (
    <a href={href} {...comum}>
      {miolo}
    </a>
  ) : aoAbrir ? (
    <button type="button" {...comum}>
      {miolo}
    </button>
  ) : (
    <div {...comum}>{miolo}</div>
  );

  return (
    <div
      className={cn(
        "flex items-center border-t border-fio transition-colors first:border-t-0",
        // a escolhida ganha da marcada: é ela que está aberta ao lado
        escolhida ? "barra-escolhida bg-cobalto-suave" : selecionada ? "bg-cobalto-suave/50" : clicavel && "hover:bg-zebra",
        className,
      )}
    >
      {aoSelecionar && (
        <span className="flex shrink-0 pl-[18px] celular:pl-3.5">
          <Caixa checked={!!selecionada} onChange={(e) => aoSelecionar(e.target.checked)} aria-label={rotuloDaSelecao} />
        </span>
      )}
      {linha}
    </div>
  );
}
