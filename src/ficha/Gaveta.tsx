"use client";

import { ArrowLeft, Maximize2, X, type LucideIcon } from "lucide-react";
import { Children, isValidElement, useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Botao } from "../ui/botao";
import { ALTURA_DO_CABECALHO } from "../ui/cabecalho";
import { DePara } from "../ui/de-para";
import { IndicadorCompacto } from "../ui/destaque";
import type { TomDoEmblema } from "../ui/emblema";

// A gaveta é o painel de detalhe do Lastro (`.painel`): a leitura de uma linha da lista, AO LADO dela, que estreita e
// continua inteira à vista (a ficha grande abre na `PilhaDeFichas`). O título fica no alto e as ações presas no
// rodapé; lista e painel rolam separados. No celular vira a folha que sobe de baixo, com o véu.
//
//   const gaveta = usePilhaDaGaveta<{ tipo: "nota" | "produto"; id: string }>();
//   <ComGaveta
//     gaveta={
//       gaveta.topo && (
//         <Gaveta rotulo="NF-e 1284" aoFechar={gaveta.fechar} aoVoltar={gaveta.pilha.length > 1 ? gaveta.voltar : undefined}>
//           <CabecaDaGaveta selos={...} titulo="..." porque="..." />
//           <ValorDaGaveta tom="positivo" valor="R$ 1.284,00" legenda="..." />
//           <AcoesDaGaveta>...</AcoesDaGaveta>
//           <SecaoDaGaveta titulo="Detalhes"><Pares denso>...</Pares></SecaoDaGaveta>
//           <SecaoDaGaveta titulo="Itens">
//             <ItemDaGaveta titulo="..." apoio="..." valor="..." aoAbrir={() => gaveta.abrir({ tipo: "produto", id })} />
//           </SecaoDaGaveta>
//         </Gaveta>
//       )
//     }
//   >
//     <Lista aoAbrir={(id) => gaveta.abrirSo({ tipo: "nota", id })} />
//   </ComGaveta>

/** A tela com a gaveta ao lado: o conteúdo e, com a gaveta aberta, a coluna dela à direita (o conteúdo estreita, não
 * fica coberto, e os cartões de número de dentro ficam compactos). Vai por fora do respiro da tela, para a gaveta
 * encostar na borda direita da janela. `gaveta` é a `Gaveta`, ou nada quando fechada. */
export function ComGaveta({
  gaveta,
  largura,
  topo = ALTURA_DO_CABECALHO,
  children,
  className,
}: {
  gaveta?: ReactNode;
  /** A largura da gaveta, em px; sem ela, a do painel de detalhe do Lastro (`--painel-largura`, 500px). */
  largura?: number;
  /** Onde a gaveta presa para, em px do alto da janela: a altura do `CabecalhoDoApp`. */
  topo?: number;
  children: ReactNode;
  className?: string;
}) {
  const aberta = gaveta != null && gaveta !== false;
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        // o `clip` segura o que a gaveta entra deslizando (sem ele a rolagem horizontal da página pisca) e, por não
        // criar área de rolagem, deixa a gaveta presa no alto
        aberta && "mesa:grid-cols-[minmax(0,1fr)_var(--largura-da-gaveta)] mesa:overflow-x-clip",
        className,
      )}
      style={
        {
          "--largura-da-gaveta": largura ? `${largura}px` : "var(--painel-largura)",
          "--topo-da-gaveta": `${topo}px`,
        } as CSSProperties
      }
    >
      <IndicadorCompacto.Provider value={aberta}>
        <div className="min-w-0">{children}</div>
      </IndicadorCompacto.Provider>
      {gaveta}
    </div>
  );
}

/** O painel da gaveta, dentro do `ComGaveta`: a linha do alto (o Voltar quando há pilha, o rótulo, o expandir e o ×) e
 * o corpo, que rola; as `AcoesDaGaveta` vão sempre para o `.painel-rodape`, preso embaixo, onde quer que estejam entre
 * os filhos. Presa no alto, ocupa a altura da janela; o Esc fecha e o Alt ← volta. No celular é a folha que sobe de
 * baixo, com a alça e o véu, e tocar fora fecha. A pilha é do app (`aoVoltar` só vem quando há para onde voltar); a
 * simples, em memória, é o `usePilhaDaGaveta`. */
