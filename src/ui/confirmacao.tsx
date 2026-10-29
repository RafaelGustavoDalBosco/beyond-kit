"use client";

import { useState, type ReactNode } from "react";

import { Botao, type BotaoProps } from "./botao";
import { Cancelar, Modal } from "./modal";

/** O botão do que não se desfaz: abre a confirmação com a frase. `tipoDoConfirmar="primario"` quando o passo não é risco (virar contrato, publicar). */
export function BotaoDeConfirmar({
  children,
  titulo,
  frase,
  confirmar,
  aoConfirmar,
  tipoDoConfirmar = "perigo",
  ...props
}: Omit<BotaoProps, "onClick" | "asChild"> & {
  titulo: string;
  frase?: ReactNode;
  confirmar: ReactNode;
  aoConfirmar: () => void;
  tipoDoConfirmar?: "perigo" | "primario";
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Botao {...props} onClick={() => setAberto(true)}>
        {children}
      </Botao>
      <Modal
        aberto={aberto}
        aoMudar={setAberto}
        titulo={titulo}
        rodape={
          <>
            <Cancelar />
            <Botao
              tipo={tipoDoConfirmar}
              onClick={() => {
                setAberto(false);
                aoConfirmar();
              }}
            >
              {confirmar}
            </Botao>
          </>
        }
      >
        {frase && <p className="m-0 text-[13px] leading-relaxed text-texto-2">{frase}</p>}
      </Modal>
    </>
  );
}
