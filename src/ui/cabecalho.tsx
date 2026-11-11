"use client";

// O cabeçalho do app, fixo no alto de ponta a ponta, acima do MenuLateral e da área da tela, em azul cheio. Da
// esquerda para a direita: a marca, o `contexto` do app na pílula translúcida (a empresa com o seletor, no Beyond
// Data), a `busca` (o `BotaoDeBusca`, campo branco com o atalho) e, no fim, a ajuda, o `sino` e o avatar com o menu
// do usuário. No celular ele baixa para 56px, a busca vira só a lupa e a ajuda some; o botão da gaveta do menu vem
// antes da marca só para quem passa `aoAlternarMenu` (quem usa a `BarraDeNavegacao` não passa), e aí a marca é a
// sigla. O kit só dá os lugares: o que vai em cada um chega por prop. Na casca:
//
//   const [menu, setMenu] = useState(false);
//   <CabecalhoDoApp nome="Beyond Data" contexto={<SeletorDeEmpresa />}
//     busca={<BotaoDeBusca aoBuscar={abrirPaleta} />} sino={<Sino ... />} usuario={{ nome, papel }}
//     itensDoUsuario={[...]} aoSair={sair} versao="v1.14.2" />
//   <MenuLateral itens={itens} aberto={menu} aoFechar={() => setMenu(false)} />
//   <BarraDeNavegacao itens={[..., { rotulo: "Menu", icone: Menu, aoAbrir: () => setMenu(true) }]} />
//   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>...</main>

import { CircleHelp, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Emblema } from "./emblema";
import type { LinkDoMenu } from "./menu-lateral";

/** A altura do cabeçalho acima de 760px, em px (a `h-15`); no celular são 56 (a `h-14`). */
export const ALTURA_DO_CABECALHO = 60;

/** O recuo do conteúdo sob o cabeçalho fixo (60px, 56 no celular): vai no `main` da casca, junto do `RECUO_DO_MENU`. */
export const RECUO_DO_CABECALHO = "pt-15 celular:pt-14";

// Diz ao `BotaoDeBusca` e ao `Sino` que estão sobre o azul do cabeçalho.
const NoCabecalho = createContext(false);
/** `true` dentro do `CabecalhoDoApp`. */
export const useNoCabecalho = () => useContext(NoCabecalho);

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

// O botão redondo de ícone sobre o azul; o contorno do foco vai em branco, que o azul do kit some no fundo.
const BOTAO =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-cabecalho-texto transition-colors hover:bg-cabecalho-2 focus-visible:outline-cabecalho-texto data-[state=open]:bg-cabecalho-2 [&_svg]:size-5";

// O `contexto` escrito para o cabeçalho antigo (os tokens `lateral-*` sobre o fundo escuro) continua legível no azul.
const SOBRE_O_AZUL = {
  "--lateral-ativo": "var(--cabecalho-texto)",
  "--lateral-texto": "var(--cabecalho-texto)",
  "--lateral-2": "transparent",
  "--lateral-linha": "transparent",
} as CSSProperties;

/** As props do `CabecalhoDoApp`. */
export type PropsDoCabecalho = {
  /** As iniciais do produto (BOD): a marca no celular de quem passa `aoAlternarMenu`, onde o botão da gaveta toma o
   * lugar do nome. Sem o botão, não é usada. */
  sigla?: string;
  /** O nome do produto, em 800; no celular fica inteiro (16px), menos ao lado do botão da gaveta, onde dá lugar à sigla. */
  nome: string;
  hrefDaMarca?: string;
  aoClicarNaMarca?: () => void;
  /** Ao lado da marca, dentro da pílula translúcida: a empresa e o seletor do app (só o conteúdo; a pílula é do kit). */
  contexto?: ReactNode;
  /** O `BotaoDeBusca`. */
  busca?: ReactNode;
  /** O `Sino`. */
  sino?: ReactNode;
  /** O botão de ajuda leva ao `hrefDaAjuda` ou chama `aoAjudar`; sem os dois, não aparece. */
  hrefDaAjuda?: string;
  aoAjudar?: () => void;
  /** O usuário do menu: as iniciais saem do nome (a primeira e a última palavra); o papel e o e-mail vão embaixo dele. */
  usuario: { nome: string; papel?: string; email?: string };
  /** Os itens do menu do usuário, acima do Sair. */
  itensDoUsuario?: ItemDoUsuario[];
  aoSair: () => void;
  /** A versão no pé do menu do usuário; com `hrefDaVersao`, leva às novidades. */
  versao?: string;
  hrefDaVersao?: string;
  /** O botão da gaveta do `MenuLateral` no celular (até 760px); quem usa a `BarraDeNavegacao` não passa. */
  menuAberto?: boolean;
  aoAlternarMenu?: () => void;
  Link?: LinkDoMenu;
};

