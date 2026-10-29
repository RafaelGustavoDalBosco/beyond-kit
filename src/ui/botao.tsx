import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

const estilo = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-controle font-medium whitespace-nowrap transition-[background,box-shadow,color] select-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tipo: {
        primario: "bg-cobalto text-sobre-cobalto shadow-1 hover:bg-cobalto-forte",
        secundario: "border border-linha bg-superficie text-texto shadow-1 hover:border-linha-forte hover:bg-superficie-2",
        fantasma: "text-texto-2 hover:bg-superficie-2 hover:text-texto",
        ganho: "bg-ganho text-white shadow-1 hover:brightness-110",
        perigo: "border border-linha bg-superficie text-risco shadow-1 hover:bg-risco-suave",
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

export type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof estilo>;

export function Botao({ className, tipo, tamanho, type = "button", ...props }: BotaoProps) {
  return <button type={type} className={cn(estilo({ tipo, tamanho }), className)} {...props} />;
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
