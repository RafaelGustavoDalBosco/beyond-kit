// A marca da Dal Bosco Systems: o brasão (as imagens moram no pacote, em
// marca/, e entram pelo kit.css), a assinatura do pé da tela inicial e o selo
// do login.

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

/** A assinatura do pé da página pública (a home, fora do login; nunca dentro do app): o brasão inteiro, o fio dourado e "Um produto da Dal Bosco Systems". */
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
      <span aria-hidden className="my-1 h-px w-16 bg-brasao-ouro" />
      <small className="text-xs font-semibold text-texto-2">
        Um produto da <b className="font-bold text-texto">Dal Bosco Systems</b> · © <span className="numero">{ano}</span> ·{" "}
        <a href="https://dalboscosystems.com.br" target="_blank" rel="noreferrer" className="font-bold text-cobalto hover:underline">
          dalboscosystems.com.br
        </a>
      </small>
    </Caixa>
  );
}

/**
 * O selo do login: o escudo e "Um produto da Dal Bosco Systems". `sobreCobalto` é o do pé do painel azul (a frase
 * em branco) e `tamanho="sm"`, o que desce para baixo do botão no celular.
 */
export function SeloDalBosco({
  sobreCobalto,
  tamanho = "md",
  className,
}: {
  sobreCobalto?: boolean;
  tamanho?: "md" | "sm";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2.5 font-bold",
        tamanho === "md" ? "text-[13px]" : "text-[12.5px]",
        sobreCobalto ? "text-sobre-cobalto/85 [&_b]:text-sobre-cobalto" : "text-texto-2 [&_b]:text-texto",
        className,
      )}
    >
      <Brasao variante="escudo" className={tamanho === "md" ? "h-12" : "h-8"} />
      <span>
        Um produto da <b className="font-extrabold">Dal Bosco Systems</b>
      </span>
    </div>
  );
}
