"use client";

import type { LucideIcon } from "lucide-react";
import { Tabs } from "radix-ui";
import { Children, createContext, useContext, type ComponentProps, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";

// Abas: as sublinhadas (`.abas`/`.aba`: texto apagado sobre o fio, a ativa no azul com o traço de 2px e o peso forte, a
// contagem no texto: "Pendentes 12"); no celular o trilho rola de lado. `largo` é o segmentado (`.seg`), que ocupa a
// largura toda e reparte entre as abas (o modal, o detalhe do cadastro): as opções da mesma largura e o indicador
// branco que desliza com mola até a ativa. O `Segmentado` é o mesmo controle fora das abas do Radix: troca a visão sem
// mudar de tela.

// A `Aba` sabe se o trilho é o segmentado.
const NoSegmentado = createContext(false);

// O Radix não aceita value "" (o filtro "Todos"); por dentro o "" vira este sentinela e volta na saída.
const VAZIO = "__vazio__";
const dentro = (v: string) => (v === "" ? VAZIO : v);
const fora = (v: string) => (v === VAZIO ? "" : v);

/** A raiz das abas (o `Tabs.Root`); aceita "" como valor. */
export function Abas({ value, defaultValue, onValueChange, ...props }: ComponentProps<typeof Tabs.Root>) {
  return (
    <Tabs.Root
      value={value === undefined ? undefined : dentro(value)}
      defaultValue={defaultValue === undefined ? undefined : dentro(defaultValue)}
      onValueChange={onValueChange && ((v: string) => onValueChange(fora(v)))}
      {...props}
    />
  );
}

/** O conteúdo de uma aba (o `Tabs.Content`); aceita "" como valor. */
export function ConteudoDaAba({ value, ...props }: ComponentProps<typeof Tabs.Content>) {
  return <Tabs.Content value={dentro(value)} {...props} />;
}

/** O trilho das abas, sublinhadas sobre o fio; no celular não quebra: rola de lado. `largo` troca pelo segmentado
 * da largura toda, com o indicador que desliza (o CSS acha a aba ativa, até a oitava). */
export function TrilhoDeAbas({
  children,
  largo,
  className,
  "aria-label": rotulo,
}: {
  children: ReactNode;
  largo?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <NoSegmentado.Provider value={!!largo}>
      <Tabs.List
        aria-label={rotulo}
        style={largo ? ({ "--n": Children.toArray(children).length } as CSSProperties) : undefined}
        className={cn(
          largo ? "seg is-deslizante grid w-full" : "abas max-w-full min-w-0 celular:overflow-x-auto celular:sem-barra",
          className,
        )}
      >
        {children}
        {/* o indicador vai por último: as abas ficam do 1º ao n-ésimo filho, que é como o CSS acha a ativa */}
        {largo && <span aria-hidden className="seg-ind" />}
      </Tabs.List>
    </NoSegmentado.Provider>
  );
}

/** Uma aba do trilho; a `contagem` vai dentro do texto ("Pendentes 12"). */
export function Aba({
  value,
  icone: Icone,
  children,
  contagem,
  className,
}: {
  value: string;
  icone?: LucideIcon;
  children: ReactNode;
  contagem?: number | null;
  className?: string;
}) {
  const segmentado = useContext(NoSegmentado);
  // O Radix foca a aba por script no mousedown e o Chrome mostra o anel nesse foco: o clique marca a aba e o anel
  // volta na próxima tecla (ou quando o foco sai).
  const tirarMarca = (e: { currentTarget: HTMLElement }) => delete e.currentTarget.dataset.peloMouse;
  return (
    <Tabs.Trigger
      value={dentro(value)}
      onPointerDown={(e) => (e.currentTarget.dataset.peloMouse = "")}
      onKeyDown={tirarMarca}
      onBlur={tirarMarca}
      className={cn(
        "whitespace-nowrap data-pelo-mouse:shadow-none data-pelo-mouse:outline-none",
        segmentado
          ? // a ativa leva o peso forte; o fundo é o indicador que desliza, no `.seg-ind`
            "seg-opt min-w-0"
          : // a ativa é o `.aba[aria-selected=true]`, que o Radix marca; no celular o trilho rola e o anel vai por dentro
            "aba inline-flex shrink-0 items-center gap-1.5 celular:focus-visible:-outline-offset-4",
        className,
      )}
    >
      {segmentado ? (
        // no segmentado a opção corta com reticências: o conteúdo vai numa linha só
        <span className="inline-flex max-w-full items-center justify-center gap-1.5 truncate align-middle">
          {Icone && <Icone aria-hidden className="size-4 shrink-0" />}
          {children}
          {contagem != null && <span className="numero">{contagem}</span>}
        </span>
      ) : (
        <>
          {Icone && <Icone aria-hidden className="size-4 shrink-0" />}
          {children}
          {contagem != null && <span className="numero">{contagem}</span>}
        </>
      )}
    </Tabs.Trigger>
  );
}

/** Uma opção do `Segmentado`. `desligada` fica apagada, sem clique, e segue recebendo o ponteiro, para a dica
 * (`hint`, no `data-hint`) dizer o porquê. */
export type OpcaoDoSegmentado<C extends string = string> = {
  chave: C;
  rotulo: ReactNode;
  hint?: string;
  desligada?: boolean;
};

/** O controle segmentado: troca a visão sem mudar de tela. As opções têm a mesma largura e o
 * indicador branco desliza com mola até a escolhida (`--n` quantas são, `--i` qual é). As setas andam entre as
 * opções ligadas e o foco vai junto. */
export function Segmentado<C extends string = string>({
  opcoes,
  valor,
  aoMudar,
  rotulo,
  className,
}: {
  opcoes: ReadonlyArray<OpcaoDoSegmentado<C>>;
  valor: C | null | undefined;
  aoMudar: (chave: C) => void;
  /** Para o leitor de tela: o que o segmentado troca. */
  rotulo: string;
  className?: string;
}) {
  const escolhida = opcoes.findIndex((o) => o.chave === valor);
  const livres = opcoes.filter((o) => !o.desligada);
  // a opção que entra no Tab: a escolhida ou, sem ela, a primeira ligada
  const noTab = (livres.find((o) => o.chave === valor) ?? livres[0])?.chave;
  return (
    <div
      role="radiogroup"
      aria-label={rotulo}
      className={cn("seg is-deslizante", className)}
      style={{ "--n": opcoes.length, "--i": Math.max(0, escolhida) } as CSSProperties}
    >
      {opcoes.map((o) => (
        <button
          key={o.chave}
          type="button"
          role="radio"
          aria-checked={o.chave === valor}
          aria-disabled={o.desligada || undefined}
          data-hint={o.hint}
          tabIndex={o.chave === noTab ? 0 : -1}
          className={cn("seg-opt", o.chave === valor && "is-ativa", o.desligada && "is-desligada")}
          onClick={() => !o.desligada && aoMudar(o.chave)}
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            const i = livres.findIndex((x) => x.chave === valor);
            const prox = livres[(i + (e.key === "ArrowRight" ? 1 : livres.length - 1)) % livres.length];
            if (!prox) return;
            aoMudar(prox.chave);
            e.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="radio"]')[opcoes.indexOf(prox)]?.focus();
          }}
        >
          {o.rotulo}
        </button>
      ))}
      {escolhida >= 0 && <span aria-hidden className="seg-ind" />}
    </div>
  );
}
