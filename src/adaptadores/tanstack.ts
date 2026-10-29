// O adaptador da pilha de fichas para o TanStack Router: `?ficha=` no search,
// `empilhadas` no state da location e `router.history.go(-n)` para voltar.

import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

import { criarUsePilha, type AdaptadorDaPilha } from "../ficha/pilha";

export function useAdaptadorDaPilha(): AdaptadorDaPilha {
  const busca = useSearch({ strict: false }) as { ficha?: string };
  const navegar = useNavigate();
  const router = useRouter();
  const ficha = busca.ficha;
  return useMemo(
    () => ({
      ler: () => ficha,
      empilhadas: () => (router.state.location.state as { empilhadas?: number }).empilhadas ?? 0,
      escrever: (valor, { empilhar, empilhadas }) =>
        navegar({
          to: ".",
          search: ((s: Record<string, unknown>) => ({ ...s, ficha: valor })) as never,
          state: ((s: Record<string, unknown>) => ({ ...s, empilhadas })) as never,
          replace: !empilhar,
        }),
      voltar: (passos) => router.history.go(-passos),
    }),
    [ficha, navegar, router],
  );
}

/** O `usePilha` pronto: aceita qualquer tipo de ficha; para restringir, `criarUsePilha(useAdaptadorDaPilha, TIPOS)`. */
export const usePilha = criarUsePilha(useAdaptadorDaPilha);
