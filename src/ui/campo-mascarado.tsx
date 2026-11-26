"use client";

// Os campos com formato brasileiro: o documento (CPF, CNPJ ou os dois), o telefone e o CEP, com a máscara enquanto se
// digita, e o número com a precisão do campo. A tela mostra formatado; o formulário recebe só o valor: os dígitos
// dos mascarados e a string decimal do número ("1250.500"), sem passar por float. Vazio é `null`, nunca "" nem 0.
// Colar vale o mesmo que digitar: "+55 (54) 99999-0000", "12.345.678/0001-90" ou "R$ 1.234,56" entram limpos.

import { useEffect, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { flushSync } from "react-dom";

import { cn } from "../lib/cn";
import { digitos } from "../lib/formato";

import { Campo } from "./campo";

type PropsDoInput = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type">;

export type Mascara = "cpf" | "cnpj" | "documento" | "telefone" | "cep";

const TAMANHO: Record<Mascara, number> = { cpf: 11, cnpj: 14, documento: 14, telefone: 11, cep: 8 };

function padrao(mascara: Mascara, d: string) {
  switch (mascara) {
    case "cpf":
      return "###.###.###-##";
    case "cnpj":
      return "##.###.###/####-##";
    case "documento":
      return d.length > 11 ? "##.###.###/####-##" : "###.###.###-##";
    case "telefone":
      return d.length > 10 ? "(##) #####-####" : "(##) ####-####";
    case "cep":
      return "#####-###";
  }
}

/** Os dígitos no desenho da máscara, até onde há dígito (o separador do fim só entra com o dígito seguinte). */
export function aplicarMascara(mascara: Mascara, valor: string) {
  const d = digitos(valor);
  let saida = "";
  let i = 0;
  for (const c of padrao(mascara, d)) {
    if (i >= d.length) break;
    saida += c === "#" ? d[i++] : c;
  }
  return saida;
}

// O telefone colado com o país ("+55 54 99999-0000") perde o 55 do começo.
function limpar(mascara: Mascara, texto: string) {
  let d = digitos(texto);
  if (mascara === "telefone" && d.length > 11 && d.startsWith("55")) d = d.slice(2);
  return d.slice(0, TAMANHO[mascara]);
}

/** Onde fica o cursor depois de `n` dígitos no texto formatado. */
function posicaoDepoisDe(texto: string, n: number) {
  if (n <= 0) return 0;
  let vistos = 0;
  for (let i = 0; i < texto.length; i++) if (/\d/.test(texto.charAt(i)) && ++vistos === n) return i + 1;
  return texto.length;
}

const AUTOCOMPLETAR: Partial<Record<Mascara, string>> = { telefone: "tel", cep: "postal-code" };

export type PropsDoCampoMascarado = PropsDoInput & {
  mascara: Mascara;
  /** Só os dígitos, como o formulário guarda. */
  valor: string | null | undefined;
  /** Recebe só os dígitos; vazio é `null`. */
  aoMudar: (digitos: string | null) => void;
};

/** O campo com a máscara brasileira (CPF, CNPJ, documento, telefone, CEP): formata enquanto se digita ou cola e
 * devolve só os dígitos. O cursor fica onde estava entre os dígitos; o Backspace sobre um separador apaga o dígito
 * de antes dele. */
export function CampoMascarado({ mascara, valor, aoMudar, className, ...resto }: PropsDoCampoMascarado) {
  const atual = digitos(valor ?? "");
  const exibido = aplicarMascara(mascara, atual);

  function mudou(e: ChangeEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const bruto = el.value;
    const cursor = el.selectionStart ?? bruto.length;
    let antes = digitos(bruto.slice(0, cursor)).length;
    let novo = limpar(mascara, bruto);
    // apagou só o separador: os dígitos não mudaram, então sai o dígito que vinha antes dele
    const apagando = (e.nativeEvent as InputEvent).inputType === "deleteContentBackward";
    if (apagando && novo === atual && bruto.length < exibido.length && antes > 0) {
      novo = novo.slice(0, antes - 1) + novo.slice(antes);
      antes -= 1;
    }
    aoMudar(novo === "" ? null : novo);
    const texto = aplicarMascara(mascara, novo);
    requestAnimationFrame(() => {
      if (document.activeElement !== el) return;
      const p = posicaoDepoisDe(texto, Math.min(antes, novo.length));
      el.setSelectionRange(p, p);
    });
  }

  return (
    <Campo
      inputMode="numeric"
      autoComplete={AUTOCOMPLETAR[mascara]}
      className={cn("numero", className)}
      value={exibido}
      onChange={mudou}
      {...resto}
    />
  );
}

/** "1.234,5" → "1234.500" (com 3 casas); vazio → null; ilegível → undefined. Arredonda pela string, meio para cima,
 * sem float (o BigInt pela função: o literal `1n` não compila nos projetos de alvo abaixo do ES2020). */
export function lerDecimal(texto: string, casas: number): string | null | undefined {
  const limpo = texto.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
  if (limpo === "") return null;
  const partes = /^(\d*)(?:\.(\d*))?$/.exec(limpo);
  if (!partes) return undefined;
  const inteiro = partes[1] ?? "";
  const fracao = partes[2] ?? "";
  if (inteiro === "" && fracao === "") return undefined;
  const corte = BigInt((inteiro || "0") + fracao.slice(0, casas).padEnd(casas, "0")) + (Number(fracao[casas] ?? "0") >= 5 ? BigInt(1) : BigInt(0));
  const s = corte.toString().padStart(casas + 1, "0");
  return casas ? `${s.slice(0, -casas)}.${s.slice(-casas)}` : s;
}

/** "1234.5" → "1.234,500" (com 3 casas); vazio → "". */
export function escreverDecimal(valor: string | null | undefined, casas: number) {
  if (valor == null || valor === "") return "";
  const [inteiro = "0", fracao = ""] = valor.split(".");
  const milhar = inteiro.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return casas ? `${milhar},${fracao.padEnd(casas, "0").slice(0, casas)}` : milhar;
}

export type PropsDoCampoNumero = PropsDoInput & {
  /** A string decimal ("1250.500"), como a API manda e recebe; `null` é sem valor (diferente de "0.000"). */
  valor: string | null | undefined;
  aoMudar: (valor: string | null) => void;
  /** As casas do campo: a precisão que ele mostra e devolve (2 por padrão). */
  casas?: number;
  /** O que fica à direita, fixo: "%", "kg", "un". */
  unidade?: string;
};

/** O campo de número com a precisão do campo: o texto livre enquanto se digita, formatado em pt-BR ao sair (ou no
 * Enter) com as `casas` certas. Devolve a string decimal com essas casas; vazio é `null`, e o ilegível volta ao
 * gravado. Para dinheiro, o `CampoMoeda`. */
export function CampoNumero({ valor, aoMudar, casas = 2, unidade, className, onKeyDown, ...resto }: PropsDoCampoNumero) {
  const gravado = escreverDecimal(valor, casas);
  const [texto, setTexto] = useState(gravado);
  const [focado, setFocado] = useState(false);

  // o valor gravado mudou por fora (descartar, recarregar): o texto acompanha
  useEffect(() => {
    if (!focado) setTexto(gravado);
  }, [gravado, focado]);

  // `emitir` envolve o aoMudar: no Enter, o flushSync deixa o estado do consumidor pronto antes do envio
  function gravar(emitir: (f: () => void) => void = (f) => f()) {
    const lido = lerDecimal(texto, casas);
    if (lido === undefined) {
      setTexto(gravado);
      return;
    }
    setTexto(escreverDecimal(lido, casas));
    const antes = valor == null || valor === "" ? null : lerDecimal(escreverDecimal(valor, casas), casas);
    if (lido !== antes) emitir(() => aoMudar(lido));
  }

  const campo = (
    <Campo
      inputMode="decimal"
      className={cn("numero text-right", unidade && "pr-10", className)}
      value={texto}
      onFocus={() => setFocado(true)}
      onChange={(e) => setTexto(e.target.value)}
      onBlur={() => {
        setFocado(false);
        gravar();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key !== "Enter") return;
        // o envio nativo sairia com o valor antigo: grava, renderiza e só então envia
        const enviar = !e.defaultPrevented;
        e.preventDefault();
        gravar(flushSync);
        if (enviar) e.currentTarget.form?.requestSubmit();
      }}
      {...resto}
    />
  );
  if (!unidade) return campo;
  return (
    <div className="relative w-full min-w-0">
      {campo}
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-base text-texto-apoio">{unidade}</span>
    </div>
  );
}
