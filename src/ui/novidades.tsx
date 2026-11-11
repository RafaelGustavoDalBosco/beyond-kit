"use client";

import { Bug, Rocket, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Emblema, type TomDoEmblema } from "./emblema";
import { Vazio } from "./estados";

/** Uma versão publicada nas Novidades, como o hub entrega: o app formata `publicado_em` em `data`; chave e título do
 * ticket ficam de fora (o cliente vê só o `texto`). */
export type VersaoDasNovidades = {
  versao: string;
  data: ReactNode;
  itens: { tipo: "novo" | "melhoria" | "correcao"; texto: ReactNode }[];
};

const SECOES: { tipo: VersaoDasNovidades["itens"][number]["tipo"]; titulo: string; icone: LucideIcon; tom: TomDoEmblema }[] = [
  { tipo: "novo", titulo: "Novidades", icone: Sparkles, tom: "cobalto" },
  { tipo: "melhoria", titulo: "Melhorias", icone: Wrench, tom: "ganho" },
  { tipo: "correcao", titulo: "Correções", icone: Bug, tom: "aviso" },
];

/** A tela de Novidades inteira: o cabeçalho e a linha do tempo das versões (a mais nova no alto, marcada em azul
 * cheio), cada uma numa caixa com as seções Novidades, Melhorias e Correções; seção sem item não aparece. */
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
      <div className="mb-[18px] flex items-center gap-3">
        <Emblema icone={Sparkles} />
        <div className="min-w-0">
          <h1 className="m-0 text-2xl leading-tight font-extrabold tracking-[-0.01em]">{titulo}</h1>
          {frase && <p className="m-0 mt-0.5 text-texto-2">{frase}</p>}
        </div>
      </div>

      {versoes.length === 0 ? (
        <Vazio titulo={vazio} icone={Sparkles} />
      ) : (
        <div className="relative">
          {/* o fio da linha do tempo, pelo meio dos círculos de 42px */}
          <div aria-hidden className="absolute top-2 bottom-2 left-5 w-0.5 bg-linha" />
          <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
            {versoes.map((v, n) => (
              <li key={v.versao} className="relative flex items-start gap-3.5">
                <Emblema icone={Rocket} tom={n === 0 ? "cobalto" : "neutro"} cheio={n === 0} className="relative z-10" />
                <div className="min-w-0 flex-1 rounded-bloco bg-superficie px-[18px] py-4 shadow-bloco">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <h2 className="numero m-0 text-base font-extrabold">{v.versao}</h2>
                    <span className="text-[13px] font-semibold text-texto-2">{v.data}</span>
                  </div>
                  {SECOES.map((s) => {
                    const itens = v.itens.filter((i) => i.tipo === s.tipo);
                    if (itens.length === 0) return null;
                    return (
                      <div key={s.tipo} className="mt-4">
                        <h3 className="m-0 flex items-center gap-2 text-sm font-extrabold">
                          <Emblema icone={s.icone} tom={s.tom} tamanho="xs" />
                          {s.titulo}
                        </h3>
                        <ul className="m-0 mt-2 flex list-disc flex-col gap-1.5 pl-9 marker:text-texto-3">
                          {itens.map((i, k) => (
                            <li key={k} className="text-sm leading-relaxed whitespace-pre-line text-texto-2">
                              {i.texto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
