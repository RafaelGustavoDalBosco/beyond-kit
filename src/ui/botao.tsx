"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

const estilo = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-controle font-medium whitespace-nowrap transition-[background,box-shadow,color] select-none disabled:cursor-default disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tipo: {
        primario: "bg-cobalto text-sobre-cobalto shadow-1 hover:bg-cobalto-forte",
        secundario: "border border-linha bg-superficie text-texto shadow-1 hover:border-linha-forte hover:bg-superficie-2",
        fantasma: "text-texto-2 hover:bg-superficie-2 hover:text-texto",
        ganho: "bg-ganho text-white shadow-1 hover:brightness-110",
        perigo: "border border-linha bg-superficie text-risco shadow-1 hover:bg-risco-suave",
        /** Sobre o menu lateral escuro. */
        lateral: "text-lateral-texto hover:bg-lateral-2 hover:text-lateral-ativo",
      },
      tamanho: {
        md: "h-9 px-3.5 text-[13px]",
        sm: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        icone: "size-9",
        "icone-sm": "size-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { tipo: "secundario", tamanho: "md" },
  },
);

export type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof estilo> & {
  /** O filho único (o `Link` do roteador, um `<a>`) leva o visual do botão. */
  asChild?: boolean;
  /** Enquanto a ação corre: o Loader2 girando no lugar do ícone (ou antes do texto), desabilitado. Não vale com `asChild`. */
  carregando?: boolean;
  /** Com `carregando`, o texto no lugar dos filhos (ex.: "Salvando…"); sem ele, os filhos ficam. */
  textoCarregando?: ReactNode;
};

/** O botão do kit; desabilitado, guarda o `title` no hover e o clique não dispara. */
export function Botao({ className, tipo, tamanho, type = "button", asChild, carregando, textoCarregando, children, ...props }: BotaoProps) {
  if (asChild)
    return (
      <Slot.Root className={cn(estilo({ tipo, tamanho }), className)} {...props}>
        {children}
      </Slot.Root>
    );
  return (
    <button
      type={type}
      className={cn(estilo({ tipo, tamanho }), carregando && "[&>svg:not([data-girando])]:hidden", className)}
      {...props}
      disabled={props.disabled || carregando}
      aria-busy={carregando || undefined}
    >
      {carregando && <Loader2 data-girando="" className="animate-spin" aria-hidden />}
      {carregando && textoCarregando !== undefined ? textoCarregando : children}
    </button>
  );
}

export function Tecla({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "numero inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-linha bg-superficie-2 px-1 text-[10.5px] text-texto-3",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
