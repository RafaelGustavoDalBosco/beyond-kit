"use client";

import { CircleAlert, type LucideIcon } from "lucide-react";

import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** null é "sem valor", nunca zero nem travessão; o rótulo vem do consumidor. */
export function SemValor({ rotulo = "sem valor" }: { rotulo?: string }) {
  return <span className="text-texto-3 italic">{rotulo}</span>;
}

export function Esqueleto({ className }: { className?: string }) {
  return <div className={cn("animate-brilhar rounded-md bg-superficie-3", className)} />;
}

/** O esqueleto enquanto carrega; `rotulo` quando a espera tem nome ("Consultando o GitHub…"). */
export function Carregando({ linhas = 4, rotulo }: { linhas?: number; rotulo?: string }) {
  return (
    <div className="flex flex-col gap-3 p-5">
      {rotulo && <span className="text-[13px] text-texto-3">{rotulo}</span>}
      {Array.from({ length: linhas }, (_, i) => (
        <Esqueleto key={i} className="h-4" />
      ))}
    </div>
  );
}

/** A recusa: a frase pronta e, quando houver, a referência (o request id) ao lado. */
export function Erro({ frase, referencia, tentar }: { frase: string; referencia?: string | null; tentar?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-5 text-[13px]">
      <CircleAlert className="size-4 shrink-0 text-risco" />
      <div className="flex-1">
        {frase}
        {referencia && <span className="numero ml-2 text-xs text-texto-3">{referencia}</span>}
      </div>
      {tentar && (
        <Botao tamanho="sm" onClick={tentar}>
          Tentar de novo
        </Botao>
      )}
    </div>
  );
}

/**
 * A lista sem item: o título, a frase e a ação para começar. `solto` tira o contorno (dentro de um bloco);
 * `icone` põe o ícone do assunto no quadrado cobalto e `filete`, o filete no alto (o vazio que ocupa a tela).
 */
export function Vazio({
  titulo,
  descricao,
  acao,
  solto,
  icone: Icone,
  filete,
}: {
  titulo: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  solto?: boolean;
  icone?: LucideIcon;
  filete?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden", !solto && "rounded-bloco border border-linha bg-superficie shadow-1")}>
      {filete && <div className="filete" />}
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        {Icone && (
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-cobalto-suave text-cobalto">
            <Icone className="size-5" />
          </span>
        )}
        <div className="text-[15px] font-semibold">{titulo}</div>
        {descricao && <p className="m-0 mt-1 max-w-[56ch] text-[13px] text-texto-2">{descricao}</p>}
        {acao && <div className="mt-4">{acao}</div>}
      </div>
    </div>
  );
}
