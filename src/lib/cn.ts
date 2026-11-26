import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// As escalas do `@theme` do `kit.css` que o tailwind-merge não conhece de fábrica. Sem o `text` (tamanho) e o
// `font-weight`, o `text-apoio` seria lido como cor e um `text-texto` depois dele o apagaria; sem o `radius`, o
// `shadow` e o `animate`, os do kit não sairiam da base quando o `className` traz outro.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["micro", "apoio", "base", "base-celular", "enfase", "botao-celular", "subtitulo", "titulo", "numero-p", "numero-m", "numero-g", "numero-xg"],
      "font-weight": ["normal", "medio", "forte"],
      radius: ["p", "m", "g", "pilula"],
      shadow: ["p", "m", "g", "topo", "acao"],
      leading: ["texto", "titulo", "numero"],
      tracking: ["titulo"],
      animate: ["entrar", "subir", "deslizar", "folha", "surgir", "correr"],
    },
  },
});

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
