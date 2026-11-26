"use client";

// O cabeçalho do app (`.topo`): 68px, no chão (sem vidro nem fio), preso no alto à direita da lateral (começa na
// `--coluna-lateral`, que acompanha a lateral aberta ou recolhida). Da esquerda para a direita: o ☰ da gaveta (só
// até 960px, para quem passa `aoAlternarMenu`), a marca (o quadrado `--marca` com a sigla e o nome), o `contexto`
// do app e a `busca` (o `BotaoDeBusca`) em superfícies brancas de 48px, o `sino`, a ajuda, o tema e o usuário num
// círculo em tinta, com o menu de vidro. A marca do cabeçalho some acima de 960px quando a lateral leva a dela (o `nome` do `MenuLateral`); sem
// lateral ou com a lateral sem marca, ela fica. Ao estreitar, o cabeçalho nunca rola de lado: a busca encolhe e os
// itens somem pelas regras do `casca.css` (a linha de apoio do contexto e a tecla da busca, o texto da busca, o nome
// do produto até 960px, o tema no celular). O kit só dá os lugares: o que vai em cada um chega por prop. Na casca:
//
//   const [menu, setMenu] = useState(false);
//   <CabecalhoDoApp sigla="BP" nome="Beyond Payments" contexto={<SeletorDeEmpresa />}
//     busca={<BotaoDeBusca aoBuscar={abrirPaleta} />} sino={<Sino ... />} usuario={{ nome, papel }}
//     itensDoUsuario={[...]} aoSair={sair} versao="v1.14.2" menuAberto={menu} aoAlternarMenu={() => setMenu(!menu)} />
//   <MenuLateral sigla="BP" nome="Beyond Payments" hrefDaMarca="/" itens={itens} aberto={menu} aoFechar={() => setMenu(false)} />
//   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>...</main>

import { CircleHelp, Menu, X, type LucideIcon } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { createContext, useContext, type ReactNode } from "react";

import { BotaoDoTema } from "../tema/tema";
import type { LinkDoMenu } from "./menu-lateral";

/** A altura do cabeçalho, em px (o `--topo-altura`), igual no celular. */
export const ALTURA_DO_CABECALHO = 68;

/** O recuo do conteúdo sob o cabeçalho fixo (o `--topo-altura`): vai no `main` da casca, junto do `RECUO_DO_MENU`. */
export const RECUO_DO_CABECALHO = "pt-[var(--topo-altura)]";

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
  /** As iniciais do produto (BOD), no quadrado da marca; sem ela, as iniciais do `nome`. */
  sigla?: string;
  /** O nome do produto, ao lado do quadrado; até 960px fica só o quadrado. Acima de 960px a marca do cabeçalho só
   * aparece quando a lateral não leva a dela. */
  nome: string;
  hrefDaMarca?: string;
  aoClicarNaMarca?: () => void;
  /** Depois da marca: a empresa e o seletor do app. O texto solto vai em negrito, no botão claro; o seletor do app é o
   * botão dele com `className="topo-contexto"`, o nome em `<b>` e a linha de apoio em `<small>`. */
  contexto?: ReactNode;
  /** O `BotaoDeBusca`. */
  busca?: ReactNode;
  /** O `Sino`. */
  sino?: ReactNode;
  /** O botão de ajuda leva ao `hrefDaAjuda` ou chama `aoAjudar`; sem os dois, não aparece. */
  hrefDaAjuda?: string;
  aoAjudar?: () => void;
  /** O usuário do canto: o avatar com as iniciais (a primeira e a última palavra do nome), o nome na dica; no alto do
   * menu, o nome, o papel e o e-mail. */
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

/** O cabeçalho do app: marca, contexto e busca à esquerda; avisos, ajuda, tema e usuário à direita. */
export function CabecalhoDoApp(props: PropsDoCabecalho) {
  const { contexto, busca, sino, hrefDaAjuda, aoAjudar, menuAberto, aoAlternarMenu } = props;
  const Link = props.Link ?? LinkPadrao;

  return (
    <NoCabecalho.Provider value>
      <header className="topo">
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
            <span className="topo-contexto">
              <b className="block min-w-0 truncate">{contexto}</b>
            </span>
          ) : (
            <div className="flex min-w-0 shrink items-center gap-2">{contexto}</div>
          ))}
        {/* a `.busca` leva a margem automática que joga o resto à direita; sem ela, o vão faz isso */}
        {busca ?? <span aria-hidden className="flex-1" />}
        {sino}
        {hrefDaAjuda ? (
          <Link href={hrefDaAjuda} title="Ajuda" className="btn btn-icon">
            <CircleHelp className="icone" aria-hidden />
          </Link>
        ) : (
          aoAjudar && (
            <button type="button" onClick={aoAjudar} aria-label="Ajuda" data-hint="Ajuda" className="btn btn-icon">
              <CircleHelp className="icone" aria-hidden />
            </button>
          )
        )}
        <BotaoDoTema className="tema-botao" />
        <MenuDoUsuario {...props} Link={Link} />
      </header>
    </NoCabecalho.Provider>
  );
}

/** A marca (`.topo-marca`): o quadrado com a sigla (o `--marca`, que a camada do produto troca; o azul por padrão) e o
 * nome do produto. */
function Marca({ sigla, nome, hrefDaMarca, aoClicarNaMarca, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  const desenho = (
    <>
      <i aria-hidden>{sigla ?? iniciais(nome)}</i>
      <span className="min-w-0 truncate">{nome}</span>
    </>
  );
  if (hrefDaMarca)
    return (
      <Link href={hrefDaMarca} title={nome} className="topo-marca">
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

// O item do menu acende pelo cursor e pelo teclado (o `data-highlighted` do Radix, desenhado no `casca.css`).
const ITEM = "flut-item cursor-pointer outline-none select-none";

/** O usuário do canto (`.topo-usuario`: o círculo em tinta com as iniciais, o nome na dica) e o menu dele no flutuante de
 * vidro (`.topo-flutuante`): o nome, o papel e o e-mail no alto, os itens do app e, no pé, a versão e o Sair. */
function MenuDoUsuario({ usuario, itensDoUsuario, aoSair, versao, hrefDaVersao, Link }: PropsDoCabecalho & { Link: LinkDoMenu }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger aria-label={`Menu de ${usuario.nome}`} data-hint={usuario.nome} className="topo-usuario">
        {iniciais(usuario.nome)}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {/* o Radix já posiciona: o `.flutuante` perde o `fixed` dele */}
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="flutuante topo-flutuante static z-50 w-[240px] max-w-[calc(100vw-16px)] outline-none"
        >
          <div className="flut-usuario">
            <b>{usuario.nome}</b>
            {usuario.papel && <small>{usuario.papel}</small>}
            {usuario.email && <small>{usuario.email}</small>}
          </div>
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
