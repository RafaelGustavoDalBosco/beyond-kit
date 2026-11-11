"use client";

import type { LucideIcon } from "lucide-react";
import { Tabs } from "radix-ui";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";

// Abas segmentadas: a ativa sobe como um cartão dentro do trilho. Sublinhadas: texto sobre um fio, a ativa em cobalto
// com o traço embaixo (a ficha, o detalhe).

// A `Aba` sabe se o trilho é sublinhado.
const Sublinhado = createContext(false);

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

/** O trilho das abas; `largo` ocupa a largura toda e reparte entre as abas (o modal, o detalhe do cadastro);
 * `sublinhado` troca o trilho segmentado por abas de texto sobre um fio da largura toda (a ficha, o detalhe). */
export function TrilhoDeAbas({
  children,
  largo,
  sublinhado,
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
    <Sublinhado.Provider value={!!sublinhado}>
      <Tabs.List
        aria-label={rotulo}
        className={cn(
          sublinhado ? "flex gap-6 border-b border-linha" : "h-10 items-center gap-0.5 rounded-xl bg-superficie-2 p-1",
          largo ? "flex w-full *:flex-1 *:justify-center" : !sublinhado && "inline-flex",
          className,
        )}
      >
        {children}
      </Tabs.List>
    </Sublinhado.Provider>
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
  const sublinhado = useContext(Sublinhado);
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
        "inline-flex cursor-pointer items-center gap-1.5 text-texto-2 transition-colors hover:text-texto data-pelo-mouse:outline-none",
        sublinhado
          ? "-mb-px border-b-2 border-transparent px-0.5 py-2.5 text-[13.5px] font-medium data-[state=active]:border-cobalto data-[state=active]:font-semibold data-[state=active]:text-cobalto"
          : "h-full rounded-lg px-4 text-sm font-medium data-[state=active]:bg-superficie data-[state=active]:text-texto data-[state=active]:shadow-1",
        className,
      )}
    >
      {Icone && <Icone className="size-3.5" />}
      {children}
      {contagem != null &&
        (sublinhado ? (
          <span className="numero rounded-full bg-superficie-2 px-[7px] py-px text-[11px] text-texto-2">{contagem}</span>
        ) : (
          <span className="numero text-[11px] text-texto-3">{contagem}</span>
        ))}
    </Tabs.Trigger>
  );
}
