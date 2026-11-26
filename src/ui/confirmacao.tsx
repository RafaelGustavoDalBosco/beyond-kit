"use client";

import { type LucideIcon } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";

import { Botao, type BotaoProps } from "./botao";
import { Campo, Rotulado } from "./campo";
import { Alerta, type VarianteDoAlerta } from "./modal";

// A confirmação é o `Alerta`: o ícone de app sobre o halo, o título em
// pergunta, a frase e os botões grandes empilhados, a ação em cima e o Cancelar embaixo, com o foco no Cancelar.
// O que não se desfaz confirma no vermelho cheio (a variante perigo); o passo que não é risco, no primário (a
// variante ação). Esc e o clique fora cancelam.

// Compara só letras e números: o CNPJ vale com ou sem a máscara.
const semMascara = (texto: string) => texto.replace(/[^0-9A-Za-z]/g, "").toUpperCase();

type TipoDaConfirmacao = "perigo" | "primario";

const DESENHO: Record<TipoDaConfirmacao, { variante: VarianteDoAlerta; acao: "perigo" | "primario" }> = {
  perigo: { variante: "perigo", acao: "perigo" },
  primario: { variante: "acao", acao: "primario" },
};

/** O botão do que não se desfaz: abre a confirmação (o `Alerta`, com o título em pergunta, a frase, o confirmar e o
 * Cancelar). `tipoDoConfirmar="primario"` quando o passo não é risco (virar contrato, publicar). `digitar` só libera
 * o confirmar com esse texto digitado (o CNPJ ao apagar a empresa). */
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
  /** O ícone do alerta (padrão: o da variante, o octógono no perigo e a interrogação no primário). */
  iconeDaConfirmacao?: LucideIcon;
  rotuloDoCancelar?: ReactNode;
  digitar?: string;
  /** O rótulo do campo (padrão `Digite ${digitar} para confirmar`). */
  rotuloDoDigitar?: ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const [digitado, setDigitado] = useState("");
  const desenho = DESENHO[tipoDoConfirmar];
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
      <Alerta
        aberto={aberto}
        aoMudar={setAberto}
        variante={desenho.variante}
        icone={iconeDaConfirmacao}
        titulo={titulo}
        mensagem={frase}
        acoes={[
          {
            rotulo: confirmar,
            tipo: desenho.acao,
            desligada: digitar !== undefined && semMascara(digitado) !== semMascara(digitar),
            aoClicar: () => {
              setAberto(false);
              aoConfirmar();
            },
          },
          { rotulo: rotuloDoCancelar ?? "Cancelar", aoClicar: () => setAberto(false) },
        ]}
      >
        {digitar !== undefined && (
          <Rotulado
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
      </Alerta>
    </>
  );
}

export type OpcoesDaConfirmacao = {
  titulo: ReactNode;
  frase?: ReactNode;
  /** O texto do botão de confirmar (padrão "Confirmar"). */
  confirmar?: ReactNode;
  tipo?: TipoDaConfirmacao;
  /** O ícone do alerta (padrão: o da variante). */
  icone?: LucideIcon;
  rotuloDoCancelar?: ReactNode;
};

/**
 * A confirmação imperativa, para quando ela não nasce de um botão só:
 * `if (await confirmar({ titulo, frase })) ...`; o `dialogo` vai no JSX do consumidor.
 * Confirmar resolve true; Cancelar, Esc e o clique fora resolvem false.
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

  const desenho = DESENHO[opcoes?.tipo ?? "perigo"];

  const dialogo = opcoes && (
    <Alerta
      aberto={aberto}
      aoMudar={(a) => !a && responder(false)}
      variante={desenho.variante}
      icone={opcoes.icone}
      titulo={opcoes.titulo}
      mensagem={opcoes.frase}
      acoes={[
        { rotulo: opcoes.confirmar ?? "Confirmar", tipo: desenho.acao, aoClicar: () => responder(true) },
        { rotulo: opcoes.rotuloDoCancelar ?? "Cancelar", aoClicar: () => responder(false) },
      ]}
    />
  );

  return { confirmar, dialogo };
}
