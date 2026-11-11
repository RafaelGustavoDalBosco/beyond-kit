"use client";

import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** A faixa baixa de números: os números em pouca altura, para a lista começar perto do topo. Deixou de ser o padrão
 * de abertura de tela (que é o `CartoesDeNumero` com os `Indicador`); fica para quando a altura conta. Os `Segmento`
 * dividem a largura e quebram em mais linhas quando não cabem; o `DivisorDaFaixa` separa os grupos. */
export function FaixaDeNumeros({ children, "aria-label": rotulo }: { children: ReactNode; "aria-label"?: string }) {
  return (
    <div
      role="group"
      aria-label={rotulo}
      className="flex shrink-0 flex-wrap items-stretch gap-1 rounded-cartao bg-superficie p-1 shadow-1"
    >
      {children}
    </div>
  );
}

/** Um número da faixa; com `aoAbrir` ele é um botão (seleciona ou abre o que o compõe) e `ativo` marca o escolhido. */
export function Segmento({
  rotulo,
  valor,
  detalhe,
  selos,
  tom,
  apagado,
  largo = true,
  aoAbrir,
  ativo,
}: {
  rotulo: ReactNode;
  valor: ReactNode;
  detalhe?: ReactNode;
  /** Ao lado do rótulo. */
  selos?: ReactNode;
  tom?: "risco" | "ganho";
  /** O número sem peso (o zero): o que tem valor salta aos olhos. */
  apagado?: boolean;
  /** Divide a sobra da largura com os outros; `false` fica do tamanho do conteúdo. */
  largo?: boolean;
  aoAbrir?: () => void;
  ativo?: boolean;
}) {
  const conteudo = (
    <>
      <span className="flex items-center gap-2 text-[12.5px] leading-snug font-bold text-texto-2">
        {rotulo}
        {selos}
      </span>
      <span
        className={cn(
          "numero text-[17px] leading-tight font-extrabold whitespace-nowrap",
          tom === "risco" && "text-risco",
          tom === "ganho" && "text-ganho",
          apagado && "font-bold text-texto-3",
        )}
      >
        {valor}
      </span>
      {detalhe && <span className="text-xs leading-snug font-semibold text-texto-2">{detalhe}</span>}
    </>
  );
  const classe = cn(
    "flex min-w-0 flex-col justify-center gap-0.5 rounded-controle px-3 py-2 text-left",
    largo ? "flex-1 basis-[130px]" : "shrink-0",
    aoAbrir && "cursor-pointer transition-colors hover:bg-superficie-2",
    ativo && "bg-cobalto-suave ring-2 ring-cobalto ring-inset hover:bg-cobalto-suave",
  );
  return aoAbrir ? (
    <button type="button" aria-pressed={ativo} onClick={aoAbrir} className={classe}>
      {conteudo}
    </button>
  ) : (
    <div className={classe}>{conteudo}</div>
  );
}

/** O fio entre os grupos da faixa. */
export function DivisorDaFaixa() {
  return <div className="my-1.5 w-px shrink-0 bg-linha" />;
}
