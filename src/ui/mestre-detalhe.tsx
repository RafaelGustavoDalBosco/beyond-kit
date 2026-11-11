"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slot } from "radix-ui";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem as emContagem } from "../lib/formato";

import { Botao } from "./botao";

// O `ItemDaLista`, o `GrupoDaLista`, o `CarregarMais` e o `PaginasDaLista` sabem se a lista é de cartões soltos ou
// de linhas dentro de uma caixa.
const EmCaixa = createContext(false);

/** A lista à esquerda, o detalhe do escolhido à direita (o padrão de toda lista). Solto na tela, cada item é um
 * cartão e o detalhe vem num bloco; abaixo de `lg`, um embaixo do outro. Com `emCaixa` é o master/detail do modal
 * de ficha: dentro de um `Bloco`, a lista em linhas separadas pelo fio e o detalhe ao lado; empilha no celular. */
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
  /** O detalhe sem o bloco em volta: quando o detalhe monta os blocos dele (o cabeçalho, as abas e as informações
   * soltos). */
  embutido?: boolean;
  /** Dentro de um `Bloco` (o modal de ficha): sem cartões, a lista em linhas com o fio à direita e o detalhe com o
   * respiro dele. */
  emCaixa?: boolean;
  className?: string;
}) {
  const estilo = { "--largura-da-lista": `${largura}px` } as CSSProperties;
  const alto = (titulo || contagem != null) && (
    <div className={cn("flex items-baseline justify-between gap-3", emCaixa && "px-4 pt-4 pb-2")}>
      <h2 className="m-0 text-base font-extrabold text-texto">{titulo}</h2>
      {contagem != null && <span className="numero text-[13px] font-bold text-texto-2">{emContagem(contagem)}</span>}
    </div>
  );

  // O provider envolve só a coluna da lista: o que o detalhe usa (um `CarregarMais`, uma paginação) se desenha como
  // no resto do app.
  return emCaixa ? (
    // o fio no alto separa a lista das abas do `Bloco`; some quando o master/detail é o primeiro da caixa
    <div
      className={cn("grid grid-cols-1 border-t border-fio first:border-t-0 mesa:grid-cols-[var(--largura-da-lista)_minmax(0,1fr)]", className)}
      style={estilo}
    >
      <EmCaixa.Provider value>
        <div className="flex min-h-0 min-w-0 flex-col border-fio celular:border-b mesa:border-r">
          {alto}
          {cabeca && <div className="flex flex-col gap-3 px-4 py-3">{cabeca}</div>}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{lista}</div>
          {rodape}
        </div>
      </EmCaixa.Provider>
      <div className="min-h-0 min-w-0 overflow-y-auto px-5 pt-[18px] pb-5 celular:px-3.5 celular:py-4">{detalhe}</div>
    </div>
  ) : (
    <div className={cn("grid grid-cols-1 gap-5 lg:grid-cols-[var(--largura-da-lista)_minmax(0,1fr)]", className)} style={estilo}>
      <EmCaixa.Provider value={false}>
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          {alto}
          {cabeca && <div className="flex flex-col gap-3">{cabeca}</div>}
          {/* o respiro de 4px deixa o contorno do cartão sob o mouse aparecer inteiro na rolagem */}
          <div className="-m-1 min-h-0 flex-1 overflow-y-auto p-1">
            <div className="flex flex-col gap-2">{lista}</div>
          </div>
          {rodape}
        </div>
      </EmCaixa.Provider>
      {embutido ? (
        // os filhos não encolhem: o detalhe maior que a altura rola, em vez de cortar o que tem overflow-hidden
        <div className="flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto *:shrink-0">{detalhe}</div>
      ) : (
        <div className="min-h-0 min-w-0 overflow-y-auto rounded-bloco bg-superficie shadow-1">{detalhe}</div>
      )}
    </div>
  );
}

/** Um item da lista do master/detail: um cartão (uma linha, dentro do `MestreDetalhe emCaixa`); o escolhido fica em
 * azul claro, com a barra azul à esquerda. Com `href` vira `<a>`; com `asChild`, o filho único (o `Link` do roteador)
 * leva o visual. `em="linha"` põe o conteúdo lado a lado (ícone, texto, seta). */
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
  const emCaixa = useContext(EmCaixa);
  const comum = {
    onClick: aoEscolher,
    "aria-current": ativo || undefined,
    className: cn(
      // o que não quebra nem trunca é cortado na borda do item, em vez de vazar
      "flex w-full shrink-0 cursor-pointer overflow-hidden px-4 py-3 text-left",
      em === "linha" ? "flex-row items-center gap-3" : emCaixa ? "flex-col gap-0.5" : "flex-col gap-1.5",
      emCaixa
        ? cn(
            "border-b border-fio transition-colors focus-visible:-outline-offset-2",
            ativo ? "barra-escolhida bg-cobalto-suave" : "hover:bg-zebra",
          )
        : cn(
            "rounded-cartao transition-[background,box-shadow]",
            // a barra é uma sombra de dentro: o escolhido fica sem a sombra do cartão, que a apagaria
            ativo ? "barra-escolhida bg-cobalto-suave" : "bg-superficie shadow-1 hover:ring-2 hover:ring-cobalto-anel",
          ),
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

/** O título de um grupo entre os itens da lista (o CFOP, o mês), com o valor opcional à direita. */
export function GrupoDaLista({ titulo, valor }: { titulo: ReactNode; valor?: ReactNode }) {
  const emCaixa = useContext(EmCaixa);
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3",
        emCaixa ? "border-b border-fio bg-cabeca-tabela px-4 py-2" : "px-1 pt-3 first:pt-0",
      )}
    >
      <span className="text-[13px] font-extrabold text-neutro">{titulo}</span>
      {valor != null && <span className="numero text-[13px] font-bold text-texto-2">{valor}</span>}
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
        emBloco ? "border-t border-fio p-3" : !emCaixa && "pt-4",
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

const BOTAO_DE_PAGINA =
  "numero grid h-8 min-w-8 shrink-0 cursor-pointer place-items-center rounded-full px-1 font-extrabold text-texto transition-colors hover:bg-superficie-2 disabled:cursor-default disabled:text-texto-3 disabled:hover:bg-transparent [&_svg]:size-4";

const PAGINA_ATUAL = "bg-cobalto text-sobre-cobalto hover:bg-cobalto";

/**
 * A paginação no pé da caixa (a página vem do servidor): "1–25 de 342", as páginas em círculo, com a atual em azul
 * cheio, e o "Por página" quando vêm os `tamanhos` e o `aoMudarTamanho`. `compacta` mostra só a atual entre as setas
 * (a lista estreita; no celular é sempre assim). Some quando tudo cabe numa página.
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
      className={cn("flex flex-wrap items-center gap-1.5 border-t border-fio px-4 py-3 text-[13px] font-bold text-texto-2", className)}
    >
      <span className="numero mr-3">
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
            className="numero h-8 cursor-pointer rounded-controle border-[1.5px] border-linha bg-superficie px-2 font-bold text-texto outline-none transition-[border,box-shadow] focus:border-cobalto focus:ring-3 focus:ring-cobalto-anel"
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
      // sob os cartões soltos não há caixa: sem o fio e sem o respiro dela
      className={emCaixa ? undefined : "border-t-0 px-1 py-0"}
    />
  );
}
