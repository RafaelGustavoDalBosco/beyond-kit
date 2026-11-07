"use client";

// O menu lateral cobalto escuro da casca, na medida do ArchFlow, só com a navegação: os itens com ícone e os grupos
// que abrem e fecham. A marca, o contexto, o usuário, o Sair e a versão moram no `CabecalhoDoApp`, fixo em cima dele.
// No celular (abaixo de `lg`) vira a gaveta que o botão do cabeçalho abre. O kit não conhece o roteador: o consumidor
// passa o `Link` dele e diz qual item está ativo.

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** A largura do menu no desktop, em px (a `w-72`). */
export const LARGURA_DO_MENU = 288;

/** O recuo do conteúdo ao lado do menu fixo: vai no `main` da casca. */
export const RECUO_DO_MENU = "lg:pl-72";

/** Um item do menu. Com `filhos`, vira grupo que abre e fecha (o `href` do grupo não é usado). */
export type ItemDoMenu = {
  rotulo: string;
  icone: LucideIcon;
  href?: string;
  /** Decidido pelo app; sem ele vale a função `ativo` do menu. */
  ativo?: boolean;
  filhos?: ItemDoMenu[];
  /** O número no selo à direita (as novidades não lidas); 0 ou vazio esconde. */
  contagem?: number;
};

/** O `Link` do roteador do app (o `next/link`, o do React Router...). */
export type LinkDoMenu = ComponentType<{
  href: string;
  className?: string;
  title?: string;
  onClick?: () => void;
  children?: ReactNode;
}>;

const LinkPadrao: LinkDoMenu = ({ href, children, ...resto }) => (
  <a href={href} {...resto}>
    {children}
  </a>
);

/** As props do `MenuLateral`. */
export type PropsDoMenuLateral = {
  itens: ItemDoMenu[];
  /** Diz se o `href` é a rota atual, para o item sem `ativo`. */
  ativo?: (href: string) => boolean;
  /** A gaveta do celular, aberta pelo botão do `CabecalhoDoApp` (`menuAberto` e `aoAlternarMenu`). */
  aberto?: boolean;
  aoFechar?: () => void;
  Link?: LinkDoMenu;
};

/** O menu lateral da casca, só com a navegação: aside fixo sob o cabeçalho no desktop, gaveta no celular. */
export function MenuLateral(props: PropsDoMenuLateral) {
  const { aberto, aoFechar } = props;
  const fechar = () => aoFechar?.();

  return (
    <>
      <aside className="fixed top-14 bottom-0 left-0 z-30 hidden w-72 lg:block">
        <Conteudo {...props} fechar={fechar} />
      </aside>

      {/* celular: a gaveta abre embaixo do cabeçalho, que continua à mostra */}
      {aberto && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-(--veu)" onClick={fechar} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-3">
            <Conteudo {...props} fechar={fechar} />
          </aside>
        </div>
      )}
    </>
  );
}

type Interno = PropsDoMenuLateral & { fechar: () => void };

function Conteudo(props: Interno) {
  const { itens, ativo, fechar } = props;
  const Link = props.Link ?? LinkPadrao;
  const estaAtivo = (item: ItemDoMenu) => item.ativo ?? (item.href ? (ativo?.(item.href) ?? false) : false);

  // Um grupo aberto por vez: abrir um fecha o anterior (o menu não rola na tela baixa). O grupo do item ativo abre
  // sozinho quando a rota muda.
  const grupoAtivo = itens.find((i) => i.filhos?.some(estaAtivo))?.rotulo;
  const [aberto, setAberto] = useState<string | null>(grupoAtivo ?? null);
  useEffect(() => {
    if (grupoAtivo) setAberto(grupoAtivo);
  }, [grupoAtivo]);
  const alternar = (rotulo: string) => setAberto((a) => (a === rotulo ? null : rotulo));

  const link = (item: ItemDoMenu, aninhado = false) => {
    const Icone = item.icone;
    return (
      <Link
        key={item.href ?? item.rotulo}
        href={item.href ?? "#"}
        onClick={fechar}
        className={cn(
          "flex items-center gap-3 border-l-[3px] py-2.5 pr-6 text-sm font-medium transition-colors",
          aninhado ? "pl-[49px]" : "pl-[21px]",
          estaAtivo(item)
            ? "border-lateral-ativo bg-lateral-cheio text-lateral-ativo"
            : "border-transparent text-lateral-texto hover:bg-lateral-2 hover:text-lateral-ativo",
        )}
      >
        <Icone size={aninhado ? 16 : 18} className="shrink-0" />
        <span className="min-w-0 flex-1 leading-snug">{item.rotulo}</span>
        {!!item.contagem && (
          <span className="numero flex size-5 shrink-0 items-center justify-center rounded-full bg-lateral-ativo text-xs font-bold text-lateral">
            {item.contagem > 9 ? "9+" : item.contagem}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col bg-lateral text-lateral-ativo">
      <nav className="flex-1 space-y-0.5 overflow-y-auto py-4">
        {itens.map((item) => {
          if (!item.filhos?.length) return link(item);
          const Icone = item.icone;
          const expandido = aberto === item.rotulo;
          const temAtivo = item.filhos.some(estaAtivo);
          return (
            <div key={item.rotulo}>
              <button
                type="button"
                onClick={() => alternar(item.rotulo)}
                aria-expanded={expandido}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 border-l-[3px] border-transparent py-2.5 pr-6 pl-[21px] text-sm font-medium transition-colors",
                  !expandido && temAtivo
                    ? "bg-lateral-2 text-lateral-ativo"
                    : "text-lateral-texto hover:bg-lateral-2 hover:text-lateral-ativo",
                )}
              >
                <Icone size={18} className="shrink-0" />
                <span className="min-w-0 flex-1 text-left leading-snug">{item.rotulo}</span>
                <ChevronDown size={16} className={cn("shrink-0 transition-transform", expandido && "rotate-180")} />
              </button>
              {expandido && <div className="mt-0.5 space-y-0.5">{item.filhos.map((f) => link(f, true))}</div>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
