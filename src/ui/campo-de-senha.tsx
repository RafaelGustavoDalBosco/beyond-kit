"use client";

// O campo de senha com o olho para mostrar e esconder o que se digitou.

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

import { cn } from "../lib/cn";

import { Campo } from "./campo";

/** O `Campo` de senha com o botão de olho; as props vão para o input (o id vem do `Rotulado`). */
export function CampoDeSenha({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visivel, setVisivel] = useState(false);
  const Olho = visivel ? EyeOff : Eye;
  return (
    <div className="relative">
      <Campo type={visivel ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        aria-label={visivel ? "Esconder o que foi digitado" : "Mostrar o que foi digitado"}
        title={visivel ? "Esconder o que foi digitado" : "Mostrar o que foi digitado"}
        aria-pressed={visivel}
        disabled={props.disabled}
        onClick={() => setVisivel((v) => !v)}
        className="absolute top-1/2 right-1 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-controle text-texto-3 outline-none transition-colors hover:text-texto focus-visible:ring-3 focus-visible:ring-cobalto-suave disabled:cursor-default disabled:hover:text-texto-3"
      >
        <Olho className="size-4" />
      </button>
    </div>
  );
}
