"use client";

// O tema claro / escuro é só o atributo `data-tema` no <html>: tokens.css redefine as mesmas variáveis sob
// `:root[data-tema="escuro"]`, e nenhum componente sabe qual tema está ativo. O padrão é o claro: sem escolha salva
// neste navegador, o app abre claro e nunca segue o tema do sistema.

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "../lib/cn";
import { CHAVE_DO_TEMA as CHAVE } from "./script";

export { SCRIPT_DO_TEMA } from "./script";

export type Tema = "claro" | "escuro";

const ouvintes = new Set<() => void>();

function salvo(): Tema {
  try {
    return localStorage.getItem(CHAVE) === "escuro" ? "escuro" : "claro";
  } catch {
    return "claro";
  }
}

function aplicar(t: Tema) {
  if (t === "escuro") document.documentElement.setAttribute("data-tema", "escuro");
  else document.documentElement.removeAttribute("data-tema");
  ouvintes.forEach((f) => f());
}

/** Aplica a escolha salva (o `SCRIPT_DO_TEMA` já faz isso antes de pintar; chamar de novo não pisca). */
export function iniciarTema() {
  aplicar(salvo());
}

export function alternarTema() {
  const novo: Tema = document.documentElement.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
  try {
    localStorage.setItem(CHAVE, novo);
  } catch {
    /* vale só nesta aba */
  }
  aplicar(novo);
}

export const useTema = () =>
  useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => (document.documentElement.getAttribute("data-tema") === "escuro" ? "escuro" : "claro") as Tema,
    () => "claro" as Tema,
  );

/** O botão de tema do cabeçalho: a lua no claro, o sol no escuro. */
export function BotaoDoTema({ className }: { className?: string }) {
  const tema = useTema();
  const rotulo = tema === "escuro" ? "Mudar para o tema claro" : "Mudar para o tema escuro";
  return (
    <button type="button" className={cn("btn btn-icon", className)} onClick={alternarTema} aria-label={rotulo} data-hint={rotulo}>
      {tema === "escuro" ? <Sun className="icone" aria-hidden /> : <Moon className="icone" aria-hidden />}
    </button>
  );
}
