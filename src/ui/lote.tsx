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

/** A barra escura que flutua embaixo da lista enquanto há linha marcada: a `contagem` (a frase vem do app), o
 * `total`, as ações (os filhos) e o × que limpa a seleção. No celular, fica acima da barra de navegação. */
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
        // 78px no celular: os 66 da barra de navegação e o mesmo respiro de 12
        "sticky bottom-3 z-20 mx-auto mt-3 flex w-max max-w-full animate-entrar flex-wrap items-center gap-x-3.5 gap-y-2 rounded-bloco bg-lote py-2 pr-2 pl-[18px] text-sm font-bold text-white shadow-2 celular:bottom-[78px]",
        className,
      )}
    >
      <span className="numero" aria-live="polite">
        {contagem}
        {total != null && <> · {total}</>}
      </span>
      {children}
      <button
        type="button"
        onClick={aoLimpar}
        aria-label={rotuloDeLimpar}
        title={rotuloDeLimpar}
        className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** A ação secundária da barra de lote (o Rejeitar): o contorno claro sobre o escuro. A principal é um `Botao`
 * primário, `tamanho="sm"`. */
export function AcaoDoLote({ className, ...props }: BotaoProps) {
  return (
    <Botao
      tipo="secundario"
      tamanho="sm"
      {...props}
      className={cn("border-white/40 bg-transparent text-white hover:bg-white/10", className)}
    />
  );
}
