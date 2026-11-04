"use client";

import { CircleAlert, type LucideIcon } from "lucide-react";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** null é "sem valor", nunca zero nem travessão; o rótulo vem do consumidor. */
export function SemValor({ rotulo = "sem valor" }: { rotulo?: string }) {
  return <span className="text-texto-3 italic">{rotulo}</span>;
}

export function Esqueleto({ className }: { className?: string }) {
  return <div className={cn("animate-brilhar rounded-md bg-superficie-3", className)} />;
}

// Larguras e alturas variadas, para o esqueleto lembrar o conteúdo; literais, para o Tailwind achar.
const LARGURAS = ["w-2/5", "w-3/5", "w-1/2", "w-2/3", "w-1/3"];
const ALTURAS = ["h-[45%]", "h-[70%]", "h-[55%]", "h-[85%]", "h-[60%]", "h-full"];

// A partir de quando a espera ganha frase, em ms.
const AINDA_CARREGANDO = 3000;
const DEMORANDO = 15000;

/** O desenho do esqueleto em cada forma; `quantos` é o número de linhas ou de cartões (o gráfico tem as barras dele). */
function FormaDoEsqueleto({ forma, quantos }: { forma: "linhas" | "tabela" | "lista" | "grafico"; quantos: number }) {
  const vezes = Array.from({ length: quantos }, (_, i) => i);
  if (forma === "tabela")
    return vezes.map((i) => (
      <div key={i} className="flex h-11 items-center gap-6 border-b border-linha px-4 last:border-0">
        <Esqueleto className={cn("h-3.5", LARGURAS[i % LARGURAS.length])} />
        <Esqueleto className="ml-auto h-3.5 w-20" />
        <Esqueleto className="h-3.5 w-16" />
      </div>
    ));
  if (forma === "lista")
    return (
      <div className="flex flex-col gap-2">
        {vezes.map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl border border-linha bg-superficie px-4 py-3">
            <Esqueleto className={cn("h-3.5", LARGURAS[i % LARGURAS.length])} />
            <Esqueleto className="h-3 w-1/4" />
          </div>
        ))}
      </div>
    );
  if (forma === "grafico")
    return (
      <div className="flex h-44 items-end gap-4 border-b border-linha px-5">
        {ALTURAS.map((altura) => (
          <Esqueleto key={altura} className={cn("flex-1 rounded-b-none", altura)} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-3 p-5">
      {vezes.map((i) => (
        <Esqueleto key={i} className="h-4" />
      ))}
    </div>
  );
}

/**
 * O esqueleto enquanto carrega, na `forma` do que vem (`linhas`, `tabela`, `lista` ou `grafico`, com `linhas` dizendo
 * quantas linhas ou cartões); `rotulo` quando a espera tem nome ("Consultando o GitHub…"). Só aparece depois de 200 ms,
 * para a resposta rápida não piscar, e ocupa o lugar desde o início. Na espera longa, diz que segue carregando.
 */
export function Carregando({
  linhas = 4,
  rotulo,
  forma = "linhas",
}: {
  linhas?: number;
  rotulo?: string;
  forma?: "linhas" | "tabela" | "lista" | "grafico";
}) {
  const [frase, setFrase] = useState<string>();
  useEffect(() => {
    const ainda = setTimeout(() => setFrase("Ainda carregando…"), AINDA_CARREGANDO);
    const demora = setTimeout(() => setFrase("Está demorando mais que o normal."), DEMORANDO);
    return () => {
      clearTimeout(ainda);
      clearTimeout(demora);
    };
  }, []);
  return (
    <div className="animate-surgir">
      {rotulo && <div className="px-5 pt-5 text-sm text-texto-3">{rotulo}</div>}
      <FormaDoEsqueleto forma={forma} quantos={linhas} />
      {frase && (
        <div role="status" className="px-5 py-3 text-xs text-texto-3">
          {frase}
        </div>
      )}
    </div>
  );
}

/** A recusa: a frase pronta e, quando houver, a referência (o request id) ao lado. */
export function Erro({ frase, referencia, tentar }: { frase: string; referencia?: string | null; tentar?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-5 text-sm">
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
    <div className={cn("overflow-hidden", !solto && "rounded-bloco border border-linha bg-superficie shadow-bloco")}>
      {filete && <div className="filete" />}
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        {Icone && (
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-cobalto-suave text-cobalto">
            <Icone className="size-5" />
          </span>
        )}
        <div className="text-[15px] font-semibold">{titulo}</div>
        {descricao && <p className="m-0 mt-1 max-w-[56ch] text-sm text-texto-2">{descricao}</p>}
        {acao && <div className="mt-4">{acao}</div>}
      </div>
    </div>
  );
}
