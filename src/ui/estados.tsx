import { CircleAlert } from "lucide-react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** null é "sem valor", nunca zero nem travessão; o rótulo vem do consumidor. */
export function SemValor({ rotulo = "sem valor" }: { rotulo?: string }) {
  return <span className="text-texto-3 italic">{rotulo}</span>;
}

export function Esqueleto({ className }: { className?: string }) {
  return <div className={cn("animate-brilhar rounded-md bg-superficie-3", className)} />;
}

export function Carregando({ linhas = 4 }: { linhas?: number }) {
  return (
    <div className="flex flex-col gap-3 p-5">
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
