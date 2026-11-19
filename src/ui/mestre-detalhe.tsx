"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem as emContagem } from "../lib/formato";

import { Botao } from "./botao";

// O `CarregarMais` e o `PaginasDaLista` sabem se a lista é a da caixa própria (solta na tela) ou a do `Bloco` em
// volta (`emCaixa`).
const EmCaixa = createContext(false);

/** A lista à esquerda, o detalhe do escolhido à direita (o padrão de toda lista). Solto na tela, a lista vem numa
 * caixa, em linhas separadas pelo fio, e o detalhe ao lado no `.painel` do Lastro (a sombra média sobre a lista);
 * abaixo de `lg`, um embaixo do outro. Com `aoVoltar`, abaixo de `lg` mostra um dos dois: a lista, ou o detalhe aberto com
 * o "← Voltar" no alto, que devolve à lista com a mesma seleção e os mesmos filtros (a lista não desmonta). Com
 * `emCaixa` é o master/detail do modal de ficha: dentro de um `Bloco`, a lista com o fio à direita e o detalhe ao lado;
 * empilha no celular. */
export function MestreDetalhe({
  titulo,
  contagem,
  cabeca,
  lista,
  rodape,
  detalhe,
  largura = 360,
  embutido = false,
  emCaixa = false,
  aberto,
  aoVoltar,
  rotuloDoVoltar = "Voltar à lista",
  className,
}: {
  /** O título da lista, com a `contagem` à direita; a `cabeca` (busca, filtros) vem embaixo. */
  titulo?: ReactNode;
  contagem?: number | null;
  cabeca?: ReactNode;
  lista: ReactNode;
  rodape?: ReactNode;
  detalhe: ReactNode;
  largura?: number;
  /** O detalhe sem o painel em volta: quando o detalhe monta os blocos dele (o cabeçalho, as abas e as informações
   * soltos). */
  embutido?: boolean;
  /** Dentro de um `Bloco` (o modal de ficha): a lista sem caixa própria, com o fio à direita, e o detalhe com o
   * respiro dele. */
  emCaixa?: boolean;
  /** Com `aoVoltar`: há um registro aberto no detalhe (abaixo de `lg`, o detalhe toma o lugar da lista). */
  aberto?: boolean;
  /** Liga o caminho de volta do celular e da tela estreita: o "← Voltar" sobre o detalhe, que fecha o registro. */
  aoVoltar?: () => void;
  rotuloDoVoltar?: string;
  className?: string;
}) {
  // um dos dois abaixo de `lg`, quando o app dá o caminho de volta
  const soUm = !!aoVoltar && !emCaixa;
  const escondeLista = soUm && aberto ? "max-lg:hidden" : undefined;
  const escondeDetalhe = soUm && !aberto ? "max-lg:hidden" : undefined;
  const voltar = soUm && aberto && (
    <div className="lg:hidden">
      <Botao tipo="fantasma" onClick={aoVoltar}>
        <ArrowLeft aria-hidden className="size-4" /> {rotuloDoVoltar}
      </Botao>
    </div>
  );
  const estilo = { "--largura-da-lista": `${largura}px` } as CSSProperties;
  const alto = (titulo || contagem != null) && (
    <div className={cn("flex items-baseline justify-between gap-3", emCaixa && "px-4 pt-4 pb-2")}>
      <h2 className="card-title m-0 text-texto">{titulo}</h2>
      {contagem != null && <span className="numero text-apoio text-texto-apoio">{emContagem(contagem)}</span>}
    </div>
  );

  // O provider envolve só a coluna da lista: o que o detalhe usa (um `CarregarMais`, uma paginação) se desenha como
  // no resto do app.
  return emCaixa ? (
    // o fio no alto separa a lista das abas do `Bloco`; some quando o master/detail é o primeiro da caixa
    <div
      className={cn("grid grid-cols-1 border-t border-borda first:border-t-0 mesa:grid-cols-[var(--largura-da-lista)_minmax(0,1fr)]", className)}
      style={estilo}
    >
      <EmCaixa.Provider value>
        <div className="flex min-h-0 min-w-0 flex-col border-borda celular:border-b mesa:border-r">
          {alto}
          {cabeca && <div className="flex flex-col gap-3 px-4 py-3">{cabeca}</div>}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{lista}</div>
          {rodape}
        </div>
      </EmCaixa.Provider>
      <div className="min-h-0 min-w-0 overflow-y-auto px-[22px] pt-[18px] pb-5 celular:px-3.5 celular:py-4">{detalhe}</div>
    </div>
  ) : (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-[var(--largura-da-lista)_minmax(0,1fr)]", className)} style={estilo}>
      <EmCaixa.Provider value={false}>
        <div className={cn("flex min-h-0 min-w-0 flex-col gap-3", escondeLista)}>
          {alto}
          {cabeca && <div className="flex flex-col gap-3">{cabeca}</div>}
          <div className="min-h-0 flex-1 overflow-y-auto rounded-g border border-borda bg-ficha shadow-p">
            <div className="flex flex-col">{lista}</div>
          </div>
          {rodape}
        </div>
      </EmCaixa.Provider>
      {embutido ? (
        // os filhos não encolhem: o detalhe maior que a altura rola, em vez de cortar o que tem overflow-hidden
        <div className={cn("flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto *:shrink-0", escondeDetalhe)}>
          {voltar}
          {detalhe}
        </div>
      ) : (
        // o `.painel` sem o respiro dele (o detalhe traz o seu), com a borda inteira e o raio da caixa
        <div className={cn("flex min-h-0 min-w-0 flex-col gap-2", escondeDetalhe)}>
          {voltar}
          <div className="painel min-h-0 min-w-0 flex-1 gap-0 overflow-y-auto rounded-g border border-borda p-0 *:shrink-0">{detalhe}</div>
        </div>
      )}
    </div>
  );
}

