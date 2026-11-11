import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { PAR_DO_TOM } from "./emblema";

/** O significado do selo: os seis pares claro/forte do kit, mais o `contorno` (tracejado, o que ainda não existe). */
export type Tom = "neutro" | "cobalto" | "ganho" | "aviso" | "risco" | "agua" | "contorno";

// Selo: o estado de um valor ou de um item, em pílula. Cheio é o par claro/forte, sem borda.
const CHEIO: Record<Tom, string> = {
  ...PAR_DO_TOM,
  contorno: "border border-dashed border-linha-forte text-texto-2",
};

// Com `contorno`: fundo branco, a borda cinza e só o texto na cor.
const SO_TEXTO: Record<Tom, string> = {
  neutro: "text-texto-2",
  cobalto: "text-cobalto",
  ganho: "text-ganho",
  aviso: "text-aviso",
  risco: "text-risco",
  agua: "text-agua",
  contorno: "text-texto-2",
};

const TAMANHO = {
  md: "h-[25px] px-3 text-[12.5px] [&_svg]:size-3.5",
  sm: "h-5 px-2.5 text-xs [&_svg]:size-3",
} as const;

/** O selo em pílula: `tom` dá o par claro/forte; `tamanho="sm"` é o da linha de lista; `contorno` troca o fundo
 * pelo branco com borda; `comPonto` põe a bolinha na cor do texto. */
export function Selo({
  tom = "neutro",
  tamanho = "md",
  contorno = false,
  comPonto = false,
  className,
  title,
  children,
}: {
  tom?: Tom;
  tamanho?: "md" | "sm";
  /** Fundo branco e borda, com o texto na cor do tom. */
  contorno?: boolean;
  comPonto?: boolean;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center gap-[5px] rounded-pilula font-bold whitespace-nowrap",
        TAMANHO[tamanho],
        contorno ? ["border border-linha bg-superficie", SO_TEXTO[tom]] : CHEIO[tom],
        className,
      )}
    >
      {comPonto && <span className="size-[7px] shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
