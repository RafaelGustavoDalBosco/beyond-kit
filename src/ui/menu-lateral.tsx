"use client";

// O menu lateral branco da casca, com a borda à direita e só a navegação: os itens com ícone e os grupos que abrem e
// fecham. A marca, o contexto, o usuário, o Sair e a versão moram no `CabecalhoDoApp`, fixo em cima dele. No celular
// (até 760px) ele some: o caminho é a `BarraDeNavegacao`; a gaveta continua para quem passa `aberto` (o botão do
// cabeçalho ou um item "Menu" da barra). O kit não conhece o roteador: o consumidor passa o `Link` dele e diz qual
// item está ativo.

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** A largura do menu no desktop, em px. */
export const LARGURA_DO_MENU = 230;

/** O recuo do conteúdo ao lado do menu fixo: vai no `main` da casca. */
export const RECUO_DO_MENU = "mesa:pl-[230px]";

/** Um item do menu. Com `filhos`, vira grupo que abre e fecha (o `href` do grupo não é usado); o grupo de um filho
 * só vira item direto, com o nome e o ícone do grupo e o destino do filho. Sem `href` e sem filhos, é o item sem
 * tela: apagado e sem clique. */
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
  /** A gaveta do celular, aberta pelo botão do `CabecalhoDoApp` (`menuAberto` e `aoAlternarMenu`) ou por um item da
   * `BarraDeNavegacao`; sem `aberto`, o menu não aparece no celular. */
  aberto?: boolean;
  aoFechar?: () => void;
  Link?: LinkDoMenu;
};

/** O menu lateral da casca, só com a navegação: aside fixo sob o cabeçalho acima de 760px, gaveta no celular. */
export function MenuLateral(props: PropsDoMenuLateral) {
  const { aberto, aoFechar } = props;
  const fechar = () => aoFechar?.();

  return (
    <>
      <aside className="fixed top-15 bottom-0 left-0 z-30 w-[230px] celular:hidden">
        <Conteudo {...props} fechar={fechar} />
      </aside>

      {/* celular: a gaveta abre embaixo do cabeçalho (56px lá), que continua à mostra, e por cima da barra de navegação */}
      {aberto && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-35 mesa:hidden">
          <div className="absolute inset-0 bg-veu" onClick={fechar} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-3">
            <Conteudo {...props} fechar={fechar} />
          </aside>
        </div>
      )}
    </>
  );
}

type Interno = PropsDoMenuLateral & { fechar: () => void };

const ITEM = "flex w-full items-center gap-3 rounded-icone px-3 py-2.5 text-left text-sm font-bold transition-colors";
const SOLTO = "text-lateral-texto hover:bg-lateral-2";
const ATIVO = "bg-lateral-cheio text-lateral-ativo";
// O filho do grupo entra alinhado ao rótulo do pai (o respiro, o ícone de 18 e o vão).
const ANINHADO = "pl-[42px]";

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
    const miolo = (
      <>
        <Icone size={aninhado ? 16 : 18} className="shrink-0" />
        <span className="min-w-0 flex-1 leading-snug">{item.rotulo}</span>
        {!!item.contagem && (
          <span className="numero flex size-5 shrink-0 items-center justify-center rounded-full bg-cobalto text-xs font-extrabold text-sobre-cobalto">
            {item.contagem > 9 ? "9+" : item.contagem}
          </span>
        )}
      </>
    );
    // O item sem tela fica à mostra, apagado e sem clique.
    if (!item.href)
      return (
        <div key={item.rotulo} className={cn(ITEM, "cursor-default text-lateral-apagado", aninhado && ANINHADO)}>
          {miolo}
        </div>
      );
    return (
      <Link key={item.href} href={item.href} onClick={fechar} className={cn(ITEM, aninhado && ANINHADO, estaAtivo(item) ? ATIVO : SOLTO)}>
        {miolo}
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-lateral-linha bg-lateral">
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {itens.map((item) => {
          const filhos = item.filhos ?? [];
          const [primeiro] = filhos;
          if (!primeiro) return link(item);
          // O grupo de um item só não vira grupo: vai direto ao filho, com o nome e o ícone do grupo (o nome do
          // filho sozinho perde o assunto).
          if (filhos.length === 1) return link({ ...primeiro, rotulo: item.rotulo, icone: item.icone });
          const Icone = item.icone;
          const expandido = aberto === item.rotulo;
          const temAtivo = filhos.some(estaAtivo);
          return (
            <div key={item.rotulo}>
              <button
                type="button"
                onClick={() => alternar(item.rotulo)}
                aria-expanded={expandido}
                className={cn(ITEM, "cursor-pointer", !expandido && temAtivo ? "bg-lateral-2 text-lateral-ativo" : SOLTO)}
              >
                <Icone size={18} className="shrink-0" />
                <span className="min-w-0 flex-1 leading-snug">{item.rotulo}</span>
                <ChevronDown size={16} className={cn("shrink-0 transition-transform", expandido && "rotate-180")} />
              </button>
              {expandido && <div className="mt-0.5 flex flex-col gap-0.5">{filhos.map((f) => link(f, true))}</div>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
