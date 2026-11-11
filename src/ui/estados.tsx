"use client";

import { CircleAlert, Inbox, Loader2, type LucideIcon } from "lucide-react";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";
import { Emblema, type TomDoEmblema } from "./emblema";

/** Liga o `SemValor` compacto (o ponto) em tudo o que estiver dentro; a `Tabela` densa já liga. */
export const SemValorCompacto = createContext(false);

/** null é "sem valor", nunca zero nem travessão; o rótulo vem do consumidor. `compacto` (ou a `Tabela` densa em volta)
 * mostra só um ponto apagado, com o rótulo no `title` e para o leitor de tela. */
export function SemValor({ rotulo = "sem valor", compacto }: { rotulo?: string; compacto?: boolean }) {
  const noCompacto = useContext(SemValorCompacto);
  if (compacto ?? noCompacto)
    return (
      <span role="img" aria-label={rotulo} title={rotulo} className="text-texto-3">
        ·
      </span>
    );
  return <span className="text-texto-3 italic">{rotulo}</span>;
}

/** O traço do esqueleto, com o brilho passando; a largura e a altura vêm pelo `className`. */
export function Esqueleto({ className }: { className?: string }) {
  return <div className={cn("reluzir rounded-lg", className)} />;
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

/** A linha da espera que passou do normal: o giro e a frase, que vem de quem chama. Nunca sozinha no meio da tela:
 * fica em cima do esqueleto ou da lista antiga. */
export function LinhaDeDemora({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="status"
      className={cn("flex animate-entrar items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-bold text-texto-2", className)}
    >
      <Loader2 aria-hidden className="size-[15px] shrink-0 animate-spin" />
      {children}
    </div>
  );
}

type Forma = "linhas" | "tabela" | "lista" | "grafico" | "cartoes" | "caixa" | "tela";

// Larguras e alturas variadas, para o esqueleto lembrar o conteúdo; literais, para o Tailwind achar.
const LARGURAS = ["w-2/5", "w-3/5", "w-1/2", "w-2/3", "w-1/3"];
const ALTURAS = ["h-[45%]", "h-[70%]", "h-[55%]", "h-[85%]", "h-[60%]", "h-full"];

// A caixa branca que segura as linhas: o esqueleto só aparece sobre o branco.
const CAIXA = "overflow-hidden rounded-bloco bg-superficie shadow-bloco";

/** Os cartões de número em esqueleto: o círculo do ícone, o rótulo, o valor e a linha pequena. */
function CartoesEmEsqueleto({ quantos }: { quantos: number }) {
  return (
    <div className="grid grid-cols-4 gap-3.5 celular:grid-cols-2 celular:gap-2.5">
      {Array.from({ length: quantos }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-cartao bg-superficie p-4 shadow-1 celular:flex-col celular:items-start celular:p-3"
        >
          <div className="reluzir size-[42px] shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 celular:w-full celular:flex-none">
            <Esqueleto className="h-3 w-3/5" />
            <Esqueleto className="mt-2.5 h-5 w-4/5" />
            <Esqueleto className="mt-2.5 h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** As linhas de lista em esqueleto: o ícone quadrado, o título com o apoio, o valor e o selo. Os respiros são os da
 * `LinhaDeLista`, para nada andar quando o dado chega. */
function LinhasEmEsqueleto({ quantos }: { quantos: number }) {
  return Array.from({ length: quantos }, (_, i) => (
    <div
      key={i}
      className="grid grid-cols-[40px_minmax(0,1fr)_110px_76px] items-center gap-3.5 border-t border-fio px-[18px] py-3 first:border-t-0 celular:grid-cols-[40px_minmax(0,1fr)_76px] celular:gap-3 celular:px-3.5"
    >
      <div className="reluzir size-10 rounded-icone" />
      <div>
        <Esqueleto className={cn("h-3", LARGURAS[i % LARGURAS.length])} />
        <Esqueleto className="mt-[7px] h-2.5 w-1/3" />
      </div>
      <Esqueleto className="h-3 celular:hidden" />
      <div className="reluzir h-[22px] rounded-full" />
    </div>
  ));
}

/** O desenho do esqueleto em cada forma; `quantos` é o número de linhas ou de cartões (o gráfico tem as barras dele).
 * `demora` é a linha da espera longa, que nas formas com caixa entra em cima das linhas. */
function FormaDoEsqueleto({ forma, quantos, demora }: { forma: Forma; quantos: number; demora: ReactNode }) {
  const vezes = Array.from({ length: quantos }, (_, i) => i);
  if (forma === "tela")
    return (
      <div className="flex flex-col gap-[18px]">
        <CartoesEmEsqueleto quantos={4} />
        <div className={CAIXA}>
          <div className="flex gap-2 px-[18px] py-3.5 celular:px-3.5 celular:py-3">
            <div className="reluzir h-8 w-16 rounded-full" />
            <div className="reluzir h-8 w-[72px] rounded-full" />
            <div className="reluzir h-8 w-20 rounded-full" />
          </div>
          {demora}
          <LinhasEmEsqueleto quantos={quantos} />
        </div>
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
  // Um cartão solto por item, como o `ItemDaLista` do `MestreDetalhe`.
  if (forma === "lista")
    return (
      <div className="flex flex-col gap-2">
        {vezes.map((i) => (
          <div key={i} className="flex flex-col gap-2 rounded-cartao bg-superficie px-4 py-3 shadow-1">
            <Esqueleto className={cn("h-3.5", LARGURAS[i % LARGURAS.length])} />
            <Esqueleto className="h-3 w-1/4" />
          </div>
        ))}
      </div>
    );
  if (forma === "tabela")
    return vezes.map((i) => (
      <div key={i} className="flex h-11 items-center gap-6 border-b border-fio px-4 last:border-0">
        <Esqueleto className={cn("h-3.5", LARGURAS[i % LARGURAS.length])} />
        <Esqueleto className="ml-auto h-3.5 w-20" />
        <Esqueleto className="h-3.5 w-16" />
      </div>
    ));
  if (forma === "grafico")
    return (
      <div className="flex h-44 items-end gap-4 border-b border-linha px-5">
        {ALTURAS.map((altura) => (
          <Esqueleto key={altura} className={cn("flex-1 rounded-t-md rounded-b-none", altura)} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-3 p-5">
      {vezes.map((i) => (
        <Esqueleto key={i} className="h-4" />
      ))}
    </div>
  );
}

// O recuo da linha de demora, para ela alinhar com o conteúdo de cada forma.
const RECUO_DA_DEMORA: Record<Forma, string> = {
  linhas: "px-5",
  grafico: "px-5",
  tabela: "px-4",
  lista: "px-4",
  caixa: "px-[18px] celular:px-3.5",
  tela: "px-[18px] celular:px-3.5",
  cartoes: "px-0",
};

/**
 * O esqueleto da primeira carga, na `forma` do que vem: `tela` (os cartões de número, as abas e as linhas de lista),
 * `cartoes` (os cartões de número), `caixa` (a caixa branca com as linhas de lista), `lista` (um cartão por item, a
 * lista do `MestreDetalhe`), `tabela`, `grafico` ou `linhas`, com `linhas` dizendo quantas linhas ou cartões. `rotulo`
 * quando a espera tem nome ("Consultando o GitHub…"). Só aparece depois de 200 ms, para a resposta rápida não piscar, e
 * ocupa o lugar desde o início. Depois de uns 2,5 s entra a linha com o giro e a frase de `demora`.
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
  // As formas que desenham as próprias superfícies brancas, direto no fundo da área.
  const naArea = forma === "tela" || forma === "caixa" || forma === "lista" || forma === "cartoes";
  // As que têm a caixa das linhas, onde a linha de demora entra por dentro.
  const naCaixa = forma === "tela" || forma === "caixa";
  const linhaDeDemora = demorou && <LinhaDeDemora className={RECUO_DA_DEMORA[forma]}>{frase}</LinhaDeDemora>;
  return (
    <div className="animate-surgir">
      {rotulo && <div className={cn("text-sm font-semibold text-texto-2", naArea ? "pb-3" : "px-5 pt-5")}>{rotulo}</div>}
      {!naCaixa && linhaDeDemora}
      <FormaDoEsqueleto forma={forma} quantos={linhas} demora={naCaixa && linhaDeDemora} />
    </div>
  );
}

/** A forma comum do vazio e do erro: o emblema em círculo, o título, a frase e a saída. */
function Estado({
  tom,
  icone,
  titulo,
  descricao,
  acao,
  contorno,
}: {
  tom: TomDoEmblema;
  icone: LucideIcon;
  titulo: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  contorno?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 px-5 py-7 text-center",
        contorno && "rounded-cartao border border-linha bg-superficie",
      )}
    >
      <Emblema icone={icone} tom={tom} tamanho="lg" className="mb-1" />
      <div className="text-[15px] font-extrabold">{titulo}</div>
      {descricao && <p className="m-0 max-w-[40ch] text-sm font-semibold text-texto-2">{descricao}</p>}
      {acao && <div className="mt-1.5">{acao}</div>}
    </div>
  );
}

/**
 * A recusa, na forma do vazio em vermelho: o emblema, a frase pronta, a referência (o request id) e o "Tentar de novo".
 * Com `titulo`, a frase desce para a linha de baixo. `contorno` põe o cartão branco em volta (fora de um bloco).
 */
export function Erro({
  frase,
  titulo,
  referencia,
  tentar,
  rotuloTentar = "Tentar de novo",
  contorno,
  icone = CircleAlert,
}: {
  frase: string;
  titulo?: ReactNode;
  referencia?: string | null;
  tentar?: () => void;
  rotuloTentar?: ReactNode;
  contorno?: boolean;
  icone?: LucideIcon;
}) {
  const codigo = referencia ? <span className="numero block text-xs text-texto-3">{referencia}</span> : null;
  return (
    <Estado
      tom="risco"
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
          <Botao tipo="primario" tamanho="sm" onClick={tentar}>
            {rotuloTentar}
          </Botao>
        )
      }
      contorno={contorno}
    />
  );
}

/**
 * A lista sem item: o emblema em círculo, o título, a frase e a saída (a ação para começar ou para limpar o filtro).
 * `solto` tira o contorno (dentro de um bloco); `icone` e `tom` são os do assunto (o verde do "nada em aberto").
 */
export function Vazio({
  titulo,
  descricao,
  acao,
  solto,
  icone = Inbox,
  tom = "cobalto",
}: {
  titulo: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  solto?: boolean;
  icone?: LucideIcon;
  tom?: TomDoEmblema;
  /** @deprecated Sem efeito: o filete saiu do kit. */
  filete?: boolean;
}) {
  return <Estado tom={tom} icone={icone} titulo={titulo} descricao={descricao} acao={acao} contorno={!solto} />;
}
