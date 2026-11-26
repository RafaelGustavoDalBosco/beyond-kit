"use client";

// O adaptador da pilha de fichas para o Next.js (App Router): `?ficha=` na URL,
// `empilhadas` no `window.history.state` e `history.go(-n)` para voltar.
//
// Usa o `pushState`/`replaceState` nativos, que o Next integra ao roteador (o
// `useSearchParams` acompanha) e que são o único jeito de guardar o
// `empilhadas` na entrada do histórico: o `router.push` não leva state. O Next
// copia as chaves internas dele para o state novo, então o nosso campo convive
// com as dele.

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { criarUsePilha, type AdaptadorDaPilha } from "../ficha/pilha";

const CHAVE = "ficha";

export function useAdaptadorDaPilha(): AdaptadorDaPilha {
  const caminho = usePathname();
  const parametros = useSearchParams();
  const ficha = parametros.get(CHAVE) ?? undefined;
  const busca = parametros.toString();
  return useMemo(
    () => ({
      ler: () => ficha,
      empilhadas: () => (window.history.state as { empilhadas?: number } | null)?.empilhadas ?? 0,
      escrever: (valor, { empilhar, empilhadas }) => {
        const novos = new URLSearchParams(busca);
        if (valor) novos.set(CHAVE, valor);
        else novos.delete(CHAVE);
        const texto = novos.toString();
        const url = texto ? `${caminho}?${texto}` : caminho;
        if (empilhar) window.history.pushState({ empilhadas }, "", url);
        else window.history.replaceState({ empilhadas }, "", url);
      },
      voltar: (passos) => window.history.go(-passos),
    }),
    [ficha, busca, caminho],
  );
}

/** O `usePilha` pronto: aceita qualquer tipo de ficha; para restringir, `criarUsePilha(useAdaptadorDaPilha, TIPOS)`. */
export const usePilha = criarUsePilha(useAdaptadorDaPilha);
