"use client";

// O sino e a busca da BarraDoTopo. O kit só desenha: as notificações, o que é lido e o que abre
// ao clicar são do app.

import { Bell, Search } from "lucide-react";
import { Popover } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** Uma notificação da lista do sino; `quando` já vem formatada pelo app. */
export type Notificacao = {
  id: string | number;
  titulo: ReactNode;
  texto?: ReactNode;
  quando: ReactNode;
  lida?: boolean;
};

const BOTAO =
  "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-texto-3 transition-colors hover:bg-superficie-2 hover:text-texto data-[state=open]:bg-cobalto-suave data-[state=open]:text-cobalto [&_svg]:size-[19px]";

/** O campo de busca da barra do topo, ao lado do sino: abre a busca do app (a Paleta do Ctrl K). No celular, só a lupa. */
export function BotaoDeBusca({ aoBuscar, exemplo = "Buscar..." }: { aoBuscar: () => void; exemplo?: string }) {
  // Começa em Ctrl K: o servidor não sabe o sistema, e o desenho da hidratação tem de ser igual ao dele.
  const [atalho, setAtalho] = useState("Ctrl K");
  useEffect(() => {
    if (/Mac/.test(navigator.userAgent)) setAtalho("⌘ K");
  }, []);

  return (
    <button
      type="button"
      onClick={aoBuscar}
      className={cn(BOTAO, "md:w-64 md:justify-start md:gap-2 md:border md:border-linha md:bg-superficie-2 md:px-3 md:hover:border-linha-forte xl:w-80")}
      aria-label="Buscar"
      title={`Buscar (${atalho})`}
    >
      <Search className="shrink-0" />
      <span className="hidden min-w-0 flex-1 truncate text-left text-[13px] md:block">{exemplo}</span>
      <kbd className="hidden shrink-0 rounded-md border border-linha bg-superficie px-1.5 py-0.5 font-sans text-[11px] leading-none font-medium md:block">
        {atalho}
      </kbd>
    </button>
  );
}

/** O sino com a contagem das não lidas (9+ acima de 9) e o painel das notificações. Clicar num item fecha o painel
 * e chama `aoAbrir`; marcar como lida é do app. */
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
  const [aberto, setAberto] = useState(false);
  const total = naoLidas ?? notificacoes.filter((n) => !n.lida).length;

  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger className={BOTAO} aria-label={total > 0 ? `Notificações (${total} não lidas)` : "Notificações"}>
        <Bell />
        {total > 0 && (
          <span className="numero absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-risco px-1 text-[10px] font-bold text-white ring-2 ring-superficie">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 animate-entrar overflow-hidden rounded-bloco border border-linha bg-superficie shadow-3 outline-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-linha px-4 py-3">
            <span className="rotulo">Notificações</span>
            {total > 0 && aoMarcarTodas && (
              <button
                type="button"
                onClick={aoMarcarTodas}
                className="cursor-pointer text-xs font-medium text-cobalto hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-[420px] divide-y divide-linha overflow-y-auto">
            {notificacoes.length === 0 ? (
              <p className="m-0 py-8 text-center text-sm text-texto-3">{vazio}</p>
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
                    "flex w-full cursor-pointer items-start gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-superficie-2",
                    !n.lida && "bg-cobalto-suave/60",
                  )}
                >
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.lida ? "bg-transparent" : "bg-cobalto")} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-texto">{n.titulo}</span>
                    {n.texto && <span className="mt-0.5 block text-texto-2">{n.texto}</span>}
                    <span className="numero mt-1 block text-xs text-texto-3">{n.quando}</span>
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
