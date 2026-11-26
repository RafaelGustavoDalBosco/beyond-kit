// Sem "use client" de propósito: a página de servidor passa `icone` (um componente) para a `CabecaDoBloco`; o
// `aoAbrir` só chega de um componente de cliente.

import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

/** A superfície, a unidade da tela: branca sobre o chão, sem borda e sem sombra. Corta o que passa do
 * canto (a linha escolhida e o hover da lista que encosta na borda); o que precisa sair dela (um menu absoluto, um
 * `sticky` preso à página) fica fora ou passa `overflow-visible` no `className`. */
export function Bloco({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-hidden rounded-g bg-ficha", className)} {...props} />;
}

const TOM_DO_BLOCO = { positivo: "is-positivo", destaque: "is-destaque", atencao: "is-atencao" } as const;

/** O bloco de número (`.bloco-numero`): o número grande, o título, o porquê e, no pé, a ação (um `Botao`, ou o `Link`
 * do roteador com o desenho dele). Com `tom` de sentido o bloco é tingido na cor do tom, com o título e o porquê no
 * tom forte; sem `tom`, é a superfície branca. Vários ficam no `BlocosDeNumero`. */
export function BlocoDeNumero({
  numero,
  titulo,
  porque,
  acao,
  tom,
  className,
}: {
  numero: ReactNode;
  titulo: ReactNode;
  porque?: ReactNode;
  acao?: ReactNode;
  tom?: keyof typeof TOM_DO_BLOCO;
  className?: string;
}) {
  return (
    <div className={cn("bloco-numero", tom && TOM_DO_BLOCO[tom], className)}>
      <span className="bloco-numero-valor numero">{numero}</span>
      <span className="bloco-numero-titulo">{titulo}</span>
      {porque && <span className="bloco-numero-porque">{porque}</span>}
      {acao && <div className="bloco-numero-acao">{acao}</div>}
    </div>
  );
}

/** A grade dos blocos de número: colunas de 260px no mínimo, que quebram linha. */
export function BlocosDeNumero({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("blocos-numero", className)} {...props} />;
}

/** O alto da caixa: o ícone do assunto (opcional, pequeno e neutro), o título, o detalhe e, à direita, a ação.
 * `acaoDeTexto` é a ação de texto ("Ver todas", "Abrir"), no `.btn-ghost`: com `aoAbrir` é botão, com `href` é `<a>`
 * e, sem os dois, o próprio nó (o `Link` do roteador) leva o desenho. `acao` segue para o que não é texto (um botão,
 * um selo, a legenda). */
export function CabecaDoBloco({
  titulo,
  detalhe,
  acao,
  acaoDeTexto,
  aoAbrir,
  href,
  icone: Icone,
}: {
  titulo: ReactNode;
  detalhe?: ReactNode;
  acao?: ReactNode;
  acaoDeTexto?: ReactNode;
  /** O clique da `acaoDeTexto`. */
  aoAbrir?: () => void;
  /** O destino da `acaoDeTexto`. */
  href?: string;
  icone?: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2.5 px-[18px] pt-4 pb-2">
      {Icone && <Icone aria-hidden className="size-4 shrink-0 text-texto-apoio" />}
      <div className="min-w-0 flex-1">
        <div className="card-title text-texto">{titulo}</div>
        {detalhe && <div className="text-apoio text-texto-apoio">{detalhe}</div>}
      </div>
      {acaoDeTexto != null &&
        (aoAbrir ? (
          <button type="button" onClick={aoAbrir} className="btn btn-ghost shrink-0">
            {acaoDeTexto}
          </button>
        ) : href ? (
          <a href={href} className="btn btn-ghost shrink-0">
            {acaoDeTexto}
          </a>
        ) : (
          <span className="btn btn-ghost shrink-0">{acaoDeTexto}</span>
        ))}
      {acao}
    </div>
  );
}

// A cor do rótulo: o tom colore só ele, o número fica em tinta.
const COR_DO_DESTAQUE = {
  texto: "text-texto-apoio",
  positivo: "text-positivo",
  destaque: "text-destaque",
  atencao: "text-atencao",
  erro: "text-erro",
} as const;

/** O número de destaque de uma caixa: o rótulo, o valor em tinta (peso forte) e o que o qualifica. O `tom` pinta só o
 * rótulo; nenhum número é azul nem colorido. */
export function Destaque({
  rotulo,
  valor,
  selo,
  detalhe,
  tom = "texto",
  grande = false,
  emCaixa = false,
}: {
  rotulo: ReactNode;
  valor: ReactNode;
  selo?: ReactNode;
  detalhe?: ReactNode;
  tom?: keyof typeof COR_DO_DESTAQUE;
  grande?: boolean;
  /** Numa área recuada (o fundo da mesa, raio do grupo) com respiro, como um mini cartão dentro da superfície. */
  emCaixa?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", emCaixa && "rounded-grupo bg-mesa px-4 py-3.5")}>
      <span className={cn("text-apoio font-forte", COR_DO_DESTAQUE[tom])}>{rotulo}</span>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "numero font-forte text-texto",
            grande ? "text-numero-p leading-numero tracking-[-.035em]" : "text-subtitulo leading-titulo tracking-titulo",
          )}
        >
          {valor}
        </span>
        {selo}
      </div>
      {detalhe && <span className="text-apoio text-texto-apoio">{detalhe}</span>}
    </div>
  );
}
