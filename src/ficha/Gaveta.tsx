"use client";

import { ArrowLeft, Maximize2, X, type LucideIcon } from "lucide-react";
import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Botao } from "../ui/botao";
import { ALTURA_DO_CABECALHO } from "../ui/cabecalho";
import { DePara } from "../ui/de-para";
import { IndicadorCompacto } from "../ui/destaque";
import { Emblema, PAR_DO_TOM, type TomDoEmblema } from "../ui/emblema";

// A gaveta é a leitura rápida de uma linha da lista: abre AO LADO da lista, que estreita e continua inteira à vista
// (a ficha grande abre no modal, a `PilhaDeFichas`). No celular vira a folha que sobe de baixo, com o véu.
//
//   const gaveta = usePilhaDaGaveta<{ tipo: "nota" | "produto"; id: string }>();
//   <ComGaveta
//     gaveta={
//       gaveta.topo && (
//         <Gaveta rotulo="NF-e 1284" aoFechar={gaveta.fechar} aoVoltar={gaveta.pilha.length > 1 ? gaveta.voltar : undefined}>
//           <CabecaDaGaveta selos={...} titulo="..." porque="..." />
//           <ValorDaGaveta tom="ganho" icone={TrendingUp} valor="R$ 1.284,00" legenda="..." />
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
 * fica coberto, e os cartões de número de dentro ficam compactos, sem o ícone). Vai por fora do respiro da tela, para
 * a gaveta encostar na borda direita da janela. `gaveta` é a `Gaveta`, ou nada quando fechada. */
export function ComGaveta({
  gaveta,
  largura = 400,
  topo = ALTURA_DO_CABECALHO,
  children,
  className,
}: {
  gaveta?: ReactNode;
  /** A largura da gaveta, em px. */
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
        // o `clip` segura os 30px que a gaveta entra deslizando (sem ele a rolagem horizontal da página pisca) e, por
        // não criar área de rolagem, deixa a gaveta presa no alto
        aberta && "mesa:grid-cols-[minmax(0,1fr)_var(--largura-da-gaveta)] mesa:overflow-x-clip",
        className,
      )}
      style={{ "--largura-da-gaveta": `${largura}px`, "--topo-da-gaveta": `${topo}px` } as CSSProperties}
    >
      <IndicadorCompacto.Provider value={aberta}>
        <div className="min-w-0">{children}</div>
      </IndicadorCompacto.Provider>
      {gaveta}
    </div>
  );
}

/** O painel da gaveta, dentro do `ComGaveta`: o cabeçalho preso (o rótulo, o Voltar quando há pilha, o expandir e o ×)
 * e o corpo, que rola. Presa no alto, ocupa a altura da janela; o Esc fecha. No celular é a folha que sobe de baixo,
 * com a alça e o véu, e tocar fora fecha. A pilha é do app (`aoVoltar` só vem quando há para onde voltar); a simples,
 * em memória, é o `usePilhaDaGaveta`. */
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
  /** Abre a ficha completa (o modal); sem ele, o botão não aparece. */
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
      // o Esc que um modal, um menu ou uma dica por cima já atendeu não fecha a gaveta
      if (e.key === "Escape" && !e.defaultPrevented) aoFechar();
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  return (
    <>
      <div aria-hidden onClick={aoFechar} className="fixed inset-0 z-45 animate-entrar bg-veu mesa:hidden" />
      <aside
        aria-labelledby={idDoRotulo}
        className={cn(
          "flex flex-col overflow-y-auto bg-superficie",
          "mesa:sticky mesa:top-(--topo-da-gaveta) mesa:h-[calc(100dvh-var(--topo-da-gaveta))] mesa:animate-deslizar mesa:self-start mesa:border-l mesa:border-linha mesa:shadow-gaveta",
          "celular:fixed celular:inset-x-0 celular:top-12 celular:bottom-0 celular:z-45 celular:animate-folha celular:rounded-t-[22px] celular:shadow-folha",
          className,
        )}
      >
        <header className="sticky top-0 z-1 flex shrink-0 items-center justify-between gap-2 border-b border-fio bg-superficie py-3.5 pr-[18px] pl-6 text-[13px] font-bold text-texto-2 celular:rounded-t-[22px] celular:pt-[22px]">
          {/* a alça da folha */}
          <span aria-hidden className="absolute top-2 left-1/2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-linha-forte mesa:hidden" />
          <div className="flex min-w-0 items-center gap-1.5">
            {aoVoltar && (
              <Botao tipo="fantasma" tamanho="icone-sm" className="size-[30px]" aria-label={rotuloDoVoltar} title={rotuloDoVoltar} onClick={aoVoltar}>
                <ArrowLeft />
              </Botao>
            )}
            <span id={idDoRotulo} className="truncate">
              {rotulo}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {aoExpandir && (
              <Botao tipo="fantasma" tamanho="icone-sm" className="size-[30px]" aria-label={rotuloDoExpandir} title={rotuloDoExpandir} onClick={aoExpandir}>
                <Maximize2 />
              </Botao>
            )}
            <Botao tipo="fantasma" tamanho="icone-sm" className="size-[30px]" aria-label={rotuloDoFechar} title={rotuloDoFechar} onClick={aoFechar}>
              <X />
            </Botao>
          </div>
        </header>
        <div className="px-6 pt-5 pb-7 celular:px-[18px] celular:pt-[18px] celular:pb-8">{children}</div>
      </aside>
    </>
  );
}

