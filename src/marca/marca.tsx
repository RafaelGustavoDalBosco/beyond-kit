// A marca da Dal Bosco Systems: o brasão (as imagens moram no pacote, em
// marca/, e entram pelo kit.css), a assinatura do pé da tela inicial e o selo
// do pé do login.

import { cn } from "../lib/cn";

/** O brasão: `inteiro` (com o nome e o lema; a partir de uns 60 px de altura) ou `escudo` (sem as fitas, para tamanho pequeno). */
export function Brasao({ variante = "inteiro", className }: { variante?: "inteiro" | "escudo"; className?: string }) {
  return (
    <span
      role="img"
      aria-label="Brasão da Dal Bosco Systems"
      className={cn(
        "inline-block shrink-0 bg-contain bg-center bg-no-repeat",
        variante === "inteiro" ? "brasao-inteiro aspect-[480/527]" : "brasao-escudo aspect-[240/184]",
        className,
      )}
    />
  );
}

/** A assinatura do pé da página pública (a home, fora do login; nunca dentro do app): o brasão inteiro, o fio dourado e "Um produto Dal Bosco Systems". */
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
    <Caixa className={cn("mt-10 flex flex-col items-center gap-1.5 pb-2 text-center", className)}>
      <Brasao className="h-[72px]" />
      <span aria-hidden className="my-1 h-px w-[120px] bg-gradient-to-r from-transparent via-brasao-ouro to-transparent" />
      <small className="text-[11px] text-texto-3">
        Um produto Dal Bosco Systems · © <span className="numero">{ano}</span> ·{" "}
        <a href="https://dalboscosystems.com.br" target="_blank" rel="noreferrer" className="text-cobalto hover:underline">
          dalboscosystems.com.br
        </a>
      </small>
    </Caixa>
  );
}

/** O selo pequeno do pé do login: o escudo e "Um produto Dal Bosco Systems". */
export function SeloDalBosco({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-[11px] text-texto-3", className)}>
      <Brasao variante="escudo" className="h-[22px]" />
      Um produto Dal Bosco Systems
    </div>
  );
}
