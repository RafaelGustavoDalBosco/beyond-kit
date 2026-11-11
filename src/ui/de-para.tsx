import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { SemValor } from "./estados";

/** O valor antigo e o novo de um campo, em caixa clara: o antigo, a seta e o novo em azul; `null` é o `SemValor`.
 * `rotulo` vai em cima. `tamanho="destaque"` é o de-para que é a decisão inteira (a gaveta, a ficha): a caixa larga,
 * com "De" e "Para" em cima de cada valor. */
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
      <span
        className={cn(
          "numero grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2.5 rounded-icone bg-superficie-2 px-3.5 py-3",
          !rotulo && className,
        )}
      >
        <span className="min-w-0">
          <span className="mb-0.5 block text-xs font-bold text-texto-2">{rotuloDe}</span>
          <span className="block font-extrabold [overflow-wrap:anywhere]">{de ?? <SemValor />}</span>
        </span>
        <ArrowRight className="size-4 shrink-0 text-texto-3" />
        <span className="min-w-0">
          <span className="mb-0.5 block text-xs font-bold text-texto-2">{rotuloPara}</span>
          <span className="block font-extrabold text-cobalto [overflow-wrap:anywhere]">{para ?? <SemValor />}</span>
        </span>
      </span>
    ) : (
      <span
        className={cn(
          "numero inline-flex max-w-full flex-wrap items-center gap-2 rounded-controle bg-superficie-2 px-2.5 py-1 text-[13px]",
          !rotulo && className,
        )}
      >
        <span className={cn("font-semibold text-texto-2 [overflow-wrap:anywhere]", de != null && "line-through decoration-texto-3")}>
          {de ?? <SemValor />}
        </span>
        <ArrowRight className="size-3.5 shrink-0 text-texto-3" />
        <span className="font-bold text-cobalto [overflow-wrap:anywhere]">{para ?? <SemValor />}</span>
      </span>
    );
  if (!rotulo) return valores;
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-1", tamanho === "destaque" && "items-stretch", className)}>
      <span className="text-[13px] font-bold text-texto-2">{rotulo}</span>
      {valores}
    </div>
  );
}