/** O cabeçalho fixo do app, em azul cheio: marca, contexto e busca à esquerda; ajuda, sino e usuário à direita. */
export function CabecalhoDoApp(props: PropsDoCabecalho) {
  const { sigla, contexto, busca, sino, hrefDaAjuda, aoAjudar, menuAberto, aoAlternarMenu } = props;
  const Link = props.Link ?? LinkPadrao;

  return (
    <NoCabecalho.Provider value>
      <header className="fixed inset-x-0 top-0 z-40 flex h-15 items-center gap-4 bg-cabecalho px-5 text-cabecalho-texto celular:h-14 celular:gap-2.5 celular:px-3">
        {aoAlternarMenu && (
          <button
            type="button"
            onClick={aoAlternarMenu}
            aria-label={menuAberto ? "Fechar o menu" : "Menu"}
            aria-expanded={!!menuAberto}
            className={cn(BOTAO, "mesa:hidden", menuAberto && "bg-cabecalho-2")}
          >
            {menuAberto ? <X /> : <Menu />}
          </button>
        )}
        {/* a marca fecha a largura do menu lateral (230px com o respiro do cabeçalho): o contexto começa com a área.
            No celular ela não cede (quem cede é a pílula do contexto); só o nome inteiro ao lado do botão da gaveta cede */}
        <div className={cn("min-w-0 mesa:w-[210px] mesa:shrink-0", (sigla || !aoAlternarMenu) && "celular:shrink-0")}>
          <Marca {...props} Link={Link} />
        </div>
        {contexto && (
          <div
            style={SOBRE_O_AZUL}
            className="flex min-h-[34px] max-w-[360px] min-w-0 items-center rounded-pilula bg-cabecalho-2 px-3.5 text-sm font-bold has-[button]:hover:bg-cabecalho-3 celular:min-h-[30px] celular:max-w-[130px] celular:px-2.5 celular:text-[13px] [&_button]:outline-cabecalho-texto"
          >
            {contexto}
          </div>
        )}
        {/* no celular a lupa vai para junto do sino: o vão passa para antes dela */}
        {busca && <div className="min-w-0 celular:order-2 celular:flex-none mesa:flex-[0_1_360px]">{busca}</div>}
        <div className="flex-1 celular:order-1" />
        <div className="flex shrink-0 items-center gap-1 celular:order-3">
          {hrefDaAjuda ? (
            <Link href={hrefDaAjuda} title="Ajuda" className={cn(BOTAO, "celular:hidden")}>
              <CircleHelp />
            </Link>
          ) : (
            aoAjudar && (
              <button type="button" onClick={aoAjudar} title="Ajuda" aria-label="Ajuda" className={cn(BOTAO, "celular:hidden")}>
                <CircleHelp />
              </button>
            )
          )}
          {sino}
          <MenuDoUsuario {...props} Link={Link} />
        </div>
      </header>
    </NoCabecalho.Provider>
  );
}

/** O nome do produto em 800, inteiro também no celular; a sigla só entra lá no lugar dele quando o botão da gaveta
 * divide o cabeçalho. */
