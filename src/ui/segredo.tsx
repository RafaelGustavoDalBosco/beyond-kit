"use client";

// O que aparece uma vez só (uma chave, um link, uma senha gerada): na área recuada (`bg-mesa`, raio do grupo), o
// valor no fundo do campo, com o fio por dentro, copiável, e o aviso que o consumidor manda.

import { Check, Copy, KeyRound, X, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Codigo } from "../ficha/partes";

import { Botao } from "./botao";
import { Emblema } from "./emblema";

/** Um valor longo (a chave, o link), que quebra linha; o `Codigo` da ficha é de uma linha só. */
export function Segredo({
  icone: Icone = KeyRound,
  nome,
  valor,
  aviso,
  aoFechar,
}: {
  icone?: LucideIcon;
  nome: string;
  valor: string;
  aviso?: ReactNode;
  aoFechar?: () => void;
}) {
  const [ok, setOk] = useState(false);
  return (
    <div className="flex items-start gap-3 rounded-grupo bg-mesa p-4">
      <Emblema icone={Icone} tamanho="sm" className="bg-campo" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="text-base font-forte text-texto">{nome}</div>
        <div className="flex items-start gap-2 rounded-m bg-campo py-1 pr-1 pl-3 shadow-[inset_0_0_0_1px_var(--borda-suave)]">
          <span className="numero min-w-0 flex-1 py-1 text-base leading-texto [overflow-wrap:anywhere] select-all">{valor}</span>
          <Botao
            tipo="fantasma"
            tamanho="icone-sm"
            aria-label="Copiar"
            onClick={() => {
              navigator.clipboard.writeText(valor);
              setOk(true);
              setTimeout(() => setOk(false), 1400);
            }}
          >
            {ok ? <Check className="text-ok" /> : <Copy />}
          </Botao>
        </div>
        {aviso && <p className="m-0 text-apoio text-texto-apoio">{aviso}</p>}
      </div>
      {aoFechar && (
        <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Fechar" onClick={aoFechar}>
          <X />
        </Botao>
      )}
    </div>
  );
}

/** A senha que sai em claro uma vez só (criar ou redefinir), com o login de quem é. */
export function SenhaGerada({ usuario, senha, aviso }: { usuario: string; senha: string; aviso?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-grupo bg-mesa p-4">
      <div className="flex items-center gap-2.5 text-base font-forte text-texto">
        <Emblema icone={KeyRound} tamanho="xs" className="bg-campo" />
        <span>
          Senha de <span className="numero">{usuario}</span>
        </span>
      </div>
      <div>
        <Codigo nome="Senha" valor={senha} copiavel={senha} />
      </div>
      {aviso && <p className="m-0 text-apoio text-texto-apoio">{aviso}</p>}
    </div>
  );
}
