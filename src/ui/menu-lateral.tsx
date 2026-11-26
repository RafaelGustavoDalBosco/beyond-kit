"use client";

// A lateral da casca (`.lateral`): presa à borda, opaca e tingida, sem sombra nem vidro, ao lado do conteúdo e nunca
// por cima dele. No alto, a marca do produto (o quadrado `--marca` com a sigla e o nome, quando o app passa `nome`)
// e o botão redondo de recolher, com a seta; embaixo, a navegação, com o ícone antes do texto. O grupo é o rótulo
// de apoio com os itens embaixo; ele abre e fecha, um aberto por vez. O item ativo vai em azul cheio com o texto
// branco; a contagem, quando houver, fica discreta à direita. Recolhida (76px) mostra só os ícones, com o nome na dica (`data-hint`, da `CamadaDeHint`); fica lembrada neste
// navegador (`chaveDaLateral`) e vai no `data-lateral` do <html>, de onde o cabeçalho e o `RECUO_DO_MENU` tiram a
// coluna (`--coluna-lateral`, no `casca.css`). O contexto, o usuário, o Sair e a versão moram no `CabecalhoDoApp`.
// Até 960px ela vira gaveta, aberta por `aberto` (o ☰ do cabeçalho ou um item "Menu" da `BarraDeNavegacao`). O kit
// não conhece o roteador: o consumidor passa o `Link` dele e diz qual item está ativo.

import { ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type ComponentType, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { iniciais } from "../lib/formato";

/** A lateral aberta no desktop, em px (o `--lateral-largura`). */
export const LARGURA_DO_MENU = 248;

/** A lateral recolhida no desktop, em px (o `--lateral-recolhida`). */
export const LARGURA_DO_MENU_RECOLHIDO = 76;

/** O recuo do conteúdo ao lado da lateral: a `--coluna-lateral`, que acompanha a lateral aberta ou recolhida e vale 0
 * até 960px (lá ela é gaveta) e sem lateral. Vai no `main` da casca, junto do `RECUO_DO_CABECALHO`. */
export const RECUO_DO_MENU =
  "pl-[var(--coluna-lateral)] transition-[padding-left] duration-[var(--dur-2)] ease-[var(--curva)] motion-reduce:transition-none";

/** A chave padrão da lateral recolhida no navegador (o `localStorage`). */
export const CHAVE_DA_LATERAL = "kit-lateral";

/** Um item do menu. Com `filhos`, vira grupo que abre e fecha (o `href` do grupo não é usado; o `icone` dele aparece
 * só com a lateral recolhida); o grupo de um filho só vira item direto, com o nome do grupo e o destino do filho. Sem
 * `href` e sem filhos, é o item sem tela: apagado e sem clique. */
export type ItemDoMenu = {
  rotulo: string;
  /** O ícone antes do texto (18px, no traço fino); recolhida a lateral, é ele que fica. */
  icone?: LucideIcon;
  href?: string;
  /** Decidido pelo app; sem ele vale a função `ativo` do menu. */
  ativo?: boolean;
  filhos?: ItemDoMenu[];
  /** O número discreto à direita (as novidades não lidas); 0 ou vazio esconde. A lateral não leva contador por padrão. */
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
  /** A linha de situação no pé (`.lateral-pe`, com o ponto verde): "ERP lido às 09:42". Recolhida, fica só o ponto. */
  pe?: ReactNode;
  /** O nome do produto, na marca do alto da lateral; sem ele, a lateral não leva marca. Com a marca aqui, a do
   * `CabecalhoDoApp` só aparece até 960px, quando a lateral vira gaveta. */
  nome?: string;
  /** As iniciais do produto (BD) no quadrado da marca; sem ela, as iniciais do `nome`. */
  sigla?: string;
  /** A marca leva ao `hrefDaMarca` (o começo do app) ou chama `aoClicarNaMarca`. */
  hrefDaMarca?: string;
  aoClicarNaMarca?: () => void;
  /** A chave da lateral recolhida no `localStorage` deste navegador; padrão `kit-lateral`. */
  chaveDaLateral?: string;
  Link?: LinkDoMenu;
};

// A lateral recolhida: lida do navegador e avisada a quem usa a mesma chave. Sem o `localStorage` (aba privada,
// bloqueio), vale só na memória desta aba.
const ouvintes = new Set<() => void>();
const naMemoria = new Map<string, boolean>();

function isRecolhidaNoNavegador(chave: string): boolean {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo === null ? (naMemoria.get(chave) ?? false) : salvo === "recolhida";
  } catch {
    return naMemoria.get(chave) ?? false;
  }
}

function gravarRecolhida(chave: string, isRecolhida: boolean) {
  naMemoria.set(chave, isRecolhida);
  try {
    localStorage.setItem(chave, isRecolhida ? "recolhida" : "aberta");
  } catch {
    /* vale só nesta aba */
  }
  ouvintes.forEach((f) => f());
}

// No servidor e na hidratação a lateral nasce aberta; logo depois vale a escolha salva.
function useRecolhida(chave: string) {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => isRecolhidaNoNavegador(chave),
    () => false,
  );
}

