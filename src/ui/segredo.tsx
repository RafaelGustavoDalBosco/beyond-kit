// O que aparece uma vez só (uma chave, um link, uma senha gerada): destacado,
// copiável e com o aviso que o consumidor manda.

import { Check, Copy, KeyRound, X, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Codigo } from "../ficha/partes";

import { Botao } from "./botao";

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
    <div className="flex items-start gap-3 rounded-xl border border-cobalto/30 bg-cobalto-suave px-4 py-3">
      <Icone className="mt-1 size-4 shrink-0 text-cobalto" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="rotulo">{nome}</div>
        <div className="flex items-start gap-2 rounded-lg border border-linha bg-superficie px-3 py-2">
          <span className="numero min-w-0 flex-1 text-[13px] leading-relaxed [overflow-wrap:anywhere] select-all">{valor}</span>
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
            {ok ? <Check /> : <Copy />}
          </Botao>
        </div>
        {aviso && <p className="m-0 text-xs leading-relaxed text-texto-2">{aviso}</p>}
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
    <div className="flex flex-col gap-2 rounded-xl border border-cobalto/30 bg-cobalto-suave px-4 py-3">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-cobalto-tinta">
        <KeyRound className="size-4" />
        Senha de <span className="numero">{usuario}</span>
      </div>
      <div>
        <Codigo nome="Senha" valor={senha} copiavel={senha} />
      </div>
      {aviso && <p className="m-0 text-xs leading-relaxed text-texto-2">{aviso}</p>}
    </div>
  );
}
