"use client";

// A barra de navegação do celular (`.barra-celular` do Lastro, abaixo de 640px), presa embaixo, em texto: é o caminho
// do menu no celular. Até cinco itens, que o app escolhe, cada um com uma parte igual da largura; o ativo vai em azul,
// em 600, com o fio azul em cima. Um deles pode abrir o resto do menu (o `aoAbrir` ligando o `aberto` do
// `MenuLateral`). Acima de 640px o `lastro.css` a esconde. O kit não conhece o roteador: o consumidor passa o `Link`
// dele e diz qual item está ativo. Na casca:
//
//   <BarraDeNavegacao itens={[{ rotulo: "Notas", href: "/notas" }, ...]} ativo={ehARota} Link={Link} />
//   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>...</main>

import type { LucideIcon } from "lucide-react";

import { cn } from "../lib/cn";
import type { LinkDoMenu } from "./menu-lateral";

/** A altura da barra de navegação, em px, sem a área segura do aparelho. */
export const ALTURA_DA_BARRA = 49;

/** O recuo de baixo do conteúdo sobre a barra presa, só no celular: vai no `main` da casca, junto do `RECUO_DO_MENU`. */
export const RECUO_DA_BARRA = "celular:pb-[calc(49px+env(safe-area-inset-bottom))]";

/** Um item da barra: leva ao `href` ou chama `aoAbrir` (o item que abre o menu, a busca...). */
export type ItemDaBarra = {
  rotulo: string;
  /** @deprecated Sem efeito: a barra do Lastro é só texto. */
  icone?: LucideIcon;
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

// O `.barra-celular a[aria-current]` desenha o ativo; a classe repete o desenho para o botão e para o `Link` que não
// repassa o `aria-current`.
const ATIVO = "font-forte text-acao-800 shadow-[inset_0_2px_0_var(--acao)]";

/** A navegação do celular, presa embaixo da tela, só com o rótulo. Acima de 640px não aparece (lá a navegação é o
 * `MenuLateral`). */
export function BarraDeNavegacao({ itens, ativo, Link = LinkPadrao, className }: PropsDaBarraDeNavegacao) {
  return (
    <nav aria-label="Navegação" className={cn("barra-celular fixed inset-x-0 bottom-0 z-30", className)}>
      {itens.map((item) => {
        const noAr = item.ativo ?? (item.href ? (ativo?.(item.href) ?? false) : false);
        const classe = cn("min-w-0 truncate px-1", noAr && ATIVO);
        return item.href ? (
          <Link key={item.rotulo} href={item.href} onClick={item.aoAbrir} aria-current={noAr ? "page" : undefined} className={classe}>
            {item.rotulo}
          </Link>
        ) : (
          <button key={item.rotulo} type="button" onClick={item.aoAbrir} aria-pressed={noAr || undefined} className={classe}>
            {item.rotulo}
          </button>
        );
      })}
    </nav>
  );
}
