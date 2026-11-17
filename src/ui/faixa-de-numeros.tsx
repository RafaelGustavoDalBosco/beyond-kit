"use client";

import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** A faixa baixa de números, numa caixa ficha: os números em pouca altura, para a lista começar perto do topo. Não é
 * o padrão de abertura de tela (que é o `CartoesDeNumero` com os `Indicador`); fica para quando a altura conta. Os
 * `Segmento` dividem a largura e quebram em mais linhas quando não cabem; o `DivisorDaFaixa` separa os grupos. */
export function FaixaDeNumeros({ children, "aria-label": rotulo }: { children: ReactNode; "aria-label"?: string }) {
  return (
    <div
      role="group"
      aria-label={rotulo}
      className="flex shrink-0 flex-wrap items-stretch gap-1 rounded-g border border-borda bg-ficha p-1 shadow-p"
    >
      {children}
    </div>
  );
}

/** Um número da faixa; com `aoAbrir` ele é um botão (seleciona ou abre o que o compõe) e `ativo` marca o escolhido
 * (o azul claro com o contorno azul, como a opção ativa do segmentado). */
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
  tom?: "erro" | "positivo";
  /** O número sem peso (o zero): o que tem valor salta aos olhos. */
  apagado?: boolean;
  /** Divide a sobra da largura com os outros; `false` fica do tamanho do conteúdo. */
  largo?: boolean;
  aoAbrir?: () => void;
  ativo?: boolean;
}) {
  const conteudo = (
    <>
      <span className="flex items-center gap-2 text-apoio font-medio text-texto-apoio">
        {rotulo}
        {selos}
      </span>
      <span
        className={cn(
          "numero text-subtitulo leading-titulo font-medio tracking-titulo whitespace-nowrap",
          tom === "erro" && "text-erro",
          tom === "positivo" && "text-positivo",
          apagado && "font-normal text-texto-apoio",
        )}
      >
        {valor}
      </span>
      {detalhe && <span className="text-apoio text-texto-apoio">{detalhe}</span>}
    </>
  );
  const classe = cn(
    "flex min-w-0 flex-col justify-center gap-0.5 rounded-m px-3 py-2 text-left",
    largo ? "flex-1 basis-[130px]" : "shrink-0",
    aoAbrir && "cursor-pointer transition-colors hover:bg-hover",
    ativo && "bg-acao-100 shadow-[inset_0_0_0_1px_var(--acao)] hover:bg-acao-100",
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
  return <div className="my-1.5 w-px shrink-0 bg-borda" />;
}
