"use client";

import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Emblema } from "./emblema";
import type { LinkDoMenu } from "./menu-lateral";

const LinkPadrao: LinkDoMenu = ({ href, children, ...resto }) => (
  <a href={href} {...resto}>
    {children}
  </a>
);

/** A barra da tela, branca e presa embaixo do `CabecalhoDoApp`: o ícone da seção, a trilha (Comercial › Clientes), o
 * título em frase e as ações da tela à direita (o mês, os botões); a busca, o sino e o usuário ficam no cabeçalho. Os
 * itens da trilha podem ser o `Link` do roteador. `carregando` liga a linha fina no pé da barra, o sinal de que a
 * tela está trabalhando; o app diz quando (no TanStack, o `useIsFetching`). */
export function BarraDoTopo({
  icone,
  trilha,
  titulo,
  subtitulo,
  acoes,
  carregando,
  className,
}: {
  icone?: LucideIcon;
  trilha?: ReactNode[];
  titulo: ReactNode;
  subtitulo?: ReactNode;
  acoes?: ReactNode;
  carregando?: boolean;
  className?: string;
}) {
  return (
    <header className={cn("sticky top-15 z-20 h-16 border-b border-linha bg-superficie px-7 celular:top-14 celular:px-3.5", className)}>
      <div className="flex h-full items-center gap-3">
        {icone && <Emblema icone={icone} forma="quadrado" className="celular:hidden" />}
        <div className="min-w-0 flex-1">
          {trilha && trilha.length > 0 && (
            <nav aria-label="Trilha" className="mb-0.5 flex items-center gap-1 leading-none">
              {trilha.map((t, i) => (
                <Fragment key={i}>
                  {i > 0 && <ChevronRight className="size-3 shrink-0 text-texto-3" />}
                  <span className="truncate text-xs font-bold text-texto-2 [&_a:hover]:text-cobalto">{t}</span>
                </Fragment>
              ))}
            </nav>
          )}
          <h1 className="m-0 truncate text-lg leading-tight font-extrabold tracking-[-0.01em]">{titulo}</h1>
          {subtitulo && <p className="m-0 truncate text-[13px] leading-snug font-semibold text-texto-2 celular:hidden">{subtitulo}</p>}
        </div>
        {acoes && <div className="flex shrink-0 items-center gap-2">{acoes}</div>}
      </div>
      {carregando && (
        <div role="progressbar" aria-label="Carregando" className="animate-surgir absolute inset-x-0 -bottom-px h-[3px] overflow-hidden">
          <div className="animate-correr h-full w-1/3 rounded-full bg-cobalto" />
        </div>
      )}
    </header>
  );
}

const LARGURAS = {
  estreita: "max-w-4xl",
  media: "max-w-6xl",
  larga: "max-w-7xl",
};

// Os respiros da área da tela: 24 em cima, 28 dos lados e 48 embaixo; no celular, 16, 14 e 30.
const RESPIRO = "px-7 pt-6 pb-12 celular:px-3.5 celular:pt-4 celular:pb-[30px]";

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

const PASSO_QUE_LEVA = "flex cursor-pointer items-center gap-1 text-cobalto transition-colors hover:text-cobalto-forte";

/** O alto da tela, dentro da área: o título em frase (24px, 800), a frase embaixo e as ações à direita (o seletor de
 * mês em pílula, os botões). `trilha` é o "‹ Tela › Subtela" acima do título, para a tela que não está no menu;
 * `rotulo` é a linha pequena do assunto sobre o título. */
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
    <div className="mb-[18px] celular:mb-3.5">
      {trilha && trilha.length > 0 && (
        <nav aria-label="Trilha" className="mb-2 flex flex-wrap items-center gap-1.5 text-[13px] font-bold text-texto-2">
          {trilha.map((passo, i) => {
            // o primeiro passo é o Voltar: leva a seta
            const miolo = (
              <>
                {i === 0 && <ChevronLeft className="size-3.5 shrink-0" />}
                {passo.rotulo}
              </>
            );
            return (
              <Fragment key={i}>
                {i > 0 && <span aria-hidden>›</span>}
                {passo.href ? (
                  <Link href={passo.href} onClick={passo.aoAbrir} className={PASSO_QUE_LEVA}>
                    {miolo}
                  </Link>
                ) : passo.aoAbrir ? (
                  <button type="button" onClick={passo.aoAbrir} className={PASSO_QUE_LEVA}>
                    {miolo}
                  </button>
                ) : (
                  <span>{passo.rotulo}</span>
                )}
              </Fragment>
            );
          })}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4 celular:items-start">
        <div className="min-w-0">
          {rotulo && <div className="mb-0.5 text-[13px] font-bold text-texto-2">{rotulo}</div>}
          <h1 className="m-0 text-2xl leading-tight font-extrabold tracking-[-0.01em] celular:text-[21px]">{titulo}</h1>
          {descricao && <p className="m-0 mt-0.5 text-sm font-semibold text-texto-2">{descricao}</p>}
        </div>
        {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
      </div>
    </div>
  );
}
