"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnMeta,
  type RowData,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";
import { Carregando, SemValorCompacto } from "./estados";
import { Paginacao } from "./mestre-detalhe";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Número ou código: algarismos alinhados e à direita. */
    numero?: boolean;
    /** A coluna que fica com a sobra da largura. Não leve `esconderAbaixo` nela: abaixo do breakpoint a sobra fica sem dono. */
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

// Sem dados, sempre o mesmo array: um novo a cada render faz o TanStack recalcular as linhas e re-renderizar em laço.
const SEM_DADOS: never[] = [];

export type Pagina = { page: number; page_size: number; total: number };

/**
 * A lista: cabeçalho fixo, linhas separadas pelo fio, linha inteira clicável quando abre a ficha. `classeDaLinha`
 * marca a linha (a inativa apagada, a atrasada em aviso); `escolhida` diz qual está aberta ao lado (azul claro, com a
 * barra azul); `grupo` abre uma faixa de título quando o valor muda de uma linha para a outra (os dados chegam
 * ordenados); o `footer` das colunas vira o rodapé (o total). `expandir` dá à linha um botão que abre embaixo dela o
 * detalhe (uma sub-tabela); `podeAbrir` diz quais linhas abrem a ficha; `atributosDaLinha` põe data-*, aria-* ou id no
 * <tr>. `idDaLinha` dá a chave de cada linha: com ela, as linhas abertas do `expandir` seguem abertas quando `dados`
 * muda (o "Carregar mais", um refetch); sem ela, a chave é a posição e elas fecham. `densa` é a tabela curta dentro de
 * uma ficha (os tributos do item): linhas de 40px, cabeçalho de 36px e o `SemValor` como um ponto. Com `pagina`, a
 * `Paginacao` vai no pé; `tamanhosDaPagina` e `aoMudarTamanhoDaPagina` ligam o "Por página".
 */
