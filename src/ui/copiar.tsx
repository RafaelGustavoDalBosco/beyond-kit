"use client";

import { Check, Copy } from "lucide-react";
import { useState, type MouseEventHandler, type ReactNode } from "react";

import { avisar } from "../aviso/aviso";

import { Botao, type BotaoProps } from "./botao";

/**
 * O botão de copiar com rótulo: copia `valor` e mostra o Check e o `copiado` por 1,4 s.
 * `tamanho` "icone"/"icone-sm": só o ícone, com o rótulo (ou o `copiado`) como nome acessível.
 * `onClick` corre antes de copiar (ex.: stopPropagation dentro de uma linha clicável);
 * `avisoAoCopiar` também mostra o toast de sucesso.
 */
export function BotaoDeCopiar({
  valor,
  rotulo = "Copiar",
  copiado = "Copiado",
  avisoAoCopiar,
  onClick,
  ...props
}: Omit<BotaoProps, "onClick" | "asChild" | "children"> & {
  valor: string;
  rotulo?: ReactNode;
  copiado?: ReactNode;
  avisoAoCopiar?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const [ok, setOk] = useState(false);
  const soIcone = props.tamanho === "icone" || props.tamanho === "icone-sm";
  const texto = ok ? copiado : rotulo;
  return (
    <Botao
      {...props}
      onClick={async (e) => {
        onClick?.(e);
        try {
          await navigator.clipboard.writeText(valor);
          setOk(true);
          setTimeout(() => setOk(false), 1400);
          if (avisoAoCopiar) avisar.sucesso(avisoAoCopiar);
        } catch {
          avisar.aviso("Não deu para copiar; selecione e copie à mão.");
        }
      }}
    >
      {ok ? <Check aria-hidden /> : <Copy aria-hidden />}
      {soIcone ? <span className="sr-only">{texto}</span> : texto}
    </Botao>
  );
}
