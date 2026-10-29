// A página pública (a home, fora do login), no modelo "vitrine do produto": o
// cabeçalho, o herói com a tela do produto, as seções (como funciona,
// recursos), a chamada final e o rodapé com a assinatura da Dal Bosco Systems.
// Os textos, os links (o Link do roteador) e a imagem da tela são do projeto;
// o SEO e a rota também.

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { AssinaturaDalBosco } from "../marca/marca";

/** A faixa de largura da home: o miolo de 1120 px com o respiro dos lados. */
function Faixa({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1120px] px-4 sm:px-6", className)}>{children}</div>;
}

/** O cabeçalho preso no alto: a marca, os links das seções (somem no celular) e as ações (Entrar e o botão principal). */
export function CabecalhoPublico({ marca, links, acoes }: { marca: ReactNode; links?: ReactNode; acoes?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-linha bg-superficie/95 backdrop-blur-md">
      <Faixa className="flex h-16 items-center gap-6">
        <div className="flex shrink-0 items-center gap-2.5 text-[15px] font-bold">{marca}</div>
        {links && (
          <nav aria-label="Seções" className="hidden flex-1 items-center gap-6 text-[13px] text-texto-2 md:flex [&_a:hover]:text-texto">
            {links}
          </nav>
        )}
        {acoes && <div className="ml-auto flex items-center gap-2">{acoes}</div>}
      </Faixa>
    </header>
  );
}

/**
 * O herói: o rótulo, o título, a frase e os botões à esquerda, sobre o
 * cobalto claro do BlocoDestaque, e a tela do produto à direita (empilha
 * abaixo de `lg`). `provas` são as frases curtas de baixo ("ICMS, ST e
 * PIS/COFINS"), com a parte forte em <b>.
 */
export function HeroiDoProduto({
  rotulo,
  titulo,
  frase,
  acoes,
  provas,
  midia,
}: {
  rotulo?: ReactNode;
  titulo: ReactNode;
  frase?: ReactNode;
  acoes?: ReactNode;
  provas?: ReactNode[];
  midia?: ReactNode;
}) {
  return (
    <section className="border-b border-destaque-anel bg-gradient-to-br from-destaque-de via-destaque-meio to-destaque-ate">
      <Faixa className={cn("grid items-center gap-10 py-14", midia && "lg:grid-cols-[1fr_1.05fr]")}>
        <div className="min-w-0">
          {rotulo && <div className="text-[11px] font-semibold tracking-[0.1em] text-cobalto uppercase">{rotulo}</div>}
          <h1 className="m-0 mt-2.5 text-[clamp(30px,4.4vw,46px)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance text-destaque-texto">
            {titulo}
          </h1>
          {frase && <p className="m-0 mt-4 max-w-[46ch] text-base leading-relaxed text-destaque-texto-2">{frase}</p>}
          {acoes && <div className="mt-6 flex flex-wrap gap-2.5">{acoes}</div>}
          {provas && provas.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-destaque-texto-2 [&_b]:text-destaque-texto">
              {provas.map((p, i) => (
                <span key={i}>{p}</span>
              ))}
            </div>
          )}
        </div>
        {midia && <div className="min-w-0">{midia}</div>}
      </Faixa>
    </section>
  );
}

/** A moldura de uma tela do produto no herói (a barra com os três pontos); dentro vai a imagem da tela ou o JSX dela. */
export function TelaDoProduto({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-bloco border border-linha bg-superficie shadow-3", className)}>
      <div aria-hidden className="flex gap-1.5 border-b border-linha bg-superficie-2 px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-linha-forte" />
        <span className="size-2.5 rounded-full bg-linha-forte" />
        <span className="size-2.5 rounded-full bg-linha-forte" />
      </div>
      {children}
    </div>
  );
}

