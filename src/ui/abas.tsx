"use client";

import type { LucideIcon } from "lucide-react";
import { Tabs } from "radix-ui";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";

// Abas em pílula (o padrão): a ativa em azul cheio, as outras em cinza claro, a contagem dentro do texto; no celular
// o trilho rola de lado. Sublinhadas (a variante): texto sobre um fio, a ativa em azul com o traço embaixo.

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

/** O trilho das abas, em pílulas; no celular não quebra: rola de lado. `largo` ocupa a largura toda e reparte entre
 * as abas (o modal, o detalhe do cadastro); `sublinhado` troca as pílulas por abas de texto sobre um fio. */
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
          sublinhado
            ? "flex gap-6 border-b border-linha"
            : "max-w-full min-w-0 items-center gap-2 celular:flex-nowrap celular:overflow-x-auto celular:sem-barra",
          largo ? "flex w-full *:flex-1 *:justify-center" : !sublinhado && "inline-flex flex-wrap",
          className,
        )}
      >
        {children}
      </Tabs.List>
    </Sublinhado.Provider>
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
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-[13.5px] font-bold whitespace-nowrap transition-colors data-pelo-mouse:outline-none",
        sublinhado
          ? "-mb-px border-b-2 border-transparent px-0.5 py-2.5 text-texto-2 data-[state=active]:border-cobalto data-[state=active]:text-cobalto data-[state=inactive]:hover:text-texto"
          : // no celular o trilho rola e cortaria o anel de foco de fora: ali o anel vai por dentro da pílula (branco na ativa)
            "h-8 rounded-pilula bg-superficie-2 px-3.5 text-neutro data-[state=active]:bg-cobalto data-[state=active]:text-sobre-cobalto data-[state=inactive]:hover:bg-superficie-3 celular:focus-visible:outline-offset-[-4px] celular:data-[state=active]:focus-visible:outline-sobre-cobalto",
        className,
      )}
    >
      {Icone && <Icone className="size-4 shrink-0" />}
      {children}
      {contagem != null &&
        (sublinhado ? (
          <span className="numero rounded-pilula bg-superficie-2 px-[7px] py-px text-[11px] text-texto-2">{contagem}</span>
        ) : (
          <span className="numero">{contagem}</span>
        ))}
    </Tabs.Trigger>
  );
}
