"use client";

// As partes de um formulário de parâmetros: o cartão de cada formulário (com a
// marca de quem informou e as regras), o campo com a ajuda, o mês e a barra
// presa no pé, que salva os grupos que mudaram. O visual: o `.field`
// nos campos, o `.seletor-mes` no mês e o selo ◔ "marcado" no que mudou.

import { useRef, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem, dataHora } from "../lib/formato";
import { Botao } from "../ui/botao";
import { Campo, type PropsDoCampo } from "../ui/campo";

/** Um formulário: a superfície branca com o título, a marca de quem informou, as regras (numa faixa recuada) e os
 * campos em duas colunas. Com `mudou`, o contorno azul por dentro (a seleção) e o selo ◔ "Alterado" ao lado do
 * título. */
export function CartaoDoFormulario({
  titulo,
  selos,
  informadoPor,
  informadoEm,
  informadoRotulo = "Informado",
  regras,
  mudou,
  children,
}: {
  titulo: ReactNode;
  selos?: ReactNode;
  informadoPor?: string | null;
  informadoEm?: string | null;
  /** O texto de quem informou (a plataforma passa "Informado pelo contador"). */
  informadoRotulo?: ReactNode;
  regras?: string[] | null;
  mudou?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-g bg-ficha transition-shadow duration-(--dur-2)", mudou && "shadow-[inset_0_0_0_1.5px_var(--acao-viva)]")}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-borda-suave px-[22px] pt-4 pb-3">
        <h2 className="m-0 text-enfase font-forte tracking-normal">{titulo}</h2>
        {selos}
        {mudou && <span className="selo selo-marcado">Alterado</span>}
        {informadoEm && (
          <span className="ml-auto text-apoio text-texto-apoio">
            {informadoRotulo} · <span className="numero">{[informadoPor, dataHora(informadoEm)].filter(Boolean).join(" · ")}</span>
          </span>
        )}
      </div>
      {regras && regras.length > 0 && (
        <div className="flex flex-col gap-1 border-b border-borda-suave bg-mesa px-[22px] py-2.5">
          {regras.map((r) => (
            <p key={r} className="m-0 text-apoio text-texto-secundario">
              {r}
            </p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-[22px] pt-4 pb-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

/** Um campo: o rótulo do `.field` em cima (com o ◔ quando mudou), o controle e a ajuda embaixo. */
export function CampoDoFormulario({
  id,
  rotulo,
  ajuda,
  rodape,
  mudou,
  children,
}: {
  id: string;
  rotulo: string;
  ajuda?: string | null;
  rodape?: ReactNode;
  mudou?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field flex min-w-0 flex-col">
      {/* O id do rótulo é o que nomeia o grupo que o `htmlFor` não alcança (o `SimNao`, a `EscolhaSegmentada`). */}
      <label id={`${id}-rotulo`} htmlFor={id} className="flex items-center gap-1.5">
        {rotulo}
        {mudou && (
          <span className="text-acao-texto" title="Alterado">
            ◔<span className="sr-only"> alterado</span>
          </span>
        )}
      </label>
      {children}
      {rodape && <div className="field-ajuda">{rodape}</div>}
      {ajuda && <p className="field-ajuda mb-0">{ajuda}</p>}
    </div>
  );
}

/** O mês AAAA-MM a `passo` meses de `valor`; com `valor` vazio, o mês de hoje. */
function mesVizinho(valor: string, passo: number) {
  const hoje = new Date();
  const [ano, mes] = valor ? valor.split("-").map(Number) : [hoje.getFullYear(), hoje.getMonth() + 1 - passo];
  const d = new Date(ano!, mes! - 1 + passo, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * O mês (AAAA-MM) do campo de período, no `.seletor-mes` (‹ mês ›): as setas andam um mês (respeitando `min` e
 * `max`) e o meio é o próprio campo de mês do navegador. A seta muda o valor pelo input, então o `onChange` do app
 * recebe o evento de sempre, controlado ou não.
 */
export function Mes({ className, disabled, min, max, ...props }: Omit<PropsDoCampo, "type">) {
  const caixa = useRef<HTMLDivElement>(null);
  const andar = (passo: number) => {
    const campo = caixa.current?.querySelector("input");
    if (!campo) return;
    const novo = mesVizinho(campo.value, passo);
    if ((min && novo < String(min)) || (max && novo > String(max))) return;
    // o setter nativo mais o evento "input" fazem o React disparar o onChange, como se a pessoa tivesse escolhido
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(campo, novo);
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  };
  return (
    <div ref={caixa} className="seletor-mes w-fit">
      <button type="button" aria-label="Mês anterior" disabled={disabled} onClick={() => andar(-1)}>
        ‹
      </button>
      <span className="has-[:focus-visible]:bg-acao-100">
        <Campo
          type="month"
          min={min}
          max={max}
          disabled={disabled}
          className={cn(
            "numero h-auto min-h-0 w-auto rounded-none border-0 bg-transparent p-0 font-medio shadow-none outline-none focus:ring-0 focus-visible:outline-none disabled:bg-transparent",
            className,
          )}
          {...props}
        />
      </span>
      <button type="button" aria-label="Próximo mês" disabled={disabled} onClick={() => andar(1)}>
        ›
      </button>
    </div>
  );
}

/** A barra de vidro presa no pé: quantos grupos mudaram (◔, o "marcado"), Descartar e Salvar (com o girador dentro do
 * botão enquanto salva). */
export function BarraDeSalvar({
  grupos,
  salvando,
  aoDescartar,
  aoSalvar,
}: {
  grupos: number;
  salvando: boolean;
  aoDescartar: () => void;
  aoSalvar: () => void;
}) {
  return (
    <div
      className={cn(
        "menu-flutuante sticky bottom-4 z-20 flex items-center gap-2 rounded-g py-2 pr-2 pl-5",
      )}
    >
      <span className="min-w-0 flex-1">
        {grupos > 0 ? (
          <span className="font-medio text-acao-texto">
            ◔ <span className="numero">{contagem(grupos)}</span> {grupos === 1 ? "formulário alterado" : "formulários alterados"}
          </span>
        ) : (
          <span className="text-texto-apoio">Nenhuma alteração</span>
        )}
      </span>
      <Botao tipo="neutro" disabled={!grupos || salvando} onClick={aoDescartar}>
        Descartar
      </Botao>
      <Botao tipo="primario" disabled={!grupos} carregando={salvando} textoCarregando="Salvando…" onClick={aoSalvar}>
        Salvar
      </Botao>
    </div>
  );
}
