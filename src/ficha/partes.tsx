"use client";

import { Check, Copy, type LucideIcon } from "lucide-react";
import { Children, createContext, Fragment, isValidElement, useContext, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Bloco } from "../ui/bloco";
import { Dica, type ConteudoDaDica } from "../ui/dica";
import { Emblema, type TomDoEmblema } from "../ui/emblema";

/** O alto da ficha, em branco: o ícone do tipo num quadrado colorido, a linha de cima, o título em frase, os selos e
 * os códigos; à direita, o número principal e as ações. Com o corpo da ficha depois dele, leva um fio embaixo e 18px
 * de respiro até o corpo; sozinho (o cabeçalho num `Bloco`), nem um nem outro. */
export function CabecaDaFicha({
  icone,
  tom = "cobalto",
  tipo,
  sobretitulo,
  titulo,
  selos,
  codigos,
  numero,
  rotuloDoNumero,
  acoes,
}: {
  icone: LucideIcon;
  /** A cor do ícone, pelo significado (a entrada em verde-água, a saída em azul). */
  tom?: TomDoEmblema;
  /** O que a ficha é ("Produto"): a linha de cima do título quando não há `sobretitulo`. */
  tipo?: ReactNode;
  /** A linha de cima do título ("NF-e 1284 · série 1 · 10/11"); no lugar do `tipo`. */
  sobretitulo?: ReactNode;
  titulo: ReactNode;
  selos?: ReactNode;
  codigos?: ReactNode;
  /** O número principal da ficha, à direita, com o `rotuloDoNumero` embaixo. */
  numero?: ReactNode;
  rotuloDoNumero?: ReactNode;
  /** Os botões da ficha, à direita do título (depois do número). */
  acoes?: ReactNode;
}) {
  const linhaDeCima = sobretitulo ?? tipo;
  return (
    <div className="flex items-center gap-4 border-linha bg-superficie px-[22px] py-[18px] not-last:mb-[18px] not-last:border-b celular:flex-wrap celular:gap-3 celular:px-3.5 celular:py-4">
      <Emblema icone={icone} tom={tom} forma="quadrado" tamanho="lg" className="celular:size-11" />
      <div className="min-w-0 flex-1">
        {linhaDeCima && <div className="flex items-center gap-2 text-[13px] font-bold text-texto-2">{linhaDeCima}</div>}
        <h2 className="m-0 text-[21px] leading-tight font-extrabold tracking-[-0.01em] [overflow-wrap:anywhere] celular:text-lg">{titulo}</h2>
        {selos && <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{selos}</div>}
        {codigos && <div className="mt-2 flex flex-wrap items-center gap-1.5">{codigos}</div>}
      </div>
      {(numero != null || acoes) && (
        <div className="flex shrink-0 items-center gap-4 text-right celular:w-full celular:justify-between celular:text-left">
          {numero != null && (
            <div className="min-w-0">
              <div className="numero text-[26px] leading-tight font-extrabold tracking-[-0.02em] celular:text-[22px]">{numero}</div>
              {rotuloDoNumero && <div className="text-[12.5px] font-bold text-texto-2">{rotuloDoNumero}</div>}
            </div>
          )}
          {acoes && <div className="flex flex-wrap items-center justify-end gap-2">{acoes}</div>}
        </div>
      )}
    </div>
  );
}

/** Um dado rápido da ficha: o rótulo em cima, o valor embaixo. */
export type DadoRapido = { rotulo: ReactNode; valor: ReactNode };

/** A linha de dados rápidos da ficha, logo abaixo do cabeçalho: até quatro mini cartões brancos lado a lado (dois por
 * linha no celular); o valor comprido corta com reticências. */
