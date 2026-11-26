import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** O sentido fixo de uma cor, sempre em par claro/forte: o azul é só ação (o que se clica ou se marcou); o
 * positivo é o que entrou ou deu certo; o destaque é o segundo realce, que não é ação; a atenção pede olho (vencido,
 * atrasado); o erro é só falha de sistema e o que apaga; o andamento é o que está a caminho; o neutro, o resto. */
export type TomDoEmblema = "neutro" | "acao" | "positivo" | "destaque" | "atencao" | "erro" | "andamento";

/** O par claro/forte de cada tom (fundo claro, conteúdo forte), para quem pinta um bloco pelo significado. */
export const PAR_DO_TOM: Record<TomDoEmblema, string> = {
  neutro: "bg-mesa text-texto-secundario",
  acao: "bg-acao-100 text-acao-texto",
  positivo: "bg-positivo-fundo text-positivo",
  destaque: "bg-destaque-fundo text-destaque",
  atencao: "bg-atencao-fundo text-atencao",
  erro: "bg-erro-fundo text-erro",
  andamento: "bg-estado-andamento-fundo text-estado-andamento",
};

// O traço do ícone na cor do tom, sobre o fundo recuado: o ícone não vai em bloco de cor (só com `cheio`).
const TRACO: Record<TomDoEmblema, string> = {
  neutro: "text-texto-secundario",
  acao: "text-acao-texto",
  positivo: "text-positivo",
  destaque: "text-destaque",
  atencao: "text-atencao",
  erro: "text-erro",
  andamento: "text-estado-andamento",
};

const TAMANHO = {
  xs: "size-6 text-micro [&_svg]:size-3.5",
  sm: "size-7 text-micro [&_svg]:size-4",
  md: "size-8 text-apoio [&_svg]:size-[17px]",
  lg: "size-10 text-base [&_svg]:size-5",
} as const;

/** O ícone de apoio do kit, discreto: o quadrado no fundo recuado (`bg-mesa`), com o ícone (ou a sigla
 * `ICMS`, `ST`, `NCM`) no traço do tom. `cheio` pinta o quadrado no par claro/forte do tom. */
export function Emblema({
  icone: Icone,
  sigla,
  tom = "neutro",
  tamanho = "md",
  cheio,
  className,
}: {
  icone?: LucideIcon;
  /** No lugar do ícone: a sigla curta (até quatro letras). */
  sigla?: ReactNode;
  tom?: TomDoEmblema;
  tamanho?: keyof typeof TAMANHO;
  cheio?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-m font-forte",
        TAMANHO[tamanho],
        cheio ? PAR_DO_TOM[tom] : ["bg-mesa", TRACO[tom]],
        className,
      )}
    >
      {Icone ? <Icone /> : sigla}
    </span>
  );
}
