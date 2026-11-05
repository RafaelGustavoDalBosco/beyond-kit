"use client";

import { Check, Copy, type LucideIcon } from "lucide-react";
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Dica, type ConteudoDaDica } from "../ui/dica";

/** O alto da ficha: o ícone do tipo, o que ela é, o nome e os códigos, no tom do alto do detalhe e com um fio embaixo
 * (o `mb-5` guarda o respiro até o corpo da ficha). */
export function CabecaDaFicha({
  icone: Icone,
  tipo,
  titulo,
  selos,
  codigos,
  acoes,
}: {
  icone: LucideIcon;
  tipo: ReactNode;
  titulo: ReactNode;
  selos?: ReactNode;
  codigos?: ReactNode;
  /** Os botões da ficha, à direita do título. */
  acoes?: ReactNode;
}) {
  return (
    <div className="mb-5 flex gap-4 border-b border-linha bg-cabeca-detalhe px-6 pt-6 pb-5">
      <div className="icone-cheio flex size-11 shrink-0 items-center justify-center rounded-xl">
        <Icone className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="rotulo flex items-center gap-2">{tipo}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h2 className="m-0 min-w-0 text-xl leading-tight font-bold tracking-tight uppercase [overflow-wrap:anywhere]">{titulo}</h2>
          {selos}
        </div>
        {codigos && <div className="mt-3 flex flex-wrap items-center gap-1.5">{codigos}</div>}
      </div>
      {acoes && <div className="flex shrink-0 flex-wrap items-start gap-2">{acoes}</div>}
    </div>
  );
}

/** Uma seção dentro da ficha ou do detalhe: o título de seção, os selos ao lado dele e a ação à direita (o botão,
 * o detalhe em texto). */
export function SecaoDaFicha({
  titulo,
  selos,
  acao,
  className,
  children,
}: {
  titulo: ReactNode;
  selos?: ReactNode;
  acao?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex min-h-7 flex-wrap items-center gap-x-3 gap-y-1.5">
        <h3 className="titulo-secao m-0">{titulo}</h3>
        {selos}
        {acao && <div className="ml-auto flex items-center gap-2 text-xs text-texto-3">{acao}</div>}
      </div>
      {children}
    </section>
  );
}

/** Um código com o nome dele (NCM, CEST, EAN, CFOP…): a ficha técnica em linha. `empilhado` põe o nome em cima do
 * valor, sem a caixa: vários códigos cabem no cabeçalho da ficha estreita (junte-os com `gap-x-4 gap-y-2`). */
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
        "flex size-5 cursor-pointer items-center justify-center rounded text-texto-3 hover:bg-superficie-3 hover:text-texto",
        !empilhado && "-ml-1",
      )}
    >
      {ok ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
  if (empilhado)
    return (
      <span className="inline-flex flex-col">
        <span className="text-xs text-texto-3">{nome}</span>
        <span className="numero flex h-6 items-center gap-1 text-[13px] font-medium text-texto">
          {valor}
          {copiar}
        </span>
      </span>
    );
  return (
    <span className="inline-flex h-7 items-center gap-2 rounded-lg border border-linha bg-superficie-2 pr-1 pl-2.5 text-xs">
      <span className="text-texto-3">{nome}</span>
      <span className="numero pr-1.5 text-texto">{valor}</span>
      {copiar}
    </span>
  );
}

/** Um valor da `Faixa`; `apagado` é o zero (em texto-3, peso normal), para o número com valor saltar aos olhos. */
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
    <div className="overflow-hidden rounded-xl border border-linha">
      <div className="flex flex-wrap gap-px bg-linha">
        {itens.map((i, k) => (
          <div
            key={k}
            className={cn(
              "flex flex-auto flex-col gap-0.5 bg-superficie px-3 py-2",
              // o fio forte no vão à esquerda do início do bloco (some quando ele abre a linha)
              inicios.has(k) && "shadow-[-1px_0_0_var(--linha-forte)]",
            )}
          >
            <span className="rotulo text-[10.5px] whitespace-nowrap">{i.rotulo}</span>
            <span className={cn("numero text-[13.5px] whitespace-nowrap", i.apagado ? "text-texto-3" : "font-semibold text-texto")}>
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

/** Pares rótulo → valor, em grade; a linha incompleta não deixa buraco. As colunas seguem a largura do contêiner (não
 * a da tela), para a ficha estreita não espremer: uma coluna abaixo de 24rem, duas até 42rem, `colunas` daí para cima.
 * `compacto` abre as `colunas` já em 32rem, para o detalhe ao lado de uma lista. `denso` é a lista de definição em
 * duas colunas (uma abaixo de 32rem): o rótulo de 104px à esquerda, o valor à direita, linhas de 34px com um fio
 * embaixo e sem caixa por par, para a ficha curta e cheia (o item da nota). */
export function Pares({
  children,
  colunas = 3,
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
          <dl className="m-0 grid grid-cols-1 gap-x-7 border-t border-linha @lg:grid-cols-2">{children}</dl>
        </Denso.Provider>
      </div>
    );
  return (
    <div className="@container">
      <dl
        className={cn(
          "m-0 grid grid-cols-[repeat(var(--colunas-agora),minmax(0,1fr))] gap-px overflow-hidden rounded-xl border border-linha bg-superficie [--colunas-agora:1] @sm:[--colunas-agora:2]",
          compacto ? "@lg:[--colunas-agora:var(--colunas)]" : "@2xl:[--colunas-agora:var(--colunas)]",
        )}
        style={{ "--colunas": colunas } as CSSProperties}
      >
        {children}
      </dl>
    </div>
  );
}

/** Um par; `longo` não corta o valor (o endereço, a descrição) e `ocupa` estende por mais colunas, até as que o `Pares`
 * tem abertas (`"inteiro"` é a linha toda: o CFOP com a descrição); `dica` põe o (i) que explica o termo. */
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
  const inteiro = ocupa === "inteiro";
  if (denso)
    return (
      <div
        className={cn(
          "flex min-h-[34px] min-w-0 items-baseline gap-3 border-b border-linha px-0.5 py-[7px]",
          (inteiro || (typeof ocupa === "number" && ocupa > 1)) && "col-span-full",
        )}
      >
        <dt className="flex w-[104px] shrink-0 items-center gap-1 text-xs text-texto-3">
          {rotulo}
          {dica && <Dica conteudo={dica} />}
        </dt>
        <dd className={cn("m-0 min-w-0 text-[13.5px] font-medium [overflow-wrap:anywhere]", longo && "whitespace-pre-line")}>{children}</dd>
      </div>
    );
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-superficie px-4 py-3 outline outline-1 outline-linha",
        inteiro && "col-span-full",
        typeof ocupa === "number" &&
          ocupa > 1 &&
          "[grid-column:span_min(var(--ocupa),var(--colunas-agora))/span_min(var(--ocupa),var(--colunas-agora))]",
      )}
      style={typeof ocupa === "number" ? ({ "--ocupa": ocupa } as CSSProperties) : undefined}
    >
      <dt className="flex items-center gap-1 text-xs text-texto-3">
        {rotulo}
        {dica && <Dica conteudo={dica} />}
      </dt>
      <dd className={cn("m-0 text-sm font-medium", longo ? "whitespace-pre-line [overflow-wrap:anywhere]" : "truncate")}>{children}</dd>
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
        "numero cursor-pointer rounded px-1 -mx-1 text-cobalto underline decoration-cobalto/30 underline-offset-[3px] hover:bg-cobalto-suave hover:decoration-cobalto",
        className,
      )}
    >
      {children}
    </button>
  );
}