export function Tabela<T>({
  dados,
  colunas,
  aoAbrir,
  carregando,
  pagina,
  aoMudarPagina,
  tamanhosDaPagina,
  aoMudarTamanhoDaPagina,
  vazio,
  classeDaLinha,
  escolhida,
  grupo,
  expandir,
  podeAbrir,
  atributosDaLinha,
  idDaLinha,
  densa,
}: {
  dados: T[] | undefined;
  colunas: ColumnDef<T, any>[];
  aoAbrir?: (linha: T) => void;
  carregando?: boolean;
  pagina?: Pagina;
  aoMudarPagina?: (page: number) => void;
  tamanhosDaPagina?: number[];
  aoMudarTamanhoDaPagina?: (page_size: number) => void;
  vazio?: ReactNode;
  classeDaLinha?: (linha: T) => string | false | undefined;
  escolhida?: (linha: T) => boolean;
  grupo?: (linha: T) => ReactNode;
  expandir?: (linha: T) => ReactNode | null;
  podeAbrir?: (linha: T) => boolean;
  atributosDaLinha?: (linha: T) => Record<string, string | number | boolean | undefined>;
  idDaLinha?: (linha: T) => string;
  densa?: boolean;
}) {
  const tabela = useReactTable({
    data: dados ?? SEM_DADOS,
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
    getRowId: idDaLinha ? (linha) => idDaLinha(linha) : undefined,
  });
  const [abertas, setAbertas] = useState<Set<string>>(() => new Set());
  // Dados novos (outra página, outro filtro): sem `idDaLinha` as linhas abertas fecham, porque a chave é a posição.
  const [dadosDasAbertas, setDadosDasAbertas] = useState(dados);
  if (!idDaLinha && dados !== dadosDasAbertas) {
    setDadosDasAbertas(dados);
    setAbertas(new Set());
  }
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
        <SemValorCompacto.Provider value={!!densa}>
          <table className="w-full border-collapse text-sm">
            <thead>
              {tabela.getHeaderGroups().map((g) => (
                <tr key={g.id}>
                  {expandir && <th className="sticky top-0 w-8 border-b border-fio bg-cabeca-tabela" />}
                  {g.headers.map((h) => (
                    <th
                      key={h.id}
                      className={cn(
                        "sticky top-0 border-b border-fio bg-cabeca-tabela text-left text-[12.5px] font-bold whitespace-nowrap text-texto-cabeca",
                        densa ? "h-9 px-3" : "h-10 px-[18px]",
                        h.column.columnDef.meta?.numero && "text-right",
                        h.column.columnDef.meta?.principal && "w-full",
                        h.column.columnDef.meta?.fixa && "left-0 z-10",
                        classeDaColuna(h.column.columnDef.meta),
                      )}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                  {aoAbrir && <th className="sticky top-0 w-8 border-b border-fio bg-cabeca-tabela" />}
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
                  const daVez = !!escolhida?.(r.original);
                  return (
                    <Fragment key={r.id}>
                      {novoGrupo && (
                        <tr>
                          <th
                            colSpan={largura}
                            className={cn(
                              "border-b border-fio bg-cabeca-tabela py-2 text-left text-[13px] font-extrabold text-texto-cabeca",
                              densa ? "px-3" : "px-[18px]",
                            )}
                          >
                            {titulo}
                          </th>
                        </tr>
                      )}
                      <tr
                        // antes do spread: o `aria-current` que o app manda por `atributosDaLinha` ganha
                        aria-current={daVez || undefined}
                        {...atributosDaLinha?.(r.original)}
                        onClick={clicavel ? () => aoAbrir?.(r.original) : undefined}
                        className={cn(
                          "group border-b border-fio transition-colors last:border-0",
                          clicavel && "cursor-pointer",
                          // a escolhida não muda sob o mouse
                          daVez ? "bg-cobalto-suave" : clicavel && "hover:bg-superficie-2",
                          classeDaLinha?.(r.original),
                        )}
                      >
                        {expandir && (
                          <td className={cn("w-8 pl-2", daVez && "barra-escolhida")}>
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
                              "whitespace-nowrap",
                              densa ? "h-10 px-3" : "h-12 px-[18px]",
                              c.column.columnDef.meta?.numero && "numero text-right",
                              c.column.columnDef.meta?.principal && "max-w-0 truncate whitespace-normal",
                              c.column.columnDef.meta?.quebra && "h-auto py-3 align-top whitespace-normal",
                              c.column.columnDef.meta?.fixa &&
                                cn(
                                  "sticky left-0 z-[1] transition-colors",
                                  daVez ? "bg-cobalto-suave" : cn("bg-superficie", clicavel && "group-hover:bg-superficie-2"),
                                ),
                              // a barra azul vai na primeira célula da linha escolhida
                              daVez && !expandir && "first:barra-escolhida",
                              classeDaColuna(c.column.columnDef.meta),
                            )}
                          >
                            {flexRender(c.column.columnDef.cell, c.getContext())}
                          </td>
                        ))}
                        {aoAbrir && (
                          <td className="pr-3 text-texto-3">
                            {clicavel && (
                              <ChevronRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                          </td>
                        )}
                      </tr>
                      {aberta && (
                        <tr className="border-b border-fio last:border-0">
                          <td colSpan={largura} className="bg-cabeca-tabela p-0">
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
                  <tr key={g.id} className="border-t-2 border-fio">
                    {expandir && <td />}
                    {g.headers.map((h) => (
                      <td
                        key={h.id}
                        className={cn(
                          "font-extrabold whitespace-nowrap",
                          densa ? "h-10 px-3" : "h-12 px-[18px]",
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
        </SemValorCompacto.Provider>
        {carregando && <Carregando forma="tabela" linhas={5} />}
        {!carregando && dados?.length === 0 && vazio && <div className="px-[18px] py-7 text-center font-semibold text-texto-2">{vazio}</div>}
      </div>
      {pagina && aoMudarPagina && (
        <Paginacao
          page={pagina.page}
          page_size={pagina.page_size}
          total={pagina.total}
          aoMudar={aoMudarPagina}
          tamanhos={tamanhosDaPagina}
          aoMudarTamanho={aoMudarTamanhoDaPagina}
        />
      )}
    </div>
  );
}
