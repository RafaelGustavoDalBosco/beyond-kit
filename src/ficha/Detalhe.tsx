"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Children, Fragment, isValidElement, useCallback, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem } from "../lib/formato";
import { Botao } from "../ui/botao";
import { DePara } from "../ui/de-para";
import type { TomDoEmblema } from "../ui/emblema";
import { isDialogoNoAlto, isTeclaDeCampo, Modal, type TamanhoDoModal, type TrilhaDoModal } from "../ui/modal";

import { SecaoDaFicha } from "./partes";

// O detalhe de um registro abre em modal centralizado, nunca em painel lateral; o que
// abre de dentro dele entra na pilha do mesmo modal (o voltar e a trilha no cabeçalho), nunca num modal por cima. Os
// modais de ação (editar, a confirmação no `Alerta`) abrem por cima dele. No
// cabeçalho, o contexto ("Cliente · cliente 3 de 50"), o título, os selos e o subtítulo, com a anterior e a próxima
// (K/J) à direita; no corpo, as ações do registro numa linha no alto (a principal primeiro), o valor, o resumo e as
// seções com o conteúdo recuado.
//
//   const detalhe = usePilhaDoDetalhe<{ tipo: "nota" | "produto"; id: string }>();
//   <Lista aoAbrir={(id) => detalhe.abrirSo({ tipo: "nota", id })} />
//   {detalhe.topo && (
//     <ModalDoDetalhe
//       aoFechar={detalhe.fechar}
//       pilha={detalhe.trilha((f) => rotuloDe(f))}
//       contexto="NF-e"
//       posicao={{ atual: 3, total: 50 }} nomeDoItem="nota" aoAnterior={...} aoProximo={...}
//     >
//       <CabecaDoDetalhe selos={...} titulo="NF-e 1284" porque="..." />   // sobe para o cabeçalho do modal
//       <AcoesDoDetalhe>...</AcoesDoDetalhe>                               // a linha do alto do corpo
//       <ValorDoDetalhe tom="positivo" valor="R$ 1.284,00" legenda="..." />
//       <SecaoDoDetalhe titulo="Detalhes"><Pares denso>...</Pares></SecaoDoDetalhe>
//       <SecaoDoDetalhe titulo="Itens">
//         <ItemDoDetalhe titulo="..." apoio="..." valor="..." aoAbrir={() => detalhe.abrir({ tipo: "produto", id })} />
//       </SecaoDoDetalhe>
//     </ModalDoDetalhe>
//   )}

/** A posição do registro na lista de onde ele abriu ("cliente 3 de 50"). */
export type PosicaoNaLista = { atual: number; total: number };

// Os filhos com uma chave cada, abrindo os fragmentos: a cabeça e as ações sobem de onde estiverem.
function achatar(children: ReactNode, prefixo = ""): ReactNode[] {
  return Children.toArray(children).flatMap((filho, i) => {
    const chave = prefixo + (isValidElement(filho) ? String(filho.key) : i);
    if (isValidElement<{ children?: ReactNode }>(filho) && filho.type === Fragment) return achatar(filho.props.children, `${chave}/`);
    return [isValidElement(filho) ? <Fragment key={chave}>{filho}</Fragment> : filho];
  });
}

// O elemento por baixo do fragmento que o `achatar` pôs em volta.
function elementoDe(filho: ReactNode): ReactElement | undefined {
  if (!isValidElement<{ children?: ReactNode }>(filho)) return undefined;
  const dentro = filho.type === Fragment ? filho.props.children : filho;
  return isValidElement(dentro) ? dentro : undefined;
}

