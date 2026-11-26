"use client";

// O campo de senha com o olho para mostrar e esconder o que se digitou.

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "../lib/cn";

import { Campo, type PropsDoCampo } from "./campo";

// O olho, à direita, no círculo do `.btn-icon`, e o recuo que o texto ganha por causa dele.
const OLHO = {
  md: "right-1.5 size-8 [&_svg]:size-4",
  lg: "right-2 size-9 [&_svg]:size-[18px]",
} as const;

const RECUO_DO_OLHO = {
  md: "pr-11",
  lg: "pr-12",
} as const;

/** O `Campo` de senha com o botão de olho; as props vão para o input (o id vem do `Rotulado`), com o `icone` à
 * esquerda e o `tamanho="lg"` do login. */
export function CampoDeSenha({ className, tamanho = "md", ...props }: Omit<PropsDoCampo, "type">) {
  const [visivel, setVisivel] = useState(false);
  const Olho = visivel ? EyeOff : Eye;
  return (
    <div className="relative">
      <Campo type={visivel ? "text" : "password"} tamanho={tamanho} className={cn(RECUO_DO_OLHO[tamanho], className)} {...props} />
      <button
        type="button"
        aria-label={visivel ? "Esconder o que foi digitado" : "Mostrar o que foi digitado"}
        title={visivel ? "Esconder o que foi digitado" : "Mostrar o que foi digitado"}
        aria-pressed={visivel}
        disabled={props.disabled}
        onClick={() => setVisivel((v) => !v)}
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-texto-apoio transition-colors duration-(--dur-1) hover:bg-preenchimento hover:text-texto focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_var(--acao-foco)] disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-texto-apoio",
          OLHO[tamanho],
        )}
      >
        <Olho />
      </button>
    </div>
  );
}
