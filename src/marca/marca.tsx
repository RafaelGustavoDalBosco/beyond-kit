// A marca da Dal Bosco Systems: o brasão (as imagens moram no pacote, em
// marca/, e entram pelo kit.css) e a assinatura do pé do rodapé público.

import { cn } from "../lib/cn";

/** O brasão: `inteiro` (com o nome e o lema; a partir de uns 60 px de altura) ou `escudo` (sem as fitas, para tamanho pequeno). */
export function Brasao({ variante = "inteiro", className }: { variante?: "inteiro" | "escudo"; className?: string }) {
  return (
    <span
      role="img"
      aria-label="Brasão da Dal Bosco Systems"
      className={cn(
        "inline-block shrink-0 bg-contain bg-center bg-no-repeat",
        variante === "inteiro" ? "brasao-inteiro aspect-[480/527]" : "brasao-escudo aspect-[240/199]",
        className,
      )}
    />
  );
}

/** A assinatura do pé da página pública (a home e as telas sem login; nunca dentro do app): o brasão inteiro, o fio dourado e "Um produto da Dal Bosco Systems". */
export function AssinaturaDalBosco({
  ano = new Date().getFullYear(),
  como = "footer",
  className,
}: {
  ano?: number;
  /** `div` dentro de outro rodapé (o RodapePublico), que já é o <footer>. */
  como?: "footer" | "div";
  className?: string;
}) {
  const Caixa = como;
  return (
    <Caixa className={cn("mt-10 flex flex-col items-center gap-2 pb-2 text-center", className)}>
      <Brasao className="h-[76px]" />
      <span aria-hidden className="h-px w-16 bg-brasao-ouro" />
      <small className="text-base font-medio text-texto-secundario">
        Um produto da <b className="font-forte text-texto">Dal Bosco Systems</b> · © <span className="numero">{ano}</span> ·{" "}
        <a href="https://dalboscosystems.com.br" target="_blank" rel="noreferrer" className="text-acao-texto hover:underline">
          dalboscosystems.com.br
        </a>
      </small>
    </Caixa>
  );
}
