"use client";

import { Inbox, TriangleAlert, type LucideIcon } from "lucide-react";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** Liga o `SemValor` compacto em tudo o que estiver dentro; a `Tabela` densa já liga. */
export const SemValorCompacto = createContext(false);

/** null é "sem dado", nunca zero nem travessão (`.sem-dado`: no texto de apoio, peso 500); o rótulo vem do
 * consumidor ("não avaliável", "não se aplica"). `compacto` (ou a `Tabela` densa em volta) escreve só "sem dado", com
 * o rótulo no `title`. */
export function SemValor({ rotulo = "sem dado", compacto }: { rotulo?: string; compacto?: boolean }) {
  const noCompacto = useContext(SemValorCompacto);
  if (compacto ?? noCompacto)
    return (
      <span title={rotulo} className="sem-dado">
        sem dado
      </span>
    );
  return <span className="sem-dado">{rotulo}</span>;
}

/** O traço do esqueleto (`.esq`, no preenchimento), com o brilho passando; a largura e a altura vêm pelo `className`. */
export function Esqueleto({ className }: { className?: string }) {
  return <div className={cn("esq", className)} />;
}

// A partir de quando a espera ganha frase, em ms.
const DEMORA = 2500;
const MUITA_DEMORA = 15000;

/** Vira `true` depois de uns 2,5 s de espera seguida (enquanto `ativa`): a hora de dizer que está demorando. */
export function useDemora(ativa = true, ms = DEMORA) {
  const [demorou, setDemorou] = useState(false);
  useEffect(() => {
    if (!ativa) return;
    const espera = setTimeout(() => setDemorou(true), ms);
    return () => {
      clearTimeout(espera);
      setDemorou(false);
    };
  }, [ativa, ms]);
  return demorou;
}

/** A linha da espera que passou do normal: o girador e a frase, que vem de quem chama. Nunca sozinha no meio da tela:
 * fica em cima do esqueleto ou da lista antiga. */
export function LinhaDeDemora({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="status" className={cn("flex animate-entrar items-center gap-2.5 py-2.5 font-medio text-texto-secundario", className)}>
      <span aria-hidden className="girador" />
      {children}
    </div>
  );
}

type Forma = "linhas" | "tabela" | "lista" | "grafico" | "cartoes" | "caixa" | "tela";

// Larguras e alturas variadas, para o esqueleto lembrar o conteúdo; literais, para o Tailwind achar.
const LARGURAS = ["w-2/5", "w-3/5", "w-1/2", "w-2/3", "w-1/3"];
const ALTURAS = ["h-[45%]", "h-[70%]", "h-[55%]", "h-[85%]", "h-[60%]", "h-full"];

/** Os cartões de número em esqueleto, no `.cartao-numero`: o rótulo, o valor e a nota. */
function CartoesEmEsqueleto({ quantos }: { quantos: number }) {
  return (
    <div className="cartoes-numero grid-cols-4 celular:grid-cols-2">
      {Array.from({ length: quantos }, (_, i) => (
        <div key={i} className="cartao-numero">
          <Esqueleto className="w-[90px] max-w-full" />
          <Esqueleto className="my-2 h-7 w-[150px] max-w-full" />
          <Esqueleto className="w-[110px] max-w-full" />
        </div>
      ))}
    </div>
  );
}

/** As linhas de lista em esqueleto, com os respiros da `.table` (9px): o título com a linha de baixo, o valor e o selo,
 * para nada andar quando o dado chega. */
function LinhasEmEsqueleto({ quantos }: { quantos: number }) {
  return Array.from({ length: quantos }, (_, i) => (
    <div
      key={i}
      className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_80px_90px] items-center gap-4 border-b border-borda-suave px-[18px] py-2.5 last:border-b-0 celular:grid-cols-[minmax(0,1fr)_90px] celular:px-3.5"
    >
      <div>
        <Esqueleto className={LARGURAS[i % LARGURAS.length]} />
        <Esqueleto className="mt-2 h-2.5 w-1/4" />
      </div>
      <Esqueleto className="celular:hidden" />
      <Esqueleto className="h-[18px]" />
    </div>
  ));
}