/** A lateral da casca: presa à borda, ao lado do conteúdo, acima de 960px (aberta ou recolhida); gaveta abaixo. */
export function MenuLateral(props: PropsDoMenuLateral) {
  const { aberto, aoFechar, pe, nome, chaveDaLateral = CHAVE_DA_LATERAL } = props;
  const isRecolhida = useRecolhida(chaveDaLateral);
  const fechar = () => aoFechar?.();

  // O <html> diz a coluna ao cabeçalho e ao recuo do conteúdo (o `casca.css`).
  useEffect(() => {
    document.documentElement.setAttribute("data-lateral", isRecolhida ? "recolhida" : "aberta");
  }, [isRecolhida]);

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
      {/* até 960px o `casca.css` tira a lateral para a esquerda e a desliza de volta com o `is-aberta` */}
      <aside aria-label="Navegação" className={cn("lateral", aberto && "is-aberta")}>
        <div className="lateral-topo">
          {nome && <Marca {...props} nome={nome} />}
          <button
            type="button"
            onClick={() => gravarRecolhida(chaveDaLateral, !isRecolhida)}
            aria-label="Barra lateral"
            aria-expanded={!isRecolhida}
            data-hint={isRecolhida ? "Expandir a lateral" : "Recolher a lateral"}
            className="btn btn-icon lateral-recolher"
          >
            {isRecolhida ? <ChevronRight className="icone" aria-hidden /> : <ChevronLeft className="icone" aria-hidden />}
          </button>
        </div>
        <Navegacao {...props} isRecolhida={isRecolhida} fechar={fechar} />
        {pe && (
          <div className="lateral-pe">
            <span>{pe}</span>
          </div>
        )}
      </aside>
      {aberto && <div aria-hidden className="lateral-veu" onClick={fechar} />}
    </>
  );
}

/** A marca no alto da lateral (`.topo-marca.lateral-marca`): o quadrado `--marca` com a sigla e o nome do produto;
 * recolhida, fica só o quadrado. */
function Marca({ sigla, nome, hrefDaMarca, aoClicarNaMarca, Link = LinkPadrao }: PropsDoMenuLateral & { nome: string }) {
  const desenho = (
    <>
      <i aria-hidden>{sigla ?? iniciais(nome)}</i>
      <span>{nome}</span>
    </>
  );
  if (hrefDaMarca)
    return (
      <Link href={hrefDaMarca} title={nome} className="topo-marca lateral-marca">
        {desenho}
      </Link>
    );
  if (aoClicarNaMarca)
    return (
      <button
        type="button"
        onClick={aoClicarNaMarca}
        title={nome}
        className="topo-marca lateral-marca cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        {desenho}
      </button>
    );
  return (
    <span title={nome} className="topo-marca lateral-marca">
      {desenho}
    </span>
  );
}

type Interno = PropsDoMenuLateral & { isRecolhida: boolean; fechar: () => void };

function Navegacao(props: Interno) {
  const { itens, ativo, isRecolhida, fechar } = props;
  const Link = props.Link ?? LinkPadrao;
  const estaAtivo = (item: ItemDoMenu) => item.ativo ?? (item.href ? (ativo?.(item.href) ?? false) : false);
  // Recolhida, o nome vai na dica.
  const dica = (rotulo: string) => (isRecolhida ? rotulo : undefined);

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
        {item.icone ? (
          <item.icone aria-hidden size={18} strokeWidth={1.7} />
        ) : (
          // sem ícone, a lateral recolhida mostra a inicial
          <span aria-hidden className="lateral-inicial">
            {item.rotulo.charAt(0)}
          </span>
        )}
        <span className="lateral-rotulo">{item.rotulo}</span>
        {!!item.contagem && <span className="lateral-contagem numero">{item.contagem}</span>}
      </>
    );
    // O item sem tela fica à mostra, apagado e sem clique.
    if (!item.href)
      return (
        <div key={item.rotulo} className="lateral-item is-sem-tela" data-hint={dica(item.rotulo)}>
          {miolo}
        </div>
      );
    const noAr = estaAtivo(item);
    // o ativo também vai por classe, para o `Link` que não repassa o `aria-current`
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={fechar}
        aria-current={noAr ? "page" : undefined}
        className={cn("lateral-item", noAr && "is-ativo")}
        data-hint={dica(item.rotulo)}
      >
        {miolo}
      </Link>
    );
  };

  return (
    <nav className="lateral-nav" aria-label="Telas">
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
          <div key={item.rotulo} className="lateral-secao">
            <button
              type="button"
              onClick={() => alternar(item.rotulo)}
              aria-expanded={expandido}
              data-hint={dica(item.rotulo)}
              className={cn("lateral-grupo", !expandido && temAtivo && "is-com-ativo")}
            >
              {item.icone && <item.icone aria-hidden size={18} strokeWidth={1.7} className="lateral-grupo-icone" />}
              <span className="lateral-rotulo">{item.rotulo}</span>
              <ChevronDown aria-hidden className="lateral-seta" />
            </button>
            {expandido && filhos.map((f) => link(f))}
          </div>
        );
      })}
    </nav>
  );
}
