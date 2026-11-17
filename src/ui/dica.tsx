"use client";

import { CircleHelp } from "lucide-react";
import { Popover } from "radix-ui";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** O que a dica explica. Texto puro é o balão curto; o objeto é o balão completo, com título e exemplo. Os dois são
 * o `.hint` do Lastro: a janelinha escura, de leitura, que surge em 120ms. */
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
          side="bottom"
          align="center"
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
          // o `.hint` parado (`is-estatico`): quem posiciona é o Radix, e o balão recebe o mouse para ficar aberto
          className={cn(
            "hint is-estatico outline-none animate-[kit-entrar_120ms_ease-out] motion-reduce:animate-none",
            typeof conteudo !== "string" && "w-[280px]",
          )}
        >
          {typeof conteudo === "string" ? (
            <span>{conteudo}</span>
          ) : (
            <>
              {conteudo.titulo && <b>{conteudo.titulo}</b>}
              <span>{conteudo.texto}</span>
              {conteudo.exemplo && <div className="mt-1 rounded-p bg-hint-titulo/10 px-2 py-1.5">{conteudo.exemplo}</div>}
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** O (?) que explica um termo, com o balão escuro embaixo (sobe se não couber). No `Rotulado` e no `Par`, use a prop `dica`. */
export function Dica({ conteudo, className }: { conteudo: ConteudoDaDica; className?: string }) {
  // A margem negativa deixa 12px no fluxo: o círculo de 20px não aumenta a linha do rótulo ao lado.
  return (
    <Balao
      conteudo={conteudo}
      rotulo="O que é isto?"
      className={cn(
        "-my-1 inline-grid size-5 shrink-0 cursor-help place-items-center self-center rounded-full text-texto-apoio hover:bg-hover hover:text-texto aria-expanded:bg-hover aria-expanded:text-texto",
        className,
      )}
    >
      <CircleHelp className="size-3.5" />
    </Balao>
  );
}

/** O termo sublinhado que explica a si mesmo, para o cabeçalho de tabela e o texto corrido, onde não cabe o (?). */
export function TermoComDica({ conteudo, className, children }: { conteudo: ConteudoDaDica; className?: string; children: ReactNode }) {
  return (
    <Balao
      conteudo={conteudo}
      className={cn(
        "cursor-help border-b border-dotted border-texto-apoio text-left hover:border-texto aria-expanded:border-texto",
        className,
      )}
    >
      {children}
    </Balao>
  );
}
