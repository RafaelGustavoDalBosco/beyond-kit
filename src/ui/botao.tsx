"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

// Botão em pílula. Um primário por área (a ação principal); o secundário tem o contorno azul; o fantasma é a ação
// leve, só texto; o neutro é o Cancelar; vermelho só no que apaga ou rejeita. A borda de 1,5px existe em todos
// (transparente no cheio), para as alturas baterem lado a lado.
const estilo = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center border-[1.5px] font-extrabold whitespace-nowrap transition-colors select-none disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:shrink-0",
  {
    variants: {
      tipo: {
        primario: "border-transparent bg-cobalto text-sobre-cobalto hover:bg-cobalto-forte",
        secundario: "border-cobalto bg-superficie text-cobalto hover:bg-cobalto-suave/50",
        fantasma: "border-transparent text-cobalto hover:bg-cobalto-suave/50",
        /** O Cancelar: contorno cinza. */
        neutro: "border-linha bg-superficie text-texto hover:bg-superficie-2",
        ganho: "border-transparent bg-ganho text-white hover:bg-ganho/90",
        perigo: "border-risco bg-superficie text-risco hover:bg-risco-suave",
        "perigo-cheio": "border-transparent bg-risco text-white hover:bg-risco/90",
        /** Sobre o menu lateral branco (e, com as cores trocadas pelo `className`, no cabeçalho azul). */
        lateral: "border-transparent text-lateral-texto hover:bg-lateral-2",
      },
      // O raio vai em cada tamanho: no lg (48px) a pílula de 20 deixaria um trecho reto, então ele fecha inteiro.
      // md e sm têm a altura do botão só de ícone do mesmo tamanho (38 e 30), para baterem na mesma linha.
      tamanho: {
        lg: "h-12 gap-2 rounded-full px-6 text-[15px] [&_svg]:size-[18px]",
        md: "h-[38px] gap-[7px] rounded-pilula px-[18px] text-sm [&_svg]:size-4",
        sm: "h-[30px] gap-1.5 rounded-pilula px-3 text-[13px] [&_svg]:size-3.5",
        icone: "size-[38px] rounded-full [&_svg]:size-[18px]",
        "icone-sm": "size-[30px] rounded-full [&_svg]:size-4",
      },
    },
    compoundVariants: [
      // o botão de texto encosta mais no conteúdo
      { tipo: "fantasma", tamanho: ["lg", "md", "sm"], class: "px-2" },
      // só o ícone (fechar, mais ações, paginar): cinza, com o fundo claro sob o mouse
      {
        tipo: ["fantasma", "neutro"],
        tamanho: ["icone", "icone-sm"],
        class: "text-texto-2 hover:bg-superficie-2 hover:text-texto",
      },
    ],
    defaultVariants: { tipo: "secundario", tamanho: "md" },
  },
);

export type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof estilo> & {
  /** O filho único (o `Link` do roteador, um `<a>`) leva o visual do botão. */
  asChild?: boolean;
  /** Enquanto a ação corre: o giro no lugar do ícone (ou antes do texto), desabilitado. Não vale com `asChild`. */
  carregando?: boolean;
  /** Com `carregando`, o texto no lugar dos filhos (ex.: "Salvando…"); sem ele, os filhos ficam. */
  textoCarregando?: ReactNode;
};

/** O botão do kit, em pílula; desabilitado, guarda o `title` no hover e o clique não dispara. */
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
      className={cn(estilo({ tipo, tamanho }), carregando && "disabled:cursor-wait [&>svg]:hidden", className)}
      {...props}
      disabled={props.disabled || carregando}
      aria-busy={carregando || undefined}
    >
      {carregando && (
        <span aria-hidden className="size-[15px] shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {carregando && textoCarregando !== undefined ? textoCarregando : children}
    </button>
  );
}

/** A tecla de um atalho (`Ctrl K`, `Esc`, `Enter`). */
export function Tecla({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "numero inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-b-2 border-linha bg-superficie px-1.5 font-sans text-[11.5px] font-extrabold text-texto-2",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
