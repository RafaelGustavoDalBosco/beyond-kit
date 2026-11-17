"use client";

import type { LucideIcon } from "lucide-react";
import { Fragment, useEffect, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { LinkDoMenu } from "./menu-lateral";

const LinkPadrao: LinkDoMenu = ({ href, children, ...resto }) => (
  <a href={href} {...resto}>
    {children}
  </a>
);

// A barra entre os passos da trilha; o "/" que o `.trilha a::after` põe sai, para o `Link` do app não dobrar a barra.
const BARRA = (
  <span aria-hidden className="text-neutro-500">
    /
  </span>
);

/** A trilha da tela (`.trilha` do Lastro): a faixa de 36px presa embaixo do `CabecalhoDoApp`, com os passos até a tela
 * (Comercial / Clientes), o `titulo` como o passo atual, a frase dela ao lado e as ações da tela à direita (o mês, os
 * botões). Os passos podem ser o `Link` do roteador. `voltaUmPasso` liga o Alt ← (o `history.back()`) e a dica dele
 * no canto, que some até 1180px. `carregando` corre a barra fina no pé da faixa, o sinal de que a tela está
 * trabalhando; o app diz quando (no TanStack, o `useIsFetching`). */
export function BarraDoTopo({
  trilha,
  titulo,
  subtitulo,
  acoes,
  carregando,
  voltaUmPasso,
  className,
}: {
  /** @deprecated Sem efeito: a trilha do Lastro não leva ícone. */
  icone?: LucideIcon;
  trilha?: ReactNode[];
  titulo: ReactNode;
  subtitulo?: ReactNode;
  acoes?: ReactNode;
  carregando?: boolean;
  voltaUmPasso?: boolean;
  className?: string;
}) {
  useEffect(() => {
    if (!voltaUmPasso) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        history.back();
      }
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [voltaUmPasso]);

  return (
    <nav aria-label="Onde estou" className={cn("trilha top-14 z-20 h-9 [&_a]:after:content-none", className)}>
      {trilha?.map((t, i) => (
        <Fragment key={i}>
          <span className="shrink-0 text-texto-apoio [&_a]:text-texto-apoio [&_a:hover]:text-acao-texto">{t}</span>
          {BARRA}
        </Fragment>
      ))}
      {/* o título da tela é o passo atual: o `h1` com o desenho do `.trilha b` */}
      <h1 className="m-0 truncate text-apoio leading-[inherit] font-medio tracking-normal">{titulo}</h1>
      {subtitulo && <span className="min-w-0 truncate text-texto-apoio celular:hidden">{subtitulo}</span>}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        {voltaUmPasso && <small>Alt ← volta um passo</small>}
        {acoes && <div className="flex items-center gap-2">{acoes}</div>}
      </div>
      {carregando && (
        <div role="progressbar" aria-label="Carregando" className="carregando-barra top-auto bottom-0">
          <i />
        </div>
      )}
    </nav>
  );
}

const LARGURAS = {
  estreita: "max-w-4xl",
  media: "max-w-6xl",
  larga: "max-w-7xl",
};

// Os respiros da área da tela, os do conteúdo do Lastro: 14 em cima, 24 dos lados e embaixo; no celular, 16 dos lados.
const RESPIRO = "px-6 pt-3.5 pb-6 celular:px-4";

/** O conteúdo da tela no meio da área, com largura máxima, nunca esticado na tela toda: `estreita` no formulário e
 * no registro simples, `media` no registro com coluna lateral, `larga` (padrão) na lista e no início. `respiro` dá
 * os respiros da área (na `AreaDaTela` da casca, que envolve as telas; não na de dentro da tela). */
export function AreaDaTela({
  largura = "larga",
  respiro,
  className,
  children,
}: {
  largura?: keyof typeof LARGURAS;
  respiro?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto w-full", LARGURAS[largura], respiro && RESPIRO, className)}>{children}</div>;
}

/** Um passo da trilha acima do título da tela: com `href` ou `aoAbrir`, leva de volta; sem os dois, é só o nome. */
export type PassoDaTrilha = {
  rotulo: ReactNode;
  href?: string;
  aoAbrir?: () => void;
};

const PASSO_QUE_LEVA = "cursor-pointer border-0 bg-transparent p-0 text-texto-apoio hover:text-acao-texto hover:no-underline";

/** O alto da tela, dentro da área: o título em frase (20px, 600; 18 no celular), a frase embaixo e as ações à direita
 * (o seletor de mês, os botões). `trilha` são os passos acima do título (Tela / Subtela), para a tela que não está no
 * menu; `rotulo` é a linha pequena do assunto sobre o título. */
export function CabecaDaTela({
  rotulo,
  titulo,
  descricao,
  acoes,
  trilha,
  Link = LinkPadrao,
}: {
  rotulo?: ReactNode;
  titulo: ReactNode;
  descricao?: ReactNode;
  acoes?: ReactNode;
  trilha?: PassoDaTrilha[];
  /** O `Link` do roteador do app, para os passos com `href`. */
  Link?: LinkDoMenu;
}) {
  return (
    <div className="mb-3.5">
      {trilha && trilha.length > 0 && (
        <nav aria-label="Trilha" className="mb-1.5 flex flex-wrap items-center gap-2 text-apoio text-texto-apoio">
          {trilha.map((passo, i) => (
            <Fragment key={i}>
              {i > 0 && BARRA}
              {passo.href ? (
                <Link href={passo.href} onClick={passo.aoAbrir} className={PASSO_QUE_LEVA}>
                  {passo.rotulo}
                </Link>
              ) : passo.aoAbrir ? (
                <button type="button" onClick={passo.aoAbrir} className={PASSO_QUE_LEVA}>
                  {passo.rotulo}
                </button>
              ) : (
                <span>{passo.rotulo}</span>
              )}
            </Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4 celular:items-start">
        <div className="min-w-0">
          {rotulo && <div className="mb-0.5 text-apoio font-medio text-texto-apoio">{rotulo}</div>}
          <h1 className="m-0 text-titulo leading-titulo font-forte tracking-titulo celular:text-subtitulo">{titulo}</h1>
          {descricao && <p className="m-0 mt-0.5 text-base text-texto-secundario">{descricao}</p>}
        </div>
        {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
      </div>
    </div>
  );
}
