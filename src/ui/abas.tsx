"use client";

import type { LucideIcon } from "lucide-react";
import { Tabs } from "radix-ui";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";

// Abas: as sublinhadas do Lastro (`.abas`/`.aba`: texto sobre o fio, a ativa em azul escuro com o traço de 2px e
// peso 600, a contagem no texto: "Pendentes 12"); no celular o trilho rola de lado. `largo` é o segmentado do
// Lastro (`.seg`), que ocupa a largura toda e reparte entre as abas (o modal, o detalhe do cadastro).

// A `Aba` sabe se o trilho é o segmentado.
const Segmentado = createContext(false);

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
 * da largura toda. `sublinhado` fica aceito por compatibilidade: as abas do Lastro já são sublinhadas. */
export function TrilhoDeAbas({
  children,
  largo,
  className,
  "aria-label": rotulo,
}: {
  children: ReactNode;
  largo?: boolean;
  sublinhado?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Segmentado.Provider value={!!largo}>
      <Tabs.List
        aria-label={rotulo}
        className={cn(
          largo
            ? "seg flex w-full *:flex-1 *:justify-center"
            : "abas max-w-full min-w-0 celular:overflow-x-auto celular:sem-barra",
          className,
        )}
      >
        {children}
      </Tabs.List>
    </Segmentado.Provider>
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
  const segmentado = useContext(Segmentado);
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
        "shrink-0 whitespace-nowrap data-pelo-mouse:outline-none",
        segmentado
          ? // o `.seg` corta o que sai dele: o anel de foco vai por dentro; a ativa é o `.seg-opt.is-ativa`
            "seg-opt justify-center focus-visible:-outline-offset-2 data-[state=active]:text-acao-texto data-[state=active]:shadow-[inset_0_0_0_1px_var(--acao)]"
          : // a ativa é o `.aba[aria-selected=true]`, que o Radix marca; no celular o trilho rola e o anel vai por dentro
            "aba inline-flex items-center gap-1.5 celular:focus-visible:-outline-offset-2",
        className,
      )}
    >
      {Icone && <Icone aria-hidden className="size-4 shrink-0" />}
      {children}
      {contagem != null && <span className="numero">{contagem}</span>}
    </Tabs.Trigger>
  );
}
