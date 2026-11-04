"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { Botao, type BotaoProps } from "./botao";
import { Campo, Rotulado } from "./campo";
import { Cancelar, Modal } from "./modal";

// Compara só letras e números: o CNPJ vale com ou sem a máscara.
const semMascara = (texto: string) => texto.replace(/[^0-9A-Za-z]/g, "").toUpperCase();

/** O botão do que não se desfaz: abre a confirmação com a frase. `tipoDoConfirmar="primario"` quando o passo não é risco (virar contrato, publicar). `digitar` só libera o confirmar com esse texto digitado (o CNPJ ao apagar a empresa). */
export function BotaoDeConfirmar({
  children,
  titulo,
  frase,
  confirmar,
  aoConfirmar,
  tipoDoConfirmar = "perigo",
  rotuloDoCancelar,
  digitar,
  rotuloDoDigitar,
  ...props
}: Omit<BotaoProps, "onClick" | "asChild"> & {
  titulo: string;
  frase?: ReactNode;
  confirmar: ReactNode;
  aoConfirmar: () => void;
  tipoDoConfirmar?: "perigo" | "primario";
  rotuloDoCancelar?: ReactNode;
  digitar?: string;
  /** O rótulo do campo (padrão `Digite ${digitar} para confirmar`). */
  rotuloDoDigitar?: ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const [digitado, setDigitado] = useState("");
  return (
    <>
      <Botao
        {...props}
        onClick={() => {
          setDigitado("");
          setAberto(true);
        }}
      >
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
              disabled={digitar !== undefined && semMascara(digitado) !== semMascara(digitar)}
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
        {frase && <div className="m-0 text-sm leading-relaxed text-texto-2">{frase}</div>}
        {digitar !== undefined && (
          <Rotulado rotulo={rotuloDoDigitar ?? `Digite ${digitar} para confirmar`}>
            <Campo autoComplete="off" value={digitado} onChange={(e) => setDigitado(e.target.value)} />
          </Rotulado>
        )}
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
      {opcoes.frase && <div className="m-0 text-sm leading-relaxed text-texto-2">{opcoes.frase}</div>}
    </Modal>
  );

  return { confirmar, dialogo };
}
