"use client";

// As partes de um formulário de parâmetros: o cartão de cada formulário (com a
// marca de quem informou e as regras), o campo com a ajuda, o mês e a barra
// presa no pé, que salva os grupos que mudaram.

import { PenLine } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem, dataHora } from "../lib/formato";
import { Botao } from "../ui/botao";
import { Campo, type PropsDoCampo } from "../ui/campo";
import { Selo } from "../ui/selo";

/** Um formulário: a caixa branca com o título, a marca de quem informou, as regras e os campos em duas colunas. */
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
        "overflow-hidden rounded-bloco border bg-superficie shadow-bloco transition-[border-color]",
        mudou ? "border-cobalto" : "border-linha",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-fio px-[22px] pt-[18px] pb-3">
        <h2 className="m-0 text-lg leading-snug font-extrabold text-texto">{titulo}</h2>
        {selos}
        {mudou && (
          <Selo tom="cobalto" tamanho="sm" comPonto>
            Alterado
          </Selo>
        )}
        {informadoEm && (
          <span className="ml-auto flex items-center gap-2 text-[12.5px] font-semibold text-texto-2">
            <Selo tom="neutro" tamanho="sm" contorno>
              <PenLine />
              {informadoRotulo}
            </Selo>
            <span className="numero">{[informadoPor, dataHora(informadoEm)].filter(Boolean).join(" · ")}</span>
          </span>
        )}
      </div>
      {regras && regras.length > 0 && (
        <div className="flex flex-col gap-1 border-b border-fio bg-zebra px-[22px] py-3">
          {regras.map((r) => (
            <p key={r} className="m-0 text-[12.5px] leading-relaxed font-semibold text-texto-2">
              {r}
            </p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 px-[22px] py-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

/** Um campo: o rótulo em cima, o controle e a ajuda embaixo. */
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
    <div className="flex min-w-0 flex-col gap-[5px]">
      {/* O id do rótulo é o que nomeia o grupo que o `htmlFor` não alcança (o `SimNao`, a `EscolhaSegmentada`). */}
      <label id={`${id}-rotulo`} htmlFor={id} className="flex items-center gap-1.5 text-[13px] font-bold text-texto">
        {rotulo}
        {mudou && <span className="size-[7px] shrink-0 rounded-full bg-cobalto" aria-hidden />}
      </label>
      {children}
      {rodape && <div className="text-[12.5px] font-semibold text-texto-2">{rodape}</div>}
      {ajuda && <p className="m-0 text-[12.5px] leading-relaxed font-semibold text-texto-2">{ajuda}</p>}
    </div>
  );
}

/** O mês (AAAA-MM) do campo de período. */
export function Mes(props: Omit<PropsDoCampo, "type">) {
  return <Campo type="month" className="numero" {...props} />;
}

/** A barra do pé: quantos grupos mudaram, Descartar e Salvar (com o giro dentro do botão enquanto salva). */
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
        // 82px no celular: os 66 da barra de navegação e o mesmo respiro de 16
        "sticky bottom-4 z-20 flex items-center gap-2 rounded-bloco border bg-superficie py-2.5 pr-2.5 pl-[18px] shadow-2 transition-[border-color] celular:bottom-[82px]",
        grupos ? "border-cobalto" : "border-linha",
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        {grupos > 0 ? (
          <>
            <span className="size-2 shrink-0 rounded-full bg-cobalto" aria-hidden />
            <span className="font-bold">
              <span className="numero">{contagem(grupos)}</span> {grupos === 1 ? "formulário alterado" : "formulários alterados"}
            </span>
          </>
        ) : (
          <span className="font-semibold text-texto-3">Nenhuma alteração</span>
        )}
      </span>
      <Botao tipo="neutro" disabled={!grupos || salvando} onClick={aoDescartar}>
        Descartar
      </Botao>
      <Botao tipo="primario" disabled={!grupos} carregando={salvando} textoCarregando="Salvando…" onClick={aoSalvar}>
        Salvar
      </Botao>
    </div>
  );
}
