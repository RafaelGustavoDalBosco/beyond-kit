"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import type { Tom } from "./selo";

/** O bloco de destaque, "Cobalto claro": o número que abre a tela. Com `aoAbrir`, o rótulo e o valor viram botão e o
 * clique vale no bloco todo (o "link esticado": o ::after do botão cobre o bloco); os links e botões dos `children`
 * ficam por cima e seguem clicáveis, sem interativo dentro de interativo. */
export function BlocoDestaque({
  rotulo,
  valor,
  selo,
  children,
  aoAbrir,
  className,
}: {
  rotulo: ReactNode;
  valor: ReactNode;
  selo?: ReactNode;
  children?: ReactNode;
  aoAbrir?: () => void;
  className?: string;
}) {
  const caixa = cn(
    "relative isolate overflow-hidden rounded-bloco bg-gradient-to-br from-destaque-de via-destaque-meio to-destaque-ate p-6 text-destaque-texto shadow-2 ring-1 ring-destaque-anel",
    aoAbrir && "transition-[box-shadow] hover:shadow-3 hover:ring-cobalto/40",
    className,
  );
  const alto = (
    <>
      <div className="text-[11px] font-semibold tracking-[0.1em] text-cobalto uppercase">{rotulo}</div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{valor}</span>
        {selo}
      </div>
    </>
  );
  return (
    <div className={caixa}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(420px_180px_at_90%_-30px,rgb(29_78_216/0.18),transparent_70%)]"
      />
      {aoAbrir ? (
        <button
          type="button"
          onClick={aoAbrir}
          className="block w-full cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-bloco after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-cobalto"
        >
          {alto}
        </button>
      ) : (
        alto
      )}
      {children && (
        <div className={cn("mt-6", aoAbrir && "[&_:is(a,button,input,select,textarea,label)]:relative [&_:is(a,button,input,select,textarea,label)]:z-[1]")}>
          {children}
        </div>
      )}
    </div>
  );
}

/** O selo dentro do bloco de destaque (a estimativa, por exemplo). */
export function SeloDoDestaque({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-dashed border-cobalto/40 px-2 py-0.5 text-[11px] text-cobalto">
      {children}
    </span>
  );
}

/** Uma linha de composição dentro do destaque: rótulo, valor e a barra da fatia. */
export function LinhaDoDestaque({ rotulo, valor, fatia }: { rotulo: ReactNode; valor: ReactNode; fatia?: number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-destaque-texto-2">{rotulo}</span>
        <span className="numero font-medium">{valor}</span>
      </div>
      {fatia != null && (
        <div className="h-1 overflow-hidden rounded-full bg-cobalto/12">
          <div className="h-full rounded-full bg-cobalto" style={{ width: `${fatia}%` }} />
        </div>
      )}
    </div>
  );
}

// O `realce` do indicador: o tom pinta também a borda e o fundo.
const REALCE: Record<Tom, string> = {
  cobalto: "border-cobalto/40 bg-cobalto-suave",
  ganho: "border-ganho/40 bg-ganho-suave",
  aviso: "border-aviso/40 bg-aviso-suave",
  risco: "border-risco/40 bg-risco-suave",
  neutro: "",
  contorno: "",
};

const ICONE: Record<Tom, string> = {
  cobalto: "bg-cobalto-suave text-cobalto",
  ganho: "bg-ganho-suave text-ganho",
  aviso: "bg-aviso-suave text-aviso",
  risco: "bg-risco-suave text-risco",
  neutro: "bg-superficie-2 text-texto-2",
  contorno: "bg-superficie-2 text-texto-2",
};

/** O cartão de número: o filete no alto e o ícone do assunto no quadrado. `realce` pinta a borda e o fundo com o tom
 * (o número que pede atenção); `compacto` aperta o cartão para a grade estreita. */
export function Indicador({
  rotulo,
  valor,
  detalhe,
  icone: Icone,
  tom = "cobalto",
  aoAbrir,
  ativo,
  realce,
  compacto,
  className,
}: {
  rotulo: ReactNode;
  valor: ReactNode;
  detalhe?: ReactNode;
  icone: LucideIcon;
  tom?: Tom;
  aoAbrir?: () => void;
  /** Com `aoAbrir`, o indicador vira filtro: `ativo` liga o aria-pressed e o contorno cobalto. */
  ativo?: boolean;
  realce?: boolean;
  compacto?: boolean;
  className?: string;
}) {
  const caixa = cn(
    "flex w-full flex-col overflow-hidden rounded-bloco border border-linha bg-superficie text-left shadow-1",
    aoAbrir && "cursor-pointer transition-[box-shadow,border,background] hover:border-linha-forte hover:shadow-2",
    realce && REALCE[tom],
    aoAbrir && ativo && "border-cobalto bg-cobalto-suave hover:border-cobalto",
    className,
  );
  const conteudo = (
    <>
      <div className="filete w-full" />
      <div className={cn("flex items-center", compacto ? "gap-3 p-3.5" : "gap-4 p-5")}>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            compacto ? "size-9 rounded-lg" : "size-12 rounded-xl",
            ICONE[tom],
          )}
        >
          <Icone className={compacto ? "size-4" : "size-5"} />
        </div>
        <div className="min-w-0">
          <div className="rotulo">{rotulo}</div>
          <div
            className={cn(
              "mt-1 leading-tight font-semibold tracking-[-0.02em] tabular-nums",
              compacto ? "text-lg" : "text-[22px]",
            )}
          >
            {valor}
          </div>
          {detalhe && <div className="truncate text-xs text-texto-3">{detalhe}</div>}
        </div>
      </div>
    </>
  );
  return aoAbrir ? (
    <button type="button" onClick={aoAbrir} aria-pressed={ativo} className={caixa}>
      {conteudo}
    </button>
  ) : (
    <div className={caixa}>{conteudo}</div>
  );
}
