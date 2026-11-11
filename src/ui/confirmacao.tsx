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

// O que não se desfaz vai em vermelho, com o botão cheio e o pé do modal de formulário (o fio e os botões à
// direita); o passo que não é risco vai em azul, com os botões no meio.
const DESENHO = {
  perigo: { tom: "risco", icone: TriangleAlert, botao: "perigo-cheio", rodapeNoMeio: false },
  primario: { tom: "cobalto", icone: CircleHelp, botao: "primario", rodapeNoMeio: true },
} as const;

const LARGURA = 440;

const FRASE = "text-sm leading-relaxed font-semibold text-texto-2";

/** O ícone em círculo que abre a confirmação, no tom do tipo: 56px, um passo acima do `lg` do `Emblema`. */
function emblemaDa(tipo: TipoDaConfirmacao, icone: LucideIcon | undefined) {
  return (
    <Emblema
      icone={icone ?? DESENHO[tipo].icone}
      tom={DESENHO[tipo].tom}
      tamanho="lg"
      className="size-14 [&_svg]:size-[26px]"
    />
  );
}

/** O botão do que não se desfaz: abre a confirmação (modal pequeno e centrado, com o ícone em círculo, o título em pergunta e a frase). `tipoDoConfirmar="primario"` quando o passo não é risco (virar contrato, publicar). `digitar` só libera o confirmar com esse texto digitado (o CNPJ ao apagar a empresa). */
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
  /** O ícone do círculo da confirmação (padrão: o alerta no perigo e a interrogação no primário). */
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
        rodapeNoMeio={DESENHO[tipoDoConfirmar].rodapeNoMeio}
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
            className="mt-4 text-left"
            rotulo={
              rotuloDoDigitar ?? (
                <>
                  Digite <b className="font-extrabold">{digitar}</b> para confirmar
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
  /** O ícone do círculo (padrão: o alerta no perigo e a interrogação no primário). */
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
      rodapeNoMeio={DESENHO[tipo].rodapeNoMeio}
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
