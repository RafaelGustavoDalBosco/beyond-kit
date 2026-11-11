import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** O significado fixo de uma cor, sempre em par claro/forte: azul ação, verde ganho, laranja pede ação, vermelho
 * risco, cinza neutro e verde-água ICMS-ST e entrada. */
export type TomDoEmblema = "cobalto" | "ganho" | "aviso" | "risco" | "neutro" | "agua";

/** O par claro/forte de cada tom (fundo claro, conteúdo forte), para quem pinta um bloco pelo significado. */
export const PAR_DO_TOM: Record<TomDoEmblema, string> = {
  cobalto: "bg-cobalto-suave text-cobalto",
  ganho: "bg-ganho-suave text-ganho",
  aviso: "bg-aviso-suave text-aviso",
  risco: "bg-risco-suave text-risco",
  neutro: "bg-neutro-suave text-neutro",
  agua: "bg-agua-suave text-agua",
};

const CHEIO: Record<TomDoEmblema, string> = {
  cobalto: "bg-cobalto text-sobre-cobalto",
  ganho: "bg-ganho text-white",
  aviso: "bg-aviso text-white",
  risco: "bg-risco text-white",
  neutro: "bg-neutro text-white",
  agua: "bg-agua text-white",
};

const TAMANHO = {
  xs: "size-7 text-[10px] [&_svg]:size-3.5",
  sm: "size-[34px] text-[11px] [&_svg]:size-4",
  md: "size-[42px] text-xs [&_svg]:size-5",
  lg: "size-[52px] text-sm [&_svg]:size-6",
} as const;

/** O ícone colorido do kit: em círculo (cartão de número, estado, confirmação, aviso, notificação) ou em quadrado
 * de raio 12 (a linha de lista, com a sigla `ICMS`, `ST`, `NCM` ou o ícone da operação; o cabeçalho da ficha).
 * `cheio` inverte o par: fundo forte, conteúdo branco. */
export function Emblema({
  icone: Icone,
  sigla,
  tom = "cobalto",
  forma = "circulo",
  tamanho = "md",
  cheio,
  className,
}: {
  icone?: LucideIcon;
  /** No lugar do ícone: a sigla curta (até quatro letras). */
  sigla?: ReactNode;
  tom?: TomDoEmblema;
  forma?: "circulo" | "quadrado";
  tamanho?: keyof typeof TAMANHO;
  cheio?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center font-extrabold",
        forma === "circulo" ? "rounded-full" : "rounded-icone",
        TAMANHO[tamanho],
        cheio ? CHEIO[tom] : PAR_DO_TOM[tom],
        className,
      )}
    >
      {Icone ? <Icone /> : sigla}
    </span>
  );
}
