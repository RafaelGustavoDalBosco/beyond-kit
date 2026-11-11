"use client";

import type { LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import { createContext, useContext, type ReactNode } from "react";

import { cn } from "../lib/cn";

import { Emblema, type TomDoEmblema } from "./emblema";
import { Esqueleto } from "./estados";
import type { Tom } from "./selo";

/** O bloco de destaque, em azul claro chapado: o número que pede o olho. Com `aoAbrir`, o rótulo e o valor viram botão
 * e o clique vale no bloco todo (o "link esticado": o ::after do botão cobre o bloco); os links e botões dos `children`
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
  const alto = (
    <>
      <div className="text-[13px] font-bold text-destaque-texto-2">{rotulo}</div>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <span className="numero text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em]">{valor}</span>
        {selo}
      </div>
    </>
  );
  return (
    <div
      className={cn(
        "relative isolate rounded-bloco bg-destaque-de p-5 text-destaque-texto",
        aoAbrir && "transition-shadow hover:ring-2 hover:ring-cobalto/40",
        className,
      )}
    >
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
        <div className={cn("mt-5", aoAbrir && "[&_:is(a,button,input,select,textarea,label)]:relative [&_:is(a,button,input,select,textarea,label)]:z-[1]")}>
          {children}
        </div>
      )}
    </div>
  );
}

/** O selo dentro do bloco de destaque (a estimativa, por exemplo). */
export function SeloDoDestaque({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pilula border border-dashed border-cobalto/50 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-cobalto">
      {children}
    </span>
  );
}

/** Uma linha de composição dentro do destaque: rótulo, valor e a barra da fatia. */
export function LinhaDoDestaque({ rotulo, valor, fatia }: { rotulo: ReactNode; valor: ReactNode; fatia?: number | null }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="font-semibold text-destaque-texto-2">{rotulo}</span>
        <span className="numero font-extrabold">{valor}</span>
      </div>
      {fatia != null && (
        <div className="h-1.5 overflow-hidden rounded-full bg-superficie">
          <div className="h-full rounded-full bg-cobalto" style={{ width: `${fatia}%` }} />
        </div>
      )}
    </div>
  );
}

/** Liga o `compacto` dos cartões de número em tudo o que estiver dentro; o `ComGaveta` com a gaveta aberta já liga. */
export const IndicadorCompacto = createContext(false);

/** A grade dos cartões de número que abre a tela (os `Indicador`): quatro por linha e, no celular, dois, com o ícone
 * em cima. `compacto` aperta a grade e vale para os cartões de dentro; sem ele, vale o do `ComGaveta` em volta (a
 * gaveta aberta ao lado). */
