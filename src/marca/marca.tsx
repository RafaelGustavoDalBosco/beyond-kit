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

/**
 * O selo do login: o escudo e "Um produto da Dal Bosco Systems". `sobreEscuro` é o do pé do painel escuro da moldura
 * (a frase no claro do hint) e `tamanho="sm"`, o que desce para baixo do formulário no celular.
 */
export function SeloDalBosco({
  sobreEscuro,
  sobreCobalto,
  tamanho = "md",
  className,
}: {
  sobreEscuro?: boolean;
  /** @deprecated O painel do login deixou de ser azul: vale o mesmo que `sobreEscuro`. */
  sobreCobalto?: boolean;
  tamanho?: "md" | "sm";
  className?: string;
}) {
  const escuro = sobreEscuro ?? sobreCobalto;
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        tamanho === "md" ? "gap-3.5 text-base-celular" : "gap-2.5 text-base",
        escuro ? "text-hint-texto [&_b]:text-hint-titulo" : "text-texto-apoio [&_b]:text-texto",
        className,
      )}
    >
      <Brasao variante="escudo" className={tamanho === "md" ? "h-[46px]" : "h-[30px]"} />
      <span>
        Um produto da <b className="font-forte">Dal Bosco Systems</b>
      </span>
    </div>
  );
}
