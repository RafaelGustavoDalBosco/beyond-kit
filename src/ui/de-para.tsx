import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { SemValor } from "./estados";

/** O valor antigo e o novo de um campo, no → para do Lastro; `null` é o `SemValor`. `rotulo` vai em cima.
 * Normal é o de linha: o antigo riscado, a seta e o novo em peso 600. `tamanho="destaque"` é o de-para que é a
 * decisão inteira (a gaveta, a ficha): o bloco `.de-para`, com o antigo afundado e riscado, o novo no contorno azul e
 * "De" e "Para" em cima de cada valor (no celular, um embaixo do outro, sem a seta). */
export function DePara({
  de,
  para,
  rotulo,
  tamanho = "normal",
  rotuloDe = "De",
  rotuloPara = "Para",
  className,
}: {
  de: ReactNode;
  para: ReactNode;
  rotulo?: ReactNode;
  tamanho?: "normal" | "destaque";
  /** No destaque, o rótulo em cima do valor antigo. */
  rotuloDe?: ReactNode;
  /** No destaque, o rótulo em cima do valor novo. */
  rotuloPara?: ReactNode;
  className?: string;
}) {
  const valores =
    tamanho === "destaque" ? (
      <div className={cn("de-para numero", !rotulo && className)}>
        <div className="de-para-de min-w-0">
          <small>{rotuloDe}</small>
          {/* o `div` do `.de-para-de` vem riscado; sem valor, o traço não risca */}
          {de != null ? <div className="[overflow-wrap:anywhere]">{de}</div> : <span className="mt-[3px] block"><SemValor /></span>}
        </div>
        <div className="de-para-seta" aria-hidden>
          →
        </div>
        <div className="de-para-para min-w-0">
          <small>{rotuloPara}</small>
          <div className="[overflow-wrap:anywhere]">{para ?? <SemValor />}</div>
        </div>
      </div>
    ) : (
      <span className={cn("numero inline-flex max-w-full flex-wrap items-baseline gap-1.5", !rotulo && className)}>
        {de != null ? <s className="[overflow-wrap:anywhere]">{de}</s> : <SemValor />}
        <span aria-hidden className="text-texto-apoio">→</span>
        <b className="font-forte [overflow-wrap:anywhere]">{para ?? <SemValor />}</b>
      </span>
    );
  if (!rotulo) return valores;
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-1", tamanho === "destaque" && "items-stretch", className)}>
      <span className="text-apoio font-medio text-texto-apoio">{rotulo}</span>
      {valores}
    </div>
  );
}
