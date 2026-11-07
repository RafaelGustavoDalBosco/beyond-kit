"use client";

// O cabeçalho do app, fixo no alto de ponta a ponta, acima do MenuLateral e da área da tela, no cobalto escuro do
// menu: à esquerda a marca e o `contexto` do app (a empresa com o seletor, no Beyond Data); à direita a `busca`
// (o `BotaoDeBusca`), o `sino`, a ajuda e o menu do usuário. No celular, o botão da gaveta do menu vem antes da
// marca. O kit só dá os lugares: o que vai em cada um chega por prop. Na casca:
//
//   const [menu, setMenu] = useState(false);
//   <CabecalhoDoApp sigla="BOD" nome="Beyond Data" contexto={<SeletorDeEmpresa />}
//     busca={<BotaoDeBusca aoBuscar={abrirPaleta} />} sino={<Sino ... />} usuario={{ nome, email }}
//     itensDoUsuario={[...]} aoSair={sair} versao="v1.14.2" menuAberto={menu} aoAlternarMenu={() => setMenu((a) => !a)} />
//   <MenuLateral itens={itens} aberto={menu} aoFechar={() => setMenu(false)} />
//   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU)}>...</main>

import { CircleHelp, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { createContext, useContext, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { LinkDoMenu } from "./menu-lateral";

/** A altura do cabeçalho, em px (a `h-14`). */
export const ALTURA_DO_CABECALHO = 56;

/** O recuo do conteúdo sob o cabeçalho fixo: vai no `main` da casca, junto do `RECUO_DO_MENU`. */
export const RECUO_DO_CABECALHO = "pt-14";

// Diz ao `BotaoDeBusca` e ao `Sino` que estão no fundo escuro do cabeçalho.
const Escuro = createContext(false);
/** `true` dentro do `CabecalhoDoApp`. */
export const useNoCabecalho = () => useContext(Escuro);

/** Um item do menu do usuário (Minha conta, Novidades, Suporte): leva ao `href` ou chama `aoClicar`. */
export type ItemDoUsuario = {
  rotulo: string;
  icone: LucideIcon;
  href?: string;
  aoClicar?: () => void;
  /** O número no selo à direita (as novidades não lidas); 0 ou vazio esconde. */
  contagem?: number;
};

const LinkPadrao: LinkDoMenu = ({ href, children, ...resto }) => (
  <a href={href} {...resto}>
    {children}
  </a>
);

const BOTAO =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-lateral-texto transition-colors hover:bg-lateral-2 hover:text-lateral-ativo data-[state=open]:bg-lateral-2 data-[state=open]:text-lateral-ativo [&_svg]:size-[19px]";

/** As props do `CabecalhoDoApp`. */
export type PropsDoCabecalho = {
  /** As iniciais da empresa, em negrito pesado (BOD). */
  sigla?: string;
  /** O nome ao lado da sigla, em caixa alta espaçada; no celular só a sigla aparece (sem sigla, o nome). */
  nome: string;
  hrefDaMarca?: string;
  aoClicarNaMarca?: () => void;
  /** Ao lado da marca: a empresa e o seletor do app. */
  contexto?: ReactNode;
  /** O `BotaoDeBusca`. */
  busca?: ReactNode;
  /** O `Sino`. */
  sino?: ReactNode;
  /** O botão de ajuda leva ao `hrefDaAjuda` ou chama `aoAjudar`; sem os dois, não aparece. */
  hrefDaAjuda?: string;
  aoAjudar?: () => void;
  /** O usuário do menu: as iniciais saem do nome (a primeira e a última palavra); o e-mail vai no alto do menu. */
  usuario: { nome: string; email?: string };
  /** Os itens do menu do usuário, acima do Sair. */
  itensDoUsuario?: ItemDoUsuario[];
  aoSair: () => void;
  /** A versão no pé do menu do usuário; com `hrefDaVersao`, leva às novidades. */
  versao?: string;
  hrefDaVersao?: string;
  /** O botão da gaveta do `MenuLateral` no celular (abaixo de `lg`). */
  menuAberto?: boolean;
  aoAlternarMenu?: () => void;
  Link?: LinkDoMenu;
};

/** O cabeçalho fixo do app: marca e contexto à esquerda; busca, sino, ajuda e usuário à direita. */
export function CabecalhoDoApp(props: PropsDoCabecalho) {
  const { contexto, busca, sino, hrefDaAjuda, aoAjudar, menuAberto, aoAlternarMenu } = props;
  const Link = props.Link ?? LinkPadrao;

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-lateral-linha bg-lateral px-2 text-lateral-ativo sm:gap-3 sm:px-4">
      {aoAlternarMenu && (
        <button
          type="button"
          onClick={aoAlternarMenu}
          aria-label={menuAberto ? "Fechar o menu" : "Menu"}
          aria-expanded={!!menuAberto}
          className={cn(BOTAO, "lg:hidden", menuAberto && "bg-lateral-2 text-lateral-ativo")}
        >
          {menuAberto ? <X /> : <Menu />}
        </button>
      )}
      <div className="shrink-0 lg:w-[256px]">
        <Marca {...props} Link={Link} />
      </div>
      <div className="flex min-w-0 flex-1 items-center">{contexto}</div>
      <Escuro.Provider value>
        <div className="flex shrink-0 items-center gap-1">
          {busca && <div className="md:mr-2">{busca}</div>}
          {sino}
          {hrefDaAjuda ? (
            <Link href={hrefDaAjuda} title="Ajuda" className={cn(BOTAO, "hidden sm:flex")}>
              <CircleHelp />
            </Link>
          ) : (
            aoAjudar && (
              <button type="button" onClick={aoAjudar} title="Ajuda" aria-label="Ajuda" className={cn(BOTAO, "hidden sm:flex")}>
                <CircleHelp />
              </button>
            )
          )}
          <MenuDoUsuario {...props} Link={Link} />
        </div>
      </Escuro.Provider>
    </header>
  );
}

/** A sigla pesada e o nome em caixa alta espaçada; no celular, só a sigla. Sem sigla, só o nome. */
function Marca({ sigla, nome, hrefDaMarca, aoClicarNaMarca, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  const desenho = sigla ? (
    <span className="flex items-center gap-2.5 text-base leading-none">
      <span className="text-[1.55em] font-extrabold tracking-tight">{sigla}</span>
      <span className="hidden text-[0.85em] leading-[1.1] font-semibold tracking-[0.12em] uppercase sm:block">{nome}</span>
    </span>
  ) : (
    <span title={nome} className="line-clamp-2 max-w-40 text-sm leading-snug font-semibold sm:max-w-none">
      {nome}
    </span>
  );
  if (hrefDaMarca)
    return (
      <Link href={hrefDaMarca} className="block px-1 text-lateral-ativo">
        {desenho}
      </Link>
    );
  if (aoClicarNaMarca)
    return (
      <button type="button" onClick={aoClicarNaMarca} className="block cursor-pointer px-1 text-left text-lateral-ativo">
        {desenho}
      </button>
    );
  return <div className="px-1">{desenho}</div>;
}

/** As iniciais do nome: a primeira letra da primeira e da última palavra (Rafael Gustavo Dal Bosco, RB). */
function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes.at(0)?.charAt(0) ?? "";
  const ultima = partes.length > 1 ? (partes.at(-1)?.charAt(0) ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

const ITEM =
  "flex cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm text-texto-2 outline-none select-none data-[highlighted]:bg-superficie-2 data-[highlighted]:text-texto [&_svg]:size-4 [&_svg]:shrink-0";

/** O avatar com as iniciais e o menu dele: o nome e o e-mail no alto, os itens do app, o Sair e a versão no pé. */
function MenuDoUsuario({ usuario, itensDoUsuario, aoSair, versao, hrefDaVersao, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={`Menu de ${usuario.nome}`}
        className="ml-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-lateral-cheio text-xs font-bold text-lateral-ativo ring-lateral-ativo transition-shadow outline-none hover:ring-2 data-[state=open]:ring-2"
      >
        {iniciais(usuario.nome)}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-72 animate-entrar overflow-hidden rounded-bloco border border-linha bg-superficie text-texto shadow-3 outline-none"
        >
          <div className="border-b border-linha px-4 py-3">
            <div className="truncate text-sm font-semibold">{usuario.nome}</div>
            {usuario.email && <div className="mt-0.5 truncate text-xs text-texto-3">{usuario.email}</div>}
          </div>
          <div className="py-1">
            {itensDoUsuario?.map((item) => {
              const Icone = item.icone;
              const miolo = (
                <>
                  <Icone />
                  <span className="min-w-0 flex-1">{item.rotulo}</span>
                  {!!item.contagem && (
                    <span className="numero flex h-5 min-w-5 items-center justify-center rounded-full bg-cobalto px-1 text-xs font-bold text-sobre-cobalto">
                      {item.contagem > 9 ? "9+" : item.contagem}
                    </span>
                  )}
                </>
              );
              return item.href ? (
                <DropdownMenu.Item key={item.rotulo} asChild className={ITEM}>
                  <Link href={item.href}>{miolo}</Link>
                </DropdownMenu.Item>
              ) : (
                <DropdownMenu.Item key={item.rotulo} onSelect={item.aoClicar} className={ITEM}>
                  {miolo}
                </DropdownMenu.Item>
              );
            })}
            {!!itensDoUsuario?.length && <DropdownMenu.Separator className="my-1 h-px bg-linha" />}
            <DropdownMenu.Item onSelect={aoSair} className={cn(ITEM, "text-risco data-[highlighted]:text-risco")}>
              <LogOut />
              Sair
            </DropdownMenu.Item>
          </div>
          {versao && (
            <div className="border-t border-linha bg-zebra px-4 py-2">
              {hrefDaVersao ? (
                <Link href={hrefDaVersao} className="numero text-xs text-texto-3 transition-colors hover:text-cobalto">
                  {versao}
                </Link>
              ) : (
                <span className="numero text-xs text-texto-3">{versao}</span>
              )}
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
