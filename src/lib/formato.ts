// Formatação pt-BR, sem regra nem conta: o número chega pronto do backend. Zero é zero; o valor ausente não passa por
// aqui (na tela é o `SemValor`, nunca 0 nem travessão).

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlUnitario = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 4 });
const ate4Casas = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });
const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

type Numero = number | string;

// Decimal chega como string: o Intl formata a string sem passar por parseFloat.
export const moeda = (v: Numero) => brl.format(v as number);
// O valor por unidade (a ST, o crédito) com até 4 casas: R$ 0,046 não vira R$ 0,05.
export const moedaUnitaria = (v: Numero) => brlUnitario.format(v as number);
export const numero = (v: Numero) => ate4Casas.format(v as number);
export const contagem = (v: Numero) => inteiro.format(v as number);
export const percentual = (v: Numero, casas?: number) => `${(casas === undefined ? pct : fixo(casas)).format(v as number)}%`;

// A precisão do campo: o número sai com as casas que o campo define, nem mais nem menos (1,500 kg não vira 1,5 kg).
const fixos = new Map<number, Intl.NumberFormat>();
function fixo(casas: number) {
  let f = fixos.get(casas);
  if (!f) fixos.set(casas, (f = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })));
  return f;
}

/** "1.234,50" com as `casas` do campo (2 por padrão), sem o símbolo: tabelas e linhas. */
export const decimal = (v: Numero, casas = 2) => fixo(casas).format(v as number);

/** "1.250,000 kg": a quantidade com a precisão do campo e a unidade, se houver. */
export const quantidade = (v: Numero, casas = 0, unidade?: string) => `${fixo(casas).format(v as number)}${unidade ? ` ${unidade}` : ""}`;

/** Só os dígitos ("123.456.789-01" → "12345678901"): o valor que os campos com máscara devolvem ao formulário. */
export const digitos = (v: string) => v.replace(/\D/g, "");

/** 123.456.789-01 (CPF) ou 12.345.678/0001-90 (CNPJ), com ou sem a máscara na entrada; outro tamanho volta como veio. */
export function documento(entrada: string) {
  const d = digitos(entrada);
  if (d.length !== 11 && d.length !== 14) return entrada;
  if (d.length === 14) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length === 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return d;
}

/** (54) 99999-0000 ou (54) 3333-0000; com o +55 na entrada, "+55 (54) 99999-0000"; outro formato volta como veio. */
export function telefone(entrada: string) {
  const d = digitos(entrada);
  const pais = d.length > 11 && d.startsWith("55") ? "+55 " : "";
  const n = pais ? d.slice(2) : d;
  if (n.length !== 10 && n.length !== 11) return entrada;
  return `${pais}(${n.slice(0, 2)}) ${n.slice(2, n.length - 4)}-${n.slice(-4)}`;
}

/** 99999-000; outro tamanho volta como veio. */
export function cep(entrada: string) {
  const d = digitos(entrada);
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : entrada;
}

export function ncm(n: string) {
  return n.length === 8 ? `${n.slice(0, 4)}.${n.slice(4, 6)}.${n.slice(6)}` : n;
}

export function cest(c: string) {
  return c.length === 7 ? `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5)}` : c;
}

// "AAAA-MM-DD" do relógio do ERP, pela string (new Date cai no dia anterior).
export function data(d: string) {
  const [a, m, dia] = d.slice(0, 10).split("-");
  return `${dia}/${m}/${a}`;
}

// Timestamp gravado em UTC, sem fuso.
export function dataHora(t: string) {
  const d = new Date(/[zZ+]/.test(t.slice(19)) ? t : `${t}Z`);
  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

export function periodo(p: string) {
  const [a, m] = p.split("-");
  return `${MESES[Number(m) - 1]}/${a}`;
}

export function periodoLongo(p: string) {
  const [a, m] = p.split("-");
  return `${MESES_LONGOS[Number(m) - 1]} de ${a}`;
}

export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter((p) => p.length > 2 || /^[A-Z]/.test(p));
  return ((partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")).toUpperCase();
}
