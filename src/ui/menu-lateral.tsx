"use client";

// O menu lateral cobalto escuro da casca, na medida do ArchFlow: a marca no alto (a sigla pesada e o nome em caixa
// alta espaçada), os itens com ícone, os grupos que abrem e fecham, a área fixa de baixo (Suporte, Novidades) e o pé
// com o usuário, o "Instalar o app", o "Sair" e a versão. No celular (abaixo de `lg`) vira a barra do alto com o botão
// que abre a gaveta. O kit não conhece o roteador: o consumidor passa o `Link` dele e diz qual item está ativo.

import { ChevronDown, LogOut, Menu, MonitorSmartphone, X, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** A largura do menu no desktop, em px (a `w-64` do ArchFlow). */
export const LARGURA_DO_MENU = 256;

/** O recuo do conteúdo ao lado do menu fixo: vai no `main` da casca. */
export const RECUO_DO_MENU = "lg:pl-64";

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
  /** As iniciais da empresa, em negrito pesado (PJTS). */
  sigla: string;
  /** O nome ao lado da sigla, em caixa alta espaçada (PROJETSE). */
  nome: string;
  /** Para onde a marca leva (o início); ou `aoClicarNaMarca`. */
  hrefDaMarca?: string;
  aoClicarNaMarca?: () => void;
  itens: ItemDoMenu[];
  /** A área fixa de baixo, acima do usuário (Suporte, Novidades). */
  rodape?: ItemDoMenu[];
  /** Diz se o `href` é a rota atual, para o item sem `ativo`. */
  ativo?: (href: string) => boolean;
  usuario: { nome: string; perfil?: ReactNode };
  /** O nome e a inicial levam ao perfil. */
  hrefDoPerfil?: string;
  /** Mostra o "Instalar o app" (quando o navegador oferece, ou para explicar no iPhone). */
  aoInstalar?: () => void;
  aoSair: () => void;
  versao?: string;
  /** A versão leva às novidades. */
  hrefDaVersao?: string;
  Link?: LinkDoMenu;
};

/** O menu lateral da casca: aside fixo no desktop, barra do alto com gaveta no celular. */
export function MenuLateral(props: PropsDoMenuLateral) {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Conteudo {...props} fechar={fechar} />
      </aside>

      {/* celular */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-lateral px-4 text-lateral-ativo lg:hidden">
        <Marca {...props} fechar={fechar} compacta />
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Menu"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-lateral-texto transition-colors hover:bg-lateral-2 hover:text-lateral-ativo"
        >
          <Menu className="size-5" />
        </button>
      </div>
      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-(--veu)" onClick={fechar} />
          <aside className="absolute inset-y-0 left-0 w-64 shadow-3">
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar"
              className="absolute top-5 right-3 z-10 cursor-pointer text-lateral-texto hover:text-lateral-ativo"
            >
              <X className="size-5" />
            </button>
            <Conteudo {...props} fechar={fechar} />
          </aside>
        </div>
      )}
    </>
  );
}

type Interno = PropsDoMenuLateral & { fechar: () => void };

/** A sigla pesada e o nome em caixa alta espaçada; o nome quebra em linhas se não couber. */
function Marca({ sigla, nome, hrefDaMarca, aoClicarNaMarca, Link = LinkPadrao, fechar, compacta }: Interno & { compacta?: boolean }) {
  const desenho = (
    <span className={cn("flex items-center gap-2.5 leading-none", compacta ? "text-base" : "text-xl")}>
      <span className="text-[1.55em] font-extrabold tracking-tight">{sigla}</span>
      <span className="text-[0.92em] leading-[1.1] font-semibold tracking-[0.12em] uppercase">{nome}</span>
    </span>
  );
  if (hrefDaMarca)
    return (
      <Link href={hrefDaMarca} onClick={fechar} className="text-lateral-ativo">
        {desenho}
      </Link>
    );
  if (aoClicarNaMarca)
    return (
      <button
        type="button"
        onClick={() => {
          fechar();
          aoClicarNaMarca();
        }}
        className="cursor-pointer text-left text-lateral-ativo"
      >
        {desenho}
      </button>
    );
  return <div className="text-lateral-ativo">{desenho}</div>;
}

