// Sem "use client" de propósito: a página de servidor passa `icone` (um componente) para a `CabecaDoBloco`; o
// `aoAbrir` só chega de um componente de cliente.

import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

import { Emblema } from "./emblema";

/** A caixa: o bloco branco que agrupa uma lista ou um conteúdo (a unidade da tela). Corta o que passa do canto (a
 * linha escolhida e o hover da lista que encosta na borda); o que precisa sair dela (um menu absoluto, um `sticky`
 * preso à página) fica fora ou passa `overflow-visible` no `className`. */
export function Bloco({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-hidden rounded-bloco bg-superficie shadow-1", className)} {...props} />;
}

// A ação de texto do alto da caixa ("Ver todas", "Abrir").
const ACAO_DE_TEXTO = "shrink-0 text-[13px] font-bold text-cobalto transition-colors hover:text-cobalto-forte";

/** O alto da caixa: o ícone do assunto (opcional), o título, o detalhe e, à direita, a ação. `acaoDeTexto` é a ação
 * de texto em azul ("Ver todas", "Abrir"): com `aoAbrir` é botão, com `href` é `<a>` e, sem os dois, o próprio nó (o
 * `Link` do roteador) leva o desenho. `acao` segue para o que não é texto (um botão, um selo, a legenda). */
export function CabecaDoBloco({
  titulo,
  detalhe,
  acao,
  acaoDeTexto,
  aoAbrir,
  href,
  icone,
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
    <div className="flex items-center gap-3 px-[18px] pt-4 pb-1.5">
      {icone && <Emblema icone={icone} forma="quadrado" tamanho="sm" />}
      <div className="min-w-0 flex-1">
        <div className="text-base leading-snug font-extrabold">{titulo}</div>
        {detalhe && <div className="text-[12.5px] font-semibold text-texto-2">{detalhe}</div>}
      </div>
      {acaoDeTexto != null &&
        (aoAbrir ? (
          <button type="button" onClick={aoAbrir} className={cn(ACAO_DE_TEXTO, "cursor-pointer")}>
            {acaoDeTexto}
          </button>
        ) : href ? (
          <a href={href} className={ACAO_DE_TEXTO}>
            {acaoDeTexto}
          </a>
        ) : (
          <span className={ACAO_DE_TEXTO}>{acaoDeTexto}</span>
        ))}
      {acao}
    </div>
  );
}

/** O número de destaque de uma caixa: rótulo, valor e o que o qualifica. */
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
  tom?: "texto" | "cobalto" | "ganho" | "aviso" | "risco";
  grande?: boolean;
  /** Com contorno, fundo e respiro, como um mini cartão. */
  emCaixa?: boolean;
}) {
  const cor = { texto: "text-texto", cobalto: "text-cobalto", ganho: "text-ganho", aviso: "text-aviso", risco: "text-risco" }[tom];
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", emCaixa && "rounded-icone border border-linha bg-superficie px-3.5 py-3")}>
      <span className="text-[12.5px] font-bold text-texto-2">{rotulo}</span>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "numero font-extrabold",
            grande ? "text-[26px] leading-[1.1] tracking-[-0.02em]" : "text-[19px] leading-tight",
            cor,
          )}
        >
          {valor}
        </span>
        {selo}
      </div>
      {detalhe && <span className="text-[12.5px] font-semibold text-texto-2">{detalhe}</span>}
    </div>
  );
}
