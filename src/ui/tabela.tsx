"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnMeta,
  type RowData,
} from "@tanstack/react-table";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";

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
    /** Texto de várias linhas: quebra, com respiro em cima e embaixo, alinhado ao topo. */
    quebra?: boolean;
    /** Presa à esquerda quando a tabela rola de lado (o nome, numa tabela larga). */
    fixa?: boolean;
    /** Some abaixo do breakpoint (a coluna secundária no celular). */
    esconderAbaixo?: "sm" | "md" | "lg";
    /** Alinhada ao centro (um ícone, um selo). */
    centro?: boolean;
  }
}

// Classes literais por breakpoint, para o Tailwind achar.
const ESCONDER = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" } as const;

// O que vale igual no th, no td e no rodapé de uma coluna: some abaixo do breakpoint e centraliza.
function classeDaColuna(meta: ColumnMeta<any, any> | undefined) {
  return cn(meta?.esconderAbaixo && ESCONDER[meta.esconderAbaixo], meta?.centro && "text-center");
}

export type Pagina = { page: number; page_size: number; total: number };

/**
 * A lista: cabeçalho fixo, linha inteira clicável quando abre a ficha. `classeDaLinha` marca a linha (a inativa
 * apagada, a atrasada em aviso); `grupo` abre uma faixa de título quando o valor muda de uma linha para a outra
 * (os dados chegam ordenados); o `footer` das colunas vira o rodapé (o total). `expandir` dá à linha um botão que
 * abre embaixo dela o detalhe (uma sub-tabela); `podeAbrir` diz quais linhas abrem a ficha; `atributosDaLinha` põe
 * data-*, aria-* ou id no <tr>.
 */
