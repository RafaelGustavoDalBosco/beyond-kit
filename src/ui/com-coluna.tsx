import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

// Classes literais por ponto, para o Tailwind achar: a grade abre, a coluna gruda no alto (na `--topo`) e, à
// direita, passa para o fim.
const PONTO = {
  "2xl": { grade: "@2xl:grid-cols-[var(--grade)]", coluna: "@2xl:sticky @2xl:top-[var(--topo)] @2xl:self-start", direita: "@2xl:order-last" },
  "3xl": { grade: "@3xl:grid-cols-[var(--grade)]", coluna: "@3xl:sticky @3xl:top-[var(--topo)] @3xl:self-start", direita: "@3xl:order-last" },
  "4xl": { grade: "@4xl:grid-cols-[var(--grade)]", coluna: "@4xl:sticky @4xl:top-[var(--topo)] @4xl:self-start", direita: "@4xl:order-last" },
  "5xl": { grade: "@5xl:grid-cols-[var(--grade)]", coluna: "@5xl:sticky @5xl:top-[var(--topo)] @5xl:self-start", direita: "@5xl:order-last" },
} as const;

/** O conteúdo principal com uma coluna lateral (os produtos e o resumo da correção; os itens da nota e o detalhe do
 * escolhido). Com largura no contêiner (o `ponto` é do contêiner, não da janela: 2xl 42rem, 3xl 48rem, 4xl 56rem,
 * 5xl 64rem), a coluna fica ao `lado`, presa no alto na rolagem, e o principal fica com o resto; sem largura, vira
 * uma coluna só, com a lateral em cima do principal. */
export function ComColuna({
  coluna,
  largura = 340,
  ponto = "4xl",
  lado = "direita",
  topo = 16,
  children,
  className,
}: {
  coluna: ReactNode;
  /** A largura da coluna, em px. */
  largura?: number;
  /** Onde a coluna presa para, em px do alto da janela: 16, ou 80 sob a `BarraDoTopo` presa (64px + 16). */
  topo?: number;
  ponto?: keyof typeof PONTO;
  lado?: "direita" | "esquerda";
  children: ReactNode;
  className?: string;
}) {
  const p = PONTO[ponto];
  const grade = lado === "direita" ? `minmax(0,1fr) ${largura}px` : `${largura}px minmax(0,1fr)`;
  return (
    <div className="@container">
      <div className={cn("grid grid-cols-1 gap-4", p.grade, className)} style={{ "--grade": grade, "--topo": `${topo}px` } as CSSProperties}>
        <div className={cn("flex min-w-0 flex-col gap-4", p.coluna, lado === "direita" && p.direita)}>{coluna}</div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
