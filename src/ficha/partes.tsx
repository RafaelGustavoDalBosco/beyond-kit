"use client";

import { Check, Copy, type LucideIcon } from "lucide-react";
import { Children, createContext, Fragment, isValidElement, useContext, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Bloco } from "../ui/bloco";
import { Dica, type ConteudoDaDica } from "../ui/dica";
import { useDentroDoModal } from "../ui/modal";

/** O alto da ficha: a linha de cima (o `.cartao-rotulo`, com o ícone do tipo pequeno e neutro), o título em frase, os
 * selos e os códigos; à direita, o número principal e as ações. Com o corpo da ficha depois dele, leva o fio suave
 * embaixo e respiro até o corpo; sozinho, nem um nem outro. No modal, o título do registro é o do cabeçalho do modal:
 * aqui ficam a identificação, os códigos e o número. */
export function CabecaDaFicha({
  icone: Icone,
  tipo,
  sobretitulo,
  titulo,
  selos,
  codigos,
  numero,
  rotuloDoNumero,
  acoes,
}: {
  /** O ícone do tipo, pequeno e neutro, antes da linha de cima. */
  icone?: LucideIcon;
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
    <div className="flex items-start gap-4 border-borda-suave not-last:mb-3 not-last:border-b not-last:pb-4 celular:flex-wrap celular:gap-3">
      <div className="min-w-0 flex-1">
        {(Icone || linhaDeCima) && (
          <div className="cartao-rotulo flex items-center gap-1.5">
            {Icone && <Icone aria-hidden className="size-3.5 shrink-0" />}
            {linhaDeCima}
          </div>
        )}
        <h3 className="m-0 mt-0.5 text-titulo [overflow-wrap:anywhere] celular:text-subtitulo">{titulo}</h3>
        {selos && <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{selos}</div>}
        {codigos && <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">{codigos}</div>}
      </div>
      {(numero != null || acoes) && (
        <div className="flex shrink-0 items-start gap-4 text-right celular:w-full celular:justify-between celular:text-left">
          {numero != null && (
            <div className="min-w-0">
              <div className="numero text-numero-p leading-numero font-medio tracking-titulo celular:text-titulo">{numero}</div>
              {rotuloDoNumero && <div className="cartao-rotulo">{rotuloDoNumero}</div>}
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

/** Os dados rápidos da ficha, o resumo logo abaixo do cabeçalho: a faixa (`.ficha-faixa`, as células
 * recuadas separadas pelo fio suave, quantas couberem por linha); o valor comprido corta com reticências. */
export function DadosRapidos({ itens, className }: { itens: DadoRapido[]; className?: string }) {
  return (
    <dl className={cn("ficha-faixa", className)}>
      {itens.map((i, k) => (
        <div key={k} className="min-w-0">
          <dt className="cartao-rotulo">{i.rotulo}</dt>
          <dd className="numero m-0 truncate font-forte">{i.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Uma seção da ficha ou do detalhe: o título, os selos ao lado dele e a ação à direita (o botão, o link em texto, o
 * detalhe parado). Na tela, na caixa (o `Bloco`); no modal, a seção da ficha (`.ficha-bloco`): o rótulo
 * pequeno em cima e o conteúdo numa área recuada, sem borda, com os fios suaves entre as linhas. `solto` tira a caixa
 * (e, no modal, o recuo) e põe o título pequeno sobre o fio suave. */
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
  /** Sem a caixa em volta (dentro de um `Bloco` que já existe) e, no modal, sem o recuo. */
  solto?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const noModal = useDentroDoModal();
  if (noModal && !solto)
    return (
      <section className={cn("ficha-bloco", className)}>
        <div className="ficha-bloco-titulo">
          <h3>{titulo}</h3>
          {selos}
          {acao && <div className="ficha-bloco-acao">{acao}</div>}
        </div>
        <div className="ficha-bloco-corpo">{children}</div>
      </section>
    );
  const cabeca = (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", solto ? "border-b border-borda-suave pb-1" : "min-h-7")}>
      {solto ? (
        <h4 className="m-0 text-apoio font-medio tracking-normal text-texto-apoio">{titulo}</h4>
      ) : (
        <h3 className="card-title m-0">{titulo}</h3>
      )}
      {selos}
      {/* o texto parado ("3 itens") fica neutro; o azul é só do link e do botão */}
      {acao && <div className="ml-auto flex items-center gap-2 text-apoio text-texto-apoio">{acao}</div>}
    </div>
  );
  if (solto)
    return (
      <section className={cn("mt-2 flex flex-col gap-2 first:mt-0", className)}>
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

/** Um código com o nome dele (NCM, CEST, EAN, CFOP…): a ficha técnica em linha, o nome no texto de apoio e o valor em
 * algarismos de largura fixa, sem pílula. `empilhado` põe o nome em cima do valor: vários códigos cabem no cabeçalho
 * da ficha estreita (junte-os com `gap-x-4 gap-y-2`). */
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
      aria-label={ok ? "Copiado" : "Copiar"}
      title={ok ? "Copiado" : "Copiar"}
      onClick={() => {
        navigator.clipboard.writeText(copiavel);
        setOk(true);
        setTimeout(() => setOk(false), 1400);
      }}
      className="grid size-[22px] shrink-0 cursor-pointer place-items-center rounded-p border-0 bg-transparent text-texto-apoio hover:bg-hover hover:text-acao-texto"
    >
      {ok ? <Check className="size-3 text-ok" /> : <Copy className="size-3" />}
    </button>
  );
  if (empilhado)
    return (
      <span className="inline-flex max-w-full min-w-0 flex-col">
        <span className="cartao-rotulo">{nome}</span>
        <span className="numero flex h-6 min-w-0 items-center gap-1 font-medio text-texto">
          <span className="min-w-0 truncate" title={copiavel}>{valor}</span>
          {copiar}
        </span>
      </span>
    );
  // O valor comprido (a chave da NF-e) corta com reticências; o nome e o copiar ficam sempre à vista.
  return (
    <span className="inline-flex h-6 max-w-full min-w-0 items-center gap-1.5 text-apoio">
      <span className="shrink-0 text-texto-apoio">{nome}</span>
      <span className="numero min-w-0 truncate font-medio text-texto" title={copiavel}>{valor}</span>
      {copiar}
    </span>
  );
}

/** Um valor da `Faixa`; `apagado` é o zero (no texto de apoio, mais leve), para o número com valor saltar aos olhos. */
export type ItemDaFaixa = { rotulo: ReactNode; valor: ReactNode; apagado?: boolean };

/** Uma linha de totais com lugar fixo para cada campo, como o quadro de totais do DANFE: o rótulo em cima, o valor
 * embaixo. `grupos` é o tamanho de cada bloco, em ordem (`[7, 3]`: os tributos | desconto, frete e seguro), e um fio
 * mais forte separa os blocos. Com largura de sobra os campos dividem a linha; sem ela, quebram em mais linhas, sem
 * buraco (o último de cada linha estica), nunca rolam de lado. Os fios são o fundo da faixa aparecendo no vão de 1px.
 * No modal, as células são recuadas e a faixa perde a borda, como a `.ficha-faixa` do resumo. */
export function Faixa({ itens, grupos }: { itens: ItemDaFaixa[]; grupos?: number[] }) {
  const noModal = useDentroDoModal();
  const inicios = new Set<number>();
  let n = 0;
  for (const g of grupos ?? []) inicios.add((n += g));
  return (
    <div className={cn("overflow-hidden", noModal ? "rounded-g" : "rounded-m border border-borda")}>
      <div className="flex flex-wrap gap-px bg-borda-suave">
        {itens.map((i, k) => (
          <div
            key={k}
            className={cn(
              "flex flex-auto flex-col gap-0.5 px-3 py-2",
              noModal ? "bg-mesa" : "bg-ficha",
              // o fio forte no vão à esquerda do início do bloco (some quando ele abre a linha)
              inicios.has(k) && "shadow-[-1px_0_0_var(--borda-forte)]",
            )}
          >
            <span className="cartao-rotulo whitespace-nowrap">{i.rotulo}</span>
            <span className={cn("numero whitespace-nowrap", i.apagado ? "text-texto-apoio" : "font-medio text-texto")}>{i.valor}</span>
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

/** Pares rótulo → valor, em blocos recuados numa grade de até quatro colunas; a linha incompleta não deixa buraco: o
 * último par dela estica até o fim. As colunas seguem a largura do contêiner (não a da tela), para a ficha estreita
 * não espremer: uma coluna abaixo de 20rem, duas até 42rem, `colunas` daí para cima. Cada filho conta como um par (o
 * que não é `Par` ocupa uma coluna). `compacto` abre as `colunas` já em 32rem, para o detalhe ao lado de uma lista.
 * `denso` é a lista de definição em duas colunas (uma abaixo de 32rem): o rótulo de 120px à esquerda, o valor à
 * direita, linhas de 34px separadas pelo fio suave e sem bloco por par; é o conteúdo da seção do detalhe no modal
 * (`SecaoDoDetalhe`), no recuo dela. Os blocos são o recuo (`superficie-mesa`) sobre a ficha (o `Bloco`, o modal). */
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
          // o fio separa as linhas: a última (nas duas colunas, as duas últimas) fica sem ele
          "flex min-h-[34px] min-w-0 items-baseline gap-3 border-b border-borda-suave py-2 last:border-b-0 @lg:odd:nth-last-2:border-b-0",
          (inteiro || (typeof ocupa === "number" && ocupa > 1)) && "col-span-full",
        )}
      >
        <dt className="flex w-[120px] shrink-0 items-center gap-1 text-texto-apoio">
          {rotulo}
          {dica && <Dica conteudo={dica} />}
        </dt>
        <dd className={cn("m-0 min-w-0 [overflow-wrap:anywhere]", longo && "whitespace-pre-line")}>{children}</dd>
      </div>
    );
  return (
    <div
      className="flex min-w-0 flex-col gap-0.5 rounded-m bg-mesa px-3 py-2.5 [grid-column:span_var(--vao,1)]"
      style={vao ? ({ "--vao-2": vao.dois, "--vao-n": vao.n } as CSSProperties) : undefined}
    >
      <dt className="cartao-rotulo flex items-center gap-1">
        {rotulo}
        {dica && <Dica conteudo={dica} />}
      </dt>
      <dd className={cn("m-0 font-medio", longo ? "whitespace-pre-line [overflow-wrap:anywhere]" : "truncate")}>{children}</dd>
    </div>
  );
}

/** O link de uma entidade dentro de uma ficha (o nome com cadastro por trás): abre a ficha dela na pilha do
 * mesmo modal, nunca num modal por cima. */
export function Entidade({ children, aoAbrir, className }: { children: ReactNode; aoAbrir: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        aoAbrir();
      }}
      className={cn(
        "numero cursor-pointer rounded-p border-0 bg-transparent p-0 text-left text-acao-texto underline-offset-[3px] hover:underline",
        className,
      )}
    >
      {children}
    </button>
  );
}
