"use client";

// Os avisos de ação (o toast do ArchFlow): no canto superior direito, somem
// sozinhos. O resultado de uma ação leva a frase que o consumidor manda; a
// recusa, a frase do erro, que o consumidor pode trocar por `configurarAvisos`.

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "../lib/cn";

type Tipo = "sucesso" | "erro" | "aviso" | "info";
type Aviso = { id: number; tipo: Tipo; texto: string };

let avisos: Aviso[] = [];
let proximo = 1;
const ouvintes = new Set<() => void>();
const mudou = () => ouvintes.forEach((f) => f());

function mostrar(tipo: Tipo, texto: string, id = proximo++) {
  // O mesmo aviso repetido troca o que já está na tela, não empilha.
  avisos = [...avisos.filter((a) => a.texto !== texto), { id, tipo, texto }].slice(-4);
  mudou();
  setTimeout(() => fechar(id), tipo === "erro" ? 6000 : 3500);
}

function fechar(id: number) {
  avisos = avisos.filter((a) => a.id !== id);
  mudou();
}

const config = {
  fraseDoErro: (erro: unknown): string => (erro instanceof Error ? erro.message : String(erro)),
};

/** O consumidor com erro próprio da API troca a frase que `avisar.erro` mostra. */
export function configurarAvisos(opcoes: { fraseDoErro?: (erro: unknown) => string }) {
  if (opcoes.fraseDoErro) config.fraseDoErro = opcoes.fraseDoErro;
}

/** A frase de uma recusa, a mesma que o `avisar.erro` mostraria (para a recusa que fica na tela, como a do login). */
export const fraseDoErro = (erro: unknown) => config.fraseDoErro(erro);

export const avisar = {
  sucesso: (texto: string) => mostrar("sucesso", texto),
  erro: (erro: unknown) => mostrar("erro", config.fraseDoErro(erro)),
  aviso: (texto: string) => mostrar("aviso", texto),
  info: (texto: string) => mostrar("info", texto),
};

const ICONE = { sucesso: CircleCheck, erro: CircleAlert, aviso: CircleAlert, info: Info };
const COR = { sucesso: "text-ganho", erro: "text-risco", aviso: "text-aviso", info: "text-cobalto" };

export function Avisos() {
  const lista = useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => avisos,
    () => avisos,
  );
  return (
    <div aria-live="polite" className="pointer-events-none fixed top-4 right-4 z-[60] flex w-[360px] flex-col gap-2">
      {lista.map((a) => {
        const Icone = ICONE[a.tipo];
        return (
          <div
            key={a.id}
            role="status"
            className="pointer-events-auto flex animate-entrar items-start gap-3 rounded-xl border border-linha bg-superficie px-4 py-3 shadow-3"
          >
            <Icone className={cn("mt-px size-[18px] shrink-0", COR[a.tipo])} />
            <span className="flex-1 text-[13px] leading-snug font-medium">{a.texto}</span>
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => fechar(a.id)}
              className="-mr-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-texto-3 hover:bg-superficie-2 hover:text-texto"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