/** O alto do corpo da gaveta: os selos, o título em frase e o porquê (a frase que explica). */
export function CabecaDaGaveta({ selos, titulo, porque }: { selos?: ReactNode; titulo: ReactNode; porque?: ReactNode }) {
  return (
    <div>
      {selos && <div className="mb-2.5 flex flex-wrap items-center gap-1.5">{selos}</div>}
      <h2 className="m-0 text-[21px] leading-tight font-extrabold tracking-[-0.01em] [overflow-wrap:anywhere]">{titulo}</h2>
      {porque && <p className="m-0 mt-1 leading-normal text-neutro">{porque}</p>}
    </div>
  );
}

/** O de → para da gaveta: o `DePara` do kit no destaque (a caixa clara larga, com "De" e "Para" em cima de cada valor
 * e o novo em azul). A caixa é a do próprio `DePara`; aqui só entra o respiro do corpo da gaveta. */
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
  return (
    <div className="mt-4 first:mt-0">
      <DePara de={de} para={para} rotulo={rotulo} tamanho={tamanho} rotuloDe={rotuloDe} rotuloPara={rotuloPara} />
    </div>
  );
}

/** O valor grande da gaveta, num bloco colorido pelo efeito (`tom`: verde ganho, laranja pede ação, vermelho risco…):
 * o ícone num círculo branco, o valor e a legenda na cor do tom. */
export function ValorDaGaveta({
  tom = "cobalto",
  icone,
  valor,
  legenda,
}: {
  tom?: TomDoEmblema;
  icone?: LucideIcon;
  valor: ReactNode;
  legenda?: ReactNode;
}) {
  return (
    <div className={cn("mt-[18px] flex items-center gap-3 rounded-cartao p-4 first:mt-0", PAR_DO_TOM[tom])}>
      {icone && <Emblema icone={icone} tom={tom} className="bg-superficie" />}
      <div className="min-w-0">
        <div className="numero text-[26px] leading-[1.1] font-extrabold tracking-[-0.02em] text-texto">{valor}</div>
        {legenda && <div className="text-[13px] font-bold">{legenda}</div>}
      </div>
    </div>
  );
}

/** As ações da gaveta (os `Botao`), lado a lado; quebram em linhas quando não cabem. */
export function AcoesDaGaveta({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2 first:mt-0">{children}</div>;
}

/** Uma seção do corpo da gaveta ("Detalhes", com os `Pares denso`; "Itens", com os `ItemDaGaveta`): o título em frase
 * sobre um fio e a ação de texto à direita ("Ver os 12"). */
export function SecaoDaGaveta({ titulo, acao, children }: { titulo: ReactNode; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-[26px] first:mt-0">
      <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-fio pb-2">
        <h3 className="m-0 text-[15px] font-extrabold">{titulo}</h3>
        {acao && <div className="shrink-0 text-[13px] font-bold text-cobalto">{acao}</div>}
      </div>
      {children}
    </section>
  );
}

const ITEM = "-mx-2 flex w-[calc(100%+16px)] items-center justify-between gap-3 rounded-lg border-b border-fio px-2 py-2.5 text-left";

/** Uma linha de lista da gaveta: o título, a linha de apoio embaixo e o valor à direita. Com `aoAbrir` é botão: abre
 * outra gaveta por cima ou a ficha no modal. */
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
        <span className="block truncate font-bold">{titulo}</span>
        {apoio && <span className="mt-px block truncate text-[12.5px] font-semibold text-texto-2">{apoio}</span>}
      </span>
      {valor != null && <span className="numero shrink-0 font-extrabold whitespace-nowrap">{valor}</span>}
    </>
  );
  if (!aoAbrir) return <div className={ITEM}>{conteudo}</div>;
  return (
    <button type="button" onClick={aoAbrir} className={cn(ITEM, "cursor-pointer hover:bg-superficie-2")}>
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
