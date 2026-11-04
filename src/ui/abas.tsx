"use client";

import type { LucideIcon } from "lucide-react";
import { Tabs } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

// Abas segmentadas: a ativa sobe como um cartão dentro do trilho.

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

/** O trilho das abas; `largo` ocupa a largura toda e reparte entre as abas (o modal, o detalhe do cadastro). */
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
    <Tabs.List
      aria-label={rotulo}
      className={cn(
        "h-10 items-center gap-0.5 rounded-xl bg-superficie-2 p-1",
        largo ? "flex w-full *:flex-1 *:justify-center" : "inline-flex",
        className,
      )}
    >
      {children}
    </Tabs.List>
  );
}

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
  return (
    <Tabs.Trigger
      value={dentro(value)}
      className={cn(
        "inline-flex h-full cursor-pointer items-center gap-1.5 rounded-lg px-4 text-sm font-medium text-texto-2 transition-colors hover:text-texto data-[state=active]:bg-superficie data-[state=active]:text-texto data-[state=active]:shadow-1",
        className,
      )}
    >
      {Icone && <Icone className="size-3.5" />}
      {children}
      {contagem != null && <span className="numero text-[11px] text-texto-3">{contagem}</span>}
    </Tabs.Trigger>
  );
}
