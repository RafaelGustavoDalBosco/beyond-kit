"use client";

import { Tabs } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

// Abas segmentadas: a ativa sobe como um cartão dentro do trilho.

export const Abas = Tabs.Root;
export const ConteudoDaAba = Tabs.Content;

export function TrilhoDeAbas({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Tabs.List className={cn("inline-flex h-9 items-center gap-0.5 rounded-controle bg-superficie-2 p-[3px]", className)}>
      {children}
    </Tabs.List>
  );
}

export function Aba({ value, children, contagem, className }: { value: string; children: ReactNode; contagem?: number | null; className?: string }) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        "inline-flex h-full cursor-pointer items-center gap-1.5 rounded-[7px] px-3 text-[12.5px] font-medium text-texto-2 transition-colors hover:text-texto data-[state=active]:bg-superficie data-[state=active]:text-texto data-[state=active]:shadow-1",
        className,
      )}
    >
      {children}
      {contagem != null && <span className="numero text-[11px] text-texto-3">{contagem}</span>}
    </Tabs.Trigger>
  );
}
