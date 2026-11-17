"use client";

// As partes da tela de envio de arquivos: a área de soltar (com o escolher), a
// lista do que foi escolhido e as linhas recusadas. Os textos de regra (o
// teto, o que fica fora) vêm do consumidor; o kit só desenha. A barra de
// progresso do envio é a `BarraDeProgresso`, que mora em `ui/carregamento`.

import type { ColumnDef } from "@tanstack/react-table";
import { FileArchive, FileText, FileUp, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem, numero } from "../lib/formato";
import { Botao } from "../ui/botao";
import { Tabela } from "../ui/tabela";

import { eZip, megabytes } from "./fluxo";

/** A área de soltar arquivos, que também abre o escolher do sistema: a caixa tracejada com o ícone, o título, a dica e
 * o "Escolher arquivos" com a cara do botão secundário. Arrastando por cima, a borda e o fundo ficam no azul da
 * seleção. `aceitar` é o `accept` do input; `dica`, a linha dos formatos e do teto. */
export function SoltarArquivos({
  aceitar,
  titulo,
  dica,
  aoJuntar,
  "aria-label": rotulo,
  className,
}: {
  aceitar: string;
  titulo: string;
  /** O nome acessível da área (padrão: o título). */
  "aria-label"?: string;
  dica?: ReactNode;
  aoJuntar: (arquivos: File[]) => void;
  className?: string;
}) {
  const campo = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  return (
    <>
      <input
        ref={campo}
        type="file"
        multiple
        accept={aceitar}
        className="hidden"
        onChange={(e) => {
          aoJuntar(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <button
        type="button"
        aria-label={rotulo}
        onClick={() => campo.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          aoJuntar(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          "flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-g border border-dashed px-5 py-6 text-center text-texto",
          arrastando ? "border-acao bg-acao-100" : "border-borda-forte bg-ficha hover:border-acao",
          className,
        )}
      >
        <FileUp aria-hidden className={cn("mb-1 size-6", arrastando ? "text-acao-texto" : "text-texto-apoio")} strokeWidth={1.6} />
        <span className="text-enfase font-forte">{arrastando ? "Solte para juntar" : titulo}</span>
        {dica && <span className="text-apoio text-texto-apoio">{dica}</span>}
        {/* um span com a cara do botão secundário: botão dentro de botão não pode */}
        <span className="btn btn-secondary mt-2">Escolher arquivos</span>
      </button>
    </>
  );
}

/** O tamanho do arquivo em KB (abaixo de 0,1 MB) ou em MB. */
export const tamanhoDoArquivo = (bytes: number) =>
  bytes < 1024 * 1024 * 0.1 ? `${contagem(Math.ceil(bytes / 1024))} KB` : `${numero(megabytes(bytes))} MB`;

/** A lista dos arquivos escolhidos, em linhas de lista: o ícone do tipo, o nome, o tamanho e o tirar. `extra` vai na
 * cabeça, à direita (a contagem de lotes); `aviso` é a linha embaixo do nome (o arquivo que fica fora do envio), no
 * vermelho da validação, com o ✕. */
export function ListaDeArquivos({
  arquivos,
  aoTirar,
  extra,
  aviso,
  className,
}: {
  arquivos: File[];
  aoTirar: (arquivo: File) => void;
  extra?: ReactNode;
  aviso?: (arquivo: File) => ReactNode;
  className?: string;
}) {
  if (!arquivos.length) return null;
  return (
    <div className="overflow-hidden rounded-g border border-borda bg-ficha">
      <div className="flex items-center gap-2 border-b border-borda px-4 py-2.5">
        <span className="card-title flex-1">Arquivos</span>
        {extra && <span className="text-apoio text-texto-apoio">{extra}</span>}
      </div>
      <ul className={cn("m-0 max-h-[240px] list-none overflow-y-auto p-0", className)}>
        {arquivos.map((a) => {
          const Icone = eZip(a) ? FileArchive : FileText;
          const linha = aviso?.(a);
          return (
            <li key={`${a.name}-${a.size}`} className="flex items-center gap-3 border-b border-borda-suave px-4 py-2 last:border-b-0 hover:bg-hover">
              <Icone aria-hidden className="size-4 shrink-0 text-texto-apoio" strokeWidth={1.6} />
              <div className="min-w-0 flex-1">
                <div className="truncate">{a.name}</div>
                {linha && <div className="text-apoio text-erro">✕ {linha}</div>}
              </div>
              <span className="numero text-apoio text-texto-apoio">{tamanhoDoArquivo(a.size)}</span>
              <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Tirar" title="Tirar" onClick={() => aoTirar(a)}>
                <X />
              </Botao>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Uma linha de uma importação que foi recusada ou veio com ressalva; sem `linha` (ou 0), o "sem dado". */
export type LinhaComProblema = { linha?: number | null; motivo: ReactNode };

const COLUNAS_DO_PROBLEMA: ColumnDef<LinhaComProblema>[] = [
  {
    id: "linha",
    header: "Linha",
    meta: { numero: true },
    cell: ({ row }) => row.original.linha || <span className="sem-dado">sem linha</span>,
  },
  { id: "motivo", header: "Motivo", meta: { principal: true, quebra: true }, cell: ({ row }) => row.original.motivo },
];

/** As linhas recusadas (ou as ressalvas) da simulação de uma importação: o título e a tabela curta, que rola; nada
 * quando não há. */
export function LinhasComProblema({ titulo, linhas }: { titulo: ReactNode; linhas: LinhaComProblema[] }) {
  if (linhas.length === 0) return null;
  return (
    <div>
      <h3 className="card-title m-0 mb-2">{titulo}</h3>
      <div className="max-h-48 overflow-auto rounded-g border border-borda bg-ficha">
        <Tabela dados={linhas} colunas={COLUNAS_DO_PROBLEMA} />
      </div>
    </div>
  );
}
