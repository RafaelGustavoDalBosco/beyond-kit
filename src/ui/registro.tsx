"use client";

import { ArrowLeft, History, type LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Bloco } from "./bloco";
import { Vazio } from "./estados";
import { Selo, type Tom } from "./selo";

// A tela de um registro (a obra, o cliente), como no ArchFlow: o cabeçalho com a faixa de indicadores, o bloco de
// informações ao lado e o histórico das alterações.

const VOLTAR =
  "mt-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-linha text-texto-3 transition-colors hover:border-cobalto/40 hover:bg-cobalto-suave hover:text-cobalto [&_svg]:size-[17px]";

/** A seta de voltar do cabeçalho. Com `href` vira `<a>`; com `asChild`, o filho único (o `Link` do roteador, vazio)
 * leva o visual e a seta. */
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

/** O alto da tela de um registro: a seta de voltar, o ícone, o rótulo do tipo, o título, o subtítulo (a empresa, o
 * CNPJ), os selos, as ações à direita e, embaixo, a faixa de indicadores (até quatro por linha). */
export function CabecaDoRegistro({
  voltar,
  icone: Icone,
  rotulo,
  titulo,
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
  subtitulo?: ReactNode;
  selos?: ReactNode;
  acoes?: ReactNode;
  indicadores?: IndicadorDoRegistro[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-bloco border border-linha bg-superficie shadow-2", className)}>
      <div className="filete" />
      <div className="flex flex-wrap items-start gap-4 p-5">
        {voltar}
        {Icone && (
          <div className="icone-cheio flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <Icone className="size-[22px]" strokeWidth={2.1} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {rotulo && <div className="rotulo mb-1 flex items-center gap-2 tracking-[0.14em]">{rotulo}</div>}
          <h1 className="m-0 text-2xl leading-tight font-bold tracking-tight uppercase [overflow-wrap:anywhere]">{titulo}</h1>
          {subtitulo && <p className="m-0 mt-1 text-sm leading-snug text-texto-3">{subtitulo}</p>}
          {selos && <div className="mt-3 flex flex-wrap items-center gap-1.5">{selos}</div>}
        </div>
        {acoes && <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">{acoes}</div>}
      </div>
      {indicadores && indicadores.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 border-t border-linha bg-superficie-2/60 md:divide-x md:divide-linha",
            COLUNAS[Math.min(indicadores.length, 4)],
          )}
        >
          {indicadores.map((i, n) => (
            <div key={n} className="min-w-0 px-5 py-3.5">
              <div className="rotulo">{i.rotulo}</div>
              <div className={cn("numero mt-0.5 truncate text-xl font-bold tracking-tight", COR[i.tom ?? "texto"])}>{i.valor}</div>
              {i.progresso != null && (
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-superficie-3">
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
    </div>
  );
}

/** O bloco de informações ao lado do registro: o título de seção (opcional) e as linhas rótulo → valor. */
export function Informacoes({
  titulo,
  solto,
  children,
  className,
}: {
  titulo?: ReactNode;
  /** Sem o cartão em volta (dentro de um `Bloco` que já existe). */
  solto?: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (solto)
    return (
      <div className={cn("flex flex-col gap-3 text-sm", className)}>
        {titulo && <h3 className="titulo-secao m-0 mb-1">{titulo}</h3>}
        <dl className="m-0 flex flex-col gap-3">{children}</dl>
      </div>
    );
  return (
    <Bloco className={cn("flex flex-col gap-3 p-5 text-sm", className)}>
      {titulo && <h3 className="titulo-secao m-0 mb-1">{titulo}</h3>}
      <dl className="m-0 flex flex-col gap-3">{children}</dl>
    </Bloco>
  );
}

/** Uma linha das `Informacoes`: o rótulo à esquerda, o valor à direita. */
export function Informacao({ rotulo, children }: { rotulo: ReactNode; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-texto-3">{rotulo}</dt>
      <dd className="m-0 min-w-0 text-right font-medium [overflow-wrap:anywhere]">{children}</dd>
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

/** O histórico de um registro: um cartão por evento, com o valor antigo riscado e o novo ao lado. */
export function Historico({ eventos, vazio = "Nenhuma alteração registrada." }: { eventos: EventoDoHistorico[]; vazio?: ReactNode }) {
  if (eventos.length === 0) return <Vazio titulo={vazio} icone={History} />;
  return (
    <ol className="m-0 flex list-none flex-col gap-3 p-0">
      {eventos.map((e) => {
        const [rotulo, tom] = typeof e.acao === "string" ? ACAO[e.acao] : [e.acao.rotulo, e.acao.tom];
        return (
          <li key={e.id} className="rounded-bloco border border-linha bg-superficie p-5 shadow-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Selo tom={tom}>{rotulo}</Selo>
                {e.autor && (
                  <span className="text-sm text-texto-2">
                    por <strong className="font-semibold text-texto">{e.autor}</strong>
                  </span>
                )}
              </div>
              <span className="numero shrink-0 text-xs text-texto-3">{e.quando}</span>
            </div>
            {e.mudancas && e.mudancas.length > 0 && (
              <dl className="m-0 mt-3 flex flex-col gap-1.5 border-t border-linha pt-3">
                {e.mudancas.map((m, n) => (
                  <div key={n} className="flex items-start gap-2 text-xs">
                    <dt className="numero w-32 shrink-0 pt-0.5 text-texto-3">{m.campo}</dt>
                    <dd className="m-0 flex min-w-0 flex-wrap items-center gap-1.5">
                      {!semValor(m.de) && (
                        <span className="rounded bg-risco-suave px-1.5 py-0.5 text-risco line-through [overflow-wrap:anywhere]">{m.de}</span>
                      )}
                      <span className="text-texto-3">→</span>
                      {semValor(m.para) ? (
                        <span className="text-texto-3">—</span>
                      ) : (
                        <span className="rounded bg-ganho-suave px-1.5 py-0.5 text-ganho [overflow-wrap:anywhere]">{m.para}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        );
      })}
    </ol>
  );
}
