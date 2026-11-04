import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

// Selo: o estado de um valor ou de um item. O ponto dá a cor; o fundo é leve.
const estilo = cva(
  "inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      tom: {
        neutro: "bg-superficie-2 text-texto-2",
        cobalto: "bg-cobalto-suave text-cobalto-tinta",
        ganho: "bg-ganho-suave text-ganho",
        aviso: "bg-aviso-suave text-aviso",
        risco: "bg-risco-suave text-risco",
        contorno: "border border-dashed border-linha-forte text-texto-2",
      },
    },
    defaultVariants: { tom: "neutro" },
  },
);

const ponto: Record<string, string> = {
  neutro: "bg-texto-3",
  cobalto: "bg-cobalto",
  ganho: "bg-ganho",
  aviso: "bg-aviso",
  risco: "bg-risco",
  contorno: "bg-texto-3",
};

export type Tom = NonNullable<VariantProps<typeof estilo>["tom"]>;

export function Selo({
  tom = "neutro",
  comPonto = false,
  className,
  title,
  children,
}: {
  tom?: Tom;
  comPonto?: boolean;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <span title={title} className={cn(estilo({ tom }), className)}>
      {comPonto && <span className={cn("size-1.5 rounded-full", ponto[tom])} />}
      {children}
    </span>
  );
}
