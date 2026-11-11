"use client";

// Os filtros de uma lista: as abas e a busca para o recorte principal e, para o resto, o botão "Filtros", que abre o
// painel. O que está aplicado vira etiqueta com ×; a ordenação é um menu. O kit só desenha: o que está marcado, o
// rascunho do painel e o que vale depois do Aplicar são do app.
//
//   <BarraDeFiltros abas={<TrilhoDeAbas>...</TrilhoDeAbas>}
//     etiquetas={aplicados.map((f) => <EtiquetaDeFiltro key={f.id} rotulo={f.nome} aoTirar={() => tirar(f.id)}>{f.valor}</EtiquetaDeFiltro>)}>
//     <Busca ... />
//     <Filtros ativos={aplicados.length} aoMudarAberto={(abriu) => abriu && refazerRascunho()} aoLimpar={limpar} aoAplicar={aplicar}>
//       <GrupoDeFiltros titulo="Tributo"><Caixa ...>ICMS</Caixa></GrupoDeFiltros>
//     </Filtros>
//     <Ordenacao opcoes={opcoes} valor={ordem} aoMudar={setOrdem} />
//   </BarraDeFiltros>

import { Check, ChevronDown, ListFilter, X } from "lucide-react";
import { DropdownMenu, Popover } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

/** A barra dos filtros, no alto da caixa da lista: as `abas` à esquerda, a busca, o `Filtros` e a `Ordenacao` (os
 * filhos) à direita e, embaixo, as `etiquetas` dos filtros aplicados. No celular, os filhos descem para baixo das abas. */
export function BarraDeFiltros({
  abas,
  etiquetas,
  children,
  className,
}: {
  abas?: ReactNode;
  etiquetas?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5 px-[18px] py-3.5 celular:px-3.5 celular:py-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {abas && <div className="min-w-0 celular:w-full">{abas}</div>}
        {children && <div className="ml-auto flex flex-wrap items-center gap-2 celular:ml-0">{children}</div>}
      </div>
      {/* sem etiqueta nenhuma (a lista vazia do app), a linha some */}
      {etiquetas && <div className="flex flex-wrap gap-2 empty:hidden">{etiquetas}</div>}
    </div>
  );
}

/**
 * O botão "Filtros", com a contagem dos ativos, e o painel que ele abre: os grupos (os filhos, cada um num
 * `GrupoDeFiltros`), o Limpar no alto e, no pé, o Cancelar e o Aplicar, que fecham o painel. Clicar fora ou o Esc
 * também fecham, sem aplicar: o app refaz o rascunho no `aoMudarAberto`.
 */