export function DadosRapidos({ itens, className }: { itens: DadoRapido[]; className?: string }) {
  return (
    <dl
      className={cn("m-0 grid grid-cols-2 gap-2 mesa:grid-cols-[repeat(var(--dados),minmax(0,1fr))] mesa:gap-2.5", className)}
      style={{ "--dados": Math.min(itens.length, 4) } as CSSProperties}
    >
      {itens.map((i, k) => (
        <div key={k} className="min-w-0 rounded-icone bg-superficie px-3.5 py-3 shadow-1">
          <dt className="text-[12.5px] font-bold text-texto-2">{i.rotulo}</dt>
          <dd className="numero m-0 mt-0.5 truncate text-base font-extrabold">{i.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Uma seção da ficha ou do detalhe: a caixa branca com o título em frase, os selos ao lado dele e a ação à direita
 * (o botão, o link em texto, o detalhe parado). `solto` tira a caixa, para a seção dentro de um `Bloco` que já existe. */
export function SecaoDaFicha({
  titulo,
  selos,
  acao,
  solto,
  className,
  children,
}: {
  titulo: ReactNode;
  selos?: ReactNode;
  acao?: ReactNode;
  /** Sem a caixa em volta (dentro de um `Bloco` que já existe). */
  solto?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cabeca = (
    <div className="flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1.5">
      <h3 className="m-0 text-base font-extrabold">{titulo}</h3>
      {selos}
      {/* o texto parado ("3 itens") fica neutro; o azul é só do link e do botão sem desenho próprio (o `Botao` e o
          link com classe ficam como vieram) */}
      {acao && (
        <div className="ml-auto flex items-center gap-2 text-[13px] font-semibold text-texto-2 [&_a:not([class])]:font-bold [&_a:not([class])]:text-cobalto [&_button:not([class])]:cursor-pointer [&_button:not([class])]:font-bold [&_button:not([class])]:text-cobalto">
          {acao}
        </div>
      )}
    </div>
  );
  if (solto)
    return (
      <section className={cn("flex flex-col gap-3", className)}>
        {cabeca}
        {children}
      </section>
    );
  return (
    <Bloco className={cn("flex flex-col gap-3 px-[18px] pt-3.5 pb-4", className)}>
      {cabeca}
      {children}
    </Bloco>
  );
}

/** Um código com o nome dele (NCM, CEST, EAN, CFOP…): a ficha técnica em linha, numa pílula cinza. `empilhado` põe o
 * nome em cima do valor, sem a pílula: vários códigos cabem no cabeçalho da ficha estreita (junte-os com
 * `gap-x-4 gap-y-2`). */
export function Codigo({
  nome,
  valor,
  copiavel,
  empilhado,
}: {
  nome: string;
  valor: ReactNode;
  copiavel?: string;
  empilhado?: boolean;
}) {
  const [ok, setOk] = useState(false);
  const copiar = copiavel && (
    <button
      type="button"
      aria-label="Copiar"
      onClick={() => {
        navigator.clipboard.writeText(copiavel);
        setOk(true);
        setTimeout(() => setOk(false), 1400);
      }}
      className={cn(
        "flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full text-cobalto hover:bg-cobalto-suave",
        !empilhado && "-ml-1",
      )}
    >
      {ok ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
  if (empilhado)
    return (
      <span className="inline-flex max-w-full min-w-0 flex-col">
        <span className="text-xs font-bold text-texto-2">{nome}</span>
        <span className="numero flex h-6 min-w-0 items-center gap-1 text-[13px] font-bold text-texto">
          <span className="min-w-0 truncate" title={copiavel}>{valor}</span>
          {copiar}
        </span>
      </span>
    );
  // O valor comprido (a chave da NF-e) corta com reticências; o nome e o copiar ficam sempre à vista.
  return (
    <span className="inline-flex h-7 max-w-full min-w-0 items-center gap-2 rounded-pilula bg-superficie-2 pr-1 pl-3 text-xs">
      <span className="shrink-0 font-semibold text-texto-2">{nome}</span>
      <span className="numero min-w-0 truncate pr-1.5 font-bold text-texto" title={copiavel}>{valor}</span>
      {copiar}
    </span>
  );
}

/** Um valor da `Faixa`; `apagado` é o zero (em texto-3, mais leve), para o número com valor saltar aos olhos. */
export type ItemDaFaixa = { rotulo: ReactNode; valor: ReactNode; apagado?: boolean };

/** Uma linha de totais com lugar fixo para cada campo, como o quadro de totais do DANFE: o rótulo em cima, o valor
 * embaixo. `grupos` é o tamanho de cada bloco, em ordem (`[7, 3]`: os tributos | desconto, frete e seguro), e um fio
 * mais forte separa os blocos. Com largura de sobra os campos dividem a linha; sem ela, quebram em mais linhas, sem
 * buraco (o último de cada linha estica), nunca rolam de lado. Os fios são o fundo da faixa aparecendo no vão de 1px. */
export function Faixa({ itens, grupos }: { itens: ItemDaFaixa[]; grupos?: number[] }) {
  const inicios = new Set<number>();
  let n = 0;
  for (const g of grupos ?? []) inicios.add((n += g));
  return (
    <div className="overflow-hidden rounded-icone border border-linha">
      <div className="flex flex-wrap gap-px bg-fio">
        {itens.map((i, k) => (
          <div
            key={k}
            className={cn(
              "flex flex-auto flex-col gap-0.5 bg-superficie px-3 py-2",
              // o fio forte no vão à esquerda do início do bloco (some quando ele abre a linha)
              inicios.has(k) && "shadow-[-1px_0_0_var(--linha-forte)]",
            )}
          >
            <span className="text-xs font-bold whitespace-nowrap text-texto-2">{i.rotulo}</span>
            <span className={cn("numero text-[13.5px] whitespace-nowrap", i.apagado ? "font-semibold text-texto-3" : "font-extrabold text-texto")}>
              {i.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// O `Par` sabe se está num `Pares` denso.
const Denso = createContext(false);

// Quantas colunas o `Par` ocupa com duas e com `colunas` abertas (com uma, ocupa sempre uma).
const Vao = createContext<{ dois: number; n: number } | null>(null);

// Os filhos do `Pares` com uma chave cada, abrindo os fragmentos (`{x && <><Par /><Par /></>}`).
function filhosDosPares(children: ReactNode, prefixo = ""): [string, ReactNode][] {
  return Children.toArray(children).flatMap((filho, i): [string, ReactNode][] => {
    const chave = prefixo + (isValidElement(filho) ? String(filho.key) : i);
    return isValidElement<{ children?: ReactNode }>(filho) && filho.type === Fragment
      ? filhosDosPares(filho.props.children, `${chave}/`)
      : [[chave, filho]];
  });
}

// As colunas que cada filho pede: `ocupa` do `Par` (o "inteiro" pede todas); o que não é `Par` pede uma.
function pedido(filho: ReactNode) {
  if (!isValidElement<{ ocupa?: number | "inteiro" }>(filho) || filho.type !== Par) return 1;
  return filho.props.ocupa === "inteiro" ? Infinity : (filho.props.ocupa ?? 1);
}

// Quanto cada filho ocupa numa grade de `n` colunas: o pedido (até `n`), mais o resto da linha quando o seguinte não
// cabe nela ou quando é o último, para a grade nunca mostrar lugar vazio.
function vaos(pedidos: number[], n: number) {
  const vao = pedidos.map((p) => Math.min(p, n));
  let usadas = 0;
  vao.forEach((v, i) => {
    if (usadas + v > n) {
      vao[i - 1]! += n - usadas;
      usadas = 0;
    }
    usadas = (usadas + v) % n;
  });
  if (usadas) vao[vao.length - 1]! += n - usadas;
  return vao;
}

/** Pares rótulo → valor, em blocos claros numa grade de até quatro colunas; a linha incompleta não deixa buraco: o
 * último par dela estica até o fim. As colunas seguem a largura do contêiner (não a da tela), para a ficha estreita
 * não espremer: uma coluna abaixo de 20rem, duas até 42rem, `colunas` daí para cima. Cada filho conta como um par (o
 * que não é `Par` ocupa uma coluna). `compacto` abre as `colunas` já em 32rem, para o detalhe ao lado de uma lista.
 * `denso` é a lista de definição em duas colunas (uma abaixo de 32rem, como na gaveta): o rótulo de 120px à esquerda,
 * o valor à direita, linhas de 34px com um fio embaixo e sem bloco por par. Os blocos são claros: vão sobre o branco
 * (a `SecaoDaFicha`, o `Bloco`). */
export function Pares({
  children,
  colunas = 4,
  compacto,
  denso,
}: {
  children: ReactNode;
  colunas?: 2 | 3 | 4;
  compacto?: boolean;
  denso?: boolean;
}) {
  if (denso)
    return (
      <div className="@container">
        <Denso.Provider value={true}>
          <dl className="m-0 grid grid-cols-1 gap-x-7 @lg:grid-cols-2">{children}</dl>
        </Denso.Provider>
      </div>
    );
  const filhos = filhosDosPares(children);
  const pedidos = filhos.map(([, filho]) => pedido(filho));
  const dois = vaos(pedidos, 2);
  const n = vaos(pedidos, colunas);
  return (
    <div className="@container">
      <dl
        className={cn(
          "m-0 grid grid-cols-[repeat(var(--colunas-agora),minmax(0,1fr))] gap-2.5 [--colunas-agora:1] *:[--vao:1] @xs:[--colunas-agora:2] @xs:*:[--vao:var(--vao-2,1)]",
          compacto
            ? "@lg:[--colunas-agora:var(--colunas)] @lg:*:[--vao:var(--vao-n,1)]"
            : "@2xl:[--colunas-agora:var(--colunas)] @2xl:*:[--vao:var(--vao-n,1)]",
        )}
        style={{ "--colunas": colunas } as CSSProperties}
      >
        {filhos.map(([chave, filho], i) => (
          <Vao.Provider key={chave} value={{ dois: dois[i]!, n: n[i]! }}>
            {filho}
          </Vao.Provider>
        ))}
      </dl>
    </div>
  );
}

/** Um par; `longo` não corta o valor (o endereço, a descrição) e `ocupa` estende por mais colunas, até as que o `Pares`
 * tem abertas (`"inteiro"` é a linha toda: o CFOP com a descrição); o último da linha estica até o fim dela, quando
 * o seguinte não cabe ou quando acabam os pares. `dica` põe o (?) que explica o termo. */
export function Par({
  rotulo,
  longo,
  ocupa,
  dica,
  children,
}: {
  rotulo: string;
  longo?: boolean;
  ocupa?: number | "inteiro";
  dica?: ConteudoDaDica;
  children: ReactNode;
}) {
  const denso = useContext(Denso);
  const vao = useContext(Vao);
  const inteiro = ocupa === "inteiro";
  if (denso)
    return (
      <div
        className={cn(
          "flex min-h-[34px] min-w-0 items-baseline gap-3 border-b border-fio py-2",
          (inteiro || (typeof ocupa === "number" && ocupa > 1)) && "col-span-full",
        )}
      >
        <dt className="flex w-[120px] shrink-0 items-center gap-1 text-[13px] font-semibold text-texto-2">
          {rotulo}
          {dica && <Dica conteudo={dica} />}
        </dt>
        <dd className={cn("m-0 min-w-0 text-sm font-bold [overflow-wrap:anywhere]", longo && "whitespace-pre-line")}>{children}</dd>
      </div>
    );
  return (
    <div
      className="flex min-w-0 flex-col gap-0.5 rounded-controle bg-superficie-2 px-3 py-2.5 [grid-column:span_var(--vao,1)]"
      style={vao ? ({ "--vao-2": vao.dois, "--vao-n": vao.n } as CSSProperties) : undefined}
    >
      <dt className="flex items-center gap-1 text-xs font-bold text-texto-2">
        {rotulo}
        {dica && <Dica conteudo={dica} />}
      </dt>
      <dd className={cn("m-0 text-sm font-extrabold", longo ? "whitespace-pre-line [overflow-wrap:anywhere]" : "truncate")}>{children}</dd>
    </div>
  );
}

/** O link de uma entidade dentro de uma ficha: abre a ficha dela por cima. */
export function Entidade({ children, aoAbrir, className }: { children: ReactNode; aoAbrir: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        aoAbrir();
      }}
      className={cn(
        "numero -mx-1 cursor-pointer rounded-md px-1 font-bold text-cobalto underline-offset-[3px] hover:bg-cobalto-suave hover:underline",
        className,
      )}
    >
      {children}
    </button>
  );
}
