"use client";

// As partes da tela de envio de arquivos: a área de soltar (com o escolher), a
// lista do que foi escolhido e a barra de progresso. Os textos de regra (o
// teto, o que fica fora) vêm do consumidor; o kit só desenha.

import { FileArchive, FileText, FileUp, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { contagem, numero } from "../lib/formato";
import { Botao } from "../ui/botao";

import { eZip, megabytes } from "./fluxo";

/** A área de soltar arquivos, que também abre o escolher do sistema. `aceitar` é o `accept` do input; `dica`, a linha
 * dos formatos e do teto. */
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
          "flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed px-6 py-6 text-center transition-colors",
          arrastando ? "border-cobalto bg-cobalto-suave text-cobalto-tinta" : "border-linha-forte hover:border-cobalto/60 hover:bg-superficie-2",
          className,
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-cobalto-suave text-cobalto">
          <FileUp className="size-5" />
        </span>
        <span className="text-[14px] font-semibold">{arrastando ? "Solte para juntar" : titulo}</span>
        {dica && <span className="text-xs text-texto-3">{dica}</span>}
        <span className="mt-1 text-[12.5px] font-medium text-cobalto">Escolher arquivos</span>
      </button>
    </>
  );
}

/** O tamanho do arquivo em KB (abaixo de 0,1 MB) ou em MB. */
export const tamanhoDoArquivo = (bytes: number) =>
  bytes < 1024 * 1024 * 0.1 ? `${contagem(Math.ceil(bytes / 1024))} KB` : `${numero(megabytes(bytes))} MB`;

/** A lista dos arquivos escolhidos: nome, tamanho e o tirar. `extra` vai na cabeça, à direita (a contagem de lotes);
 * `aviso` é a linha embaixo do nome (o arquivo que fica fora do envio). */
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
    <div className="overflow-hidden rounded-xl border border-linha">
      <div className="flex items-center gap-2 border-b border-linha bg-superficie-2/60 px-4 py-2">
        <span className="rotulo flex-1">Arquivos</span>
        {extra}
      </div>
      <ul className={cn("m-0 max-h-[220px] list-none overflow-y-auto p-0", className)}>
        {arquivos.map((a) => {
          const Icone = eZip(a) ? FileArchive : FileText;
          const linha = aviso?.(a);
          return (
            <li key={`${a.name}-${a.size}`} className="flex items-center gap-3 border-b border-linha px-4 py-2 text-[13px] last:border-b-0">
              <Icone className="size-4 shrink-0 text-texto-3" />
              <div className="min-w-0 flex-1">
                <div className="numero truncate">{a.name}</div>
                {linha && <div className="text-xs text-risco">{linha}</div>}
              </div>
              <span className="numero text-xs text-texto-3">{tamanhoDoArquivo(a.size)}</span>
              <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Tirar" onClick={() => aoTirar(a)}>
                <X />
              </Botao>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** A barra de progresso do envio ou do processamento; `esperando` pulsa enquanto o total não chegou. */
export function BarraDeProgresso({ rotulo, valor, parte, esperando }: { rotulo: string; valor: string; parte: number; esperando?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[12.5px]">
        <span className="font-medium">{rotulo}</span>
        <span className="numero text-texto-3">{valor}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-superficie-3">
        <div
          className={cn("h-full rounded-full bg-cobalto transition-[width] duration-300", esperando && "animate-brilhar")}
          style={{ width: `${Math.min(100, Math.round(parte * 100))}%` }}
        />
      </div>
    </div>
  );
}
