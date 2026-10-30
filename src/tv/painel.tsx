"use client";

import { Maximize, Minimize, Pause, Play, RefreshCw, SkipBack, SkipForward, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";

// O painel de TV: escuro, letra grande, um item por vez passando sozinho (ou a lista inteira). O assunto
// (obra, disciplina, pedido) fica no app; aqui moram a moldura, os controles e a passagem.

/** Tempos oferecidos para cada item na tela, em segundos. */
export const TEMPOS_DA_APRESENTACAO = [10, 20, 30, 60] as const;

const PASSO_MS = 250;

/** Próximo índice, voltando ao primeiro no fim da lista. */
function proximoIndice(atual: number, total: number, passo = 1) {
  if (total <= 0) return 0;
  return (((atual + passo) % total) + total) % total;
}

/** O índice dentro da lista depois que ela muda sozinha (item sai do filtro, outro entra). */
function indiceValido(atual: number, total: number) {
  if (total <= 0 || atual < 0) return 0;
  return atual >= total ? total - 1 : atual;
}

/** Quanto do tempo do item já passou, de 0 a 1. */
function fracaoDecorrida(decorridoMs: number, segundos: number) {
  if (segundos <= 0) return 0;
  return Math.min(1, Math.max(0, decorridoMs / (segundos * 1000)));
}

function relogio(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function decorrido(segundos: number) {
  if (segundos < 60) return `${segundos}s`;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}m${s > 0 ? ` ${s}s` : ""}`;
}

/** A tela cheia do navegador (a TV): liga e desliga no documento inteiro. */
function BotaoTelaCheia() {
  const [cheia, setCheia] = useState(false);

  useEffect(() => {
    const atualizar = () => setCheia(Boolean(document.fullscreenElement));
    atualizar();
    document.addEventListener("fullscreenchange", atualizar);
    return () => document.removeEventListener("fullscreenchange", atualizar);
  }, []);

  function alternar() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  }

  const Icone = cheia ? Minimize : Maximize;
  return (
    <button
      type="button"
      onClick={alternar}
      title={cheia ? "Sair da tela cheia" : "Tela cheia"}
      className="cursor-pointer text-painel-texto-3 transition-colors hover:text-painel-texto"
    >
      <Icone className="size-5" />
    </button>
  );
}

/** O relógio e o "atualizado há"; `aoAtualizar` faz do "atualizado há" o botão de buscar de novo. */
function Relogio({ atualizadoEm, aoAtualizar }: { atualizadoEm: number; aoAtualizar?: () => void }) {
  // null até montar: a hora do servidor nunca bate com a do navegador
  const [agora, setAgora] = useState<Date | null>(null);

  useEffect(() => {
    setAgora(new Date());
    const t = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const segundos = agora && atualizadoEm ? Math.max(0, Math.floor((agora.getTime() - atualizadoEm) / 1000)) : 0;
  const atualizado = (
    <>
      <RefreshCw className="size-2.5" />
      <span>atualizado há {decorrido(segundos)}</span>
    </>
  );

  return (
    <div className="shrink-0 text-right">
      <p className="numero m-0 text-2xl leading-tight font-bold tracking-tight">{agora ? relogio(agora) : " "}</p>
      {aoAtualizar ? (
        <button
          type="button"
          onClick={aoAtualizar}
          title="Atualizar agora"
          className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-painel-texto-3 transition-colors hover:text-painel-texto-2"
        >
          {atualizado}
        </button>
      ) : (
        <span className="flex items-center justify-end gap-1 text-xs text-painel-texto-3">{atualizado}</span>
      )}
    </div>
  );
}

/**
 * A moldura do painel de TV: escura, na altura toda. No alto, `voltar` (o `Link` do app), `marca`, o `rotulo` em
 * caixa alta sobre o `titulo`, os `filtros` e, à direita, o relógio, o "atualizado há" (`atualizadoEm` em ms, o
 * `dataUpdatedAt` do React Query) e o botão de tela cheia.
 */
export function PainelDeTv({
  voltar,
  marca,
  rotulo,
  titulo,
  filtros,
  atualizadoEm,
  aoAtualizar,
  className,
  children,
}: {
  voltar?: ReactNode;
  marca?: ReactNode;
  rotulo?: ReactNode;
  titulo: ReactNode;
  filtros?: ReactNode;
  atualizadoEm: number;
  aoAtualizar?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-painel text-painel-texto", className)}>
      <header className="flex shrink-0 flex-wrap items-center gap-4 border-b border-painel-linha bg-painel-2 px-6 py-4">
        {voltar && (
          <div className="shrink-0 text-painel-texto-3 transition-colors [&_a:hover]:text-painel-texto [&_button:hover]:text-painel-texto">
            {voltar}
          </div>
        )}
        {marca && <div className="shrink-0">{marca}</div>}
        {marca && <div className="mx-1 h-8 w-px bg-painel-linha" />}
        <div className="min-w-0">
          {rotulo && <div className="rotulo text-painel-texto-3">{rotulo}</div>}
          <p className="m-0 truncate text-lg leading-tight font-semibold">{titulo}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-6">
          {filtros && <div className="flex flex-wrap items-center gap-2">{filtros}</div>}
          <Relogio atualizadoEm={atualizadoEm} aoAtualizar={aoAtualizar} />
          <BotaoTelaCheia />
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/** O controle segmentado do painel (o filtro de situação, o modo): a opção ativa acende em branco. */
export function SegmentosDoPainel<T extends string | number>({
  opcoes,
  valor,
  aoMudar,
  className,
}: {
  opcoes: { valor: T; rotulo: ReactNode; icone?: LucideIcon; dica?: string }[];
  valor: T;
  aoMudar: (valor: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 rounded-lg border border-painel-linha bg-painel-3 p-1", className)}>
      {opcoes.map(({ valor: v, rotulo, icone: Icone, dica }) => (
        <button
          key={String(v)}
          type="button"
          title={dica}
          aria-pressed={v === valor}
          onClick={() => aoMudar(v)}
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors",
            v === valor ? "bg-painel-texto text-painel-2" : "text-painel-texto-2 hover:text-painel-texto",
          )}
        >
          {Icone && <Icone className="size-3.5" />}
          {rotulo}
        </button>
      ))}
    </div>
  );
}

/** O `select` nativo no escuro do painel (o cliente, o tempo do item). */
export function SelecaoDoPainel({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "cursor-pointer rounded-lg border border-painel-linha bg-painel-2 px-3 py-1.5 text-sm text-painel-texto focus:ring-1 focus:ring-painel-texto-3 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

/** O que `useApresentacao` devolve. */
export type Apresentacao = {
  indice: number;
  progresso: number;
  pausado: boolean;
  alternarPausa: () => void;
  irPara: (indice: number) => void;
  proximo: () => void;
  anterior: () => void;
};

/**
 * A passagem dos itens: um a cada `segundos`, voltando ao primeiro no fim. O índice se ajusta quando a lista muda
 * sozinha; com `ativa`, as setas passam e o espaço pausa (o controle remoto da TV manda setas).
 */
export function useApresentacao({
  total,
  segundos,
  ativa = true,
}: {
  total: number;
  segundos: number;
  ativa?: boolean;
}): Apresentacao {
  const [indice, setIndice] = useState(0);
  const [noItemMs, setNoItemMs] = useState(0);
  const [pausado, setPausado] = useState(false);

  // trocar o tempo recomeça a contagem do item
  useEffect(() => setNoItemMs(0), [segundos]);

  const passar = useCallback(
    (passo: number) => {
      setIndice((atual) => proximoIndice(indiceValido(atual, total), total, passo));
      setNoItemMs(0);
    },
    [total],
  );
  const proximo = useCallback(() => passar(1), [passar]);
  const anterior = useCallback(() => passar(-1), [passar]);
  const irPara = useCallback(
    (novo: number) => {
      setIndice(indiceValido(novo, total));
      setNoItemMs(0);
    },
    [total],
  );
  const alternarPausa = useCallback(() => setPausado((p) => !p), []);

  useEffect(() => {
    if (!ativa || pausado || total <= 1) return;
    const t = setInterval(() => {
      setNoItemMs((ms) => {
        if (ms + PASSO_MS >= segundos * 1000) {
          setIndice((atual) => proximoIndice(indiceValido(atual, total), total));
          return 0;
        }
        return ms + PASSO_MS;
      });
    }, PASSO_MS);
    return () => clearInterval(t);
  }, [ativa, pausado, segundos, total]);

  useEffect(() => {
    if (!ativa) return;
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "ArrowRight") proximo();
      else if (e.key === "ArrowLeft") anterior();
      else if (e.key === " ") {
        e.preventDefault();
        alternarPausa();
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [ativa, proximo, anterior, alternarPausa]);

  return {
    indice: indiceValido(indice, total),
    progresso: fracaoDecorrida(noItemMs, segundos),
    pausado,
    alternarPausa,
    irPara,
    proximo,
    anterior,
  };
}

/**
 * Os controles da apresentação, discretos (a TV roda sozinha): a barra do tempo do item, voltar, pausar, avançar,
 * "passando a cada Ns" e "{nomeDoItem} X de N".
 */
export function ControlesDaApresentacao({
  apresentacao,
  total,
  segundos,
  nomeDoItem = "item",
}: {
  apresentacao: Apresentacao;
  total: number;
  segundos: number;
  nomeDoItem?: string;
}) {
  const { indice, progresso, pausado, alternarPausa, proximo, anterior } = apresentacao;
  const botao = "cursor-pointer transition-colors hover:text-painel-texto";
  return (
    <div className="shrink-0">
      <div className="h-1 bg-painel-3">
        <div
          className="h-full bg-painel-destaque transition-[width] duration-200 ease-linear"
          style={{ width: `${progresso * 100}%` }}
        />
      </div>
      {total > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-painel-linha py-3 text-painel-texto-3">
          <button type="button" onClick={anterior} className={botao} title={`${nomeDoItem} anterior (←)`}>
            <SkipBack className="size-5" />
          </button>
          <button
            type="button"
            onClick={alternarPausa}
            className={botao}
            title={pausado ? "Retomar (espaço)" : "Pausar (espaço)"}
          >
            {pausado ? <Play className="size-[22px]" /> : <Pause className="size-[22px]" />}
          </button>
          <button type="button" onClick={proximo} className={botao} title={`Próximo ${nomeDoItem} (→)`}>
            <SkipForward className="size-5" />
          </button>
          <span className="ml-2 text-sm">{pausado ? "pausado" : `passando a cada ${segundos}s`}</span>
          <span className="numero ml-2 text-sm">
            {nomeDoItem} {indice + 1} de {total}
          </span>
        </div>
      )}
    </div>
  );
}

type ModoDoPainel = "apresentacao" | "lista";

function ler(chave: string) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    // sem armazenamento (aba anônima, bloqueio): a escolha vale só nesta tela
  }
}

/** O modo e o tempo do item, guardados no próprio aparelho (a TV) sob `chave`. */
export function usePreferenciasDoPainel(chave: string) {
  const [modo, setModoEstado] = useState<ModoDoPainel>("apresentacao");
  const [segundos, setSegundosEstado] = useState<number>(20);

  useEffect(() => {
    const m = ler(`${chave}:modo`);
    if (m === "apresentacao" || m === "lista") setModoEstado(m);
    const s = Number(ler(`${chave}:segundos`));
    if ((TEMPOS_DA_APRESENTACAO as readonly number[]).includes(s)) setSegundosEstado(s);
  }, [chave]);

  const setModo = useCallback(
    (novo: ModoDoPainel) => {
      setModoEstado(novo);
      gravar(`${chave}:modo`, novo);
    },
    [chave],
  );
  const setSegundos = useCallback(
    (novo: number) => {
      setSegundosEstado(novo);
      gravar(`${chave}:segundos`, String(novo));
    },
    [chave],
  );

  return { modo, setModo, segundos, setSegundos };
}

/**
 * O miolo do painel: carregando, vazio, ou o item da vez (`renderSlide`, com os controles embaixo) no modo
 * apresentação, ou a lista inteira (`renderLista`).
 */
export function ConteudoDoPainel<T>({
  itens,
  carregando,
  modo,
  segundos,
  nomeDoItem,
  renderSlide,
  renderLista,
  vazio = "Nada a exibir",
}: {
  itens: T[];
  carregando?: boolean;
  modo: ModoDoPainel;
  segundos: number;
  nomeDoItem?: string;
  renderSlide: (item: T, posicao: number, total: number) => ReactNode;
  renderLista: (itens: T[]) => ReactNode;
  vazio?: ReactNode;
}) {
  const apresentando = modo === "apresentacao";
  const apresentacao = useApresentacao({ total: itens.length, segundos, ativa: apresentando && !carregando });

  if (carregando || itens.length === 0) {
    return (
      <div className={cn("p-12 text-center text-painel-texto-3", apresentando ? "text-2xl" : "text-sm")}>
        {carregando ? "Carregando…" : vazio}
      </div>
    );
  }

  if (!apresentando) return <div className="flex-1 overflow-y-auto">{renderLista(itens)}</div>;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {renderSlide(itens[apresentacao.indice]!, apresentacao.indice + 1, itens.length)}
      </div>
      <ControlesDaApresentacao
        apresentacao={apresentacao}
        total={itens.length}
        segundos={segundos}
        nomeDoItem={nomeDoItem}
      />
    </div>
  );
}

/** A barra de andamento no escuro: `valor` de 0 a 100; `cor` é a classe do preenchimento (padrão o destaque). */
export function BarraDoPainel({
  valor,
  cor = "bg-painel-destaque",
  className,
}: {
  valor: number;
  cor?: string;
  className?: string;
}) {
  const largura = Math.min(100, Math.max(0, valor));
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-painel-3", className)}>
      <div className={cn("h-full rounded-full transition-[width]", cor)} style={{ width: `${largura}%` }} />
    </div>
  );
}

/** A situação em pílula; `cor` é dado do app (a cor do status no banco), por isso vai no style. */
export function SeloDoPainel({ cor, rotulo, className }: { cor: string; rotulo: ReactNode; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", className)}
      style={{ color: cor, background: `color-mix(in srgb, ${cor} 16%, transparent)` }}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ background: cor }} />
      {rotulo}
    </span>
  );
}
