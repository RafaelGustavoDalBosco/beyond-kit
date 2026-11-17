"use client";

import { ArrowLeft, History, type LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Bloco } from "./bloco";
import { DePara } from "./de-para";
import { Vazio } from "./estados";
import { Selo, type Tom } from "./selo";

// A tela de um registro (a obra, o cliente), como a ficha do Lastro: o cabeçalho na caixa com a faixa de
// indicadores, o bloco de informações ao lado (rótulo de apoio, valor à direita) e o histórico das alterações.

const VOLTAR = "btn btn-icon shrink-0 [&_svg]:size-[17px]";

/** A seta de voltar do cabeçalho (o `.btn-icon`). Com `href` vira `<a>`; com `asChild`, o filho único (o `Link` do
 * roteador, vazio) leva o visual e a seta. */
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
  tom?: "texto" | "positivo" | "destaque" | "atencao" | "erro";
  progresso?: number;
};

// O tom pinta só o valor; nenhum número é azul.
const COR = { texto: "text-texto", positivo: "text-positivo", destaque: "text-destaque", atencao: "text-atencao", erro: "text-erro" };
const COLUNAS = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"];

/** O alto da tela de um registro, numa caixa: a seta de voltar, o ícone do assunto num marcador neutro, o rótulo do
 * tipo, o título (`text-titulo`, peso 600), os selos, o subtítulo (a empresa, o CNPJ), as ações à direita e, embaixo,
 * a faixa de indicadores (até quatro por linha). */
export function CabecaDoRegistro({
  voltar,
  icone: Icone,
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
      <div className="flex flex-wrap items-center gap-3.5 px-[22px] py-[18px] celular:items-start celular:gap-3 celular:p-4">
        {voltar}
        {Icone && (
          <span aria-hidden className="inline-grid size-10 shrink-0 place-items-center rounded-m bg-mesa text-texto-secundario [&_svg]:size-5">
            <Icone />
          </span>
        )}
        <div className="min-w-0 flex-1">
          {rotulo && <div className="mb-0.5 flex items-center gap-2 text-apoio font-medio text-texto-apoio">{rotulo}</div>}
          <h1
            className={cn(
              "m-0 font-forte tracking-titulo leading-titulo [overflow-wrap:anywhere]",
              tituloFrase ? "text-subtitulo" : "text-titulo celular:text-subtitulo",
            )}
          >
            {titulo}
          </h1>
          {selos && <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{selos}</div>}
          {subtitulo && <p className="m-0 mt-1 text-base text-texto-secundario">{subtitulo}</p>}
        </div>
        {acoes && <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">{acoes}</div>}
      </div>
      {indicadores && indicadores.length > 0 && (
        <div className={cn("grid grid-cols-2 border-t border-borda md:divide-x md:divide-borda-suave", COLUNAS[Math.min(indicadores.length, 4)])}>
          {indicadores.map((i, n) => (
            <div key={n} className="min-w-0 px-[22px] py-3 celular:px-4">
              <div className="text-apoio font-medio text-texto-apoio">{i.rotulo}</div>
              <div className={cn("numero mt-0.5 truncate text-subtitulo leading-titulo font-medio tracking-titulo", COR[i.tom ?? "texto"])}>
                {i.valor}
              </div>
              {i.progresso != null && (
                <div className="barra">
                  <i style={{ width: `${Math.min(100, Math.max(0, Math.round(i.progresso * 100)))}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Bloco>
  );
}

/** O bloco de informações ao lado do registro: o título em frase (opcional) e as linhas rótulo → valor, com o fio
 * suave entre elas. */
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
      <div className={cn("flex flex-col gap-1 text-base", className)}>
        {titulo && <h3 className="card-title m-0">{titulo}</h3>}
        <dl className="m-0 flex flex-col">{children}</dl>
      </div>
    );
  return (
    <Bloco className={cn("flex flex-col gap-1 px-[18px] pt-4 pb-2 text-base", className)}>
      {titulo && <h3 className="card-title m-0">{titulo}</h3>}
      <dl className="m-0 flex flex-col">{children}</dl>
    </Bloco>
  );
}

/** Uma linha das `Informacoes`: o rótulo de apoio à esquerda, o valor à direita. */
export function Informacao({ rotulo, children }: { rotulo: ReactNode; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-t border-borda-suave py-2 first:border-t-0">
      <dt className="shrink-0 text-texto-apoio">{rotulo}</dt>
      <dd className="m-0 min-w-0 text-right font-medio text-texto [overflow-wrap:anywhere]">{children}</dd>
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

// A alteração é neutra: azul é interação, não estado.
const ACAO: Record<"criacao" | "alteracao" | "exclusao", [ReactNode, Tom]> = {
  criacao: ["Criação", "positivo"],
  alteracao: ["Alteração", "neutro"],
  exclusao: ["Exclusão", "erro"],
};

const semValor = (v: ReactNode) => v == null || v === "";

/** O histórico de um registro: uma caixa por evento, com o `DePara` de cada campo (o valor antigo riscado, o novo). */
export function Historico({ eventos, vazio = "Nenhuma alteração registrada." }: { eventos: EventoDoHistorico[]; vazio?: ReactNode }) {
  if (eventos.length === 0) return <Vazio titulo={vazio} icone={History} />;
  return (
    <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
      {eventos.map((e) => {
        const [rotulo, tom] = typeof e.acao === "string" ? ACAO[e.acao] : [e.acao.rotulo, e.acao.tom];
        return (
          <li key={e.id}>
            <Bloco className="px-[18px] py-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Selo tom={tom}>{rotulo}</Selo>
                  {e.autor && (
                    <span className="text-base text-texto-secundario">
                      por <strong className="font-medio text-texto">{e.autor}</strong>
                    </span>
                  )}
                </div>
                <span className="numero shrink-0 text-apoio text-texto-apoio">{e.quando}</span>
              </div>
              {e.mudancas && e.mudancas.length > 0 && (
                <dl className="m-0 mt-3 flex flex-col gap-1.5 border-t border-borda-suave pt-3">
                  {e.mudancas.map((m, n) => (
                    <div key={n} className="flex items-start gap-2 text-apoio">
                      <dt className="w-32 shrink-0 pt-0.5 text-texto-apoio">{m.campo}</dt>
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
