// A página pública (a home, fora do login), no modelo "vitrine do produto": o
// cabeçalho, o herói com a tela do produto, as seções (como funciona,
// recursos), a chamada final e o rodapé com a assinatura da Dal Bosco Systems.
// Os textos, os links (o Link do roteador) e a imagem da tela são do projeto;
// o SEO e a rota também.

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { AssinaturaDalBosco } from "../marca/marca";
import { Emblema } from "../ui/emblema";

/** A faixa de largura da home: o miolo de 1120 px com o respiro dos lados. */
function Faixa({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1120px] px-4 sm:px-6", className)}>{children}</div>;
}

// Os botões que o projeto põe sobre o azul cheio do herói se invertem sozinhos: os tokens trocam de valor só aqui
// dentro (o primário fica branco com o texto azul; o secundário e o de texto, brancos e sem fundo). O branco e o
// azul vêm dos tokens do cabeçalho, que têm os mesmos valores e não entram na troca.
const SOBRE_O_AZUL =
  "[--cobalto:var(--cabecalho-texto)] [--sobre-cobalto:var(--cabecalho)] [--cobalto-forte:var(--destaque-de)] [--cobalto-suave:var(--cabecalho-2)] [--superficie:transparent] [--superficie-2:var(--cabecalho-2)]";

/** O cabeçalho preso no alto: a marca, os links das seções (somem no celular) e as ações (Entrar e o botão principal). */
export function CabecalhoPublico({ marca, links, acoes }: { marca: ReactNode; links?: ReactNode; acoes?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-linha bg-superficie">
      <Faixa className="flex h-16 items-center gap-6">
        <div className="flex shrink-0 items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.01em]">{marca}</div>
        {links && (
          <nav
            aria-label="Seções"
            className="hidden flex-1 items-center gap-6 text-[13.5px] font-bold text-texto-2 md:flex [&_a:hover]:text-cobalto"
          >
            {links}
          </nav>
        )}
        {acoes && <div className="ml-auto flex items-center gap-2">{acoes}</div>}
      </Faixa>
    </header>
  );
}

/**
 * O herói, em azul cheio: a linha de cima (`rotulo`), o título, a frase e os botões à esquerda, e a tela do produto
 * à direita (empilha abaixo de `lg`). Os botões de `acoes` se invertem sozinhos sobre o azul (o primário fica
 * branco). `provas` são as frases curtas de baixo ("ICMS, ST e PIS/COFINS"), com a parte forte em <b>.
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
    <section className="bg-cobalto text-sobre-cobalto">
      <Faixa className={cn("grid items-center gap-10 py-14", midia && "lg:grid-cols-[1fr_1.05fr]")}>
        <div className="min-w-0">
          {rotulo && <div className="text-[13px] font-bold text-sobre-cobalto/85">{rotulo}</div>}
          <h1 className="m-0 mt-2.5 text-[clamp(30px,4.4vw,44px)] leading-[1.12] font-extrabold tracking-[-0.02em] text-balance">
            {titulo}
          </h1>
          {frase && <p className="m-0 mt-4 max-w-[46ch] text-base leading-[1.55] text-sobre-cobalto/85">{frase}</p>}
          {acoes && <div className={cn("mt-6 flex flex-wrap gap-2.5", SOBRE_O_AZUL)}>{acoes}</div>}
          {provas && provas.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-semibold text-sobre-cobalto/85 [&_b]:font-extrabold [&_b]:text-sobre-cobalto">
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
    <div className={cn("overflow-hidden rounded-bloco border border-linha bg-superficie text-texto shadow-2", className)}>
      <div aria-hidden className="flex gap-1.5 border-b border-fio bg-superficie-2 px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-linha-forte" />
        <span className="size-2.5 rounded-full bg-linha-forte" />
        <span className="size-2.5 rounded-full bg-linha-forte" />
      </div>
      {children}
    </div>
  );
}

/** Uma seção da home: a linha de cima (`rotulo`), o título e a frase, e o conteúdo. `id` é a âncora dos links do cabeçalho. */
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
          <div className="mb-6 flex max-w-[640px] flex-col gap-1.5">
            {rotulo && <div className="text-[13px] font-bold text-cobalto">{rotulo}</div>}
            {titulo && <h2 className="m-0 text-[26px] leading-tight font-extrabold tracking-[-0.015em] text-balance">{titulo}</h2>}
            {frase && <p className="m-0 text-[15px] leading-normal text-texto-2">{frase}</p>}
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
    <ol className="m-0 grid list-none grid-cols-1 gap-3.5 p-0 md:grid-cols-3">
      {itens.map((p, i) => (
        <li key={i} className="flex items-start gap-3 rounded-bloco border border-linha bg-superficie p-5 shadow-bloco">
          <Emblema sigla={i + 1} tamanho="sm" cheio className="numero text-[13px]" />
          <div className="min-w-0">
            <h3 className="m-0 mb-1 text-[15px] leading-snug font-extrabold">{p.titulo}</h3>
            <p className="m-0 text-[13.5px] leading-normal text-texto-2">{p.frase}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A grade dos recursos: o ícone no círculo azul claro, o título e a frase. */
export function Recursos({ itens }: { itens: { icone: LucideIcon; titulo: ReactNode; frase: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {itens.map(({ icone, titulo, frase }, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-bloco border border-linha bg-superficie p-5 shadow-bloco">
          <Emblema icone={icone} className="mb-1" />
          <h3 className="m-0 text-[15px] leading-snug font-extrabold">{titulo}</h3>
          <p className="m-0 text-[13.5px] leading-normal text-texto-2">{frase}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * A chamada final: a faixa em azul cheio com a pergunta, a frase e o botão (use o Botao com className
 * "bg-superficie text-cobalto-forte"). Sob o mouse o botão fica no cinza claro, opaco.
 */
export function ChamadaFinal({ titulo, frase, acao }: { titulo: ReactNode; frase?: ReactNode; acao?: ReactNode }) {
  return (
    <section className="pt-14">
      <Faixa>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-bloco bg-cobalto p-9 text-sobre-cobalto celular:p-6">
          <div className="min-w-0">
            <h2 className="m-0 max-w-[30ch] text-2xl leading-tight font-extrabold tracking-[-0.015em] text-balance">{titulo}</h2>
            {frase && <p className="m-0 mt-1.5 text-[15px] text-sobre-cobalto/85">{frase}</p>}
          </div>
          {/* O hover do Botao é translúcido (pensado para o branco) e sumiria com o texto sobre o azul: aqui ele é fixo e opaco. */}
          {acao && (
            <div className="flex shrink-0 items-center gap-2.5 [&_a:hover]:bg-superficie-2 [&_button:hover]:bg-superficie-2">{acao}</div>
          )}
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
          <div className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.01em]">{marca}</div>
          {sobre && <p className="m-0 mt-2 max-w-[34ch] text-[13.5px] leading-normal text-texto-2">{sobre}</p>}
        </div>
        {colunas.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo}>
            <div className="mb-2.5 text-[13px] font-extrabold text-texto">{c.titulo}</div>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[13.5px] font-semibold text-texto-2 [&_a:hover]:text-cobalto">
              {c.links.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </nav>
        ))}
      </Faixa>
      <div className="border-t border-fio">
        <AssinaturaDalBosco como="div" className="mt-0 pt-5 pb-7" />
      </div>
    </footer>
  );
}
