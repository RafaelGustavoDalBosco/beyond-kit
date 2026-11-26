"use client";

// O sino e a busca do CabecalhoDoApp (ou da BarraDoTopo). O kit só desenha: as notificações, o que é lido e o que
// abre ao clicar são do app. O sino leva dois avisos, a versão nova (Novidades) e a resposta do suporte
// a um chamado; o que mais o app puser segue o mesmo desenho.

import { Bell, Search, type LucideIcon } from "lucide-react";
import { Popover } from "radix-ui";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { useNoCabecalho } from "./cabecalho";

/** Uma notificação da lista do sino; `quando` já vem formatada pelo app ("há 2 horas"). O `icone` é o sinal à
 * esquerda, em texto de apoio; sem ele, o sino. */
export type Notificacao = {
  id: string | number;
  titulo: ReactNode;
  texto?: ReactNode;
  quando: ReactNode;
  lida?: boolean;
  icone?: LucideIcon;
};

/** O campo de busca (`.busca`): abre a busca do app (a Paleta do Ctrl K), com o texto de exemplo e a tecla.
 * No cabeçalho a margem automática dele joga o resto à direita; ao estreitar o cabeçalho a tecla some e depois fica só a lupa. */
export function BotaoDeBusca({ aoBuscar, exemplo = "Buscar…" }: { aoBuscar: () => void; exemplo?: string }) {
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
      className={cn("busca cursor-text border-0 text-left", !noCabecalho && "ml-0")}
      aria-label="Buscar"
      title={`Buscar (${atalho})`}
    >
      <Search aria-hidden className="size-4 shrink-0" />
      <span className="truncate">{exemplo}</span>
      <kbd className="tecla font-sans">{atalho}</kbd>
    </button>
  );
}

/** O sino (`.btn-icon` com o `.ponto-aviso` vermelho enquanto há não lido) e o `.flutuante` dos avisos, em vidro: no
 * alto, "Não lidos" e "Todos"; cada aviso com o sinal, o título e a linha de apoio com o quando, o não lido em azul
 * claro; no pé, "Marcar todos como lidos". Clicar num aviso fecha o flutuante e chama `aoAbrir`; marcar como lido é do app. */
export function Sino({
  notificacoes,
  naoLidas,
  aoAbrir,
  aoMarcarTodas,
  vazio = "Nenhum aviso.",
}: {
  notificacoes: Notificacao[];
  /** Sem ele, conta as da lista sem `lida`. */
  naoLidas?: number;
  aoAbrir?: (n: Notificacao) => void;
  aoMarcarTodas?: () => void;
  vazio?: ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  const [soNaoLidas, setSoNaoLidas] = useState(true);
  const total = naoLidas ?? notificacoes.filter((n) => !n.lida).length;
  // Os não lidos primeiro; com o filtro "Não lidos", só eles.
  const ordem = [...notificacoes].sort((a, b) => Number(!!a.lida) - Number(!!b.lida));
  const visiveis = soNaoLidas && total > 0 ? ordem.filter((n) => !n.lida) : ordem;

  return (
    <Popover.Root open={aberto} onOpenChange={setAberto}>
      <Popover.Trigger className="btn btn-icon" aria-label={total > 0 ? `Avisos (${total} não lidos)` : "Avisos"}>
        <Bell className="icone" aria-hidden />
        {total > 0 && <span aria-hidden className="ponto-aviso" />}
      </Popover.Trigger>
      <Popover.Portal>
        {/* o Radix já posiciona: o `.flutuante` perde o `fixed` dele */}
        <Popover.Content
          align="end"
          sideOffset={6}
          aria-label="Avisos"
          className="flutuante static z-50 w-[380px] max-w-[calc(100vw-16px)] outline-none"
        >
          <div className="flut-topo">
            <b>Avisos</b>
            {total > 0 && (
              <>
                <button type="button" className={cn("tag filtro", soNaoLidas && "is-ativo")} onClick={() => setSoNaoLidas(true)}>
                  Não lidos <span className="numero">{total}</span>
                </button>
                <button type="button" className={cn("tag filtro", !soNaoLidas && "is-ativo")} onClick={() => setSoNaoLidas(false)}>
                  Todos
                </button>
              </>
            )}
          </div>
          {visiveis.length === 0 ? (
            <div className="busca-vazio">
              <span>{vazio}</span>
            </div>
          ) : (
            visiveis.map((n) => {
              const Icone = n.icone ?? Bell;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setAberto(false);
                    aoAbrir?.(n);
                  }}
                  // o não lido fica com o azul claro do `.is-novo`; sob o cursor, o item vai no azul da ação
                  className={cn("flut-item", !n.lida && "is-novo")}
                >
                  <i aria-hidden>
                    <Icone className="icone mx-auto" />
                  </i>
                  <span>
                    <b>{n.titulo}</b>
                    <small>
                      {n.texto}
                      {n.texto && " · "}
                      {n.quando}
                    </small>
                  </span>
                </button>
              );
            })
          )}
          {total > 0 && aoMarcarTodas && (
            <div className="flut-rodape">
              <button type="button" className="btn btn-ghost" onClick={aoMarcarTodas}>
                Marcar todos como lidos
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