// A caixa da lista: a superfície branca, onde o esqueleto das linhas mora.
const CAIXA = "overflow-hidden rounded-g bg-ficha";

/** O desenho do esqueleto em cada forma; `quantos` é o número de linhas ou de cartões (o gráfico tem as barras dele).
 * `demora` é a linha da espera longa, que nas formas com caixa entra em cima das linhas. */
function FormaDoEsqueleto({ forma, quantos, demora }: { forma: Forma; quantos: number; demora: ReactNode }) {
  const vezes = Array.from({ length: quantos }, (_, i) => i);
  // A área inteira: o rótulo, o número grande e as linhas, que apagam no fim.
  if (forma === "tela")
    return (
      <div className="flex flex-col gap-3">
        <Esqueleto className="w-[140px]" />
        <Esqueleto className="esq-numero max-w-full" />
        {demora}
        {vezes.map((i) => (
          <Esqueleto key={i} className="esq-linha" />
        ))}
      </div>
    );
  if (forma === "cartoes") return <CartoesEmEsqueleto quantos={quantos} />;
  if (forma === "caixa")
    return (
      <div className={CAIXA}>
        {demora}
        <LinhasEmEsqueleto quantos={quantos} />
      </div>
    );
  // Uma ficha solta por item, como o `ItemDaLista` do `MestreDetalhe`.
  if (forma === "lista")
    return (
      <div className="flex flex-col gap-2">
        {vezes.map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-grupo bg-ficha px-4 py-3.5">
            <Esqueleto className={LARGURAS[i % LARGURAS.length]} />
            <Esqueleto className="h-2.5 w-1/4" />
          </div>
        ))}
      </div>
    );
  if (forma === "tabela")
    return vezes.map((i) => (
      <div key={i} className="flex h-[38px] items-center gap-6 border-b border-borda-suave px-[18px] last:border-0">
        <Esqueleto className={LARGURAS[i % LARGURAS.length]} />
        <Esqueleto className="ml-auto w-20" />
        <Esqueleto className="w-16" />
      </div>
    ));
  if (forma === "grafico")
    return (
      <div className="flex h-44 items-end gap-4 border-b border-borda-suave px-5">
        {ALTURAS.map((altura) => (
          <Esqueleto key={altura} className={cn("flex-1 rounded-b-none", altura)} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-3">
      {vezes.map((i) => (
        <Esqueleto key={i} className={i === quantos - 1 ? "w-3/5" : undefined} />
      ))}
    </div>
  );
}

/**
 * O esqueleto da primeira carga (`.carregando`: a barra fina correndo no alto, o girador com o que está
 * sendo lido e o esqueleto no lugar do conteúdo), na `forma` do que vem: `tela` (o rótulo, o número grande e as
 * linhas), `cartoes` (os cartões de número), `caixa` (a ficha com as linhas de lista), `lista` (uma ficha por item, a
 * lista do `MestreDetalhe`), `tabela`, `grafico` ou `linhas`, com `linhas` dizendo quantas linhas ou cartões.
 * `rotulo` é o que está sendo lido ("Lendo 3.418 notas do ERP…"). Só aparece depois de 200 ms, para a resposta rápida
 * não piscar, e ocupa o lugar desde o início. Depois de uns 2,5 s entra a linha com o girador e a frase de `demora`.
 */
export function Carregando({
  linhas = 4,
  rotulo,
  forma = "linhas",
  demora,
}: {
  linhas?: number;
  rotulo?: string;
  forma?: Forma;
  /** A frase da espera que passou de uns 2,5 s ("Ainda buscando as notas do mês."); sem ela, a genérica do kit. */
  demora?: ReactNode;
}) {
  const demorou = useDemora();
  const muito = useDemora(true, MUITA_DEMORA);
  const frase = demora ?? (muito ? "Está demorando mais que o normal." : "Ainda carregando…");
  // As que têm a caixa das linhas, onde a linha de demora entra por dentro (com o respiro da linha).
  const naCaixa = forma === "caixa";
  const linhaDeDemora = demorou && <LinhaDeDemora className={cn(naCaixa && "px-[18px]")}>{frase}</LinhaDeDemora>;
  return (
    <div role="status" aria-busy="true" className="carregando animate-surgir pt-3">
      <div aria-hidden className="carregando-barra">
        <i />
      </div>
      {rotulo && (
        <div className="mb-3 flex items-center gap-2.5 font-medio text-texto-secundario">
          <span aria-hidden className="girador" />
          {rotulo}
        </div>
      )}
      {/* com o rótulo, o girador já está à vista: a demora troca só a frase */}
      {!naCaixa && forma !== "tela" && !rotulo && linhaDeDemora}
      <FormaDoEsqueleto forma={forma} quantos={linhas} demora={(naCaixa || forma === "tela") && !rotulo && linhaDeDemora} />
    </div>
  );
}

/** A forma comum dos estados (`.estado-caixa`): o ícone num quadrado de preenchimento (no erro, no tom do erro), o
 * título, a frase e a saída, no meio. `tela` ocupa a área da tela inteira (`.estado-tela`); `contorno` põe a
 * superfície branca em volta (fora de um bloco). */
function Estado({
  erro,
  icone: Icone,
  titulo,
  descricao,
  acao,
  contorno,
  tela,
}: {
  erro?: boolean;
  icone: LucideIcon;
  titulo: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  contorno?: boolean;
  tela?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid place-items-center",
        tela ? "estado-tela" : "px-5 py-7",
        erro && "estado-erro",
        contorno && "rounded-g bg-ficha",
      )}
    >
      <div className="estado-caixa">
        <span aria-hidden className="estado-icone">
          <Icone />
        </span>
        <h3 className={cn(!tela && "text-enfase")}>{titulo}</h3>
        {descricao && <p>{descricao}</p>}
        {acao && <div className="mt-2.5">{acao}</div>}
      </div>
    </div>
  );
}

