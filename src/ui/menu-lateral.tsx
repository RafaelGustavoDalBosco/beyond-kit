"use client";

// O menu lateral da casca (`.lateral` do Lastro): fundo de mesa, a borda à direita e só a navegação, em texto, sem
// ícone. O grupo é o rótulo pequeno (`.lateral-grupo`) com os itens embaixo; ele abre e fecha, um aberto por vez. O
// item ativo vai na ficha, com o texto em azul e a sombra pequena; a contagem fica à direita, em texto de apoio. A
// marca, o contexto, o usuário, o Sair e a versão moram no `CabecalhoDoApp`, fixo em cima dele. Até 960px ele vira
// gaveta, aberta por `aberto` (o ☰ do cabeçalho ou um item "Menu" da `BarraDeNavegacao`). O kit não conhece o
// roteador: o consumidor passa o `Link` dele e diz qual item está ativo.

import { ChevronDown, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** A largura do menu no desktop, em px (o `--lateral-largura` do Lastro). */
export const LARGURA_DO_MENU = 200;

/** O recuo do conteúdo ao lado do menu fixo, acima de 960px (abaixo, o menu é gaveta): vai no `main` da casca. */
export const RECUO_DO_MENU = "min-[961px]:pl-[200px]";

/** Um item do menu. Com `filhos`, vira grupo que abre e fecha (o `href` do grupo não é usado); o grupo de um filho
 * só vira item direto, com o nome do grupo e o destino do filho. Sem `href` e sem filhos, é o item sem tela: apagado
 * e sem clique. */
export type ItemDoMenu = {
  rotulo: string;
  /** @deprecated Sem efeito: o menu do Lastro é só texto. */
  icone?: LucideIcon;
  href?: string;
  /** Decidido pelo app; sem ele vale a função `ativo` do menu. */
  ativo?: boolean;
  filhos?: ItemDoMenu[];
  /** O número à direita (as novidades não lidas); 0 ou vazio esconde. */
  contagem?: number;
};

/** O `Link` do roteador do app (o `next/link`, o do React Router...). */
export type LinkDoMenu = ComponentType<{
  href: string;
  className?: string;
  title?: string;
  onClick?: () => void;
  "aria-current"?: "page";
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
  /** A gaveta até 960px, aberta pelo ☰ do `CabecalhoDoApp` (`menuAberto` e `aoAlternarMenu`) ou por um item da
   * `BarraDeNavegacao`; sem `aberto`, o menu não aparece até 960px. */
  aberto?: boolean;
  aoFechar?: () => void;
  /** A linha de situação no pé (`.lateral-pe`, com o ponto verde do CSS): "ERP lido às 09:42". */
  pe?: ReactNode;
  Link?: LinkDoMenu;
};

/** O menu lateral da casca, só com a navegação: fixo sob o cabeçalho acima de 960px, gaveta abaixo. */
export function MenuLateral(props: PropsDoMenuLateral) {
  const { aberto, aoFechar, pe } = props;
  const fechar = () => aoFechar?.();

  // Esc fecha a gaveta.
  useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar?.();
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [aberto, aoFechar]);

  return (
    <>
      {/* até 960px o `lastro.css` tira a lateral para a esquerda (transform) e a desliza de volta quando aberta */}
      <aside
        aria-label="Navegação"
        className={cn("lateral fixed top-14 bottom-0 left-0 z-30 h-auto w-[200px] motion-reduce:transition-none max-[961px]:w-60", aberto && "[transform:none]")}
      >
        <Conteudo {...props} fechar={fechar} />
        {pe && <div className="lateral-pe">{pe}</div>}
      </aside>
      {aberto && <div className="fixed inset-x-0 top-14 bottom-0 z-[29] bg-veu-painel min-[961px]:hidden" onClick={fechar} />}
    </>
  );
}

type Interno = PropsDoMenuLateral & { fechar: () => void };

// O `.lateral a` desenha o link; o ativo também vai por classe, para o `Link` que não repassa o `aria-current`.
const ATIVO = "bg-ficha font-medio text-acao-texto shadow-p [&>span]:[color:inherit]";
// O grupo fechado com o item ativo dentro acende o rótulo.
const GRUPO = "lateral-grupo flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-transparent text-left hover:text-texto";

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

  const link = (item: ItemDoMenu) => {
    const miolo = (
      <>
        <span className="min-w-0 truncate [color:inherit]">{item.rotulo}</span>
        {!!item.contagem && <span className="numero shrink-0 pl-2">{item.contagem}</span>}
      </>
    );
    // O item sem tela fica à mostra, apagado e sem clique.
    if (!item.href)
      return (
        <div key={item.rotulo} className="flex cursor-default justify-between rounded-[6px] px-2 py-1.5 text-texto-apoio">
          {miolo}
        </div>
      );
    const noAr = estaAtivo(item);
    return (
      <Link key={item.href} href={item.href} onClick={fechar} aria-current={noAr ? "page" : undefined} className={cn(noAr && ATIVO)}>
        {miolo}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-px">
      {itens.map((item) => {
        const filhos = item.filhos ?? [];
        const [primeiro] = filhos;
        if (!primeiro) return link(item);
        // O grupo de um item só não vira grupo: vai direto ao filho, com o nome do grupo (o nome do filho sozinho
        // perde o assunto).
        if (filhos.length === 1) return link({ ...primeiro, rotulo: item.rotulo });
        const expandido = aberto === item.rotulo;
        const temAtivo = filhos.some(estaAtivo);
        return (
          <div key={item.rotulo} className="flex flex-col gap-px">
            <button
              type="button"
              onClick={() => alternar(item.rotulo)}
              aria-expanded={expandido}
              className={cn(GRUPO, !expandido && temAtivo && "text-acao-texto")}
            >
              {item.rotulo}
              <ChevronDown aria-hidden className={cn("size-3 shrink-0 transition-transform", expandido && "rotate-180")} />
            </button>
            {expandido && filhos.map((f) => link(f))}
          </div>
        );
      })}
    </nav>
  );
}
