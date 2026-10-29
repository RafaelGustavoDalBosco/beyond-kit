"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

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
  rotuloDoCancelar,
  ...props
}: Omit<BotaoProps, "onClick" | "asChild"> & {
  titulo: string;
  frase?: ReactNode;
  confirmar: ReactNode;
  aoConfirmar: () => void;
  tipoDoConfirmar?: "perigo" | "primario";
  rotuloDoCancelar?: ReactNode;
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
            <Cancelar rotulo={rotuloDoCancelar} />
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
        {frase && <div className="m-0 text-[13px] leading-relaxed text-texto-2">{frase}</div>}
      </Modal>
    </>
  );
}

export type OpcoesDaConfirmacao = {
  titulo: ReactNode;
  frase?: ReactNode;
  /** O texto do botão de confirmar (padrão "Confirmar"). */
  confirmar?: ReactNode;
  tipo?: "perigo" | "primario";
  rotuloDoCancelar?: ReactNode;
};

/**
 * A confirmação imperativa, para quando ela não nasce de um botão só:
 * `if (await confirmar({ titulo, frase })) ...`; o `dialogo` vai no JSX do consumidor.
 * Confirmar resolve true; Cancelar e × resolvem false.
 */
export function useConfirmar() {
  const [opcoes, setOpcoes] = useState<OpcoesDaConfirmacao | null>(null);
  const [aberto, setAberto] = useState(false);
  const resolver = useRef<((sim: boolean) => void) | null>(null);

  const responder = useCallback((sim: boolean) => {
    resolver.current?.(sim);
    resolver.current = null;
    setAberto(false);
  }, []);

  const confirmar = useCallback((novas: OpcoesDaConfirmacao) => {
    resolver.current?.(false);
    setOpcoes(novas);
    setAberto(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const dialogo = opcoes && (
    <Modal
      aberto={aberto}
      aoMudar={(a) => !a && responder(false)}
      titulo={opcoes.titulo}
      rodape={
        <>
          <Cancelar rotulo={opcoes.rotuloDoCancelar} />
          <Botao tipo={opcoes.tipo ?? "perigo"} onClick={() => responder(true)}>
            {opcoes.confirmar ?? "Confirmar"}
          </Botao>
        </>
      }
    >
      {opcoes.frase && <div className="m-0 text-[13px] leading-relaxed text-texto-2">{opcoes.frase}</div>}
    </Modal>
  );

  return { confirmar, dialogo };
}
