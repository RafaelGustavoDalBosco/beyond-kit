"use client";

import { ArrowLeft, History, type LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Bloco } from "./bloco";
import { DePara } from "./de-para";
import { Emblema } from "./emblema";
import { Vazio } from "./estados";
import { Selo, type Tom } from "./selo";

// A tela de um registro (a obra, o cliente): o cabeçalho branco com a faixa de indicadores, o bloco de informações ao
// lado e o histórico das alterações.

const VOLTAR =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-linha bg-superficie text-texto-2 transition-colors hover:border-cobalto-anel hover:bg-cobalto-suave hover:text-cobalto [&_svg]:size-[17px]";

/** A seta de voltar do cabeçalho, redonda. Com `href` vira `<a>`; com `asChild`, o filho único (o `Link` do roteador,
 * vazio) leva o visual e a seta. */
export function BotaoDeVoltar({
  href,
  aoVoltar,
  asChild,
  children,
  rotulo = "Voltar",
}: {
  href?: string;
  aoVoltar?: () => void;
  asChild?: boolean;
  children?: ReactNode;
  rotulo?: string;
}) {
  if (asChild)
    return (
      <Slot.Root className={VOLTAR} aria-label={rotulo} title={rotulo}>
        <ArrowLeft />
        <Slot.Slottable>{children}</Slot.Slottable>
      </Slot.Root>
    );
  if (href)
    return (
      <a href={href} className={VOLTAR} aria-label={rotulo} title={rotulo}>
        <ArrowLeft />
      </a>
    );
  return (
    <button type="button" onClick={aoVoltar} className={VOLTAR} aria-label={rotulo} title={rotulo}>
      <ArrowLeft />
    </button>
  );
}

/** Um número da faixa do cabeçalho; `progresso` (0 a 1) põe a barra embaixo do valor. */
export type IndicadorDoRegistro = {
  rotulo: ReactNode;
  valor: ReactNode;
  tom?: "texto" | "cobalto" | "ganho" | "aviso" | "risco";
  progresso?: number;
};

const COR = { texto: "text-texto", cobalto: "text-cobalto", ganho: "text-ganho", aviso: "text-aviso", risco: "text-risco" };
const COLUNAS = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"];

/** O alto da tela de um registro, numa caixa branca: a seta de voltar, o ícone num quadrado colorido, o rótulo do tipo,
 * o título em frase, os selos, o subtítulo (a empresa, o CNPJ), as ações à direita e, embaixo, a faixa de indicadores
 * (até quatro por linha). */
