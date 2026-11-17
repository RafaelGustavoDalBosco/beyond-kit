"use client";

import { CircleHelp, TriangleAlert, type LucideIcon } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";

import { Botao, type BotaoProps } from "./botao";
import { Campo, Rotulado } from "./campo";
import { Emblema } from "./emblema";
import { Cancelar, Modal } from "./modal";

// Compara só letras e números: o CNPJ vale com ou sem a máscara.
const semMascara = (texto: string) => texto.replace(/[^0-9A-Za-z]/g, "").toUpperCase();

type TipoDaConfirmacao = "perigo" | "primario";

// O que não se desfaz confirma no `.btn-perigo` do Lastro (o contorno vermelho), com o ícone de alerta no traço
// vermelho; o passo que não é risco confirma no primário, com o ícone neutro.
const DESENHO = {
  perigo: { tom: "erro", icone: TriangleAlert, botao: "perigo" },
  primario: { tom: "neutro", icone: CircleHelp, botao: "primario" },
} as const;

const LARGURA = 460;

const FRASE = "text-base leading-texto text-texto-secundario";

/** O emblema discreto ao lado do título da confirmação, no tom do tipo. */
function emblemaDa(tipo: TipoDaConfirmacao, icone: LucideIcon | undefined) {
  return <Emblema icone={icone ?? DESENHO[tipo].icone} tom={DESENHO[tipo].tom} tamanho="md" />;
}

/** O botão do que não se desfaz: abre a confirmação (o `.dialog` pequeno, com o emblema ao lado do título em pergunta, a frase e o confirmar à direita). `tipoDoConfirmar="primario"` quando o passo não é risco (virar contrato, publicar). `digitar` só libera o confirmar com esse texto digitado (o CNPJ ao apagar a empresa). */
export function BotaoDeConfirmar({
  children,
  titulo,
  frase,
  confirmar,
  aoConfirmar,
  tipoDoConfirmar = "perigo",
  iconeDaConfirmacao,
  rotuloDoCancelar,
  digitar,
  rotuloDoDigitar,
  ...props
}: Omit<BotaoProps, "onClick" | "asChild"> & {
  titulo: string;
  frase?: ReactNode;
  confirmar: ReactNode;
  aoConfirmar: () => void;
  tipoDoConfirmar?: TipoDaConfirmacao;
  /** O ícone do emblema da confirmação (padrão: o alerta no perigo e a interrogação no primário). */
  iconeDaConfirmacao?: LucideIcon;
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
        largura={LARGURA}
        emblema={emblemaDa(tipoDoConfirmar, iconeDaConfirmacao)}
        rodape={
          <>
            <Cancelar rotulo={rotuloDoCancelar} />
            <Botao
              tipo={DESENHO[tipoDoConfirmar].botao}
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
        {frase && <div className={FRASE}>{frase}</div>}
        {digitar !== undefined && (
          <Rotulado
            className="mt-3.5"
            rotulo={
              rotuloDoDigitar ?? (
                <>
                  Digite <b className="font-forte">{digitar}</b> para confirmar
                </>
              )
            }
          >
            <Campo autoComplete="off" placeholder={digitar} value={digitado} onChange={(e) => setDigitado(e.target.value)} />
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
  tipo?: TipoDaConfirmacao;
  /** O ícone do emblema (padrão: o alerta no perigo e a interrogação no primário). */
  icone?: LucideIcon;
  rotuloDoCancelar?: ReactNode;
};

/**
 * A confirmação imperativa, para quando ela não nasce de um botão só:
 * `if (await confirmar({ titulo, frase })) ...`; o `dialogo` vai no JSX do consumidor.
 * Confirmar resolve true; Cancelar e Esc resolvem false.
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

  const tipo = opcoes?.tipo ?? "perigo";

  const dialogo = opcoes && (
    <Modal
      aberto={aberto}
      aoMudar={(a) => !a && responder(false)}
      titulo={opcoes.titulo}
      largura={LARGURA}
      emblema={emblemaDa(tipo, opcoes.icone)}
      rodape={
        <>
          <Cancelar rotulo={opcoes.rotuloDoCancelar} />
          <Botao tipo={DESENHO[tipo].botao} onClick={() => responder(true)}>
            {opcoes.confirmar ?? "Confirmar"}
          </Botao>
        </>
      }
    >
      {opcoes.frase && <div className={FRASE}>{opcoes.frase}</div>}
    </Modal>
  );

  return { confirmar, dialogo };
}
