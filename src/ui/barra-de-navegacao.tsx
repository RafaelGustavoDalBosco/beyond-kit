"use client";

// A barra de navegação do celular (até 760px), presa embaixo: é o caminho do menu no celular, no lugar do
// `MenuLateral`, que some. Até cinco itens com ícone e rótulo, que o app escolhe; um deles pode abrir o resto do menu
// (o `aoAbrir` ligando o `aberto` do `MenuLateral`). O kit não conhece o roteador: o consumidor passa o `Link` dele e
// diz qual item está ativo. Na casca:
//
//   <BarraDeNavegacao itens={[{ rotulo: "Notas", icone: FileText, href: "/notas" }, ...]} ativo={ehARota} Link={Link} />
//   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>...</main>

import type { LucideIcon } from "lucide-react";

import { cn } from "../lib/cn";
import type { LinkDoMenu } from "./menu-lateral";

/** A altura da barra de navegação, em px. */
export const ALTURA_DA_BARRA = 66;

/** O recuo de baixo do conteúdo sobre a barra presa, só no celular: vai no `main` da casca, junto do `RECUO_DO_MENU`. */
export const RECUO_DA_BARRA = "celular:pb-[66px]";

/** Um item da barra: leva ao `href` ou chama `aoAbrir` (o item que abre o menu, a busca...). */
export type ItemDaBarra = {
  rotulo: string;
  icone: LucideIcon;
  href?: string;
  aoAbrir?: () => void;
  /** Decidido pelo app; sem ele vale a função `ativo` da barra. */
  ativo?: boolean;
};

/** As props da `BarraDeNavegacao`. */
export type PropsDaBarraDeNavegacao = {
  /** Até cinco: cada um fica com uma parte igual da largura. */
  itens: ItemDaBarra[];
  /** Diz se o `href` é a rota atual, para o item sem `ativo`. */
  ativo?: (href: string) => boolean;
  Link?: LinkDoMenu;
  className?: string;
};

const LinkPadrao: LinkDoMenu = ({ href, children, ...resto }) => (
  <a href={href} {...resto}>
    {children}
  </a>
);

/** A navegação do celular, presa embaixo da tela: o ícone com o rótulo embaixo, o ativo em azul. Acima de 760px não
 * aparece (lá a navegação é o `MenuLateral`). */
export function BarraDeNavegacao({ itens, ativo, Link = LinkPadrao, className }: PropsDaBarraDeNavegacao) {
  return (
    <nav
      aria-label="Navegação"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 grid h-[66px] auto-cols-fr grid-flow-col border-t border-linha bg-superficie pb-1 mesa:hidden",
        className,
      )}
    >
      {itens.map((item) => {
        const Icone = item.icone;
        const noAr = item.ativo ?? (item.href ? (ativo?.(item.href) ?? false) : false);
        const classe = cn(
          "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-[3px] px-1 text-[11.5px] leading-tight font-bold transition-colors",
          noAr ? "text-cobalto" : "text-texto-2",
        );
        const miolo = (
          <>
            <Icone size={21} className="shrink-0" />
            <span className="max-w-full truncate">{item.rotulo}</span>
          </>
        );
        return item.href ? (
          <Link key={item.rotulo} href={item.href} onClick={item.aoAbrir} className={classe}>
            {miolo}
          </Link>
        ) : (
          <button key={item.rotulo} type="button" onClick={item.aoAbrir} className={classe}>
            {miolo}
          </button>
        );
      })}
    </nav>
  );
}
