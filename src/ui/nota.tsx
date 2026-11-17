import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import type { TomDoEmblema } from "./emblema";

// Nota: o `.aviso` do Lastro, a faixa que fica na tela (o resultado de uma ação vai ao toast, o `avisar`), com o
// sinal antes da frase (i, ✓, ◇, ✕) e a ação à direita. Também é a faixa que vale para a tela inteira.

export type TomDaNota = TomDoEmblema;

// O aviso do Lastro de cada tom; ação, destaque e andamento são o aviso neutro com o texto no tom.
const CLASSE: Record<TomDaNota, string> = {
  neutro: "aviso",
  positivo: "aviso aviso-ok",
  atencao: "aviso aviso-atencao",
  erro: "aviso aviso-erro",
  acao: "aviso text-acao-texto before:text-current",
  destaque: "aviso text-destaque before:text-current",
  andamento: "aviso text-estado-andamento before:text-current",
};

/** A faixa de aviso: o sinal do tom (ou o `icone`, no lugar dele), título opcional, a frase e a ação à direita (no
 * celular, a ação desce para baixo da frase). O erro é `role="alert"`. */
export function Nota({
  tom = "neutro",
  icone: Icone,
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
  return (
    <div role={tom === "erro" ? "alert" : "status"} className={cn(CLASSE[tom], "celular:flex-wrap", Icone && "before:hidden", className)}>
      {Icone && <Icone className="size-4 shrink-0 self-start translate-y-px" aria-hidden />}
      <div className="min-w-0 flex-1">
        {titulo && <div className="font-forte">{titulo}</div>}
        {children && <div className={cn(titulo && "mt-0.5")}>{children}</div>}
      </div>
      {acao && <div className="ml-auto flex shrink-0 items-center gap-2 self-center celular:ml-0 celular:w-full">{acao}</div>}
    </div>
  );
}