export function Gaveta({
  rotulo,
  aoFechar,
  aoVoltar,
  aoExpandir,
  rotuloDoVoltar = "Voltar",
  rotuloDoExpandir = "Abrir ficha completa",
  rotuloDoFechar = "Fechar",
  children,
  className,
}: {
  /** O que a gaveta mostra ("Correção · 12", "NF-e 1284 · série 1"). */
  rotulo: ReactNode;
  aoFechar: () => void;
  /** Volta à gaveta anterior da pilha; sem ele, o Voltar não aparece. */
  aoVoltar?: () => void;
  /** Abre a ficha completa; sem ele, o botão não aparece. */
  aoExpandir?: () => void;
  rotuloDoVoltar?: string;
  rotuloDoExpandir?: string;
  rotuloDoFechar?: string;
  children: ReactNode;
  className?: string;
}) {
  const idDoRotulo = useId();

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      // o Esc que um modal, um menu, uma dica ou a pilha por cima já atendeu não fecha a gaveta
      if (e.defaultPrevented) return;
      if (e.key === "Escape") aoFechar();
      else if (e.altKey && e.key === "ArrowLeft" && aoVoltar) {
        e.preventDefault();
        aoVoltar();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aoFechar, aoVoltar]);

  // as ações vão para o rodapé preso do painel (`.painel > .painel-rodape`), depois do resto
  const filhos = Children.toArray(children);
  const acoes = filhos.filter((f) => isValidElement(f) && f.type === AcoesDaGaveta);
  const corpo = filhos.filter((f) => !(isValidElement(f) && f.type === AcoesDaGaveta));

  return (
    <>
      <div aria-hidden onClick={aoFechar} className="fixed inset-0 z-45 animate-entrar bg-veu mesa:hidden" />
      <aside
        aria-labelledby={idDoRotulo}
        className={cn(
          "painel overflow-y-auto",
          "mesa:sticky mesa:top-(--topo-da-gaveta) mesa:h-[calc(100dvh-var(--topo-da-gaveta))] mesa:animate-deslizar mesa:self-start",
          "celular:fixed celular:inset-x-0 celular:top-12 celular:bottom-0 celular:z-45 celular:animate-folha celular:rounded-t-g celular:border-l-0 celular:shadow-g",
          className,
        )}
      >
        <header className="sticky top-0 z-1 -mx-[22px] -mt-[18px] flex shrink-0 items-center gap-1 bg-ficha px-[22px] pt-3 pb-1 celular:pt-5">
          {/* a alça da folha */}
          <span aria-hidden className="absolute top-2 left-1/2 h-1 w-9 -translate-x-1/2 rounded-pilula bg-borda-forte mesa:hidden" />
          {aoVoltar && (
            <Botao tipo="fantasma" tamanho="icone-sm" className="-ml-2" aria-label={rotuloDoVoltar} title={`${rotuloDoVoltar} (Alt ←)`} onClick={aoVoltar}>
              <ArrowLeft />
            </Botao>
          )}
          <span id={idDoRotulo} className="cartao-rotulo min-w-0 flex-1 truncate">
            {rotulo}
          </span>
          {aoExpandir && (
            <Botao tipo="fantasma" tamanho="icone-sm" aria-label={rotuloDoExpandir} title={rotuloDoExpandir} onClick={aoExpandir}>
              <Maximize2 />
            </Botao>
          )}
          <Botao tipo="fantasma" tamanho="icone-sm" className="-mr-2" aria-label={rotuloDoFechar} title={`${rotuloDoFechar} (Esc)`} onClick={aoFechar}>
            <X />
          </Botao>
        </header>
        {corpo}
        {acoes}
      </aside>
    </>
  );
}

/** O alto do corpo da gaveta: os selos, o título em frase (20px, peso 600) e o porquê (a frase que explica). */
export function CabecaDaGaveta({ selos, titulo, porque }: { selos?: ReactNode; titulo: ReactNode; porque?: ReactNode }) {
  return (
    <div>
      {selos && <div className="mb-2 flex flex-wrap items-center gap-1.5">{selos}</div>}
      <h3 className="m-0 text-titulo [overflow-wrap:anywhere]">{titulo}</h3>
      {porque && <p className="m-0 mt-1 text-texto-secundario">{porque}</p>}
    </div>
  );
}

