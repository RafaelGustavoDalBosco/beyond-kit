// O adaptador da pilha de fichas para o React Router (v6.4+ e v7): `?ficha=` na
// busca, `empilhadas` no state da location e `navigate(-n)` para voltar.

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { criarUsePilha, type AdaptadorDaPilha } from "../ficha/pilha";

const CHAVE = "ficha";

export function useAdaptadorDaPilha(): AdaptadorDaPilha {
  const local = useLocation();
  const navegar = useNavigate();
  const ficha = new URLSearchParams(local.search).get(CHAVE) ?? undefined;
  return useMemo(
    () => ({
      ler: () => ficha,
      empilhadas: () => (local.state as { empilhadas?: number } | null)?.empilhadas ?? 0,
      escrever: (valor, { empilhar, empilhadas }) => {
        const novos = new URLSearchParams(local.search);
        if (valor) novos.set(CHAVE, valor);
        else novos.delete(CHAVE);
        const texto = novos.toString();
        navegar(
          { pathname: local.pathname, search: texto ? `?${texto}` : "", hash: local.hash },
          { replace: !empilhar, state: { ...(local.state as object | null), empilhadas } },
        );
      },
      voltar: (passos) => navegar(-passos),
    }),
    [ficha, local, navegar],
  );
}

/** O `usePilha` pronto: aceita qualquer tipo de ficha; para restringir, `criarUsePilha(useAdaptadorDaPilha, TIPOS)`. */
export const usePilha = criarUsePilha(useAdaptadorDaPilha);