export function CabecaDoRegistro({
  voltar,
  icone,
  rotulo,
  titulo,
  tituloFrase,
  subtitulo,
  selos,
  acoes,
  indicadores,
  className,
}: {
  /** O `BotaoDeVoltar`. */
  voltar?: ReactNode;
  icone?: LucideIcon;
  rotulo?: ReactNode;
  titulo: ReactNode;
  /** O título é uma frase longa, não o nome do registro: menor. */
  tituloFrase?: boolean;
  subtitulo?: ReactNode;
  selos?: ReactNode;
  acoes?: ReactNode;
  indicadores?: IndicadorDoRegistro[];
  className?: string;
}) {
  return (
    <Bloco className={className}>
      <div className="flex flex-wrap items-center gap-4 p-5 celular:items-start celular:gap-3 celular:p-4">
        {voltar}
        {icone && <Emblema icone={icone} forma="quadrado" tamanho="lg" className="celular:size-11" />}
        <div className="min-w-0 flex-1">
          {rotulo && <div className="mb-0.5 flex items-center gap-2 text-[13px] font-bold text-texto-2">{rotulo}</div>}
          <h1
            className={cn(
              "m-0 font-extrabold tracking-[-0.01em] [overflow-wrap:anywhere]",
              tituloFrase ? "text-lg leading-snug" : "text-[22px] leading-tight celular:text-[19px]",
            )}
          >
            {titulo}
          </h1>
          {selos && <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{selos}</div>}
          {subtitulo && <p className="m-0 mt-1 text-[13px] leading-snug font-semibold text-texto-2">{subtitulo}</p>}
        </div>
        {acoes && <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">{acoes}</div>}
      </div>
      {indicadores && indicadores.length > 0 && (
        <div className={cn("grid grid-cols-2 border-t border-fio md:divide-x md:divide-fio", COLUNAS[Math.min(indicadores.length, 4)])}>
          {indicadores.map((i, n) => (
            <div key={n} className="min-w-0 px-5 py-3.5">
              <div className="text-[12.5px] font-bold text-texto-2">{i.rotulo}</div>
              <div className={cn("numero mt-0.5 truncate text-[19px] font-extrabold", COR[i.tom ?? "texto"])}>{i.valor}</div>
              {i.progresso != null && (
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fio">
                  <div
                    className="h-full rounded-full bg-cobalto transition-[width] duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, Math.round(i.progresso * 100)))}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Bloco>
  );
}

/** O bloco de informações ao lado do registro: o título em frase (opcional) e as linhas rótulo → valor, com um fio
 * entre elas. */
export function Informacoes({
  titulo,
  solto,
  children,
  className,
}: {
  titulo?: ReactNode;
  /** Sem a caixa em volta (dentro de um `Bloco` que já existe). */
  solto?: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (solto)
    return (
      <div className={cn("flex flex-col gap-1 text-sm", className)}>
        {titulo && <h3 className="m-0 text-base font-extrabold">{titulo}</h3>}
        <dl className="m-0 flex flex-col">{children}</dl>
      </div>
    );
  return (
    <Bloco className={cn("flex flex-col gap-1 px-[18px] pt-4 pb-2.5 text-sm", className)}>
      {titulo && <h3 className="m-0 text-base font-extrabold">{titulo}</h3>}
      <dl className="m-0 flex flex-col">{children}</dl>
    </Bloco>
  );
}

/** Uma linha das `Informacoes`: o rótulo à esquerda, o valor à direita. */
export function Informacao({ rotulo, children }: { rotulo: ReactNode; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-t border-fio py-[9px] first:border-t-0">
      <dt className="shrink-0 font-semibold text-texto-2">{rotulo}</dt>
      <dd className="m-0 min-w-0 text-right font-bold [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

/** Um evento do histórico: o que houve, quem, quando e o que mudou (o campo, o valor antigo e o novo). A `acao` é uma
 * das três ou livre, com o rótulo e o tom do selo (Aberta, Atribuída, Resolvida). */
export type EventoDoHistorico = {
  id: string | number;
  acao: "criacao" | "alteracao" | "exclusao" | { rotulo: ReactNode; tom: Tom };
  autor?: ReactNode;
  quando: ReactNode;
  mudancas?: { campo: ReactNode; de?: ReactNode; para?: ReactNode }[];
};

const ACAO: Record<"criacao" | "alteracao" | "exclusao", [ReactNode, Tom]> = {
  criacao: ["Criação", "ganho"],
  alteracao: ["Alteração", "cobalto"],
  exclusao: ["Exclusão", "risco"],
};

const semValor = (v: ReactNode) => v == null || v === "";

/** O histórico de um registro: uma caixa por evento, com o `DePara` de cada campo (o valor antigo riscado, o novo em azul). */
export function Historico({ eventos, vazio = "Nenhuma alteração registrada." }: { eventos: EventoDoHistorico[]; vazio?: ReactNode }) {
  if (eventos.length === 0) return <Vazio titulo={vazio} icone={History} />;
  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
      {eventos.map((e) => {
        const [rotulo, tom] = typeof e.acao === "string" ? ACAO[e.acao] : [e.acao.rotulo, e.acao.tom];
        return (
          <li key={e.id}>
            <Bloco className="px-[18px] py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Selo tom={tom}>{rotulo}</Selo>
                  {e.autor && (
                    <span className="text-sm font-semibold text-texto-2">
                      por <strong className="font-bold text-texto">{e.autor}</strong>
                    </span>
                  )}
                </div>
                <span className="numero shrink-0 text-xs font-semibold text-texto-2">{e.quando}</span>
              </div>
              {e.mudancas && e.mudancas.length > 0 && (
                <dl className="m-0 mt-3 flex flex-col gap-1.5 border-t border-fio pt-3">
                  {e.mudancas.map((m, n) => (
                    <div key={n} className="flex items-start gap-2 text-xs">
                      <dt className="numero w-32 shrink-0 pt-0.5 font-semibold text-texto-2">{m.campo}</dt>
                      <dd className="m-0 min-w-0">
                        <DePara de={semValor(m.de) ? null : m.de} para={semValor(m.para) ? null : m.para} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </Bloco>
          </li>
        );
      })}
    </ol>
  );
}