/** Um item da lista do master/detail: uma linha separada pelo fio; o escolhido fica em azul claro, com o fio azul à
 * esquerda (como a linha selecionada da tabela). Com `href` vira `<a>`; com `asChild`, o filho único (o `Link` do
 * roteador) leva o visual. `em="linha"` põe o conteúdo lado a lado (ícone, texto, seta). */
export function ItemDaLista({
  ativo,
  aoEscolher,
  href,
  asChild,
  em = "coluna",
  children,
}: {
  ativo: boolean;
  aoEscolher?: () => void;
  href?: string;
  asChild?: boolean;
  em?: "coluna" | "linha";
  children: ReactNode;
}) {
  const comum = {
    onClick: aoEscolher,
    "aria-current": ativo || undefined,
    className: cn(
      // o que não quebra nem trunca é cortado na borda do item, em vez de vazar
      "flex w-full shrink-0 cursor-pointer overflow-hidden border-b border-borda-suave px-4 py-[9px] text-left text-base text-texto no-underline transition-colors last:border-b-0 hover:no-underline focus-visible:-outline-offset-2",
      em === "linha" ? "flex-row items-center gap-3" : "flex-col gap-0.5",
      ativo ? "bg-acao-100 shadow-[inset_2px_0_0_var(--acao)]" : "hover:bg-hover",
    ),
  };
  if (asChild) return <Slot.Root {...comum}>{children}</Slot.Root>;
  if (href)
    return (
      <a href={href} {...comum}>
        {children}
      </a>
    );
  return (
    <button type="button" {...comum}>
      {children}
    </button>
  );
}

/** O título de um grupo entre os itens da lista (o CFOP, o mês), na faixa da mesa, com o valor opcional à direita. */
export function GrupoDaLista({ titulo, valor }: { titulo: ReactNode; valor?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-borda-suave bg-mesa px-4 py-1.5">
      <span className="text-apoio font-medio text-texto-secundario">{titulo}</span>
      {valor != null && <span className="numero text-apoio text-texto-apoio">{valor}</span>}
    </div>
  );
}

/** O "Carregar mais" da lista que vem aos pedaços (some quando não há mais); `emBloco` põe o fio em cima, para o pé
 * de um `Bloco` ou de uma tabela. */
export function CarregarMais({
  temMais,
  carregando,
  aoCarregar,
  emBloco,
  rotulo = "Carregar mais",
}: {
  temMais: boolean;
  carregando?: boolean;
  aoCarregar: () => void;
  emBloco?: boolean;
  rotulo?: ReactNode;
}) {
  const emCaixa = useContext(EmCaixa);
  if (!temMais) return null;
  return (
    <div
      className={cn(
        "flex",
        emCaixa ? "justify-start p-2" : "justify-center",
        emBloco ? "border-t border-borda-suave p-3" : !emCaixa && "pt-4",
      )}
    >
      <Botao tipo="fantasma" tamanho="sm" carregando={carregando} onClick={aoCarregar}>
        {rotulo}
      </Botao>
    </div>
  );
}

// As páginas que aparecem: a primeira, a última e a vizinhança da atual; null é a reticência.
function janelaDePaginas(atual: number, paginas: number): Array<number | null> {
  if (paginas <= 7) return Array.from({ length: paginas }, (_, i) => i + 1);
  const de = Math.max(2, Math.min(atual - 1, paginas - 2));
  const ate = Math.min(paginas - 1, Math.max(atual + 1, 3));
  const janela: Array<number | null> = [1];
  if (de > 2) janela.push(null);
  for (let p = de; p <= ate; p++) janela.push(p);
  if (ate < paginas - 1) janela.push(null);
  janela.push(paginas);
  return janela;
}

