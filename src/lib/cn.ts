import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// As escalas do `@theme` do `kit.css` que o tailwind-merge não conhece de fábrica: sem elas, o `rounded-*`, o
// `shadow-*` e o `animate-*` do kit não saem da base quando o `className` traz outro.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["controle", "icone", "cartao", "bloco", "ficha", "pilula"],
      shadow: ["1", "2", "3", "bloco", "gaveta", "folha"],
      animate: ["entrar", "subir", "brilhar", "deslizar", "folha", "surgir", "correr"],
    },
  },
});

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
