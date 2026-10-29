// O adaptador da pilha de fichas para app sem roteador: `?ficha=` direto na URL
// pelo `pushState`/`replaceState`, `empilhadas` no `history.state` e o
// `popstate` (o voltar do navegador) avisando quem lê.

import { useMemo, useSyncExternalStore } from "react";

import { criarUsePilha, type AdaptadorDaPilha } from "../ficha/pilha";

const CHAVE = "ficha";
const MUDOU = "dalbosco:ficha";

function ouvir(aviso: () => void) {
  window.addEventListener("popstate", aviso);
  window.addEventListener(MUDOU, aviso);
  return () => {
    window.removeEventListener("popstate", aviso);
    window.removeEventListener(MUDOU, aviso);
  };
}

const lerDaUrl = () => new URLSearchParams(window.location.search).get(CHAVE) ?? undefined;

export function useAdaptadorDaPilha(): AdaptadorDaPilha {
  const ficha = useSyncExternalStore(ouvir, lerDaUrl, () => undefined);
  return useMemo(
    () => ({
      ler: () => ficha,
      empilhadas: () => (window.history.state as { empilhadas?: number } | null)?.empilhadas ?? 0,
      escrever: (valor, { empilhar, empilhadas }) => {
        const url = new URL(window.location.href);
        if (valor) url.searchParams.set(CHAVE, valor);
        else url.searchParams.delete(CHAVE);
        const estado = { ...(window.history.state as object | null), empilhadas };
        if (empilhar) window.history.pushState(estado, "", url);
        else window.history.replaceState(estado, "", url);
        window.dispatchEvent(new Event(MUDOU));
      },
      voltar: (passos) => window.history.go(-passos),
    }),
    [ficha],
  );
}

/** O `usePilha` pronto: aceita qualquer tipo de ficha; para restringir, `criarUsePilha(useAdaptadorDaPilha, TIPOS)`. */
export const usePilha = criarUsePilha(useAdaptadorDaPilha);
