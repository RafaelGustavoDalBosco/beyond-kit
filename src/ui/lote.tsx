"use client";

// A seleção em lote: a `LinhaDeLista` leva a caixa de seleção (`selecionada`/`aoSelecionar`) e, com alguma marcada,
// o app põe a `BarraDeLote` depois do `Bloco` da lista, fora dele (o `Bloco` corta o que passa da borda). O kit só desenha: quem está marcado, o total e o que cada ação faz são do app.
//
//   {marcadas.size > 0 && (
//     <BarraDeLote contagem={`${marcadas.size} selecionadas`} total={moeda(total)} aoLimpar={limpar}>
//       <AcaoDoLote onClick={rejeitar}>Rejeitar</AcaoDoLote>
//       <Botao tipo="primario" tamanho="sm" onClick={aprovar}>Aprovar {marcadas.size}</Botao>
//     </BarraDeLote>
//   )}

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao, type BotaoProps } from "./botao";

/** A barra de vidro (o material dos menus) que flutua embaixo da lista enquanto há linha marcada: a `contagem` (a
 * frase vem do app), o `total` no positivo, as ações (os filhos) e o × que limpa a seleção. No celular, fica acima da
 * barra de navegação. */
export function BarraDeLote({
  contagem,
  total,
  aoLimpar,
  rotuloDeLimpar = "Limpar a seleção",
  children,
  className,
}: {
  contagem: ReactNode;
  total?: ReactNode;
  aoLimpar: () => void;
  rotuloDeLimpar?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // 61px no celular: os 49 da barra de navegação e o mesmo respiro de 12
        "menu-flutuante sticky bottom-3 z-20 mx-auto mt-3 flex w-max max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-g py-2 pr-2 pl-5 text-base font-medio celular:bottom-[61px]",
        className,
      )}
    >
      <span className="numero" aria-live="polite">
        {contagem}
        {total != null && (
          <>
            <span className="text-texto-apoio"> · </span>
            <span className="font-forte text-positivo">{total}</span>
          </>
        )}
      </span>
      {children}
      <button
        type="button"
        onClick={aoLimpar}
        aria-label={rotuloDeLimpar}
        title={rotuloDeLimpar}
        className="btn btn-icon btn-p"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** A ação secundária da barra de lote (o Rejeitar): o botão neutro, no preenchimento. A principal é um `Botao`
 * primário, `tamanho="sm"`. */
export function AcaoDoLote({ className, ...props }: BotaoProps) {
  return <Botao tipo="secundario" tamanho="sm" {...props} className={className} />;
}
