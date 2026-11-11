"use client";

// O carregamento depois da primeira carga (o esqueleto dela é o `Carregando`): a barra fina no alto da área e a lista
// antiga apagada no lugar ao trocar aba, filtro ou mês, e a tarefa longa com as etapas marcadas. Nenhum deles mostra
// um giro sozinho no meio da tela.

import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "../lib/cn";

import { LinhaDeDemora, useDemora } from "./estados";

const COR_DA_BARRA = { cobalto: "bg-cobalto", ganho: "bg-ganho", aviso: "bg-aviso", risco: "bg-risco" };

/** A barra de progresso do envio ou do processamento, de 8px; `esperando` pulsa enquanto o total não chegou e `tom`
 * pinta o preenchimento (o uso que chega ao limite fica aviso ou risco). Sem `rotulo` nem `valor`, só a barra (a das
 * `Etapas`). Mora aqui, e não no envio, para o `ui/carregamento` não puxar a `Tabela` (e o `@tanstack/react-table`). */
export function BarraDeProgresso({
  rotulo,
  valor,
  parte,
  esperando,
  tom = "cobalto",
}: {
  rotulo?: string;
  valor?: string;
  parte: number;
  esperando?: boolean;
  tom?: keyof typeof COR_DA_BARRA;
}) {
  return (
    <div className="flex flex-col gap-2">
      {(rotulo || valor) && (
        <div className="flex justify-between gap-3 text-[13px]">
          <span className="font-bold">{rotulo}</span>
          <span className="numero font-semibold text-texto-2">{valor}</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-fio">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", COR_DA_BARRA[tom], esperando && "animate-brilhar")}
          style={{ width: `${Math.min(100, Math.round(parte * 100))}%` }}
        />
      </div>
    </div>
  );
}

/** A barra fina de 3px no alto da área enquanto a aba, o filtro ou o mês trocam: cresce até três quartos e, quando a
 * carga chega (`ativa` volta a `false`), completa e some. Fica presa ao alto do ancestral posicionado (`relative`). */
export function BarraDeCarga({ ativa, className }: { ativa: boolean; className?: string }) {
  const barra = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barra.current;
    if (!ativa || !el) return;
    // Parte do zero sem transição; ler a largura faz o navegador aplicar o zero antes de crescer.
    el.style.transition = "none";
    el.style.width = "0";
    el.style.opacity = "1";
    void el.offsetWidth;
    el.style.transition = "width 1.1s ease";
    el.style.width = "75%";
    return () => {
      el.style.transition = "width 0.25s ease, opacity 0.3s ease 0.25s";
      el.style.width = "100%";
      el.style.opacity = "0";
    };
  }, [ativa]);
  return (
    <div
      ref={barra}
      aria-hidden
      className={cn("pointer-events-none absolute top-0 left-0 z-[2] h-[3px] w-0 rounded-r-full bg-cobalto opacity-0", className)}
    />
  );
}

/**
 * O invólucro da lista que recarrega: enquanto `ativa`, o conteúdo antigo fica no lugar, apagado, sem clique e sem
 * foco, até o novo chegar (as abas e os filtros que disparam a troca ficam fora dele). Depois de uns 2,5 s entra a
 * linha com o giro e a frase de `demora`. `barra` põe a `BarraDeCarga` no alto do próprio invólucro (quando a área
 * inteira é ele).
 */
export function Recarregando({
  ativa,
  demora,
  barra,
  children,
  className,
}: {
  ativa: boolean;
  /** A frase da espera longa ("Ainda buscando as notas do mês."); sem ela, a linha não aparece. */
  demora?: ReactNode;
  barra?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const demorou = useDemora(ativa);
  return (
    <div aria-busy={ativa || undefined} className={cn("relative", className)}>
      {barra && <BarraDeCarga ativa={ativa} />}
      {ativa && demorou && demora && <LinhaDeDemora>{demora}</LinhaDeDemora>}
      {/* inert tira o clique e também o foco: pelo teclado a linha antiga não abre nada */}
      <div inert={ativa} className={cn("transition-opacity duration-200", ativa && "opacity-45")}>
        {children}
      </div>
    </div>
  );
}

/** Uma etapa da tarefa longa: já feita, a atual (com o giro) ou ainda pendente. */
export type Etapa = { rotulo: ReactNode; estado: "feito" | "atual" | "pendente" };

/**
 * A tarefa longa (gerar um PDF, sincronizar): o título com a ação à direita, a barra de progresso e as etapas marcadas.
 * `parte` é a fração já feita, de 0 a 1; sem ela, vale a das etapas feitas sobre o total.
 */
export function Etapas({
  titulo,
  acao,
  itens,
  parte,
  className,
}: {
  titulo?: ReactNode;
  /** À direita do título: o botão que dispara a tarefa ou o que baixa o resultado. */
  acao?: ReactNode;
  itens: Etapa[];
  parte?: number;
  className?: string;
}) {
  const feitas = itens.filter((e) => e.estado === "feito").length;
  return (
    <div className={cn("rounded-cartao border border-linha bg-superficie p-4", className)}>
      {(titulo || acao) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="m-0 text-[15px] font-extrabold">{titulo}</h4>
          {acao}
        </div>
      )}
      <BarraDeProgresso parte={parte ?? feitas / itens.length} />
      <ol className="m-0 mt-3.5 list-none p-0">
        {itens.map((etapa, i) => (
          <li
            key={i}
            aria-current={etapa.estado === "atual" ? "step" : undefined}
            className={cn("flex items-center gap-2.5 py-[5px] font-bold", etapa.estado === "pendente" ? "text-texto-3" : "text-texto")}
          >
            <span
              aria-hidden
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full",
                etapa.estado === "feito" && "bg-ganho text-white",
                etapa.estado === "pendente" && "border-2 border-linha",
              )}
            >
              {etapa.estado === "feito" && <Check className="size-3" strokeWidth={3} />}
              {etapa.estado === "atual" && <Loader2 className="size-4 animate-spin text-cobalto" />}
            </span>
            {etapa.rotulo}
          </li>
        ))}
      </ol>
    </div>
  );
}
