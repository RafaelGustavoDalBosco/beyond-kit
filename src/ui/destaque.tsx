"use client";

import type { LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import { Children, createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";

import type { TomDoEmblema } from "./emblema";
import type { Tom } from "./selo";

/** A caixa do número grande: ficha neutra (o Lastro não tem bloco de cor), o rótulo de apoio e o valor em
 * `text-numero-g`. Com `aoAbrir`, o rótulo e o valor viram botão e o clique vale na caixa toda (o "link esticado": o
 * ::after do botão cobre a caixa); os links e botões dos `children` ficam por cima e seguem clicáveis, sem interativo
 * dentro de interativo. */
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
      <div className="text-apoio font-medio text-texto-apoio">{rotulo}</div>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <span className="numero text-numero-g leading-numero font-medio tracking-titulo">{valor}</span>
        {selo}
      </div>
    </>
  );
  return (
    <div
      className={cn(
        "relative isolate rounded-g border border-borda bg-ficha p-5 text-texto shadow-p",
        aoAbrir && "transition-[border-color,box-shadow] hover:border-borda-forte hover:shadow-m",
        className,
      )}
    >
      {aoAbrir ? (
        <button
          type="button"
          onClick={aoAbrir}
          className="block w-full cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-g after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-acao"
        >
          {alto}
        </button>
      ) : (
        alto
      )}
      {children && (
        <div className={cn("mt-4", aoAbrir && "[&_:is(a,button,input,select,textarea,label)]:relative [&_:is(a,button,input,select,textarea,label)]:z-[1]")}>
          {children}
        </div>
      )}
    </div>
  );
}

/** O selo dentro da caixa do número grande (a estimativa, por exemplo): neutro, de contorno pontilhado. */
export function SeloDoDestaque({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-p border border-dotted border-neutro-600 px-[7px] py-px text-apoio font-medio whitespace-nowrap text-texto-secundario">
      {children}
    </span>
  );
}

/** Uma linha de composição dentro do destaque: rótulo, valor e o filete da fatia, em tinta neutra. */
export function LinhaDoDestaque({ rotulo, valor, fatia }: { rotulo: ReactNode; valor: ReactNode; fatia?: number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 text-base">
        <span className="text-texto-secundario">{rotulo}</span>
        <span className="numero font-medio">{valor}</span>
      </div>
      {fatia != null && (
        <div className="h-[3px] bg-neutro-200">
          <div className="h-full bg-neutro-800" style={{ width: `${fatia}%` }} />
        </div>
      )}
    </div>
  );
}

/** Liga o `compacto` dos cartões de número em tudo o que estiver dentro; o `ComGaveta` com a gaveta aberta já liga. */
export const IndicadorCompacto = createContext(false);

/** A grade dos cartões de número que abre a tela (os `Indicador`): até quatro por linha (tantas colunas quantos os
 * cartões) e, no celular, dois. `compacto` aperta a grade e vale para os cartões de dentro; sem ele, vale o do
 * `ComGaveta` em volta (a gaveta aberta ao lado). */
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
  const colunas = Math.min(4, Math.max(1, Children.toArray(children).length));
  return (
    <IndicadorCompacto.Provider value={apertado}>
      <div
        role="group"
        aria-label={rotulo}
        style={{ "--colunas": `repeat(${colunas},minmax(0,1fr))` } as CSSProperties}
        className={cn("grid grid-cols-2 gap-2.5 mesa:grid-cols-(--colunas)", !apertado && "mesa:gap-3.5", className)}
      >
        {children}
      </div>
    </IndicadorCompacto.Provider>
  );
}

// O filete de 2px no alto do cartão. O utilitário da cor do alto ganha do hover e da seleção do `.cartao-numero`,
// que trocam a borda inteira: o filete nunca some.
const FILETE: Partial<Record<Tom | TomDoEmblema, string>> = {
  positivo: "cartao-positivo border-t-positivo",
  destaque: "cartao-destaque border-t-destaque",
  atencao: "cartao-atencao border-t-atencao",
  erro: "border-t-2 border-t-erro",
};

// O `realce`: o fundo claro do tom (o número que pede atenção). O azul fica fora: é a cor da seleção.
const REALCE: Partial<Record<Tom | TomDoEmblema, string>> = {
  neutro: "bg-mesa",
  positivo: "bg-positivo-fundo",
  destaque: "bg-destaque-fundo",
  atencao: "bg-atencao-fundo",
  erro: "bg-erro-fundo",
  andamento: "bg-estado-andamento-fundo",
};

/** O cartão de número (`.cartao-numero`): o rótulo de apoio (com o ícone do assunto pequeno e neutro ao lado), o valor
 * e a nota embaixo (`detalhe`). O `tom` é o filete de 2px no alto (positivo, destaque, atenção e erro; os outros ficam
 * sem). Com `aoAbrir` é botão, com `href` é `<a>` e com `asChild` o filho único (o `Link` do roteador, vazio) leva o
 * desenho e o conteúdo: o cartão que leva a outra tela. `ativo` marca o escolhido (`.is-selecionado`, o cartão que é
 * seletor). `realce` pinta o fundo com o tom. `compacto` (ou o do `CartoesDeNumero` em volta, ou o do `ComGaveta` com
 * a gaveta aberta) tira o ícone e aperta o respiro e o valor. `carregando` mantém o rótulo e põe o esqueleto no lugar
 * do valor e da nota. Nada corta: o valor quebra linha se faltar largura. */
export function Indicador({
  rotulo,
  valor,
  detalhe,
  icone: Icone,
  tom = "acao",
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
  const filete = FILETE[tom];
  const clicavel = !!aoAbrir || !!href || !!asChild;
  const caixa = cn(
    "cartao-numero w-full min-w-0 text-left celular:px-3 celular:py-2.5",
    apertado && "px-3 py-2.5",
    filete,
    realce && REALCE[tom],
    clicavel && "cursor-pointer transition-[border-color,box-shadow] hover:shadow-p",
    clicavel && !ativo && (filete ? "hover:border-x-borda-forte hover:border-b-borda-forte" : "hover:border-borda-forte"),
    ativo && "is-selecionado",
    className,
  );
  const conteudo = (
    <>
      <div className="cartao-rotulo flex items-center gap-1.5">
        {Icone && <Icone aria-hidden className={cn("size-3.5 shrink-0 text-texto-apoio", apertado && "hidden")} />}
        <span className="min-w-0">{rotulo}</span>
      </div>
      {carregando ? (
        <div aria-hidden className="animate-surgir">
          <div className={cn("esq my-2 w-3/4", apertado ? "h-6" : "h-7")} />
          <div className="esq w-1/2" />
        </div>
      ) : (
        <>
          <div className={cn("cartao-valor numero whitespace-normal [overflow-wrap:anywhere] celular:text-numero-p", apertado && "text-numero-p")}>
            {valor}
          </div>
          {detalhe && <div className="cartao-nota">{detalhe}</div>}
        </>
      )}
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