function Conteudo(props: Interno) {
  const { itens, rodape, ativo, usuario, hrefDoPerfil, aoInstalar, aoSair, versao, hrefDaVersao, fechar } = props;
  const Link = props.Link ?? LinkPadrao;
  const estaAtivo = (item: ItemDoMenu) => item.ativo ?? (item.href ? (ativo?.(item.href) ?? false) : false);

  // O grupo do item ativo abre sozinho; os outros abrem e fecham no clique.
  const grupoAtivo = itens.find((i) => i.filhos?.some(estaAtivo))?.rotulo;
  const [abertos, setAbertos] = useState<string[]>(grupoAtivo ? [grupoAtivo] : []);
  useEffect(() => {
    if (grupoAtivo) setAbertos((a) => (a.includes(grupoAtivo) ? a : [...a, grupoAtivo]));
  }, [grupoAtivo]);
  const alternar = (rotulo: string) =>
    setAbertos((a) => (a.includes(rotulo) ? a.filter((r) => r !== rotulo) : [...a, rotulo]));

  const link = (item: ItemDoMenu, aninhado = false) => {
    const Icone = item.icone;
    return (
      <Link
        key={item.href ?? item.rotulo}
        href={item.href ?? "#"}
        onClick={fechar}
        className={cn(
          "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
          aninhado ? "pr-3 pl-10" : "px-3",
          estaAtivo(item) ? "bg-lateral-cheio text-lateral-ativo" : "text-lateral-texto hover:bg-lateral-2 hover:text-lateral-ativo",
        )}
      >
        <Icone size={aninhado ? 16 : 18} className="shrink-0" />
        <span className="flex-1 truncate">{item.rotulo}</span>
        {!!item.contagem && (
          <span className="numero flex size-5 items-center justify-center rounded-full bg-lateral-ativo text-xs font-bold text-lateral">
            {item.contagem > 9 ? "9+" : item.contagem}
          </span>
        )}
      </Link>
    );
  };

  const botaoDoPe = "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-lateral-texto transition-colors hover:bg-lateral-2 hover:text-lateral-ativo";
  const inicial = usuario.nome.trim().charAt(0).toUpperCase();

  return (
    <div className="flex h-full flex-col bg-lateral text-lateral-ativo">
      <div className="flex items-center border-b border-lateral-linha px-5 py-5 pr-10 lg:pr-5">
        <Marca {...props} />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {itens.map((item) => {
          if (!item.filhos?.length) return link(item);
          const Icone = item.icone;
          const expandido = abertos.includes(item.rotulo);
          const temAtivo = item.filhos.some(estaAtivo);
          return (
            <div key={item.rotulo}>
              <button
                type="button"
                onClick={() => alternar(item.rotulo)}
                aria-expanded={expandido}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  !expandido && temAtivo
                    ? "bg-lateral-2 text-lateral-ativo"
                    : "text-lateral-texto hover:bg-lateral-2 hover:text-lateral-ativo",
                )}
              >
                <Icone size={18} className="shrink-0" />
                <span className="flex-1 truncate text-left">{item.rotulo}</span>
                <ChevronDown size={16} className={cn("shrink-0 transition-transform", expandido && "rotate-180")} />
              </button>
              {expandido && <div className="mt-0.5 space-y-0.5">{item.filhos.map((f) => link(f, true))}</div>}
            </div>
          );
        })}
      </nav>

      {rodape && rodape.length > 0 && (
        <div className="space-y-0.5 border-t border-lateral-linha px-3 py-2">{rodape.map((item) => link(item))}</div>
      )}

      <div className="border-t border-lateral-linha p-4">
        <div className="mb-3 flex items-center gap-3">
          {hrefDoPerfil ? (
            <Link href={hrefDoPerfil} onClick={fechar} title="Meu perfil" className="transition-opacity hover:opacity-80">
              <Avatar inicial={inicial} />
            </Link>
          ) : (
            <Avatar inicial={inicial} />
          )}
          <div className="min-w-0 flex-1">
            {hrefDoPerfil ? (
              <Link href={hrefDoPerfil} onClick={fechar} className="block truncate text-sm font-medium transition-colors hover:text-lateral-texto">
                {usuario.nome}
              </Link>
            ) : (
              <div className="truncate text-sm font-medium">{usuario.nome}</div>
            )}
            {usuario.perfil && <div className="truncate text-xs text-lateral-texto">{usuario.perfil}</div>}
          </div>
        </div>
        {aoInstalar && (
          <button
            type="button"
            onClick={() => {
              fechar();
              aoInstalar();
            }}
            className={botaoDoPe}
          >
            <MonitorSmartphone size={16} />
            Instalar o app
          </button>
        )}
        <button type="button" onClick={aoSair} className={botaoDoPe}>
          <LogOut size={16} />
          Sair
        </button>
        {versao &&
          (hrefDaVersao ? (
            <Link
              href={hrefDaVersao}
              onClick={fechar}
              className="numero mt-2 block text-center text-xs text-lateral-texto/40 transition-colors hover:text-lateral-texto"
            >
              {versao}
            </Link>
          ) : (
            <div className="numero mt-2 text-center text-xs text-lateral-texto/40">{versao}</div>
          ))}
      </div>
    </div>
  );
}

/** A inicial do usuário no círculo cobalto. */
function Avatar({ inicial }: { inicial: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-lateral-cheio text-sm font-semibold text-lateral-ativo">
      {inicial}
    </span>
  );
}
