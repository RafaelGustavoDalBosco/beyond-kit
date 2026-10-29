// O campo de dinheiro: o "R$" fixo à esquerda, o texto livre enquanto se
// digita e a formatação pt-BR ao sair do campo. Vazio é null; o que não se lê
// volta ao valor gravado.

import { useEffect, useState, type InputHTMLAttributes } from "react";

import { cn } from "../lib/cn";

import { Campo } from "./campo";

const formato = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatar = (v: number | null | undefined) => (v == null ? "" : formato.format(v));

/** "1.234,56" → 1234.56; vazio → null; ilegível → undefined. */
function interpretar(texto: string): number | null | undefined {
  const limpo = texto.trim();
  if (limpo === "") return null;
  const n = Number(limpo.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : undefined;
}

export function CampoMoeda({
  valor,
  aoMudar,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  valor: number | null | undefined;
  aoMudar: (valor: number | null) => void;
}) {
  const [texto, setTexto] = useState(formatar(valor));
  const [focado, setFocado] = useState(false);

  // O valor gravado mudou por fora (descartar, recarregar): o texto acompanha.
  useEffect(() => {
    if (!focado) setTexto(formatar(valor));
  }, [valor, focado]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-texto-3">R$</span>
      <Campo
        inputMode="decimal"
        className={cn("numero pl-10 text-right", className)}
        value={texto}
        onFocus={() => setFocado(true)}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          setFocado(false);
          const n = interpretar(texto);
          if (n === undefined) {
            setTexto(formatar(valor));
            return;
          }
          setTexto(formatar(n));
          if (n !== (valor ?? null)) aoMudar(n);
        }}
        {...props}
      />
    </div>
  );
}