function Marca({ sigla, nome, hrefDaMarca, aoClicarNaMarca, aoAlternarMenu, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  const curta = aoAlternarMenu ? sigla : undefined;
  const desenho = (
    <span title={nome} className="block truncate text-lg leading-tight font-extrabold tracking-[-0.01em] celular:text-base">
      {curta ? (
        <>
          <span className="mesa:hidden">{curta}</span>
          <span className="celular:hidden">{nome}</span>
        </>
      ) : (
        nome
      )}
    </span>
  );
  if (hrefDaMarca)
    return (
      <Link href={hrefDaMarca} className="block rounded-md focus-visible:outline-cabecalho-texto">
        {desenho}
      </Link>
    );
  if (aoClicarNaMarca)
    return (
      <button
        type="button"
        onClick={aoClicarNaMarca}
        className="block max-w-full cursor-pointer rounded-md text-left focus-visible:outline-cabecalho-texto"
      >
        {desenho}
      </button>
    );
  return desenho;
}

/** As iniciais do nome: a primeira letra da primeira e da última palavra (Rafael Gustavo Dal Bosco, RB). */
function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes.at(0)?.charAt(0) ?? "";
  const ultima = partes.length > 1 ? (partes.at(-1)?.charAt(0) ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

const ITEM =
  "flex cursor-pointer items-center gap-2.5 px-4 py-[9px] text-sm font-bold text-texto outline-none select-none data-[highlighted]:bg-superficie-2 [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:text-texto-2";

/** O avatar com as iniciais e o menu dele: o avatar, o nome e o papel no alto, os itens do app com ícone, o Sair em
 * vermelho e a versão no pé. */
function MenuDoUsuario({ usuario, itensDoUsuario, aoSair, versao, hrefDaVersao, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  const letras = iniciais(usuario.nome);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={`Menu de ${usuario.nome}`}
        className="ml-1.5 flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-cabecalho-texto text-[13px] font-extrabold text-cabecalho ring-cabecalho-3 transition-shadow outline-none hover:ring-[3px] focus-visible:ring-[3px] data-[state=open]:ring-[3px] celular:size-[30px] celular:text-xs"
      >
        {letras}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-[300px] max-w-[calc(100vw-24px)] animate-entrar overflow-hidden rounded-bloco border border-fio bg-superficie text-texto shadow-2 outline-none"
        >
          <div className="flex items-center gap-3 border-b border-fio p-4">
            <Emblema sigla={letras} cheio className="text-sm" />
            <div className="min-w-0">
              <div className="truncate font-bold">{usuario.nome}</div>
              {usuario.papel && <div className="truncate text-[13px] font-semibold text-texto-2">{usuario.papel}</div>}
              {usuario.email && <div className="truncate text-[13px] font-semibold text-texto-2">{usuario.email}</div>}
            </div>
          </div>
          <div className="py-1.5">
            {itensDoUsuario?.map((item) => {
              const Icone = item.icone;
              const miolo = (
                <>
                  <Icone />
                  <span className="min-w-0 flex-1">{item.rotulo}</span>
                  {!!item.contagem && (
                    <span className="numero flex h-5 min-w-5 items-center justify-center rounded-full bg-cobalto px-1 text-xs font-extrabold text-sobre-cobalto">
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
            {!!itensDoUsuario?.length && <DropdownMenu.Separator className="my-1.5 h-px bg-fio" />}
            <DropdownMenu.Item onSelect={aoSair} className={cn(ITEM, "text-risco [&_svg]:text-risco")}>
              <LogOut />
              Sair
            </DropdownMenu.Item>
          </div>
          {versao && (
            <div className="border-t border-fio px-4 py-2.5">
              {hrefDaVersao ? (
                <Link href={hrefDaVersao} className="numero text-xs font-semibold text-texto-3 transition-colors hover:text-cobalto">
                  {versao}
                </Link>
              ) : (
                <span className="numero text-xs font-semibold text-texto-3">{versao}</span>
              )}
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
