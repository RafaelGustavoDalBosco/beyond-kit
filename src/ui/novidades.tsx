"use client";

import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { Vazio } from "./estados";

/** Uma versão publicada nas Novidades, como o hub entrega: o app formata `publicado_em` em `data`; chave e título do
 * ticket ficam de fora (o cliente vê só o `texto`). */
export type VersaoDasNovidades = {
  versao: string;
  data: ReactNode;
  itens: { tipo: "novo" | "melhoria" | "correcao"; texto: ReactNode }[];
};

const SECOES: { tipo: VersaoDasNovidades["itens"][number]["tipo"]; titulo: string }[] = [
  { tipo: "novo", titulo: "Novidades" },
  { tipo: "melhoria", titulo: "Melhorias" },
  { tipo: "correcao", titulo: "Correções" },
];

/** A tela de Novidades inteira: o alto da tela e a linha do tempo das versões, discreta (o fio à esquerda com um ponto
 * por versão; a mais nova no alto, com o ponto em azul), cada uma com as seções Novidades, Melhorias e Correções;
 * seção sem item não aparece. */
export function Novidades({
  versoes,
  titulo = "Novidades",
  frase = "Atualizações e melhorias do sistema",
  vazio = "Nenhuma novidade publicada ainda.",
}: {
  versoes: VersaoDasNovidades[];
  titulo?: ReactNode;
  frase?: ReactNode;
  vazio?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-titulo leading-titulo font-forte tracking-titulo celular:text-subtitulo">{titulo}</h1>
        {frase && <p className="m-0 mt-0.5 text-texto-secundario">{frase}</p>}
      </div>

      {versoes.length === 0 ? (
        <Vazio titulo={vazio} />
      ) : (
        // o fio da linha do tempo é a borda da lista; o ponto de cada versão (10px) fica centrado nele
        <ol className="m-0 ml-1.5 flex list-none flex-col gap-7 border-l border-borda p-0 pl-6">
          {versoes.map((v, n) => (
            <li key={v.versao} className="relative">
              <span
                aria-hidden
                className={cn(
                  "absolute top-[5px] -left-[29.5px] size-2.5 rounded-full border-2",
                  n === 0 ? "border-acao bg-acao" : "border-borda-forte bg-fundo",
                )}
              />
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <h2 className="numero m-0 text-enfase leading-titulo font-forte tracking-normal">{v.versao}</h2>
                <span className="text-apoio text-texto-apoio">{v.data}</span>
              </div>
              {SECOES.map((s) => {
                const itens = v.itens.filter((i) => i.tipo === s.tipo);
                if (itens.length === 0) return null;
                return (
                  <div key={s.tipo} className="mt-3">
                    <h3 className="m-0 text-apoio font-medio tracking-normal text-texto-apoio">{s.titulo}</h3>
                    <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-4 marker:text-texto-apoio">
                      {itens.map((i, k) => (
                        <li key={k} className="whitespace-pre-line">
                          {i.texto}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
