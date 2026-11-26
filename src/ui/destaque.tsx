"use client";

import type { LucideIcon } from "lucide-react";
import { Slot } from "radix-ui";
import { Children, createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";

import type { TomDoEmblema } from "./emblema";
import type { Tom } from "./selo";

/** A caixa do número grande: superfície branca, sem borda e sem sombra, o rótulo de apoio e o valor em tinta
 * (`text-numero-g`, peso forte). Com `aoAbrir`, o rótulo e o valor viram botão e o clique vale na caixa toda (o "link
 * esticado": o ::after do botão cobre a caixa); os links e botões dos `children` ficam por cima e seguem clicáveis, sem
 * interativo dentro de interativo. */
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
      <div className="text-apoio font-forte text-texto-apoio">{rotulo}</div>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <span className="numero text-numero-g leading-numero font-forte tracking-[-.035em]">{valor}</span>
        {selo}
      </div>
    </>
  );
  return (
    <div
      className={cn(
        "relative isolate rounded-g bg-ficha p-5 text-texto",
        aoAbrir && "transition-[box-shadow] duration-(--dur-1) hover:shadow-[inset_0_0_0_999px_var(--hover)]",
        className,
      )}
    >
      {aoAbrir ? (
        <button
          type="button"
          onClick={aoAbrir}
          className="block w-full cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-g after:content-[''] focus-visible:after:shadow-[inset_0_0_0_2px_var(--acao-viva)]"
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

/** O selo dentro da caixa do número grande (a estimativa, por exemplo): a etiqueta neutra, no preenchimento. */
export function SeloDoDestaque({ children }: { children: ReactNode }) {
  return <span className="tag tag-neutral">{children}</span>;
}

/** Uma linha de composição dentro do destaque: rótulo, valor e a barra da fatia, em tinta (a barra é desenho, nunca
 * número; nunca azul). */
export function LinhaDoDestaque({ rotulo, valor, fatia }: { rotulo: ReactNode; valor: ReactNode; fatia?: number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 text-base">
        <span className="text-texto-secundario">{rotulo}</span>
        <span className="numero font-forte">{valor}</span>
      </div>
      {fatia != null && (
        <span className="barra-dado">
          <i style={{ width: `${fatia}%` }} />
        </span>
      )}
    </div>
  );
}

/** Liga o `compacto` dos cartões de número em tudo o que estiver dentro. */
export const IndicadorCompacto = createContext(false);

/** Os cartões de número que abrem a tela (os `Indicador`), numa superfície só, separados pelo fio: até quatro por
 * linha (tantas colunas quantos os cartões) e, no celular, dois. `compacto` aperta os cartões de dentro; sem ele, vale
 * o do `IndicadorCompacto` em volta. */
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
        className={cn("cartoes-numero grid-cols-2 mesa:grid-cols-(--colunas)", className)}
      >
        {children}
      </div>
    </IndicadorCompacto.Provider>
  );
}

// O tom de sentido (positivo, destaque, atenção) tinge o cartão inteiro, com o rótulo no tom forte; o de erro colore
// só o rótulo. O número é sempre tinta.
const ROTULO_DO_TOM: Partial<Record<Tom | TomDoEmblema, string>> = {
  positivo: "cartao-positivo",
  destaque: "cartao-destaque",
  atencao: "cartao-atencao",
  erro: "cartao-erro",
};

// O `realce`: o fundo claro do tom que não é de sentido (os de sentido já são tingidos). O azul fica fora: é a cor
// da seleção.
const REALCE: Partial<Record<Tom | TomDoEmblema, string>> = {
  neutro: "bg-mesa",
  erro: "bg-erro-fundo",
  andamento: "bg-estado-andamento-fundo",
};

/** O cartão de número (`.cartao-numero`): o rótulo de apoio (com o ícone do assunto pequeno e neutro ao lado), o valor
 * em tinta e a nota embaixo (`detalhe`). O `tom` de sentido (positivo, destaque, atenção) tinge o cartão, com o rótulo no tom
 * forte; o de erro colore só o rótulo; os outros ficam sem cor. Com `aoAbrir` é botão, com `href` é `<a>` e com `asChild` o filho único (o `Link` do roteador, vazio)
 * leva o desenho e o conteúdo: o cartão que leva a outra tela. `ativo` marca o escolhido (`.is-selecionado`: o
 * contorno azul por dentro, o cartão que é seletor). `realce` pinta o fundo com o tom. `compacto` (ou o do
 * `CartoesDeNumero` em volta) tira o ícone e aperta o respiro e o valor.
 * `carregando` mantém o rótulo e põe o esqueleto no lugar do valor e da nota. Nada corta: o valor quebra linha se
 * faltar largura. */
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
  /** O cartão escolhido: o contorno azul (e o aria-pressed no botão, o aria-current no link). */
  ativo?: boolean;
  realce?: boolean;
  compacto?: boolean;
  carregando?: boolean;
  className?: string;
}) {
  const deFora = useContext(IndicadorCompacto);
  const apertado = compacto ?? deFora;
  const caixa = cn(
    "cartao-numero w-full min-w-0 text-left celular:px-3.5 celular:py-3",
    apertado && "px-3.5 py-3",
    ROTULO_DO_TOM[tom],
    realce && REALCE[tom],
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
