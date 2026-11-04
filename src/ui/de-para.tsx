import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { SemValor } from "./estados";

/** O valor antigo e o novo de um campo: o antigo apagado e riscado, a seta, o novo em cobalto; `null` é o `SemValor`.
 * `rotulo` vai em cima; `tamanho="destaque"` é o de-para que é a decisão inteira (18px). */
export function DePara({
  de,
  para,
  rotulo,
  tamanho = "normal",
  className,
}: {
  de: ReactNode;
  para: ReactNode;
  rotulo?: ReactNode;
  tamanho?: "normal" | "destaque";
  className?: string;
}) {
  const destaque = tamanho === "destaque";
  const valores = (
    <span
      className={cn(
        "numero inline-flex flex-wrap items-center gap-2",
        destaque ? "text-lg font-semibold tracking-tight" : "text-[13px]",
        !rotulo && className,
      )}
    >
      <span className={cn("text-texto-3 [overflow-wrap:anywhere]", de != null && "line-through decoration-texto-3/40")}>
        {de ?? <SemValor />}
      </span>
      <ArrowRight className={cn("shrink-0 text-texto-3", destaque ? "size-4" : "size-3.5")} />
      <span className="font-semibold text-cobalto [overflow-wrap:anywhere]">{para ?? <SemValor />}</span>
    </span>
  );
  if (!rotulo) return valores;
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
      <span className="text-[13px] text-texto-2">{rotulo}</span>
      {valores}
    </div>
  );
}