// Os botões da paginação são o `.btn-ghost`, em cinza; só a página atual leva a cor da seleção.
const BOTAO_DE_PAGINA = "btn btn-ghost numero h-8 min-w-8 px-1.5 text-texto-secundario [&_svg]:size-4";

const PAGINA_ATUAL = "bg-acao-100 font-forte text-acao-800 hover:bg-acao-100";

/**
 * A paginação no pé da caixa (a página vem do servidor), discreta: "1–25 de 342", as setas e as páginas no
 * `.btn-ghost`, com a atual em azul claro, e o "Por página" quando vêm os `tamanhos` e o `aoMudarTamanho`. `compacta`
 * mostra só a atual entre as setas (a lista estreita; no celular é sempre assim). Some quando tudo cabe numa página.
 */
export function Paginacao({
  page,
  page_size,
  total,
  aoMudar,
  tamanhos,
  aoMudarTamanho,
  compacta,
  rotulo = "Paginação",
  rotuloDe = "de",
  rotuloPorPagina = "Por página",
  rotuloAnterior = "Página anterior",
  rotuloProxima = "Próxima página",
  className,
}: {
  page: number;
  page_size: number;
  total: number;
  aoMudar: (page: number) => void;
  /** As opções do "Por página" (25, 50, 100). */
  tamanhos?: number[];
  aoMudarTamanho?: (page_size: number) => void;
  compacta?: boolean;
  rotulo?: string;
  rotuloDe?: ReactNode;
  rotuloPorPagina?: ReactNode;
  rotuloAnterior?: string;
  rotuloProxima?: string;
  className?: string;
}) {
  const porPagina = tamanhos && aoMudarTamanho ? tamanhos : undefined;
  // com o "Por página", a paginação só some quando tudo cabe no menor tamanho: senão não haveria como voltar dele
  if (total <= Math.min(page_size, ...(porPagina ?? []))) return null;
  const paginas = Math.ceil(total / page_size);

  return (
    <nav
      aria-label={rotulo}
      className={cn("flex flex-wrap items-center gap-1 border-t border-borda-suave px-[18px] py-2 text-apoio text-texto-apoio", className)}
    >
      <span className="numero mr-2">
        {emContagem((page - 1) * page_size + 1)}–{emContagem(Math.min(page * page_size, total))} {rotuloDe} {emContagem(total)}
      </span>
      <button type="button" aria-label={rotuloAnterior} disabled={page <= 1} onClick={() => aoMudar(page - 1)} className={BOTAO_DE_PAGINA}>
        <ChevronLeft />
      </button>
      {compacta ? (
        <span aria-current="page" className={cn(BOTAO_DE_PAGINA, PAGINA_ATUAL, "cursor-default")}>
          {emContagem(page)}
        </span>
      ) : (
        janelaDePaginas(page, paginas).map((p, i) =>
          p === null ? (
            <span key={`reticencia-${i}`} aria-hidden className="px-0.5 celular:hidden">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => aoMudar(p)}
              className={cn(BOTAO_DE_PAGINA, p === page ? PAGINA_ATUAL : "celular:hidden")}
            >
              {emContagem(p)}
            </button>
          ),
        )
      )}
      <button type="button" aria-label={rotuloProxima} disabled={page >= paginas} onClick={() => aoMudar(page + 1)} className={BOTAO_DE_PAGINA}>
        <ChevronRight />
      </button>
      {porPagina && aoMudarTamanho && (
        <label className="ml-auto flex items-center gap-2">
          {rotuloPorPagina}
          <select
            value={page_size}
            onChange={(e) => aoMudarTamanho(Number(e.target.value))}
            className="input numero h-8 min-h-0 w-auto cursor-pointer px-2 py-0"
          >
            {porPagina.map((tamanho) => (
              <option key={tamanho} value={tamanho}>
                {tamanho}
              </option>
            ))}
          </select>
        </label>
      )}
    </nav>
  );
}

/** A paginação no pé da lista do master/detail: a `Paginacao` compacta, que cabe na coluna da lista. */
export function PaginasDaLista({
  page,
  page_size,
  total,
  aoMudar,
}: {
  page: number;
  page_size: number;
  total: number;
  aoMudar: (p: number) => void;
}) {
  const emCaixa = useContext(EmCaixa);
  return (
    <Paginacao
      compacta
      page={page}
      page_size={page_size}
      total={total}
      aoMudar={aoMudar}
      // solta na tela, a paginação fica sob a caixa da lista: sem o fio e sem o respiro dela
      className={emCaixa ? undefined : "border-t-0 px-1 py-0"}
    />
  );
}