/**
 * O modal do detalhe: o `Modal` (tamanho m por padrão) com o cabeçalho do registro e a pilha. Os filhos são as
 * partes do corpo; a `CabecaDoDetalhe` entre eles sobe para o cabeçalho do modal (o título, os selos e o porquê como
 * subtítulo), e as `AcoesDoDetalhe` vão para a linha do alto do corpo, onde quer que estejam. Com `posicao` e as
 * setas (`aoAnterior`, `aoProximo`), o contexto ganha "N de M" e o alto ganha a anterior e a próxima; K e J fazem o
 * mesmo, só com este modal no alto, fora de campo e de menu, e só na raiz da pilha. A `pilha` (o `trilha` do
 * `usePilhaDoDetalhe`) põe o voltar e os níveis no cabeçalho; o Alt ← volta um nível; o Esc, o ✕ e o clique fora
 * fecham o modal inteiro. Monte-o só com o registro aberto (`{topo && <ModalDoDetalhe …>}`) ou passe `aberto`.
 */
export function ModalDoDetalhe({
  aberto = true,
  aoFechar,
  contexto,
  titulo,
  subtitulo,
  selos,
  tamanho = "m",
  largura,
  maximizavel,
  pilha,
  aoAnterior,
  aoProximo,
  posicao,
  nomeDoItem,
  rotuloDoAnterior = "Anterior",
  rotuloDoProximo = "Próximo",
  acoesDoTopo,
  rodape,
  className,
  children,
}: {
  /** Padrão true: o detalhe montado é o detalhe aberto. */
  aberto?: boolean;
  aoFechar: () => void;
  /** A linha pequena acima do título (o tipo do registro, a série, a empresa). */
  contexto?: ReactNode;
  /** O título do registro; sem ele, o da `CabecaDoDetalhe` entre os filhos e, sem ela, o `contexto`. */
  titulo?: ReactNode;
  subtitulo?: ReactNode;
  selos?: ReactNode;
  /** p 420 · m 680 (padrão) · g 1040 · xg 1360 · cheio. */
  tamanho?: TamanhoDoModal;
  /** A largura em px, no lugar do `tamanho`. */
  largura?: number;
  maximizavel?: boolean;
  /** A navegação dentro do modal (`usePilhaDoDetalhe().trilha(...)`). */
  pilha?: TrilhaDoModal;
  /** O registro anterior da lista (K); sem ele, a seta fica desligada. */
  aoAnterior?: () => void;
  /** O próximo registro da lista (J); sem ele, a seta fica desligada. */
  aoProximo?: () => void;
  posicao?: PosicaoNaLista;
  /** O nome do registro na posição ("cliente" vira "cliente 3 de 50"). */
  nomeDoItem?: string;
  rotuloDoAnterior?: string;
  rotuloDoProximo?: string;
  /** Ações do cabeçalho, antes das setas ("Abrir em Clientes"). */
  acoesDoTopo?: ReactNode;
  /** O pé de vidro do modal, para o detalhe que edita (o `Cancelar` e o salvar). */
  rodape?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const caixa = useRef<HTMLDivElement>(null);

  const filhos = achatar(children);
  const cabeca = filhos.map(elementoDe).find((e) => e?.type === CabecaDoDetalhe) as ReactElement<PropsDaCabeca> | undefined;
  const isAcoes = (f: ReactNode) => elementoDe(f)?.type === AcoesDoDetalhe;
  const acoes = filhos.filter(isAcoes);
  const corpo = filhos.filter((f) => !isAcoes(f) && (!cabeca || elementoDe(f) !== cabeca));

  const tituloDoRegistro = titulo ?? cabeca?.props.titulo;
  const naRaiz = !pilha || pilha.niveis.length <= 1;
  const naPosicao = naRaiz && posicao ? `${nomeDoItem ? `${nomeDoItem} ` : ""}${contagem(posicao.atual)} de ${contagem(posicao.total)}` : null;
  // o contexto que virou título não se repete em cima dele
  const contextoDaTrilha = tituloDoRegistro != null ? contexto : undefined;
  const linhaDeContexto =
    contextoDaTrilha != null && naPosicao ? (
      <>
        {contextoDaTrilha} · {naPosicao}
      </>
    ) : (
      (contextoDaTrilha ?? naPosicao ?? undefined)
    );

  // J/K trocam o registro (só com este modal no alto, fora de campo e de menu, na raiz da pilha)
  const setas = useRef({ aoAnterior, aoProximo });
  setas.current = { aoAnterior, aoProximo };
  const comSetas = !!(aoAnterior || aoProximo);
  useEffect(() => {
    if (!aberto || !naRaiz || !comSetas) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.altKey || isTeclaDeCampo(e) || !isDialogoNoAlto(caixa.current)) return;
      const ir = e.key === "j" || e.key === "J" ? setas.current.aoProximo : e.key === "k" || e.key === "K" ? setas.current.aoAnterior : undefined;
      if (!ir) return;
      e.preventDefault();
      ir();
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [aberto, naRaiz, comSetas]);

  const botoesDasSetas = naRaiz && (comSetas || posicao) && (
    <>
      <Botao tipo="fantasma" tamanho="icone" className="is-cheio" aria-label={rotuloDoAnterior} title={`${rotuloDoAnterior} (K)`} disabled={!aoAnterior} onClick={aoAnterior}>
        <ChevronUp aria-hidden />
      </Botao>
      <Botao tipo="fantasma" tamanho="icone" className="is-cheio" aria-label={rotuloDoProximo} title={`${rotuloDoProximo} (J)`} disabled={!aoProximo} onClick={aoProximo}>
        <ChevronDown aria-hidden />
      </Botao>
    </>
  );

  return (
    <Modal
      ref={caixa}
      aberto={aberto}
      aoFechar={aoFechar}
      tamanho={largura ? undefined : tamanho}
      largura={largura}
      maximizavel={maximizavel}
      pilha={pilha}
      contexto={linhaDeContexto}
      titulo={tituloDoRegistro ?? contexto}
      selos={selos ?? cabeca?.props.selos}
      subtitulo={subtitulo ?? cabeca?.props.porque}
      acoesDoTopo={
        acoesDoTopo || botoesDasSetas ? (
          <>
            {acoesDoTopo}
            {botoesDasSetas}
          </>
        ) : undefined
      }
      rodape={rodape}
      className={className}
    >
      {acoes}
      {corpo}
    </Modal>
  );
}

type PropsDaCabeca = { selos?: ReactNode; titulo: ReactNode; porque?: ReactNode };

/** O alto do registro: os selos, o título e o porquê (a frase que explica). Dentro do `ModalDoDetalhe` sobe para o
 * cabeçalho do modal (o título, os selos e o subtítulo); fora dele, desenha-se onde está. */
export function CabecaDoDetalhe({ selos, titulo, porque }: PropsDaCabeca) {
  return (
    <div>
      {selos && <div className="mb-2 flex flex-wrap items-center gap-1.5">{selos}</div>}
      <h3 className="m-0 text-titulo [overflow-wrap:anywhere]">{titulo}</h3>
      {porque && <p className="m-0 mt-1 text-texto-apoio">{porque}</p>}
    </div>
  );
}

/** As ações do registro (os `Botao`, a principal primeiro): no `ModalDoDetalhe` vão para a linha do alto do corpo,
 * em qualquer ordem entre os filhos; quebram em linhas quando não cabem. */
export function AcoesDoDetalhe({ children }: { children: ReactNode }) {
  return <div className="detalhe-acoes">{children}</div>;
}

/** O de → para do detalhe: o `DePara` do kit no destaque. */
export function DeParaDoDetalhe({
  de,
  para,
  rotulo,
  tamanho = "destaque",
  rotuloDe,
  rotuloPara,
}: {
  de: ReactNode;
  para: ReactNode;
  rotulo?: ReactNode;
  tamanho?: "normal" | "destaque";
  /** O rótulo em cima do valor antigo ("De"). */
  rotuloDe?: ReactNode;
  /** O rótulo em cima do valor novo ("Para"). */
  rotuloPara?: ReactNode;
}) {
  return <DePara de={de} para={para} rotulo={rotulo} tamanho={tamanho} rotuloDe={rotuloDe} rotuloPara={rotuloPara} />;
}

// A cor do número pelo sentido; os outros tons ficam neutros (nenhum dado é azul, e o vermelho é só de falha).
const VALOR_DO_TOM: Record<string, string | undefined> = {
  positivo: "detalhe-valor-positivo",
  destaque: "detalhe-valor-destaque",
  atencao: "detalhe-valor-atencao",
};

/** O valor grande do registro, numa área recuada: o número e a legenda embaixo. `tom` `positivo`, `destaque` ou
 * `atencao` põe a cor do sentido no número (a legenda diz o que ele é); os demais ficam neutros. */
export function ValorDoDetalhe({
  tom = "acao",
  valor,
  legenda,
}: {
  tom?: TomDoEmblema;
  valor: ReactNode;
  legenda?: ReactNode;
}) {
  return (
    <div className={cn("detalhe-valor", VALOR_DO_TOM[tom])}>
      <div className="detalhe-valor-numero">{valor}</div>
      {legenda && <div className="detalhe-valor-legenda">{legenda}</div>}
    </div>
  );
}

/** Uma seção do detalhe ("Detalhes", com os `Pares denso`; "Itens", com os `ItemDoDetalhe`): no modal, o rótulo
 * pequeno em cima, a ação à direita ("Ver os 12 →") e o conteúdo numa área recuada, sem borda (a `SecaoDaFicha`). */
export function SecaoDoDetalhe({ titulo, acao, children }: { titulo: ReactNode; acao?: ReactNode; children: ReactNode }) {
  return (
    <SecaoDaFicha titulo={titulo} acao={acao}>
      {children}
    </SecaoDaFicha>
  );
}

/** Uma linha de lista do detalhe: o título, a linha de apoio embaixo e o valor à direita, separada pelo fio suave; no
 * recuo da seção vai de ponta a ponta. Com `aoAbrir` é botão: abre o item na pilha do mesmo modal. */
export function ItemDoDetalhe({
  titulo,
  apoio,
  valor,
  aoAbrir,
}: {
  titulo: ReactNode;
  apoio?: ReactNode;
  valor?: ReactNode;
  aoAbrir?: () => void;
}) {
  const conteudo = (
    <>
      <span className="detalhe-item-texto">
        <span className="detalhe-item-titulo">{titulo}</span>
        {apoio && <span className="detalhe-item-apoio">{apoio}</span>}
      </span>
      {valor != null && <span className="detalhe-item-valor">{valor}</span>}
    </>
  );
  if (!aoAbrir) return <div className="detalhe-item">{conteudo}</div>;
  return (
    <button type="button" onClick={aoAbrir} className="detalhe-item">
      {conteudo}
    </button>
  );
}

/** A pilha do detalhe em memória, para o app que não a guarda na URL: `abrirSo` abre do zero (a linha da lista),
 * `abrir` empilha (o item de dentro do detalhe), `voltar` desce um nível, `voltarPara` desce até o nível escolhido
 * (0 é o primeiro) e `fechar` esvazia; `topo` é o que o modal mostra e `trilha` monta o que o `ModalDoDetalhe`
 * recebe em `pilha`, com o rótulo de cada nível. */
export function usePilhaDoDetalhe<T>() {
  const [pilha, setPilha] = useState<T[]>([]);
  const abrir = useCallback((item: T) => setPilha((p) => [...p, item]), []);
  const abrirSo = useCallback((item: T) => setPilha([item]), []);
  const voltar = useCallback(() => setPilha((p) => p.slice(0, -1)), []);
  const voltarPara = useCallback((nivel: number) => setPilha((p) => p.slice(0, Math.max(1, nivel + 1))), []);
  const fechar = useCallback(() => setPilha([]), []);
  return {
    pilha,
    topo: pilha.at(-1),
    aberto: pilha.length > 0,
    abrir,
    abrirSo,
    voltar,
    voltarPara,
    fechar,
    trilha: (rotulo: (item: T, nivel: number) => ReactNode): TrilhaDoModal => ({
      niveis: pilha.map(rotulo),
      aoVoltar: voltar,
      aoIrPara: voltarPara,
    }),
  };
}