/** Uma seção da home: o título de seção, o título e a frase, e o conteúdo. `id` é a âncora dos links do cabeçalho. */
export function SecaoPublica({
  id,
  rotulo,
  titulo,
  frase,
  children,
}: {
  id?: string;
  rotulo?: ReactNode;
  titulo?: ReactNode;
  frase?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 pt-14">
      <Faixa>
        {(rotulo || titulo || frase) && (
          <div className="mb-6 flex max-w-[640px] flex-col gap-2">
            {rotulo && <div className="titulo-secao">{rotulo}</div>}
            {titulo && <h2 className="m-0 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-balance">{titulo}</h2>}
            {frase && <p className="m-0 text-texto-2">{frase}</p>}
          </div>
        )}
        {children}
      </Faixa>
    </section>
  );
}

/** Os passos de "como funciona", numerados (a ordem é a do processo). */
export function Passos({ itens }: { itens: { titulo: ReactNode; frase: ReactNode }[] }) {
  return (
    <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
      {itens.map((p, i) => (
        <li key={i} className="relative rounded-bloco border border-linha bg-superficie py-5 pr-5 pl-16">
          <span
            aria-hidden
            className="numero absolute top-5 left-5 flex size-[30px] items-center justify-center rounded-full bg-cobalto text-[13px] font-semibold text-sobre-cobalto"
          >
            {i + 1}
          </span>
          <h3 className="m-0 mb-1 text-[14.5px] font-semibold">{p.titulo}</h3>
          <p className="m-0 text-[13px] text-texto-2">{p.frase}</p>
        </li>
      ))}
    </ol>
  );
}

/** A grade dos recursos: o ícone no quadrado cobalto, o título e a frase. */
export function Recursos({ itens }: { itens: { icone: LucideIcon; titulo: ReactNode; frase: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {itens.map(({ icone: Icone, titulo, frase }, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-bloco border border-linha bg-superficie p-5 shadow-1">
          <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-cobalto-suave text-cobalto">
            <Icone className="size-5" />
          </span>
          <h3 className="m-0 text-[15px] font-semibold">{titulo}</h3>
          <p className="m-0 text-[13px] text-texto-2">{frase}</p>
        </div>
      ))}
    </div>
  );
}

/** A chamada final: a faixa cobalto com a pergunta, a frase e o botão (use o Botao com className "bg-superficie text-cobalto-forte"). */
export function ChamadaFinal({ titulo, frase, acao }: { titulo: ReactNode; frase?: ReactNode; acao?: ReactNode }) {
  return (
    <section className="pt-14">
      <Faixa>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-ficha bg-cobalto p-9 text-sobre-cobalto">
          <div className="min-w-0">
            <h2 className="m-0 max-w-[30ch] text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance">{titulo}</h2>
            {frase && <p className="m-0 mt-1.5 text-sobre-cobalto/80">{frase}</p>}
          </div>
          {acao}
        </div>
      </Faixa>
    </section>
  );
}

/** O rodapé: a marca e a frase do produto, as colunas de links e, embaixo, a assinatura com o brasão da Dal Bosco Systems. */
export function RodapePublico({
  marca,
  sobre,
  colunas,
}: {
  marca: ReactNode;
  sobre?: ReactNode;
  colunas: { titulo: string; links: ReactNode[] }[];
}) {
  return (
    <footer className="mt-16 border-t border-linha bg-superficie">
      <Faixa className="grid grid-cols-2 gap-6 pt-9 pb-7 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 text-[15px] font-bold">{marca}</div>
          {sobre && <p className="m-0 mt-2 max-w-[34ch] text-[13px] text-texto-2">{sobre}</p>}
        </div>
        {colunas.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo}>
            <div className="rotulo mb-2.5">{c.titulo}</div>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[13px] text-texto-2 [&_a:hover]:text-cobalto">
              {c.links.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </nav>
        ))}
      </Faixa>
      <div className="border-t border-linha">
        <AssinaturaDalBosco como="div" className="mt-0 pt-5 pb-7" />
      </div>
    </footer>
  );
}