export function Tabela<T>({
  dados,
  colunas,
  aoAbrir,
  carregando,
  pagina,
  aoMudarPagina,
  vazio,
  classeDaLinha,
  grupo,
  expandir,
  podeAbrir,
  atributosDaLinha,
}: {
  dados: T[] | undefined;
  colunas: ColumnDef<T, any>[];
  aoAbrir?: (linha: T) => void;
  carregando?: boolean;
  pagina?: Pagina;
  aoMudarPagina?: (page: number) => void;
  vazio?: ReactNode;
  classeDaLinha?: (linha: T) => string | false | undefined;
  grupo?: (linha: T) => ReactNode;
  expandir?: (linha: T) => ReactNode | null;
  podeAbrir?: (linha: T) => boolean;
  atributosDaLinha?: (linha: T) => Record<string, string | number | boolean | undefined>;
}) {
  const tabela = useReactTable({ data: dados ?? [], columns: colunas, getCoreRowModel: getCoreRowModel() });
  const [abertas, setAbertas] = useState<Set<string>>(() => new Set());
  // Dados novos (outra página, outro filtro): as linhas abertas fecham, porque a chave é a posição da linha.
  const [dadosDasAbertas, setDadosDasAbertas] = useState(dados);
  if (dados !== dadosDasAbertas) {
    setDadosDasAbertas(dados);
    setAbertas(new Set());
  }
  const paginas = pagina ? Math.max(1, Math.ceil(pagina.total / pagina.page_size)) : 1;
  const largura = tabela.getVisibleLeafColumns().length + (aoAbrir ? 1 : 0) + (expandir ? 1 : 0);
  const comRodape = tabela.getAllLeafColumns().some((c) => c.columnDef.footer);
  const linhas = tabela.getRowModel().rows;

  // Abre ou fecha o detalhe de uma linha.
  const alternar = (id: string) =>
    setAbertas((atual) => {
      const nova = new Set(atual);
      if (nova.has(id)) nova.delete(id);
      else nova.add(id);
      return nova;
    });

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            {tabela.getHeaderGroups().map((g) => (
              <tr key={g.id}>
                {expandir && <th className="sticky top-0 w-8 border-b border-linha bg-superficie" />}
                {g.headers.map((h) => (
                  <th
                    key={h.id}
                    className={cn(
                      "rotulo sticky top-0 h-9 border-b border-linha bg-superficie px-4 text-left font-medium whitespace-nowrap",
                      h.column.columnDef.meta?.numero && "text-right",
                      h.column.columnDef.meta?.principal && "w-full",
                      h.column.columnDef.meta?.fixa && "left-0 z-10",
                      classeDaColuna(h.column.columnDef.meta),
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
              linhas.map((r, i) => {
                const titulo = grupo?.(r.original);
                const anterior = linhas[i - 1];
                const novoGrupo = grupo && (!anterior || titulo !== grupo(anterior.original));
                const clicavel = !!aoAbrir && (podeAbrir?.(r.original) ?? true);
                const detalhe = expandir?.(r.original) ?? null;
                const aberta = detalhe !== null && abertas.has(r.id);
                return (
                  <Fragment key={r.id}>
                    {novoGrupo && (
                      <tr>
                        <th colSpan={largura} className="border-b border-linha bg-superficie-2/60 px-4 py-2 text-left">
                          <span className="titulo-secao">{titulo}</span>
                        </th>
                      </tr>
                    )}
                    <tr
                      {...atributosDaLinha?.(r.original)}
                      onClick={clicavel ? () => aoAbrir?.(r.original) : undefined}
                      className={cn(
                        "group border-b border-linha last:border-0",
                        clicavel && "cursor-pointer transition-colors hover:bg-superficie-2",
                        classeDaLinha?.(r.original),
                      )}
                    >
                      {expandir && (
                        <td className="w-8 pl-2">
                          {detalhe !== null && (
                            <Botao
                              tipo="fantasma"
                              tamanho="icone-sm"
                              aria-expanded={aberta}
                              aria-label={aberta ? "Esconder detalhes" : "Mostrar detalhes"}
                              onClick={(e) => {
                                e.stopPropagation();
                                alternar(r.id);
                              }}
                            >
                              <ChevronDown className={cn("transition-transform", !aberta && "-rotate-90")} />
                            </Botao>
                          )}
                        </td>
                      )}
                      {r.getVisibleCells().map((c) => (
                        <td
                          key={c.id}
                          className={cn(
                            "h-11 px-4 whitespace-nowrap",
                            c.column.columnDef.meta?.numero && "numero text-right",
                            c.column.columnDef.meta?.principal && "max-w-0 truncate whitespace-normal",
                            c.column.columnDef.meta?.quebra && "h-auto py-3 align-top whitespace-normal",
                            c.column.columnDef.meta?.fixa && "sticky left-0 z-[1] bg-superficie",
                            classeDaColuna(c.column.columnDef.meta),
                          )}
                        >
                          {flexRender(c.column.columnDef.cell, c.getContext())}
                        </td>
                      ))}
                      {aoAbrir && (
                        <td className="pr-3 text-texto-3">
                          {clicavel && (
                            <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </td>
                      )}
                    </tr>
                    {aberta && (
                      <tr className="border-b border-linha last:border-0">
                        <td colSpan={largura} className="bg-superficie-2/40 p-0">
                          {detalhe}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
          {comRodape && !carregando && (
            <tfoot>
              {tabela.getFooterGroups().map((g) => (
                <tr key={g.id} className="border-t border-linha-forte bg-superficie-2/60">
                  {expandir && <td />}
                  {g.headers.map((h) => (
                    <td
                      key={h.id}
                      className={cn(
                        "h-11 px-4 font-semibold whitespace-nowrap",
                        h.column.columnDef.meta?.numero && "numero text-right",
                        classeDaColuna(h.column.columnDef.meta),
                      )}
                    >
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.footer, h.getContext())}
                    </td>
                  ))}
                  {aoAbrir && <td />}
                </tr>
              ))}
            </tfoot>
          )}
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
