import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

// Nota: o aviso que fica na tela, em linha (o resultado de uma ação vai ao toast, o `avisar`).

export type TomDaNota = "neutro" | "cobalto" | "ganho" | "aviso" | "risco";

const COR: Record<TomDaNota, string> = {
  neutro: "border-linha bg-superficie-2 text-texto-2",
  cobalto: "border-cobalto/20 bg-cobalto-suave text-cobalto-tinta",
  ganho: "border-ganho/20 bg-ganho-suave text-ganho",
  aviso: "border-aviso/20 bg-aviso-suave text-aviso",
  risco: "border-risco/20 bg-risco-suave text-risco",
};

const ICONE: Record<TomDaNota, LucideIcon> = {
  neutro: Info,
  cobalto: Info,
  ganho: CircleCheck,
  aviso: TriangleAlert,
  risco: CircleAlert,
};

/** O aviso em linha: ícone do tom, título opcional, o texto e a ação à direita. O risco é `role="alert"`. */
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
  acao?: ReactNode;
  className?: string;
}) {
  const Icone = icone ?? ICONE[tom];
  return (
    <div
      role={tom === "risco" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-[13px] leading-relaxed", COR[tom], className)}
    >
      <Icone className="mt-[3px] size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        {titulo && <div className="font-semibold">{titulo}</div>}
        {children && <div className={cn(titulo && "mt-0.5")}>{children}</div>}
      </div>
      {acao && <div className="flex shrink-0 items-center gap-2 self-center">{acao}</div>}
    </div>
  );
}
