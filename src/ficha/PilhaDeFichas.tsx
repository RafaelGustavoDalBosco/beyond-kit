"use client";

import { Check, Link } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { Botao } from "../ui/botao";
import { Modal, type TamanhoDoModal } from "../ui/modal";

import type { Ficha, UsePilha } from "./pilha";

/** O que o consumidor diz de cada tipo de ficha: o nome, o título e o conteúdo. */
export type DefinicaoDaFicha = {
  /** O tipo ("Produto"): o contexto acima do título e, sem `titulo`, o título com o id. */
  rotulo: string;
  /** O título da ficha no cabeçalho do modal e o nome dela na trilha; sem ele, o rótulo e o id. */
  titulo?: (id: string) => ReactNode;
  render: (id: string) => ReactNode;
};

export type RegistroDeFichas<T extends string = string> = Record<T, DefinicaoDaFicha>;

/** O nome de uma ficha no título e na trilha: o `titulo`, ou o rótulo e o id. */
function nomeDaFicha<T extends string>(def: DefinicaoDaFicha | undefined, f: Ficha<T>) {
  if (def?.titulo) return def.titulo(f.id);
  return (
    <>
      {def?.rotulo ?? f.tipo} <span className="numero">{f.id}</span>
    </>
  );
}

/**
 * A pilha de fichas: a pilha vem do `usePilha` do adaptador (mora na URL, `?ficha=`) e cada tipo, do registro
 * `fichas`. As fichas abrem num modal centralizado só (tamanho g por padrão, maximizável), por cima da tela, sem
 * trocá-la; a que abre de dentro de outra entra na pilha do mesmo modal, nunca num modal por cima. O cabeçalho leva o
 * tipo, o título da ficha do alto e, com mais de uma, o "‹ Voltar" e os níveis clicáveis da trilha; à direita, o
 * copiar o link (a pilha mora na URL), o maximizar e o ✕. O Alt ← volta um nível; o Esc, o ✕ e o clique fora fecham
 * tudo, e o foco volta a quem abriu a primeira (a linha, a referência da prévia); a tela de baixo não muda, então
 * filtros, seleção e rolagem ficam como estavam. As duas fichas logo abaixo da do alto ficam montadas, escondidas, e
 * voltar não perde o que estava nelas. No celular o modal ocupa a tela.
 */
export function PilhaDeFichas<T extends string = string>({
  usePilha,
  fichas,
  tamanho = "g",
}: {
  usePilha: UsePilha<T>;
  fichas: Record<T, DefinicaoDaFicha>;
  /** O tamanho do modal (padrão g, 1040px). */
  tamanho?: TamanhoDoModal;
}) {
  const { pilha: daUrl, voltar, voltarPara, fechar } = usePilha();
  const aberta = daUrl.length > 0;
  // fechada, o modal sai encolhendo com as fichas de antes, sem piscar vazio
  const ultima = useRef(daUrl);
  if (aberta) ultima.current = daUrl;
  const pilha = aberta ? daUrl : ultima.current;
  const topo = pilha.at(-1);
  const defDoTopo = topo ? fichas[topo.tipo] : undefined;

  return (
    <Modal
      aberto={aberta}
      aoFechar={fechar}
      tamanho={tamanho}
      maximizavel
      pilha={{ niveis: pilha.map((f) => nomeDaFicha(fichas[f.tipo], f)), aoVoltar: voltar, aoIrPara: voltarPara }}
      contexto={defDoTopo?.titulo ? defDoTopo.rotulo : undefined}
      titulo={topo ? nomeDaFicha(defDoTopo, topo) : null}
      acoesDoTopo={<CopiarLink />}
    >
      {pilha.map((f, i) => {
        // As duas fichas logo abaixo da do alto ficam montadas, escondidas: voltar a elas não perde a aba nem o que
        // estava digitado.
        const recuo = pilha.length - 1 - i;
        if (recuo > 2) return null;
        const def = fichas[f.tipo];
        if (!def) return null;
        return (
          <div key={`${i}-${f.tipo}-${f.id}`} hidden={recuo > 0} className="flex min-w-0 flex-col gap-3.5">
            {def.render(f.id)}
          </div>
        );
      })}
    </Modal>
  );
}

/** O copiar o link da ficha: a pilha mora na URL, e o link reabre o mesmo caminho. */
function CopiarLink() {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };
  return (
    <Botao tipo="fantasma" tamanho="icone" className="is-cheio" aria-label={copiado ? "Copiado" : "Copiar o link"} title={copiado ? "Copiado" : "Copiar o link"} onClick={copiar}>
      {copiado ? <Check aria-hidden /> : <Link aria-hidden />}
    </Botao>
  );
}
