import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** A lista à esquerda, o detalhe do escolhido à direita (o padrão de toda lista). */
export function MestreDetalhe({
  cabeca,
  lista,
  rodape,
  detalhe,
  largura = 380,
  className,
}: {
  cabeca: ReactNode;
  lista: ReactNode;
  rodape?: ReactNode;
  detalhe: ReactNode;
  largura?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid overflow-hidden rounded-bloco border border-linha bg-superficie shadow-1", className)}
      style={{ gridTemplateColumns: `${largura}px 1fr` }}
    >
      <div className="flex min-h-0 min-w-0 flex-col border-r border-linha">
        <div className="flex flex-col gap-3 border-b border-linha p-4">{cabeca}</div>
        <div className="min-h-0 flex-1 overflow-y-auto">{lista}</div>
        {rodape}
      </div>
      <div className="flex min-h-0 min-w-0 flex-col">
        <div className="filete shrink-0" />
        <div className="min-h-0 flex-1 overflow-y-auto">{detalhe}</div>
      </div>
    </div>
  );
}

/** Uma linha da lista do master/detail; a escolhida leva a barra cobalto. */
export function ItemDaLista({ ativo, aoEscolher, children }: { ativo: boolean; aoEscolher: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={aoEscolher}
      aria-current={ativo || undefined}
      className={cn(
        "relative flex w-full cursor-pointer flex-col gap-1 border-b border-linha px-4 py-3 text-left transition-colors",
        ativo ? "bg-cobalto-suave" : "hover:bg-superficie-2",
      )}
    >
      {ativo && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-cobalto" />}
      {children}
    </button>
  );
}

/** A paginação no pé da lista (a página vem do servidor). */
export function PaginasDaLista({
  page,
  page_size,
  total,
  aoMudar,
}: {
  page: number;
  page_size: number;
  total: number;
  aoMudar: (p: number) => void;
}) {
  if (total <= page_size) return null;
  const paginas = Math.ceil(total / page_size);
  return (
    <div className="flex items-center justify-between border-t border-linha px-4 py-2 text-xs text-texto-2">
      <Botao tipo="fantasma" tamanho="icone-sm" disabled={page <= 1} onClick={() => aoMudar(page - 1)}>
        <ChevronLeft />
      </Botao>
      <span className="numero">
        {page}/{paginas}
      </span>
      <Botao tipo="fantasma" tamanho="icone-sm" disabled={page >= paginas} onClick={() => aoMudar(page + 1)}>
        <ChevronRight />
      </Botao>
    </div>
  );
}
