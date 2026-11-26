// A pilha de fichas: cada item abre a ficha dele por cima da anterior, e a
// pilha inteira mora na URL (?ficha=produto:1001|nota:196), então o link
// copiado reabre o mesmo caminho. O núcleo não conhece roteador: quem lê e
// escreve a URL é um adaptador (`adaptadores/tanstack`, `adaptadores/next`).

import { useCallback, useMemo } from "react";

export type Ficha<T extends string = string> = { tipo: T; id: string };

/** Lê a pilha da URL; com `tipos`, descarta as fichas de tipo desconhecido. */
export function lerPilha<T extends string = string>(valor: unknown, tipos?: readonly T[]): Ficha<T>[] {
  if (typeof valor !== "string" || !valor) return [];
  return valor.split("|").flatMap((parte) => {
    const i = parte.indexOf(":");
    const tipo = parte.slice(0, i) as T;
    const id = decodeURIComponent(parte.slice(i + 1));
    return i > 0 && (!tipos || tipos.includes(tipo)) && id ? [{ tipo, id }] : [];
  });
}

export function escreverPilha(pilha: Ficha[]): string | undefined {
  return pilha.length ? pilha.map((f) => `${f.tipo}:${encodeURIComponent(f.id)}`).join("|") : undefined;
}

/**
 * O que a pilha pede ao roteador. Cada ficha aberta é uma entrada do histórico;
 * `empilhadas` é quantas seguidas a pilha empilhou (vive no state da entrada).
 * Voltar desce o histórico até onde ele cobre (o "voltar" do navegador faz o
 * mesmo); o resto, como a pilha que veio inteira pelo link, se substitui.
 */
export interface AdaptadorDaPilha {
  /** O `?ficha=` de agora. */
  ler(): string | undefined;
  /** Grava o `?ficha=` (undefined tira) e o `empilhadas` no state; `empilhar` cria entrada, senão substitui. */
  escrever(valor: string | undefined, opcoes: { empilhar: boolean; empilhadas: number }): void;
  /** O `empilhadas` do state da entrada de agora (0 quando não há). */
  empilhadas(): number;
  /** Desce `passos` entradas do histórico. */
  voltar(passos: number): void;
}

export type UsePilha<T extends string = string> = () => {
  pilha: Ficha<T>[];
  /** Abre por cima; a mesma ficha já aberta no topo não duplica. */
  abrir: (f: Ficha<T>) => void;
  /** Abre do zero, fora de uma ficha (uma linha de lista). */
  abrirSo: (f: Ficha<T>) => void;
  voltar: () => void;
  voltarPara: (i: number) => void;
  fechar: () => void;
};

/** Monta o `usePilha` em cima de um adaptador de URL; `tipos` restringe o que a URL pode abrir. */
export function criarUsePilha<T extends string = string>(useAdaptador: () => AdaptadorDaPilha, tipos?: readonly T[]): UsePilha<T> {
  return function usePilha() {
    const adaptador = useAdaptador();
    const valor = adaptador.ler();
    const pilha = useMemo(() => lerPilha<T>(valor, tipos), [valor]);

    const trocar = useCallback(
      (nova: Ficha<T>[], empilhar: boolean) =>
        adaptador.escrever(escreverPilha(nova), {
          empilhar,
          empilhadas: empilhar ? (nova.length > 1 ? adaptador.empilhadas() : 0) + 1 : 0,
        }),
      [adaptador],
    );
    const descer = (ate: number) => {
      const passos = pilha.length - ate;
      if (passos > 0 && passos <= adaptador.empilhadas()) adaptador.voltar(passos);
      else trocar(pilha.slice(0, ate), false);
    };

    return {
      pilha,
      abrir: (f: Ficha<T>) => {
        const topo = pilha.at(-1);
        if (topo?.tipo === f.tipo && topo.id === f.id) return;
        trocar([...pilha, f], true);
      },
      abrirSo: (f: Ficha<T>) => trocar([f], true),
      voltar: () => descer(pilha.length - 1),
      voltarPara: (i: number) => descer(i + 1),
      fechar: () => descer(0),
    };
  };
}
