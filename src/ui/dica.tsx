"use client";

import { Info } from "lucide-react";
import { Popover } from "radix-ui";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** O que a dica explica. Texto puro é o balão curto; o objeto é o balão completo, com título e exemplo. */
export type ConteudoDaDica = string | { titulo?: ReactNode; texto: ReactNode; exemplo?: ReactNode };

/** O tempo para o mouse ir do gatilho até o balão sem ele fechar. */
const ESPERA_AO_SAIR_MS = 150;

/** O balão: abre com o mouse em cima e fica aberto com o clique ou o toque, até o segundo clique, o Esc ou um clique fora. */
function Balao({
  conteudo,
  rotulo,
  className,
  children,
}: {
  conteudo: ConteudoDaDica;
  rotulo?: string;
  className: string;
  children: ReactNode;
}) {
  const [sobre, setSobre] = useState(false);
  const [fixo, setFixo] = useState(false);
  const gatilho = useRef<HTMLButtonElement>(null);
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);

  function entrar(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(espera.current);
    setSobre(true);
  }

  function sair(e: PointerEvent) {
    if (e.pointerType !== "mouse") return;
    espera.current = setTimeout(() => setSobre(false), ESPERA_AO_SAIR_MS);
  }

  const aberto = sobre || fixo;

  return (
    <Popover.Root
      open={aberto}
      onOpenChange={(abrir) => {
        if (abrir) return;
        setSobre(false);
        setFixo(false);
      }}
    >
      <Popover.Anchor asChild>
        <button
          ref={gatilho}
          type="button"
          aria-label={rotulo}
          aria-expanded={aberto}
          onPointerEnter={entrar}
          onPointerLeave={sair}
          onClick={(e) => {
            e.stopPropagation();
            if (fixo) setSobre(false);
            setFixo(!fixo);
          }}
          className={className}
        >
          {children}
        </button>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={6}
          collisionPadding={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (gatilho.current?.contains(e.target as Node)) e.preventDefault();
          }}
          onPointerEnter={entrar}
          onPointerLeave={sair}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "z-50 animate-entrar text-xs leading-relaxed shadow-3 outline-none",
            typeof conteudo === "string"
              ? "max-w-60 rounded-lg bg-texto px-2.5 py-2 text-superficie"
              : "w-72 rounded-xl border border-linha bg-superficie p-3 text-texto-2",
          )}
        >
          {typeof conteudo === "string" ? (
            conteudo
          ) : (
            <>
              {conteudo.titulo && <div className="mb-1 text-sm font-semibold text-texto">{conteudo.titulo}</div>}
              {conteudo.texto}
              {conteudo.exemplo && <div className="mt-2 rounded-lg bg-superficie-2 px-2.5 py-1.5 text-texto">{conteudo.exemplo}</div>}
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** O (i) que explica um termo. No `Rotulado` e no `Par`, use a prop `dica`. */
export function Dica({ conteudo, className }: { conteudo: ConteudoDaDica; className?: string }) {
  return (
    <Balao
      conteudo={conteudo}
      rotulo="O que é isto?"
      className={cn(
        "-m-0.5 inline-flex shrink-0 cursor-pointer self-center rounded-full p-0.5 text-texto-3 outline-none transition-colors hover:text-cobalto focus-visible:ring-2 focus-visible:ring-cobalto aria-expanded:text-cobalto",
        className,
      )}
    >
      <Info className="size-3.5" />
    </Balao>
  );
}

/** O termo sublinhado que explica a si mesmo, para o cabeçalho de tabela e o texto corrido, onde não cabe o (i). */
export function TermoComDica({ conteudo, className, children }: { conteudo: ConteudoDaDica; className?: string; children: ReactNode }) {
  return (
    <Balao
      conteudo={conteudo}
      className={cn(
        "cursor-help rounded-sm border-b border-dotted border-texto-3 text-left outline-none transition-colors hover:border-cobalto hover:text-cobalto focus-visible:ring-2 focus-visible:ring-cobalto aria-expanded:border-cobalto aria-expanded:text-cobalto",
        className,
      )}
    >
      {children}
    </Balao>
  );
}
