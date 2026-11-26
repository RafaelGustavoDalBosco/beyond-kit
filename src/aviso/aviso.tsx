"use client";

// Os avisos de ação (o toast): o `.toast`, a faixa de vidro que sobe no rodapé, centrada, com mola. O tipo é o sinal
// no selinho tonal: ✓ verde no sucesso, i neutro no info, ◇ laranja no aviso, ✕ vermelho no erro. Sucesso, info e aviso somem sozinhos em 2 s (4 s com a ação, o "Desfazer"; o
// tempo para com o mouse em cima); o erro fica até o ✕. Vários empilham, o mais novo embaixo. O resultado de uma
// ação leva a frase que o consumidor manda; a recusa, a frase do erro, que o consumidor pode trocar por
// `configurarAvisos`.

import { X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "../lib/cn";

type Tipo = "sucesso" | "erro" | "aviso" | "info";

/** A ação de um aviso ("Desfazer"): o clique roda o `aoClicar` e fecha o aviso. */
export type AcaoDoAviso = { rotulo: string; aoClicar: () => void };

/** O que acompanha o título de um aviso: a frase embaixo e a ação. */
export type OpcoesDoAviso = { frase?: string; acao?: AcaoDoAviso };

type Aviso = OpcoesDoAviso & { id: number; tipo: Tipo; titulo: string };

// Quanto tempo o aviso fica na tela, em ms (o `--toast-duracao`); o de erro não some sozinho.
const DURACAO = 2000;
const DURACAO_COM_ACAO = 4000;
// O tempo da saída (o `.toast` some em `--dur-2`) antes de sair da pilha.
const SAIDA = 200;

let avisos: Aviso[] = [];
let proximo = 1;
const ouvintes = new Set<() => void>();
const mudou = () => ouvintes.forEach((f) => f());

function mostrar(tipo: Tipo, titulo: string, opcoes?: OpcoesDoAviso) {
  const novo: Aviso = { id: proximo++, tipo, titulo, frase: opcoes?.frase, acao: opcoes?.acao };
  // O mesmo aviso repetido troca o que já está na tela, não empilha; o mais novo entra no começo da lista, que a
  // `.toasts` (coluna invertida) põe embaixo.
  avisos = [novo, ...avisos.filter((a) => a.titulo !== titulo || a.frase !== novo.frase)].slice(0, 4);
  mudou();
}

function fechar(id: number) {
  avisos = avisos.filter((a) => a.id !== id);
  mudou();
}

const config = {
  fraseDoErro: (erro: unknown): string => (erro instanceof Error ? erro.message : String(erro)),
};

/** O consumidor com erro próprio da API troca a frase que `avisar.erro` mostra. */
export function configurarAvisos(opcoes: { fraseDoErro?: (erro: unknown) => string }) {
  if (opcoes.fraseDoErro) config.fraseDoErro = opcoes.fraseDoErro;
}

/** A frase de uma recusa, a mesma que o `avisar.erro` mostraria (para a recusa que fica na tela, como a do login). */
export const fraseDoErro = (erro: unknown) => config.fraseDoErro(erro);

/**
 * O aviso do resultado de uma ação: o texto é o título e as opções trazem a frase de baixo e a ação
 * (`avisar.sucesso("3 correções rejeitadas", { acao: { rotulo: "Desfazer", aoClicar } })`). No `erro`, a frase do erro
 * é o título; com `titulo` nas opções, ela desce para a linha de baixo.
 */
export const avisar = {
  sucesso: (texto: string, opcoes?: OpcoesDoAviso) => mostrar("sucesso", texto, opcoes),
  erro: (erro: unknown, opcoes?: { titulo?: string; acao?: AcaoDoAviso }) => {
    const frase = config.fraseDoErro(erro);
    if (opcoes?.titulo) mostrar("erro", opcoes.titulo, { frase, acao: opcoes.acao });
    else mostrar("erro", frase, { acao: opcoes?.acao });
  },
  aviso: (texto: string, opcoes?: OpcoesDoAviso) => mostrar("aviso", texto, opcoes),
  info: (texto: string, opcoes?: OpcoesDoAviso) => mostrar("info", texto, opcoes),
};

// A classe do `.toast` (a cor do selinho do sinal) e o sinal no círculo.
const CLASSE: Record<Tipo, string> = { sucesso: "toast-sucesso", erro: "toast-erro", aviso: "toast-aviso", info: "toast-info" };
const SINAL: Record<Tipo, string> = { sucesso: "✓", erro: "✕", aviso: "◇", info: "i" };

function UmAviso({ a }: { a: Aviso }) {
  const [visivel, setVisivel] = useState(false);
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);
  const duracao = a.tipo === "erro" ? 0 : a.acao ? DURACAO_COM_ACAO : DURACAO;

  const sair = () => {
    clearTimeout(espera.current);
    setVisivel(false);
    setTimeout(() => fechar(a.id), SAIDA);
  };
  const contar = (ms: number) => {
    if (!duracao) return;
    clearTimeout(espera.current);
    espera.current = setTimeout(sair, ms);
  };

  useEffect(() => {
    // um quadro depois de montar, para a transição do `.toast` correr
    const quadro = requestAnimationFrame(() => setVisivel(true));
    contar(duracao);
    return () => {
      cancelAnimationFrame(quadro);
      clearTimeout(espera.current);
    };
  }, []);

  return (
    <div
      role={a.tipo === "erro" ? "alert" : "status"}
      className={cn("toast max-w-[min(600px,calc(100vw-32px))]", CLASSE[a.tipo], visivel && "is-visivel")}
      onMouseEnter={() => clearTimeout(espera.current)}
      onMouseLeave={() => contar(1000)}
    >
      <i aria-hidden>{SINAL[a.tipo]}</i>
      <span className="flex min-w-0 flex-col whitespace-normal [overflow-wrap:anywhere]">
        <span>{a.titulo}</span>
        {a.frase && <span className="text-apoio font-normal text-texto-apoio">{a.frase}</span>}
      </span>
      {a.acao && (
        <button
          type="button"
          className="btn btn-tonal btn-p"
          onClick={() => {
            a.acao?.aoClicar();
            sair();
          }}
        >
          {a.acao.rotulo}
        </button>
      )}
      {!duracao && (
        <button type="button" className="btn btn-icon btn-p" aria-label="Fechar" onClick={sair}>
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

/** A pilha dos avisos, uma vez na raiz do app: o `.toasts`, no rodapé, centrado. */
export function Avisos() {
  const lista = useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    () => avisos,
    () => avisos,
  );
  return (
    // `data-avisos` é como o `Modal` reconhece o clique num aviso (o ✕ e a ação), que fica fora da árvore dele
    <div data-avisos aria-live="polite" className="toasts">
      {lista.map((a) => (
        <UmAviso key={a.id} a={a} />
      ))}
    </div>
  );
}
