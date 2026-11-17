"use client";

// O cabeçalho do app (`.topo` do Lastro), fixo no alto de ponta a ponta, claro, com a borda e a sombra embaixo, acima
// do MenuLateral e da área da tela. Da esquerda para a direita: o ☰ da gaveta (só até 960px, para quem passa
// `aoAlternarMenu`), a marca (o quadrado azul com a sigla e o nome), o `contexto` do app, a `busca` (o `BotaoDeBusca`),
// o `sino`, o botão de tema, a ajuda e o usuário com o menu dele. Ao estreitar, o cabeçalho nunca rola de lado: os
// itens somem pelas regras do `lastro.css` (o nome do usuário e a tecla da busca até 1180px, o nome do produto até
// 960px, o texto da busca e o tema no celular). O kit só dá os lugares: o que vai em cada um chega por prop. Na casca:
//
//   const [menu, setMenu] = useState(false);
//   <CabecalhoDoApp sigla="BD" nome="Beyond Data" contexto={<SeletorDeEmpresa />}
//     busca={<BotaoDeBusca aoBuscar={abrirPaleta} />} sino={<Sino ... />} usuario={{ nome, papel }}
//     itensDoUsuario={[...]} aoSair={sair} versao="v1.14.2" menuAberto={menu} aoAlternarMenu={() => setMenu(!menu)} />
//   <MenuLateral itens={itens} aberto={menu} aoFechar={() => setMenu(false)} />
//   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>...</main>

import { CircleHelp, Menu, X, type LucideIcon } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { createContext, useContext, type ReactNode } from "react";

import { BotaoDoTema } from "../tema/tema";
import type { LinkDoMenu } from "./menu-lateral";

/** A altura do cabeçalho, em px (o `--topo-altura` do Lastro), igual no celular. */
export const ALTURA_DO_CABECALHO = 56;

/** O recuo do conteúdo sob o cabeçalho fixo: vai no `main` da casca, junto do `RECUO_DO_MENU`. */
export const RECUO_DO_CABECALHO = "pt-14";

// Diz ao `BotaoDeBusca` que está no cabeçalho.
const NoCabecalho = createContext(false);
/** `true` dentro do `CabecalhoDoApp`. */
export const useNoCabecalho = () => useContext(NoCabecalho);

/** Um item do menu do usuário (Minha conta, Novidades, Suporte): leva ao `href` ou chama `aoClicar`. */
export type ItemDoUsuario = {
  rotulo: string;
  icone: LucideIcon;
  href?: string;
  aoClicar?: () => void;
  /** O número à direita (as novidades não lidas); 0 ou vazio esconde. */
  contagem?: number;
};

const LinkPadrao: LinkDoMenu = ({ href, children, ...resto }) => (
  <a href={href} {...resto}>
    {children}
  </a>
);

/** As props do `CabecalhoDoApp`. */
export type PropsDoCabecalho = {
  /** As iniciais do produto (BOD), no quadrado azul da marca; sem ela, as iniciais do `nome`. */
  sigla?: string;
  /** O nome do produto, ao lado do quadrado; até 960px fica só o quadrado. */
  nome: string;
  hrefDaMarca?: string;
  aoClicarNaMarca?: () => void;
  /** Ao lado da marca: a empresa e o seletor do app. O texto solto vai em negrito; o seletor do app é o botão dele com
   * `className="btn btn-secondary topo-contexto"`, o nome em `<b>` e a linha de apoio em `<small>`. */
  contexto?: ReactNode;
  /** O `BotaoDeBusca`. */
  busca?: ReactNode;
  /** O `Sino`. */
  sino?: ReactNode;
  /** O botão de ajuda leva ao `hrefDaAjuda` ou chama `aoAjudar`; sem os dois, não aparece. */
  hrefDaAjuda?: string;
  aoAjudar?: () => void;
  /** O usuário do canto: as iniciais saem do nome (a primeira e a última palavra); o papel vai embaixo do nome e o
   * e-mail, no alto do menu. */
  usuario: { nome: string; papel?: string; email?: string };
  /** Os itens do menu do usuário, acima do Sair. */
  itensDoUsuario?: ItemDoUsuario[];
  aoSair: () => void;
  /** A versão no pé do menu do usuário; com `hrefDaVersao`, leva às novidades. */
  versao?: string;
  hrefDaVersao?: string;
  /** O ☰ da gaveta do `MenuLateral`, que aparece até 960px (onde a lateral vira gaveta). */
  menuAberto?: boolean;
  aoAlternarMenu?: () => void;
  Link?: LinkDoMenu;
};

