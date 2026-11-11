import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** Uma barra do gráfico: o mês fechado, o mês de referência ou uma projeção. */
export type BarraDoGrafico = {
  rotulo: string;
  valor: number;
  /** O mês de referência: em azul cheio, com o valor escrito em cima. */
  referencia?: boolean;
  /** A barra é uma projeção: o `valor` é o provável, dentro da faixa de `minimo` a `maximo`. */
  projecao?: { minimo: number; maximo: number };
};

// As linhas da grade, em % da altura do desenho.
const GRADE = [25, 50, 75, 100];

// O trilho da barra, no meio da coluna: 34px, ou menos quando a coluna aperta.
const TRILHO = "absolute inset-y-0 left-1/2 w-[34px] max-w-[70%] -translate-x-1/2";

/** O gráfico de barras, sem biblioteca: os meses fechados em azul, o de `referencia` em azul cheio com o valor em cima
 * e a `projecao` como barra tracejada, com a faixa em azul claro e o traço do valor provável. Uma linha vertical separa
 * a primeira projeção dos fechados, com o `rotuloDaProjecao` ao lado. `formatar` escreve o valor (em cima da referência
 * e na dica de cada barra); `altura` é a do gráfico inteiro, em px. */
export function GraficoDeBarras({
  barras,
  formatar = (valor) => valor.toLocaleString("pt-BR"),
  altura = 230,
  rotuloDaProjecao,
  className,
  "aria-label": rotulo,
}: {
  barras: BarraDoGrafico[];
  formatar?: (valor: number) => string;
  altura?: number;
  rotuloDaProjecao?: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  // A folga de 8% no alto deixa o valor escrito caber sobre a barra mais alta; tudo zerado não divide por zero.
  const teto = Math.max(0, ...barras.flatMap((b) => [b.valor, b.projecao?.maximo ?? 0])) * 1.08 || 1;
  const parte = (valor: number) => `${(valor / teto) * 100}%`;
  const primeiraProjecao = barras.findIndex((b) => b.projecao);
  return (
    <div role="img" aria-label={rotulo} className={cn("relative flex", className)} style={{ height: altura }}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[22px] bottom-6">
        {GRADE.map((linha) => (
          <div key={linha} className="absolute inset-x-0 border-t border-fio" style={{ bottom: `${linha}%` }} />
        ))}
      </div>
      {barras.map((b, i) => (
        <div
          key={i}
          title={
            b.projecao
              ? `${b.rotulo}: ${formatar(b.valor)} (${formatar(b.projecao.minimo)} – ${formatar(b.projecao.maximo)})`
              : `${b.rotulo}: ${formatar(b.valor)}`
          }
          className="relative flex min-w-0 flex-1 flex-col"
        >
          {i === primeiraProjecao && (
            <>
              <div className="absolute top-3 bottom-6 left-0 border-l border-dashed border-linha-forte" />
              {rotuloDaProjecao && (
                <div className="absolute top-[9px] left-2 text-[11.5px] leading-none font-bold whitespace-nowrap text-texto-2">
                  {rotuloDaProjecao}
                </div>
              )}
            </>
          )}
          <div className="relative mt-[22px] min-h-0 flex-1">
            <div className={TRILHO}>
              {b.projecao ? (
                <>
                  <div
                    className="absolute inset-x-0 rounded-[6px] bg-cobalto-suave"
                    style={{ bottom: parte(b.projecao.minimo), height: parte(b.projecao.maximo - b.projecao.minimo) }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-[6px] border-[1.5px] border-dashed border-cobalto"
                    style={{ height: parte(b.valor) }}
                  />
                  <div className="absolute inset-x-1 h-0.5 translate-y-1/2 rounded-full bg-cobalto" style={{ bottom: parte(b.valor) }} />
                </>
              ) : (
                <div
                  className={cn("absolute inset-x-0 bottom-0 rounded-[6px]", b.referencia ? "bg-cobalto" : "bg-serie-2")}
                  style={{ height: parte(b.valor) }}
                />
              )}
            </div>
            {b.referencia && (
              <div
                className="numero absolute left-1/2 -translate-x-1/2 pb-1.5 text-xs leading-none font-extrabold whitespace-nowrap"
                style={{ bottom: parte(b.valor) }}
              >
                {formatar(b.valor)}
              </div>
            )}
          </div>
          <div className={cn("h-6 truncate pt-2 text-center text-xs leading-4 font-bold", b.referencia ? "text-texto" : "text-texto-2")}>
            {b.rotulo}
          </div>
        </div>
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 border-t border-linha" />
    </div>
  );
}

// O quadradinho de cada tipo de barra, na legenda.
const AMOSTRA = {
  fechado: "bg-serie-2",
  referencia: "bg-cobalto",
  projecao: "bg-cobalto-suave ring-[1.5px] ring-cobalto ring-inset",
} as const;

/** A legenda do `GraficoDeBarras` (vai na `acao` da `CabecaDoBloco`): o quadradinho de cada tipo de barra e o rótulo,
 * que vem do app. */
export function LegendaDoGrafico({
  itens,
  className,
}: {
  itens: { tipo: keyof typeof AMOSTRA; rotulo: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px] font-bold text-texto-2", className)}>
      {itens.map((item) => (
        <span key={item.tipo} className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2.5 rounded-[3px]", AMOSTRA[item.tipo])} />
          {item.rotulo}
        </span>
      ))}
    </div>
  );
}
