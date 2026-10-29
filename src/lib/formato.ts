// Formatação, sem regra nem conta: o número chega pronto do backend.

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const brlUnitario = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 4 });
const decimal = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 });
const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

type Numero = number | string;

// Decimal chega como string: o Intl formata a string sem passar por parseFloat.
export const moeda = (v: Numero) => brl.format(v as number);
// O valor por unidade (a ST, o crédito) com até 4 casas: R$ 0,046 não vira R$ 0,05.
export const moedaUnitaria = (v: Numero) => brlUnitario.format(v as number);
export const numero = (v: Numero) => decimal.format(v as number);
export const contagem = (v: Numero) => inteiro.format(v as number);
export const percentual = (v: Numero) => `${pct.format(v as number)}%`;

export function documento(d: string) {
  if (d.length === 14) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  if (d.length === 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return d;
}

export function ncm(n: string) {
  return n.length === 8 ? `${n.slice(0, 4)}.${n.slice(4, 6)}.${n.slice(6)}` : n;
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
