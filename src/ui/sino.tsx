"use client";

// O sino e a busca do CabecalhoDoApp (sobre o azul dele) ou da BarraDoTopo. O kit só desenha: as notificações, o
// que é lido e o que abre ao clicar são do app.

import { Bell, Search, type LucideIcon } from "lucide-react";
import { Popover } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { useNoCabecalho } from "./cabecalho";
import { Emblema, type TomDoEmblema } from "./emblema";

/** Uma notificação da lista do sino; `quando` já vem formatada pelo app. O `icone` e o `tom` dizem o que ela é (a
 * correção aplicada em verde, o atraso em laranja); sem eles, o sino em azul. */
export type Notificacao = {
  id: string | number;
  titulo: ReactNode;
  texto?: ReactNode;
  quando: ReactNode;
  lida?: boolean;
  icone?: LucideIcon;
  tom?: TomDoEmblema;
};

const BOTAO =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-texto-2 transition-colors hover:bg-superficie-2 hover:text-texto data-[state=open]:bg-cobalto-suave data-[state=open]:text-cobalto [&_svg]:size-5";

// Sobre o azul do cabeçalho; o contorno do foco vai em branco, que o azul do kit some no fundo.
const BOTAO_NO_CABECALHO =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-cabecalho-texto transition-colors hover:bg-cabecalho-2 focus-visible:outline-cabecalho-texto data-[state=open]:bg-cabecalho-2 [&_svg]:size-5";

/** O campo de busca do cabeçalho: abre a busca do app (a Paleta do Ctrl K). No cabeçalho é o campo branco em pílula,
 * que ocupa o lugar que o cabeçalho dá; fora dele leva a borda. No celular, só a lupa. */
export function BotaoDeBusca({ aoBuscar, exemplo = "Buscar..." }: { aoBuscar: () => void; exemplo?: string }) {
  const noCabecalho = useNoCabecalho();
  // Começa em Ctrl K: o servidor não sabe o sistema, e o desenho da hidratação tem de ser igual ao dele.
  const [atalho, setAtalho] = useState("Ctrl K");
  useEffect(() => {
    if (/Mac/.test(navigator.userAgent)) setAtalho("⌘ K");
  }, []);

  return (
    <button
      type="button"
      onClick={aoBuscar}
      className={cn(
        "flex h-[38px] w-full min-w-0 cursor-pointer items-center gap-2 rounded-pilula bg-superficie px-4 text-sm font-semibold text-texto-2 transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
        "celular:size-[34px] celular:shrink-0 celular:justify-center celular:rounded-full celular:px-0",
        // a largura de fora do cabeçalho vai sem `mesa:`: a variante do kit sai depois das do Tailwind e ganharia do `xl:`
        noCabecalho ? "focus-visible:outline-cabecalho-texto" : "w-64 border border-linha hover:border-linha-forte xl:w-80",
      )}
      aria-label="Buscar"
      title={`Buscar (${atalho})`}
    >
      <Search />
      <span className="min-w-0 flex-1 truncate text-left celular:hidden">{exemplo}</span>
      <kbd className="shrink-0 font-sans text-xs font-semibold text-texto-3 celular:hidden">{atalho}</kbd>
    </button>
  );
}

/** O sino com a contagem das não lidas (9+ acima de 9) e o painel das notificações: o cabeçalho com "Marcar todas
 * como lidas" e cada notificação com o ícone em círculo, a nova em azul claro. Clicar num item fecha o painel e
 * chama `aoAbrir`; marcar como lida é do app. */
export function Sino({
  notificacoes,
  naoLidas,
  aoAbrir,
  aoMarcarTodas,
  vazio = "Nenhuma notificação.",
}: {
  notificacoes: Notificacao[];
  /** Sem ele, conta as da lista sem `lida`. */
  naoLidas?: number;
  aoAbrir?: (n: Notificacao) => void;
  aoMarcarTodas?: () => void;
  vazio?: ReactNode;
}) {
  const noCabecalho = useNoCabecalho();
  const [aberto, setAberto] = useState(false);
  const total = naoLidas ?? notificacoes.filter((n) => !n.lida).length;

  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger
        className={noCabecalho ? BOTAO_NO_CABECALHO : BOTAO}
        aria-label={total > 0 ? `Notificações (${total} não lidas)` : "Notificações"}
      >
        <Bell />
        {total > 0 && (
          <span
            className={cn(
              "numero absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-risco px-1 text-[10px] font-extrabold text-white ring-2",
              noCabecalho ? "ring-cabecalho" : "ring-superficie",
            )}
          >
            {total > 9 ? "9+" : total}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-50 w-[360px] max-w-[calc(100vw-24px)] animate-entrar overflow-hidden rounded-bloco border border-fio bg-superficie text-texto shadow-2 outline-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-fio px-4 py-3.5">
            <span className="font-extrabold">Notificações</span>
            {total > 0 && aoMarcarTodas && (
              <button
                type="button"
                onClick={aoMarcarTodas}
                className="cursor-pointer text-[13px] font-bold text-cobalto hover:text-cobalto-forte"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {notificacoes.length === 0 ? (
              <p className="m-0 py-8 text-center text-sm font-semibold text-texto-2">{vazio}</p>
            ) : (
              notificacoes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setAberto(false);
                    aoAbrir?.(n);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3 border-b border-fio px-4 py-3 text-left text-sm transition-colors last:border-b-0",
                    // a nova vai no azul claro, mais leve que o da seleção
                    n.lida ? "hover:bg-superficie-2" : "bg-cobalto-suave/40 hover:bg-cobalto-suave/70",
                  )}
                >
                  <Emblema icone={n.icone ?? Bell} tom={n.tom} tamanho="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-texto">{n.titulo}</span>
                    {n.texto && <span className="block text-[13px] font-semibold text-texto-2">{n.texto}</span>}
                    <span className="numero mt-0.5 block text-xs font-bold text-texto-3">{n.quando}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