export function CartoesDeNumero({
  compacto,
  className,
  children,
  "aria-label": rotulo,
}: {
  compacto?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const deFora = useContext(IndicadorCompacto);
  const apertado = compacto ?? deFora;
  return (
    <IndicadorCompacto.Provider value={apertado}>
      <div
        role="group"
        aria-label={rotulo}
        className={cn("grid grid-cols-4 celular:grid-cols-2 celular:gap-2.5", apertado ? "gap-2.5" : "gap-3.5", className)}
      >
        {children}
      </div>
    </IndicadorCompacto.Provider>
  );
}

// O `realce` do indicador: o fundo claro do tom (o ícone passa para o branco, para não sumir nele).
const REALCE: Record<TomDoEmblema, string> = {
  cobalto: "bg-cobalto-suave",
  ganho: "bg-ganho-suave",
  aviso: "bg-aviso-suave",
  risco: "bg-risco-suave",
  neutro: "bg-neutro-suave",
  agua: "bg-agua-suave",
};

/** O cartão de número: o ícone do assunto no círculo do tom, o rótulo, o valor e a linha pequena embaixo (`detalhe`).
 * Com `aoAbrir` é botão, com `href` é `<a>` e com `asChild` o filho único (o `Link` do roteador, vazio) leva o desenho
 * e o conteúdo: o cartão que leva a outra tela. `ativo` marca o escolhido com a borda azul (o cartão que é seletor).
 * `realce` pinta o fundo com o tom (o número que pede atenção). `compacto` (ou o do `CartoesDeNumero` em volta, ou o do
 * `ComGaveta` com a gaveta aberta) tira o ícone e aperta o respiro, para o valor caber ao lado dela. `carregando` mantém o rótulo e o ícone e põe o
 * esqueleto no lugar do valor e do detalhe. Nada corta: no cartão estreito (abaixo de 13rem de largura) o ícone sai, e
 * o valor e o detalhe quebram linha se ainda faltar largura. No celular o ícone vai em cima. */
export function Indicador({
  rotulo,
  valor,
  detalhe,
  icone,
  tom = "cobalto",
  aoAbrir,
  href,
  asChild,
  children,
  ativo,
  realce,
  compacto,
  carregando,
  className,
}: {
  rotulo: ReactNode;
  valor: ReactNode;
  detalhe?: ReactNode;
  icone?: LucideIcon;
  tom?: Tom | TomDoEmblema;
  aoAbrir?: () => void;
  href?: string;
  asChild?: boolean;
  /** Só com `asChild`: o `Link` do roteador. */
  children?: ReactNode;
  /** O cartão escolhido: a borda azul (e o aria-pressed no botão, o aria-current no link). */
  ativo?: boolean;
  realce?: boolean;
  compacto?: boolean;
  carregando?: boolean;
  className?: string;
}) {
  const deFora = useContext(IndicadorCompacto);
  const apertado = compacto ?? deFora;
  const tomDoIcone: TomDoEmblema = tom === "contorno" ? "neutro" : tom;
  const caixa = cn(
    "@container flex w-full items-center rounded-cartao bg-superficie text-left shadow-1 celular:flex-col celular:items-start celular:gap-2.5 celular:p-3",
    apertado ? "gap-2.5 p-3" : "gap-3 p-4",
    realce && REALCE[tomDoIcone],
    (aoAbrir || href || asChild) && "cursor-pointer transition-shadow hover:ring-2 hover:ring-cobalto-anel",
    ativo && "ring-2 ring-cobalto ring-inset hover:ring-cobalto",
    className,
  );
  const conteudo = (
    <>
      {icone && (
        <Emblema
          icone={icone}
          tom={tomDoIcone}
          className={cn(
            "celular:size-8 celular:[&_svg]:size-4",
            // 11rem de miolo: o contêiner mede sem o respiro (16 de cada lado), então é o cartão de 13rem
            apertado ? "mesa:hidden" : "mesa:@max-[11rem]:hidden",
            realce && "bg-superficie",
          )}
        />
      )}
      <div className={cn("min-w-0", carregando && "flex-1 celular:w-full")}>
        <div className="text-[13px] leading-snug font-bold text-texto-2">{rotulo}</div>
        {carregando ? (
          <div className="animate-surgir">
            <Esqueleto className={cn("mt-1 w-3/4", apertado ? "h-5" : "h-[22px]")} />
            <Esqueleto className="mt-1.5 h-3 w-1/2" />
          </div>
        ) : (
          <>
            <div
              className={cn(
                "numero font-extrabold [overflow-wrap:anywhere] celular:text-[16px]",
                apertado ? "text-[17px]" : "text-[19px]",
                // depois do tamanho: o tailwind-merge tira a altura de linha que vem antes dele
                "leading-tight",
              )}
            >
              {valor}
            </div>
            {detalhe && <div className="text-[12.5px] leading-snug font-semibold text-texto-2">{detalhe}</div>}
          </>
        )}
      </div>
    </>
  );
  if (asChild)
    return (
      <Slot.Root className={caixa} aria-current={ativo ? "true" : undefined}>
        {conteudo}
        <Slot.Slottable>{children}</Slot.Slottable>
      </Slot.Root>
    );
  if (href)
    return (
      <a href={href} aria-current={ativo ? "true" : undefined} className={caixa}>
        {conteudo}
      </a>
    );
  if (aoAbrir)
    return (
      <button type="button" onClick={aoAbrir} aria-pressed={ativo} className={caixa}>
        {conteudo}
      </button>
    );
  return <div className={caixa}>{conteudo}</div>;
}
