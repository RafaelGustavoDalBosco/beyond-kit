import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import type { TomDoEmblema } from "./emblema";

/** O sentido do selo: os tons do kit, mais o `contorno` (o círculo pontilhado, o que ainda não existe). */
export type Tom = TomDoEmblema | "contorno";

/** O estado de um registro no ciclo, com o sinal que enche conforme avança: em aberto ○, marcado ◔, em andamento →,
 * aplicado ◑, concluído ● (o único cheio), com erro ✕, cancelado (riscado) e para conferir ?. */
export type EstadoDoSelo = "aberto" | "marcado" | "andamento" | "aplicado" | "concluido" | "erro" | "cancelado" | "conferir";

// md é o `.selo`; sm, o da linha de lista densa.
const TAMANHO = {
  md: "[&_svg]:size-3",
  sm: "text-micro [&_svg]:size-3",
} as const;

/** O selo (`.selo`): sinal + texto, sem pílula colorida. `estado` dá o ciclo de um registro, com o sinal do CSS (o
 * `tom` fica de fora); sem ele, `tom` dá o sentido: o texto no tom e o sinal no selinho tonal (✓ positivo, + destaque,
 * ◇ atenção, ✕ erro, → andamento, • ação); o `neutro` é a etiqueta neutra, no preenchimento. `tamanho="sm"` é o da
 * linha de lista; `contorno` tira o sinal e põe o fio de dentro, com o texto no tom; `comPonto` troca o sinal pelo
 * ponto na cor do texto. */
export function Selo({
  tom = "neutro",
  estado,
  tamanho = "md",
  contorno = false,
  comPonto = false,
  className,
  title,
  children,
}: {
  tom?: Tom;
  /** O estado do registro no ciclo: as classes `.selo-<estado>`, com o sinal antes do texto. */
  estado?: EstadoDoSelo;
  tamanho?: "md" | "sm";
  /** O fio de dentro, sem o sinal, com o texto na cor do tom. */
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
        "selo shrink-0",
        TAMANHO[tamanho],
        estado ? `selo-${estado}` : `selo-${tom}`,
        !estado && contorno && "is-contornado",
        comPonto && "before:hidden",
        className,
      )}
    >
      {comPonto && <span className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
