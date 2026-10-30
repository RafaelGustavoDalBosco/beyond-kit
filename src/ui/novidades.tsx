import { Bug, Rocket, Sparkles, Wrench, type LucideIcon } from "lucide-react";
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

const SECOES: { tipo: VersaoDasNovidades["itens"][number]["tipo"]; titulo: string; icone: LucideIcon; cor: string }[] = [
  { tipo: "novo", titulo: "Novidades", icone: Sparkles, cor: "text-cobalto" },
  { tipo: "melhoria", titulo: "Melhorias", icone: Wrench, cor: "text-ganho" },
  { tipo: "correcao", titulo: "Correções", icone: Bug, cor: "text-aviso" },
];

/** A tela de Novidades inteira: o cabeçalho e a linha do tempo das versões (a mais nova no alto, marcada em cobalto),
 * cada uma com as seções Novidades, Melhorias e Correções; seção sem item não aparece. */
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
      <div className="mb-8 flex items-center gap-3">
        <div className="icone-cheio flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Sparkles className="size-[18px]" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <h1 className="m-0 text-xl leading-tight font-bold tracking-[0.07em] uppercase">{titulo}</h1>
          {frase && <p className="m-0 mt-0.5 text-sm text-texto-2">{frase}</p>}
        </div>
      </div>

      {versoes.length === 0 ? (
        <Vazio titulo={vazio} icone={Sparkles} />
      ) : (
        <div className="relative">
          <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-linha" />
          <ol className="m-0 flex list-none flex-col gap-6 p-0">
            {versoes.map((v, n) => (
              <li key={v.versao} className="relative flex gap-4">
                <div
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                    n === 0 ? "bg-cobalto text-sobre-cobalto shadow-2" : "border-2 border-linha bg-superficie text-texto-3",
                  )}
                >
                  <Rocket className="size-[18px]" />
                </div>
                <div className="min-w-0 flex-1 rounded-bloco border border-linha bg-superficie p-5 shadow-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="numero m-0 text-base font-bold">{v.versao}</h3>
                    <span className="text-xs text-texto-3">{v.data}</span>
                  </div>
                  {SECOES.map((s) => {
                    const itens = v.itens.filter((i) => i.tipo === s.tipo);
                    if (itens.length === 0) return null;
                    const Icone = s.icone;
                    return (
                      <div key={s.tipo} className="mt-4">
                        <h4 className="m-0 flex items-center gap-1.5 text-sm font-semibold">
                          <Icone className={cn("size-4 shrink-0", s.cor)} />
                          {s.titulo}
                        </h4>
                        <ul className="m-0 mt-2 flex list-disc flex-col gap-2 pl-5">
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
