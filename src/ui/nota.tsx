import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { PAR_DO_TOM } from "./emblema";

// Nota: o aviso que fica na tela (o resultado de uma ação vai ao toast, o `avisar`). É também a faixa que vale para
// a tela inteira: colorida no par do tom, sem borda, com a ação à direita.

export type TomDaNota = "neutro" | "cobalto" | "ganho" | "aviso" | "risco" | "agua";

// O par do tom; no azul o texto vai no azul escuro, que lê melhor numa frase inteira.
const COR: Record<TomDaNota, string> = {
  ...PAR_DO_TOM,
  cobalto: "bg-cobalto-suave text-cobalto-tinta",
};

const ICONE: Record<TomDaNota, LucideIcon> = {
  neutro: Info,
  cobalto: Info,
  ganho: CircleCheck,
  aviso: TriangleAlert,
  risco: CircleAlert,
  agua: Info,
};

/** A faixa de aviso: ícone do tom, título opcional, a frase e a ação à direita (no celular, a ação desce para
 * baixo da frase). O risco é `role="alert"`. */
export function Nota({
  tom = "neutro",
  icone,
  titulo,
  children,
  acao,
  className,
}: {
  tom?: TomDaNota;
  icone?: LucideIcon;
  titulo?: ReactNode;
  children?: ReactNode;
  /** O botão (ou os botões) à direita da faixa. */
  acao?: ReactNode;
  className?: string;
}) {
  const Icone = icone ?? ICONE[tom];
  return (
    <div
      role={tom === "risco" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-icone px-4 py-3 text-sm leading-[1.45] font-bold celular:flex-wrap",
        // só a frase: ícone, frase e ação no mesmo eixo; com título, o ícone acompanha a primeira linha
        titulo ? "items-start" : "items-center",
        COR[tom],
        className,
      )}
    >
      <Icone className={cn("size-[18px] shrink-0", titulo && "mt-px")} aria-hidden />
      <div className="min-w-0 flex-1">
        {titulo && <div className="font-extrabold">{titulo}</div>}
        {children && <div className={cn(titulo && "mt-0.5 font-semibold")}>{children}</div>}
      </div>
      {/* no celular a ação ocupa a linha de baixo, alinhada com a frase (18px do ícone + 12px do respiro) */}
      {acao && <div className="flex shrink-0 items-center gap-2 self-center celular:w-full celular:pl-[30px]">{acao}</div>}
    </div>
  );
}