/**
 * A recusa (`.estado-erro`: o ícone de alerta no quadrado vermelho claro): a frase pronta, a referência (o request
 * id) e o "Tentar de novo". Com `titulo`, a frase desce para a linha de baixo. `icone` troca o ícone de alerta.
 * `contorno` põe a superfície em volta (fora de um bloco); `tela` ocupa a área da tela inteira.
 */
export function Erro({
  frase,
  titulo,
  referencia,
  tentar,
  rotuloTentar = "Tentar de novo",
  contorno,
  tela,
  icone = TriangleAlert,
}: {
  frase: string;
  titulo?: ReactNode;
  referencia?: string | null;
  tentar?: () => void;
  rotuloTentar?: ReactNode;
  contorno?: boolean;
  tela?: boolean;
  /** O ícone do quadrado, no lugar do alerta. */
  icone?: LucideIcon;
}) {
  const codigo = referencia ? <span className="numero block text-apoio text-texto-apoio">{referencia}</span> : null;
  return (
    <Estado
      erro
      icone={icone}
      titulo={titulo ?? frase}
      descricao={
        titulo ? (
          <>
            {frase}
            {codigo}
          </>
        ) : (
          codigo
        )
      }
      acao={
        tentar && (
          <button type="button" className="btn btn-secondary" onClick={tentar}>
            {rotuloTentar}
          </button>
        )
      }
      contorno={contorno}
      tela={tela}
    />
  );
}

/**
 * A lista sem item: o ícone (a caixa vazia, ou o `icone` do assunto), o título, a frase e a saída (a ação para
 * começar ou para limpar o filtro). `solto` tira a superfície em volta (dentro de um bloco); `tela` ocupa a área da
 * tela inteira.
 */
export function Vazio({
  titulo,
  descricao,
  acao,
  solto,
  tela,
  icone = Inbox,
}: {
  titulo: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  solto?: boolean;
  tela?: boolean;
  /** O ícone do quadrado, no lugar da caixa vazia. */
  icone?: LucideIcon;
}) {
  return <Estado icone={icone} titulo={titulo} descricao={descricao} acao={acao} contorno={!solto && !tela} tela={tela} />;
}
