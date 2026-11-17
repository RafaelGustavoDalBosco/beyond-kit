// Sem "use client" de propósito: a página de servidor passa `icone` (um componente) para a `CabecaDoBloco`; o
// `aoAbrir` só chega de um componente de cliente.

import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

/** A caixa do Lastro: ficha com borda, raio grande e sombra leve, a unidade da tela. Corta o que passa do canto (a
 * linha escolhida e o hover da lista que encosta na borda); o que precisa sair dela (um menu absoluto, um `sticky`
 * preso à página) fica fora ou passa `overflow-visible` no `className`. */
export function Bloco({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-hidden rounded-g border border-borda bg-ficha shadow-p", className)} {...props} />;
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

const COR_DO_DESTAQUE = {
  texto: "text-texto",
  positivo: "text-positivo",
  destaque: "text-destaque",
  atencao: "text-atencao",
  erro: "text-erro",
} as const;

/** O número de destaque de uma caixa: rótulo de apoio, valor em peso 500 e o que o qualifica. O `tom` pinta só o
 * valor; nenhum número é azul. */
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
  /** Com contorno, fundo e respiro, como um mini cartão. */
  emCaixa?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", emCaixa && "rounded-m border border-borda bg-ficha px-4 py-3.5")}>
      <span className="text-apoio font-medio text-texto-apoio">{rotulo}</span>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "numero font-medio tracking-titulo",
            grande ? "text-numero-p leading-numero" : "text-subtitulo leading-titulo",
            COR_DO_DESTAQUE[tom],
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