/** O cabeçalho fixo do app: marca, contexto e busca à esquerda; avisos, tema, ajuda e usuário à direita. */
export function CabecalhoDoApp(props: PropsDoCabecalho) {
  const { contexto, busca, sino, hrefDaAjuda, aoAjudar, menuAberto, aoAlternarMenu } = props;
  const Link = props.Link ?? LinkPadrao;

  return (
    <NoCabecalho.Provider value>
      <header className="topo fixed inset-x-0 top-0 z-40 h-14">
        {aoAlternarMenu && (
          <button
            type="button"
            onClick={aoAlternarMenu}
            aria-label={menuAberto ? "Fechar o menu" : "Abrir o menu"}
            aria-expanded={!!menuAberto}
            className="btn btn-icon topo-menu"
          >
            {menuAberto ? <X className="icone" aria-hidden /> : <Menu className="icone" aria-hidden />}
          </button>
        )}
        <Marca {...props} Link={Link} />
        {contexto &&
          (typeof contexto === "string" ? (
            <span className="topo-contexto flex items-center">
              <b className="block min-w-0 truncate">{contexto}</b>
            </span>
          ) : (
            <div className="flex min-w-0 shrink items-center">{contexto}</div>
          ))}
        {/* a `.busca` leva a margem automática que joga o resto à direita; sem ela, o vão faz isso */}
        {busca ?? <span aria-hidden className="flex-1" />}
        {sino}
        <BotaoDoTema className="tema-botao" />
        {hrefDaAjuda ? (
          <Link href={hrefDaAjuda} title="Ajuda" className="btn btn-icon">
            <CircleHelp className="icone" aria-hidden />
          </Link>
        ) : (
          aoAjudar && (
            <button type="button" onClick={aoAjudar} title="Ajuda" aria-label="Ajuda" className="btn btn-icon">
              <CircleHelp className="icone" aria-hidden />
            </button>
          )
        )}
        <MenuDoUsuario {...props} Link={Link} />
      </header>
    </NoCabecalho.Provider>
  );
}

/** A marca (`.topo-marca`): o quadrado azul com a sigla e o nome do produto. */
function Marca({ sigla, nome, hrefDaMarca, aoClicarNaMarca, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  const desenho = (
    <>
      <i aria-hidden>{sigla ?? iniciais(nome)}</i>
      <span className="min-w-0 truncate">{nome}</span>
    </>
  );
  if (hrefDaMarca)
    return (
      <Link href={hrefDaMarca} title={nome} className="topo-marca hover:no-underline">
        {desenho}
      </Link>
    );
  if (aoClicarNaMarca)
    return (
      <button
        type="button"
        onClick={aoClicarNaMarca}
        title={nome}
        className="topo-marca cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        {desenho}
      </button>
    );
  return (
    <span title={nome} className="topo-marca">
      {desenho}
    </span>
  );
}

/** As iniciais do nome: a primeira letra da primeira e da última palavra (Rafael Gustavo Dal Bosco, RB). */
function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes.at(0)?.charAt(0) ?? "";
  const ultima = partes.length > 1 ? (partes.at(-1)?.charAt(0) ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

// O item do `.flutuante` também acende pelo teclado (o `data-highlighted` do Radix).
const ITEM = "flut-item cursor-pointer outline-none select-none data-[highlighted]:bg-hover";

/** O usuário do canto (`.topo-usuario`: as iniciais no círculo, o nome e o papel) e o menu dele no `.flutuante`: os
 * itens do app e, no pé, a versão e o Sair. */
function MenuDoUsuario({ usuario, itensDoUsuario, aoSair, versao, hrefDaVersao, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  return (
    <DropdownMenu.Root modal={false}>
      {/* o botão perde a borda e o recuo do navegador; fica só o fio da esquerda do `.topo-usuario` */}
      <DropdownMenu.Trigger
        aria-label={`Menu de ${usuario.nome}`}
        className="topo-usuario cursor-pointer border-y-0 border-r-0 bg-transparent py-0 pr-0 text-left text-texto"
      >
        <i aria-hidden>{iniciais(usuario.nome)}</i>
        <span>
          <b>{usuario.nome}</b>
          {usuario.papel && (
            <>
              <br />
              <small>{usuario.papel}</small>
            </>
          )}
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {/* o Radix já posiciona: o `.flutuante` perde o `fixed` dele */}
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="flutuante static z-50 w-[240px] max-w-[calc(100vw-16px)] outline-none"
        >
          {usuario.email && (
            <div className="truncate border-b border-borda px-2 pt-1.5 pb-2.5 text-apoio text-texto-apoio">{usuario.email}</div>
          )}
          {itensDoUsuario?.map((item) => {
            const Icone = item.icone;
            const miolo = (
              <>
                <i aria-hidden>
                  <Icone className="icone mx-auto" />
                </i>
                <span className="flex min-w-0 items-center gap-2">
                  <b className="min-w-0 flex-1 truncate">{item.rotulo}</b>
                  {!!item.contagem && <span className="numero text-apoio text-texto-apoio">{item.contagem}</span>}
                </span>
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
          <div className="flut-rodape">
            {versao && hrefDaVersao ? (
              <DropdownMenu.Item
                asChild
                className="numero cursor-pointer rounded-p text-texto-apoio outline-none data-[highlighted]:text-acao-texto"
              >
                <Link href={hrefDaVersao}>{versao}</Link>
              </DropdownMenu.Item>
            ) : (
              <span className="numero text-texto-apoio">{versao}</span>
            )}
            <DropdownMenu.Item onSelect={aoSair} className="btn btn-ghost outline-none data-[highlighted]:bg-acao-100">
              Sair
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