/** O de → para da gaveta: o `DePara` do kit no destaque (o bloco `.de-para`, com "De" e "Para" em cima de cada
 * valor e o novo no contorno azul). */
export function DeParaDaGaveta({
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

// O fio de cima do cartão de número pelo sentido; os outros tons ficam no cartão neutro (nenhum dado é azul, e o
// vermelho é só de falha de sistema).
const CARTAO_DO_TOM: Record<string, string | undefined> = {
  positivo: "cartao-positivo",
  destaque: "cartao-destaque",
  atencao: "cartao-atencao",
};

/** O valor grande da gaveta, no cartão de número do Lastro (`.cartao-numero`): o valor e a legenda embaixo. `tom`
 * `positivo`, `destaque` ou `atencao` põe o fio e a cor do sentido; os demais ficam neutros. */
export function ValorDaGaveta({
  tom = "acao",
  valor,
  legenda,
}: {
  tom?: TomDoEmblema;
  /** @deprecated Sem efeito: o cartão de número do Lastro não leva ícone. */
  icone?: LucideIcon;
  valor: ReactNode;
  legenda?: ReactNode;
}) {
  return (
    <div className={cn("cartao-numero", CARTAO_DO_TOM[tom])}>
      <div className="cartao-valor numero">{valor}</div>
      {legenda && <div className="cartao-nota">{legenda}</div>}
    </div>
  );
}

/** As ações da gaveta (os `Botao`, o principal primeiro): na `Gaveta` vão para o rodapé preso, em qualquer ordem entre
 * os filhos; quebram em linhas quando não cabem. */
export function AcoesDaGaveta({ children }: { children: ReactNode }) {
  return <div className="painel-rodape flex-wrap">{children}</div>;
}

/** Uma seção do corpo da gaveta ("Detalhes", com os `Pares denso`; "Itens", com os `ItemDaGaveta`): o título pequeno
 * sobre o fio escuro, como na pilha do Lastro, e a ação de texto à direita ("Ver os 12 →"). */
export function SecaoDaGaveta({ titulo, acao, children }: { titulo: ReactNode; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-1.5">
      <div className="flex items-baseline justify-between gap-3 border-b border-texto pb-1">
        <h4 className="m-0 text-apoio font-medio tracking-normal text-texto-apoio">{titulo}</h4>
        {acao && <div className="shrink-0 text-apoio font-medio text-acao-texto">{acao}</div>}
      </div>
      {children}
    </section>
  );
}

const ITEM = "-mx-[9px] flex w-[calc(100%+18px)] items-center justify-between gap-3 border-b border-borda-suave p-[9px] text-left";

/** Uma linha de lista da gaveta, como a linha de tabela do Lastro: o título (peso 600), a linha de apoio embaixo e o
 * valor à direita. Com `aoAbrir` é botão: abre outra gaveta por cima ou a ficha na pilha. */
export function ItemDaGaveta({
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
      <span className="min-w-0">
        <span className="linha-titulo block truncate">{titulo}</span>
        {apoio && <span className="linha-sub block truncate">{apoio}</span>}
      </span>
      {valor != null && <span className="numero shrink-0 whitespace-nowrap">{valor}</span>}
    </>
  );
  if (!aoAbrir) return <div className={ITEM}>{conteudo}</div>;
  return (
    <button type="button" onClick={aoAbrir} className={cn(ITEM, "cursor-pointer bg-transparent text-texto hover:bg-hover")}>
      {conteudo}
    </button>
  );
}

/** A pilha da gaveta em memória, para o app que não a guarda na URL: `abrirSo` abre do zero (a linha da lista),
 * `abrir` abre por cima (o item de dentro da gaveta), `voltar` desce uma e `fechar` esvazia; `topo` é a que aparece. */
export function usePilhaDaGaveta<T>() {
  const [pilha, setPilha] = useState<T[]>([]);
  return {
    pilha,
    topo: pilha.at(-1),
    abrir: (item: T) => setPilha((p) => [...p, item]),
    abrirSo: (item: T) => setPilha([item]),
    voltar: () => setPilha((p) => p.slice(0, -1)),
    fechar: () => setPilha([]),
  };
}
