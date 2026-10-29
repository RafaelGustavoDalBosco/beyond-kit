"use client";

// As partes de um formulário de parâmetros: o cartão de cada formulário (com a
// marca de quem informou e as regras), o campo com a ajuda, o mês e a barra
// presa no pé, que salva os grupos que mudaram.

import { PenLine } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem, dataHora } from "../lib/formato";
import { Botao } from "../ui/botao";
import { Campo } from "../ui/campo";
import { Selo } from "../ui/selo";

/** Um formulário: o título, a marca de quem informou, as regras e os campos em duas colunas. */
export function CartaoDoFormulario({
  titulo,
  selos,
  informadoPor,
  informadoEm,
  informadoRotulo = "Informado",
  regras,
  mudou,
  children,
}: {
  titulo: ReactNode;
  selos?: ReactNode;
  informadoPor?: string | null;
  informadoEm?: string | null;
  /** O texto do selo de quem informou (a plataforma passa "Informado pelo contador"). */
  informadoRotulo?: ReactNode;
  regras?: string[] | null;
  mudou?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-bloco border bg-superficie shadow-1 transition-[border-color]",
        mudou ? "border-cobalto/50" : "border-linha",
      )}
    >
      <div className="filete" />
      <div className="flex flex-wrap items-center gap-3 border-b border-linha px-6 py-4">
        <h2 className="titulo-secao m-0">{titulo}</h2>
        {selos}
        {mudou && (
          <Selo tom="cobalto" comPonto>
            Alterado
          </Selo>
        )}
        {informadoEm && (
          <span className="ml-auto flex items-center gap-2 text-xs text-texto-3">
            <Selo tom="contorno">
              <PenLine />
              {informadoRotulo}
            </Selo>
            <span className="numero">{[informadoPor, dataHora(informadoEm)].filter(Boolean).join(" · ")}</span>
          </span>
        )}
      </div>
      {regras && regras.length > 0 && (
        <div className="flex flex-col gap-1 border-b border-linha bg-superficie-2/50 px-6 py-3">
          {regras.map((r) => (
            <p key={r} className="m-0 text-xs leading-relaxed text-texto-2">
              {r}
            </p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 px-6 py-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

/** Um campo: o rótulo, o controle e a ajuda embaixo. */
export function CampoDoFormulario({
  id,
  rotulo,
  ajuda,
  rodape,
  mudou,
  children,
}: {
  id: string;
  rotulo: string;
  ajuda?: string | null;
  rodape?: ReactNode;
  mudou?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-texto-3 uppercase">
        {rotulo}
        {mudou && <span className="size-1.5 rounded-full bg-cobalto" aria-hidden />}
      </label>
      {children}
      {rodape && <div className="text-xs text-texto-2">{rodape}</div>}
      {ajuda && <p className="m-0 text-xs leading-relaxed text-texto-3">{ajuda}</p>}
    </div>
  );
}

/** O mês (AAAA-MM) do campo de período. */
export function Mes(props: Omit<Parameters<typeof Campo>[0], "type">) {
  return <Campo type="month" className="numero disabled:bg-superficie-2 disabled:opacity-70" {...props} />;
}

/** A barra do pé: quantos grupos mudaram, Descartar e Salvar. */
export function BarraDeSalvar({
  grupos,
  salvando,
  aoDescartar,
  aoSalvar,
}: {
  grupos: number;
  salvando: boolean;
  aoDescartar: () => void;
  aoSalvar: () => void;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-4 z-20 flex items-center gap-3 rounded-bloco border bg-superficie/95 px-5 py-3 shadow-3 backdrop-blur-md transition-[border-color]",
        grupos ? "border-cobalto/50" : "border-linha",
      )}
    >
      <span className="flex flex-1 items-center gap-2 text-sm">
        {grupos > 0 ? (
          <>
            <span className="size-2 rounded-full bg-cobalto" aria-hidden />
            <span className="font-semibold">
              <span className="numero">{contagem(grupos)}</span> {grupos === 1 ? "formulário alterado" : "formulários alterados"}
            </span>
          </>
        ) : (
          <span className="text-texto-3">Nenhuma alteração</span>
        )}
      </span>
      <Botao tipo="fantasma" disabled={!grupos || salvando} onClick={aoDescartar}>
        Descartar
      </Botao>
      <Botao tipo="primario" disabled={!grupos || salvando} onClick={aoSalvar}>
        {salvando ? "Salvando…" : "Salvar"}
      </Botao>
    </div>
  );
}