export function Filtros({
  ativos = 0,
  children,
  aoAplicar,
  aoLimpar,
  aberto,
  aoMudarAberto,
  rotulo = "Filtros",
  rotuloLimpar = "Limpar",
  rotuloCancelar = "Cancelar",
  rotuloAplicar = "Aplicar",
  className,
}: {
  /** Quantos filtros estão aplicados; 0 esconde a contagem. */
  ativos?: number;
  children: ReactNode;
  aoAplicar: () => void;
  /** O "Limpar" do alto do painel; sem ele, não aparece. */
  aoLimpar?: () => void;
  /** Para o app comandar o painel; sem eles, o painel se abre e se fecha sozinho. */
  aberto?: boolean;
  aoMudarAberto?: (aberto: boolean) => void;
  rotulo?: ReactNode;
  rotuloLimpar?: ReactNode;
  rotuloCancelar?: ReactNode;
  rotuloAplicar?: ReactNode;
  className?: string;
}) {
  return (
    <Popover.Root open={aberto} onOpenChange={aoMudarAberto}>
      <Popover.Trigger asChild>
        <Botao tipo="neutro" tamanho="sm" className={className}>
          <ListFilter />
          {rotulo}
          {ativos > 0 && (
            <span className="numero rounded-pilula bg-cobalto px-[7px] text-xs leading-[18px] font-bold text-sobre-cobalto">{ativos}</span>
          )}
        </Botao>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 flex max-h-(--radix-popover-content-available-height) w-[300px] max-w-[calc(100vw-24px)] animate-entrar flex-col rounded-bloco border border-fio bg-superficie text-sm text-texto shadow-2 outline-none"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-3.5 pb-2.5">
            <span className="font-extrabold">{rotulo}</span>
            {aoLimpar && (
              <Botao tipo="fantasma" tamanho="sm" className="-my-1 -mr-2" onClick={aoLimpar}>
                {rotuloLimpar}
              </Botao>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          <div className="flex shrink-0 justify-between gap-2 px-4 py-3">
            <Popover.Close asChild>
              <Botao tipo="neutro" tamanho="sm">
                {rotuloCancelar}
              </Botao>
            </Popover.Close>
            <Popover.Close asChild>
              <Botao tipo="primario" tamanho="sm" onClick={aoAplicar}>
                {rotuloAplicar}
              </Botao>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Um grupo do painel de filtros: o título e os controles dele (caixas, escolha segmentada, interruptor), separado
 * do próximo pelo fio. */
export function GrupoDeFiltros({ titulo, children, className }: { titulo?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[9px] border-b border-fio px-4 pt-1 pb-3 last:border-b-0", className)}>
      {titulo != null && <div className="mt-1.5 mb-0.5 text-[12.5px] font-extrabold text-texto-2">{titulo}</div>}
      {children}
    </div>
  );
}

/** O filtro aplicado: a etiqueta azul clara com o nome do filtro (o `rotulo`, com os dois-pontos: "Tributo:"), o
 * valor e o × que o tira. */
export function EtiquetaDeFiltro({
  rotulo,
  children,
  aoTirar,
  rotuloDeTirar = "Tirar o filtro",
  className,
}: {
  rotulo?: ReactNode;
  children: ReactNode;
  aoTirar: () => void;
  rotuloDeTirar?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-pilula bg-cobalto-suave py-[5px] pr-2 pl-3 text-[13px] font-bold text-cobalto-tinta",
        className,
      )}
    >
      {rotulo != null && <span className="shrink-0 font-semibold text-texto-2">{rotulo}</span>}
      <span className="min-w-0 truncate">{children}</span>
      <button
        type="button"
        onClick={aoTirar}
        aria-label={rotuloDeTirar}
        className="grid size-5 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-cobalto-anel"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

/** Uma opção da `Ordenacao`. */
export type OpcaoDeOrdenacao<V extends string = string> = { valor: V; rotulo: ReactNode };

/** A ordenação da lista, em menu: o botão mostra a opção da vez (sem nenhuma, o `rotulo`) e o menu marca a escolhida. */
export function Ordenacao<V extends string = string>({
  opcoes,
  valor,
  aoMudar,
  rotulo = "Ordenar",
  className,
}: {
  opcoes: ReadonlyArray<OpcaoDeOrdenacao<V>>;
  valor?: V;
  aoMudar: (valor: V) => void;
  rotulo?: ReactNode;
  className?: string;
}) {
  const daVez = opcoes.find((o) => o.valor === valor);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Botao tipo="neutro" tamanho="sm" className={className}>
          {daVez?.rotulo ?? rotulo}
          <ChevronDown />
        </Botao>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 min-w-[200px] animate-entrar rounded-bloco border border-fio bg-superficie py-1.5 text-sm text-texto shadow-2 outline-none"
        >
          <DropdownMenu.RadioGroup value={valor} onValueChange={(v) => aoMudar(v as V)}>
            {opcoes.map((o) => (
              <DropdownMenu.RadioItem
                key={o.valor}
                value={o.valor}
                // sem a marca, o texto recua o lugar dela (16 do ícone + 10 do vão)
                className="flex cursor-pointer items-center gap-2.5 py-[9px] pr-4 pl-[42px] font-bold outline-none select-none data-[highlighted]:bg-superficie-2 data-[state=checked]:pl-4 data-[state=checked]:text-cobalto"
              >
                <DropdownMenu.ItemIndicator className="grid place-items-center">
                  <Check className="size-4" />
                </DropdownMenu.ItemIndicator>
                {o.rotulo}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
