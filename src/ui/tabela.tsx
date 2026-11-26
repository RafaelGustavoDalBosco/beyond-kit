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
    /** Número ou código: algarismos alinhados e à direita (o `.num`). */
    numero?: boolean;
    /** A coluna que fica com a sobra da largura. Não leve `esconderAbaixo` nela: abaixo do breakpoint a sobra fica sem dono. */
    principal?: boolean;
    /** Texto de várias linhas: quebra, alinhado ao topo. */
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

// O que vale igual no th, no td e no rodapé de uma coluna: número à direita, some abaixo do breakpoint e centraliza.
function classeDaColuna(meta: ColumnMeta<any, any> | undefined) {
  return cn(meta?.numero && "num numero",meta?.esconderAbaixo && ESCONDER[meta.esconderAbaixo], meta?.centro && "text-center");
}

// Sem dados, sempre o mesmo array: um novo a cada render faz o TanStack recalcular as linhas e re-renderizar em laço.
const SEM_DADOS: never[] = [];

export type Pagina = { page: number; page_size: number; total: number };

/**
 * A tabela da casa (`.table`), densa: o título da coluna em 12px apagado, que nunca quebra linha, as linhas separadas
 * pelo fio suave, números tabulares à direita, hover na linha e sem zebra; a linha inteira é clicável quando abre a
 * ficha. `classeDaLinha` marca a linha (a inativa apagada, a atrasada); `escolhida` diz qual está aberta
 * (`.is-selecionada`: o azul claro da seleção); `grupo` abre uma faixa de título quando o valor muda de uma linha para a outra (os dados
 * chegam ordenados); o `footer` das colunas vira o rodapé (o total). `expandir` dá à linha um botão que abre embaixo
 * dela o detalhe (uma sub-tabela); `podeAbrir` diz quais linhas abrem a ficha; `atributosDaLinha` põe data-*, aria-*
 * ou id no <tr>. `idDaLinha` dá a chave de cada linha: com ela, as linhas abertas do `expandir` seguem abertas quando
 * `dados` muda (o "Carregar mais", um refetch); sem ela, a chave é a posição e elas fecham. `densa` é a tabela curta
 * dentro de uma ficha (os tributos do item): menos respiro e o `SemValor` como um ponto. Com `pagina`, a `Paginacao`
 * vai no pé; `tamanhosDaPagina` e `aoMudarTamanhoDaPagina` ligam o "Por página".
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
  // As pontas da linha encostam no respiro da caixa (18px); as colunas do expandir e da seta ficam com o delas.
  const pontas = densa ? "py-2 first:pl-3 last:pr-3" : "first:pl-[18px] last:pr-[18px]";

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
          <table className="table [&>tbody>tr:last-child>td]:border-b-0">
            <thead>
              {tabela.getHeaderGroups().map((g) => (
                <tr key={g.id}>
                  {expandir && <th className="sticky top-0 w-8 bg-ficha" />}
                  {g.headers.map((h) => (
                    <th
                      key={h.id}
                      className={cn(
                        "sticky top-0 bg-ficha whitespace-nowrap",
                        pontas,
                        densa && "py-1.5",
                        h.column.columnDef.meta?.principal && "w-full",
                        h.column.columnDef.meta?.fixa && "left-0 z-10",
                        classeDaColuna(h.column.columnDef.meta),
                      )}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                  {aoAbrir && <th className="sticky top-0 w-8 bg-ficha" />}
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
                          {/* a faixa do grupo é título em frase, não o cabeçalho em caixa alta */}
                          <th
                            colSpan={largura}
                            scope="colgroup"
                            className={cn(
                              "border-b-borda-suave bg-mesa py-1.5 text-apoio font-forte text-texto-apoio",
                              pontas,
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
                          "group",
                          clicavel && "cursor-pointer",
                          // a escolhida não muda sob o mouse: o utilitário ganha do hover do `.table`
                          daVez && "is-selecionada bg-acao-100",
                          classeDaLinha?.(r.original),
                        )}
                      >
                        {expandir && (
                          <td className="w-8 pr-0 pl-2">
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
                              pontas,
                              c.column.columnDef.meta?.principal && "max-w-0 truncate whitespace-normal",
                              c.column.columnDef.meta?.quebra && "align-top whitespace-normal",
                              c.column.columnDef.meta?.fixa &&
                                cn("sticky left-0 z-[1]", daVez ? "bg-acao-100" : "bg-ficha group-hover:bg-hover"),
                              classeDaColuna(c.column.columnDef.meta),
                            )}
                          >
                            {flexRender(c.column.columnDef.cell, c.getContext())}
                          </td>
                        ))}
                        {aoAbrir && (
                          <td className="w-8 pr-3 pl-0 text-texto-apoio">
                            {clicavel && (
                              <ChevronRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                          </td>
                        )}
                      </tr>
                      {aberta && (
                        <tr className="hover:bg-transparent">
                          <td colSpan={largura} className="bg-mesa p-0">
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
                  <tr key={g.id}>
                    {expandir && <td className="border-t border-b-0 border-borda" />}
                    {g.headers.map((h) => (
                      <td
                        key={h.id}
                        className={cn(
                          "border-t border-b-0 border-borda font-medio whitespace-nowrap",
                          pontas,
                          classeDaColuna(h.column.columnDef.meta),
                        )}
                      >
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.footer, h.getContext())}
                      </td>
                    ))}
                    {aoAbrir && <td className="border-t border-b-0 border-borda" />}
                  </tr>
                ))}
              </tfoot>
            )}
          </table>
        </SemValorCompacto.Provider>
        {carregando && <Carregando forma="tabela" linhas={5} />}
        {!carregando && dados?.length === 0 && vazio && <div className="px-[18px] py-7 text-center text-texto-apoio">{vazio}</div>}
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
