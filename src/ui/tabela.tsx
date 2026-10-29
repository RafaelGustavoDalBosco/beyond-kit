import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../lib/cn";
import { contagem } from "../lib/formato";

import { Botao } from "./botao";
import { Carregando } from "./estados";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Número ou código: algarismos alinhados e à direita. */
    numero?: boolean;
    /** A coluna que fica com a sobra da largura. */
    principal?: boolean;
  }
}

export type Pagina = { page: number; page_size: number; total: number };

/** A lista: cabeçalho fixo, linha inteira clicável quando abre a ficha. */
export function Tabela<T>({
  dados,
  colunas,
  aoAbrir,
  carregando,
  pagina,
  aoMudarPagina,
  vazio,
}: {
  dados: T[] | undefined;
  colunas: ColumnDef<T, any>[];
  aoAbrir?: (linha: T) => void;
  carregando?: boolean;
  pagina?: Pagina;
  aoMudarPagina?: (page: number) => void;
  vazio?: string;
}) {
  const tabela = useReactTable({ data: dados ?? [], columns: colunas, getCoreRowModel: getCoreRowModel() });
  const paginas = pagina ? Math.max(1, Math.ceil(pagina.total / pagina.page_size)) : 1;

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            {tabela.getHeaderGroups().map((g) => (
              <tr key={g.id}>
                {g.headers.map((h) => (
                  <th
                    key={h.id}
                    className={cn(
                      "rotulo sticky top-0 h-9 border-b border-linha bg-superficie px-4 text-left font-medium whitespace-nowrap",
                      h.column.columnDef.meta?.numero && "text-right",
                      h.column.columnDef.meta?.principal && "w-full",
                    )}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
                {aoAbrir && <th className="sticky top-0 w-8 border-b border-linha bg-superficie" />}
              </tr>
            ))}
          </thead>
          <tbody>
            {!carregando &&
              tabela.getRowModel().rows.map((r) => (
                <tr
                  key={r.id}
                  onClick={aoAbrir ? () => aoAbrir(r.original) : undefined}
                  className={cn(
                    "group border-b border-linha last:border-0",
                    aoAbrir && "cursor-pointer transition-colors hover:bg-superficie-2",
                  )}
                >
                  {r.getVisibleCells().map((c) => (
                    <td
                      key={c.id}
                      className={cn(
                        "h-11 px-4 whitespace-nowrap",
                        c.column.columnDef.meta?.numero && "numero text-right",
                        c.column.columnDef.meta?.principal && "max-w-0 truncate whitespace-normal",
                      )}
                    >
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </td>
                  ))}
                  {aoAbrir && (
                    <td className="pr-3 text-texto-3">
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        {carregando && <Carregando linhas={5} />}
        {!carregando && dados?.length === 0 && vazio && <div className="p-8 text-center text-texto-3">{vazio}</div>}
      </div>
      {pagina && aoMudarPagina && pagina.total > pagina.page_size && (
        <div className="flex items-center justify-between border-t border-linha px-4 py-2.5 text-xs text-texto-2">
          <span className="numero">
            {contagem((pagina.page - 1) * pagina.page_size + 1)}–{contagem(Math.min(pagina.page * pagina.page_size, pagina.total))} de{" "}
            {contagem(pagina.total)}
          </span>
          <div className="flex items-center gap-1">
            <Botao tipo="fantasma" tamanho="icone-sm" disabled={pagina.page <= 1} onClick={() => aoMudarPagina(pagina.page - 1)}>
              <ChevronLeft />
            </Botao>
            <span className="numero px-1">
              {pagina.page}/{paginas}
            </span>
            <Botao
              tipo="fantasma"
              tamanho="icone-sm"
              disabled={pagina.page >= paginas}
              onClick={() => aoMudarPagina(pagina.page + 1)}
            >
              <ChevronRight />
            </Botao>
          </div>
        </div>
      )}
    </div>
  );
}
