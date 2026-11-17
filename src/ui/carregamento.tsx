"use client";

// O carregamento depois da primeira carga (o esqueleto dela é o `Carregando`): a barra fina no alto da área e a lista
// antiga apagada no lugar ao trocar aba, filtro ou mês, e a tarefa longa com os passos marcados. Nenhum deles mostra
// um giro sozinho no meio da tela.

import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { LinhaDeDemora, useDemora } from "./estados";

const COR_DA_BARRA = { acao: "bg-acao", positivo: "bg-positivo", atencao: "bg-atencao", erro: "bg-erro" };

/** A barra de progresso do envio ou do processamento (`.barra` do Lastro, 6px); `esperando` pulsa enquanto o total não
 * chegou e `tom` pinta o preenchimento (o uso que chega ao limite fica `atencao`; `erro` só para a falha). Sem
 * `rotulo` nem `valor`, só a barra (a das `Etapas`). Mora aqui, e não no envio, para o `ui/carregamento` não puxar a
 * `Tabela` (e o `@tanstack/react-table`). */
export function BarraDeProgresso({
  rotulo,
  valor,
  parte,
  esperando,
  tom = "acao",
}: {
  rotulo?: string;
  valor?: string;
  parte: number;
  esperando?: boolean;
  tom?: keyof typeof COR_DA_BARRA;
}) {
  return (
    <div>
      {(rotulo || valor) && (
        <div className="flex justify-between gap-3">
          <span className="font-medio">{rotulo}</span>
          <span className="numero text-texto-apoio">{valor}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={esperando ? undefined : Math.min(100, Math.round(parte * 100))}
        className="barra"
      >
        <i
          className={cn("transition-[width] duration-500 motion-reduce:transition-none", COR_DA_BARRA[tom], esperando && "animate-pulse")}
          style={{ width: `${Math.min(100, Math.round(parte * 100))}%` }}
        />
      </div>
    </div>
  );
}

/** A barra fina de 2px que corre no alto da área enquanto a aba, o filtro ou o mês trocam (`.carregando-barra` do
 * Lastro). Fica presa ao alto do ancestral posicionado (`relative`). */
export function BarraDeCarga({ ativa, className }: { ativa: boolean; className?: string }) {
  if (!ativa) return null;
  return (
    <div aria-hidden className={cn("carregando-barra z-[2]", className)}>
      <i />
    </div>
  );
}

/**
 * O invólucro da lista que recarrega: enquanto `ativa`, o conteúdo antigo fica no lugar, apagado, sem clique e sem
 * foco, até o novo chegar (as abas e os filtros que disparam a troca ficam fora dele). Depois de uns 2,5 s entra a
 * linha com o girador e a frase de `demora`. `barra` põe a `BarraDeCarga` no alto do próprio invólucro (quando a área
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
      <div inert={ativa} className={cn("transition-opacity duration-200 motion-reduce:transition-none", ativa && "opacity-45")}>
        {children}
      </div>
    </div>
  );
}

/** Uma etapa da tarefa longa: já feita, a atual ou ainda pendente. */
export type Etapa = { rotulo: ReactNode; estado: "feito" | "atual" | "pendente" };

const CLASSE_DA_ETAPA = { feito: "is-feito", atual: "is-atual", pendente: "" };

/**
 * A tarefa longa (gerar um PDF, sincronizar): o título com a ação à direita, a barra de progresso e os passos
 * (`.passos` do Lastro: o número no círculo, o feito com ✓ e o fio verde, o atual em azul). `parte` é a fração já
 * feita, de 0 a 1; sem ela, vale a dos passos feitos sobre o total.
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
    <div className={cn("rounded-m border border-borda bg-ficha px-4 py-3.5", className)}>
      {(titulo || acao) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          <h4 className="m-0 text-enfase font-forte">{titulo}</h4>
          {acao}
        </div>
      )}
      <BarraDeProgresso parte={parte ?? feitas / itens.length} />
      {/* o `.passos` reparte em quatro colunas; com menos passos, uma coluna por passo */}
      <ol
        className="passos mt-3.5"
        style={itens.length < 4 ? { gridTemplateColumns: `repeat(${itens.length}, minmax(0, 1fr))` } : undefined}
      >
        {itens.map((etapa, i) => (
          <li key={i} aria-current={etapa.estado === "atual" ? "step" : undefined} className={CLASSE_DA_ETAPA[etapa.estado]}>
            <i aria-hidden>{etapa.estado === "feito" ? "✓" : i + 1}</i>
            <b>{etapa.rotulo}</b>
          </li>
        ))}
      </ol>
    </div>
  );
}
