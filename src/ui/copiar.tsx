"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";

import { avisar } from "../aviso/aviso";

import { Botao, type BotaoProps } from "./botao";

/** O botão de copiar com rótulo: copia `valor` e mostra o Check e o `copiado` por 1,4 s. */
export function BotaoDeCopiar({
  valor,
  rotulo = "Copiar",
  copiado = "Copiado",
  ...props
}: Omit<BotaoProps, "onClick" | "asChild" | "children"> & {
  valor: string;
  rotulo?: ReactNode;
  copiado?: ReactNode;
}) {
  const [ok, setOk] = useState(false);
  return (
    <Botao
      {...props}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(valor);
          setOk(true);
          setTimeout(() => setOk(false), 1400);
        } catch {
          avisar.aviso("Não deu para copiar; selecione e copie à mão.");
        }
      }}
    >
      {ok ? <Check /> : <Copy />}
      {ok ? copiado : rotulo}
    </Botao>
  );
}
