import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { PAR_DO_TOM, type TomDoEmblema } from "./emblema";

/** O sentido do selo: os pares claro/forte do kit, mais o `contorno` (pontilhado, o que ainda não existe). */
export type Tom = TomDoEmblema | "contorno";

/** O estado de um registro no ciclo do Lastro, com o sinal que enche conforme avança: em aberto ○, marcado ◔, em
 * andamento →, aplicado ◑, concluído ● (o único cheio), com erro ✕, cancelado (riscado) e para conferir ?. */
export type EstadoDoSelo = "aberto" | "marcado" | "andamento" | "aplicado" | "concluido" | "erro" | "cancelado" | "conferir";

// Selo de sentido: o par claro/forte, sem borda.
const CHEIO: Record<Tom, string> = {
  ...PAR_DO_TOM,
  contorno: "border border-dotted border-neutro-600 text-texto-secundario",
};

// Com `contorno`: o fundo do campo, a borda cinza e só o texto na cor.
const SO_TEXTO: Record<Tom, string> = {
  neutro: "text-texto-secundario",
  acao: "text-acao-texto",
  positivo: "text-positivo",
  destaque: "text-destaque",
  atencao: "text-atencao",
  erro: "text-erro",
  andamento: "text-estado-andamento",
  contorno: "text-texto-apoio",
};

// md é o `.selo` do Lastro; sm, o da linha de lista densa.
const TAMANHO = {
  md: "[&_svg]:size-3",
  sm: "px-[5px] text-micro [&_svg]:size-3",
} as const;

/** O selo do Lastro (`.selo`: raio 4, 12px, peso 500). `estado` dá o selo do ciclo de um registro, com o sinal
 * (o `tom` fica de fora); sem ele, `tom` dá o par claro/forte de sentido. `tamanho="sm"` é o da linha de lista;
 * `contorno` troca o fundo pelo do campo com borda; `comPonto` põe o ponto na cor do texto. */
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
  /** O fundo do campo e a borda, com o texto na cor do tom. */
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
        estado ? `selo-${estado}` : contorno ? ["border border-borda bg-campo", SO_TEXTO[tom]] : CHEIO[tom],
        className,
      )}
    >
      {comPonto && <span className="size-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
