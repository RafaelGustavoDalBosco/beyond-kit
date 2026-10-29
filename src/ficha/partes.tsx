"use client";

import { Check, Copy, type LucideIcon } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** O alto da ficha: o ícone do tipo, o que ela é, o nome e os códigos. */
export function CabecaDaFicha({
  icone: Icone,
  tipo,
  titulo,
  selos,
  codigos,
  acoes,
}: {
  icone: LucideIcon;
  tipo: ReactNode;
  titulo: ReactNode;
  selos?: ReactNode;
  codigos?: ReactNode;
  /** Os botões da ficha, à direita do título. */
  acoes?: ReactNode;
}) {
  return (
    <div className="flex gap-4 px-6 pt-6 pb-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cobalto-suave text-cobalto">
        <Icone className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="rotulo flex items-center gap-2">{tipo}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h2 className="m-0 min-w-0 text-xl leading-tight font-semibold tracking-[-0.015em] [overflow-wrap:anywhere]">{titulo}</h2>
          {selos}
        </div>
        {codigos && <div className="mt-3 flex flex-wrap items-center gap-1.5">{codigos}</div>}
      </div>
      {acoes && <div className="flex shrink-0 flex-wrap items-start gap-2">{acoes}</div>}
    </div>
  );
}

/** Um código com o nome dele (NCM, CEST, EAN, CFOP…): a ficha técnica em linha. */
export function Codigo({ nome, valor, copiavel }: { nome: string; valor: ReactNode; copiavel?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <span className="inline-flex h-7 items-center gap-2 rounded-lg border border-linha bg-superficie-2 pr-1 pl-2.5 text-xs">
      <span className="text-texto-3">{nome}</span>
      <span className="numero pr-1.5 text-texto">{valor}</span>
      {copiavel && (
        <button
          type="button"
          aria-label="Copiar"
          onClick={() => {
            navigator.clipboard.writeText(copiavel);
            setOk(true);
            setTimeout(() => setOk(false), 1400);
          }}
          className="-ml-1 flex size-5 cursor-pointer items-center justify-center rounded text-texto-3 hover:bg-superficie-3 hover:text-texto"
        >
          {ok ? <Check className="size-3" /> : <Copy className="size-3" />}
        </button>
      )}
    </span>
  );
}

/** Pares rótulo → valor, em grade; a linha incompleta não deixa buraco. As colunas seguem a largura do contêiner (não
 * a da tela), para a ficha estreita não espremer: uma coluna abaixo de 28rem, duas até 42rem, `colunas` daí para cima. */
export function Pares({ children, colunas = 3 }: { children: ReactNode; colunas?: 2 | 3 | 4 }) {
  return (
    <div className="@container">
      <dl
        className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-linha bg-superficie @md:grid-cols-2 @2xl:grid-cols-[repeat(var(--colunas),minmax(0,1fr))]"
        style={{ "--colunas": colunas } as CSSProperties}
      >
        {children}
      </dl>
    </div>
  );
}

/** Um par; `longo` não corta o valor (o endereço, a descrição) e `ocupa` estende por mais colunas. */
export function Par({ rotulo, longo, ocupa, children }: { rotulo: string; longo?: boolean; ocupa?: number; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-superficie px-4 py-3 outline outline-1 outline-linha",
        ocupa && ocupa > 1 && "@md:col-span-2 @2xl:[grid-column:span_var(--ocupa)/span_var(--ocupa)]",
      )}
      style={ocupa ? ({ "--ocupa": ocupa } as CSSProperties) : undefined}
    >
      <dt className="text-xs text-texto-3">{rotulo}</dt>
      <dd className={cn("m-0 text-[13px] font-medium", longo ? "whitespace-pre-line [overflow-wrap:anywhere]" : "truncate")}>{children}</dd>
    </div>
  );
}

/** O link de uma entidade dentro de uma ficha: abre a ficha dela por cima. */
export function Entidade({ children, aoAbrir, className }: { children: ReactNode; aoAbrir: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        aoAbrir();
      }}
      className={cn(
        "numero cursor-pointer rounded px-1 -mx-1 text-cobalto underline decoration-cobalto/30 underline-offset-[3px] hover:bg-cobalto-suave hover:decoration-cobalto",
        className,
      )}
    >
      {children}
    </button>
  );
}
