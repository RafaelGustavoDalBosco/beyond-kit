"use client";

// O campo de dinheiro: o "R$" fixo à esquerda, o texto livre enquanto se
// digita e a formatação pt-BR ao sair do campo (ou no Enter). Vazio é null; o
// que não se lê volta ao valor gravado. `comoTexto` troca o number pela string
// decimal ("1234.56"), sem passar por float.

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

/** "1234.56" → "1.234,56"; vazio → "". */
function formatarDecimal(v: string | null | undefined) {
  if (!v) return "";
  const [inteiro = "", fracao = ""] = v.split(".");
  return `${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${fracao.padEnd(2, "0").slice(0, 2)}`;
}

/** "1.234,56" → "1234.56"; vazio → null; ilegível → undefined. Só arredonda (pelo float) quando vêm mais de 2 casas. */
function interpretarDecimal(texto: string): string | null | undefined {
  const limpo = texto.trim().replace(/\./g, "").replace(",", ".");
  if (limpo === "") return null;
  const partes = /^(\d*)(?:\.(\d*))?$/.exec(limpo);
  const inteiro = partes?.[1] ?? "";
  const fracao = partes?.[2] ?? "";
  if (!partes || (inteiro === "" && fracao === "")) return undefined;
  const semZeros = inteiro.replace(/^0+(?=\d)/, "") || "0";
  if (fracao.length <= 2) return `${semZeros}.${fracao.padEnd(2, "0")}`;
  return (Math.round(Number(`${semZeros}.${fracao}`) * 100) / 100).toFixed(2);
}

type PropsDoInput = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;

export type PropsDoCampoMoeda =
  | (PropsDoInput & { comoTexto?: false; valor: number | null | undefined; aoMudar: (valor: number | null) => void })
  | (PropsDoInput & { comoTexto: true; valor: string | null | undefined; aoMudar: (valor: string | null) => void });

export function CampoMoeda(props: PropsDoCampoMoeda) {
  const { valor: _valor, aoMudar: _aoMudar, comoTexto: _comoTexto, className, onKeyDown, ...resto } = props;
  const gravado = props.comoTexto ? formatarDecimal(props.valor) : formatar(props.valor);
  const [texto, setTexto] = useState(gravado);
  const [focado, setFocado] = useState(false);

  // O valor gravado mudou por fora (descartar, recarregar): o texto acompanha.
  useEffect(() => {
    if (!focado) setTexto(gravado);
  }, [gravado, focado]);

  /** Lê o texto e grava (ao sair do campo e no Enter); o ilegível volta ao gravado. */
  function gravar() {
    if (props.comoTexto) {
      const d = interpretarDecimal(texto);
      if (d === undefined) {
        setTexto(gravado);
        return;
      }
      const novo = formatarDecimal(d);
      setTexto(novo);
      if (novo !== gravado) props.aoMudar(d);
      return;
    }
    const n = interpretar(texto);
    if (n === undefined) {
      setTexto(gravado);
      return;
    }
    setTexto(formatar(n));
    if (n !== (props.valor ?? null)) props.aoMudar(n);
  }

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
          gravar();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") gravar();
          onKeyDown?.(e);
        }}
        {...resto}
      />
    </div>
  );
}
