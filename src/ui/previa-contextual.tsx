"use client";

// A prévia contextual (Beyond Design System, `docs/beyond-design-system.md` do Beyond Data): a referência vinculada,
// sublinhada em pontos no meio de uma nota, de uma lista ou de uma apuração, abre um cartão com a consulta
// complementar. O kit cuida da abertura, do posicionamento e do foco; o produto passa o que o cartão mostra e a ação
// de detalhe (abrir a ficha na pilha, que devolve o foco à referência quando fecha).
//
// - mouse: abre depois de uma pausa curta sobre a referência; o ponteiro pode descer para o cartão e ler, e clicar
//   na ação;
// - teclado: abre com o foco pela tecla (o foco pelo clique não abre); Esc fecha e devolve o foco à referência;
// - toque: o toque na referência abre; tocar fora fecha.
// Sem a Popover API no navegador, a referência abre o detalhe direto.

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cn } from "../lib/cn";

import { Botao } from "./botao";

const PAUSA_PARA_ABRIR = 280;
const PAUSA_PARA_FECHAR = 220;

export function PreviaContextual({
  rotulo,
  titulo,
  children,
  acao = "Ver detalhes",
  aoAbrir,
  className,
}: {
  /** A referência como aparece no texto (o nome do fornecedor, o código do produto). */
  rotulo: ReactNode;
  /** O título do cartão; sem ele, o próprio `rotulo`. */
  titulo?: ReactNode;
  /** Os dados essenciais da consulta (o CNPJ e o município, o código e o NCM). */
  children?: ReactNode;
  /** O texto da ação de detalhe, dentro do cartão. */
  acao?: ReactNode;
  /** Abre o detalhe (a ficha na pilha); sem ele o cartão não tem ação. */
  aoAbrir?: () => void;
  className?: string;
}) {
  const id = useId();
  const [aberta, setAberta] = useState(false);
  const ancora = useRef<HTMLButtonElement>(null);
  const cartao = useRef<HTMLSpanElement>(null);
  const relogio = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // o foco devolvido à referência pelo próprio componente não reabre o cartão
  const devolvendo = useRef(false);
  const temPopover = () => typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";

  const cancelar = () => clearTimeout(relogio.current);
  useEffect(() => () => clearTimeout(relogio.current), []);

  // rolar ou mudar o tamanho da janela fecha: o cartão não persegue a referência
  useEffect(() => {
    if (!aberta) return;
    const fechar = () => cartao.current?.hidePopover();
    window.addEventListener("resize", fechar);
    window.addEventListener("scroll", fechar, true);
    return () => {
      window.removeEventListener("resize", fechar);
      window.removeEventListener("scroll", fechar, true);
    };
  }, [aberta]);

  function abrir() {
    cancelar();
    const c = cartao.current;
    const a = ancora.current;
    if (!c || !a || devolvendo.current || !temPopover()) return;
    if (!c.matches(":popover-open")) c.showPopover();
    // embaixo da referência; sobe quando não cabe; nunca passa da borda da janela
    const r = a.getBoundingClientRect();
    c.style.left = `${Math.max(8, Math.min(r.left, innerWidth - c.offsetWidth - 8))}px`;
    const abaixo = r.bottom + 4;
    c.style.top = `${abaixo + c.offsetHeight <= innerHeight - 8 ? abaixo : Math.max(8, r.top - c.offsetHeight - 4)}px`;
  }

  function fechar() {
    cancelar();
    if (cartao.current?.matches(":popover-open")) cartao.current.hidePopover();
  }

  function devolverFoco() {
    devolvendo.current = true;
    ancora.current?.focus();
    fechar();
    devolvendo.current = false;
  }

  return (
    <span
      className={cn("inline", className)}
      onPointerEnter={(e) => {
        cancelar();
        if (e.pointerType === "mouse") relogio.current = setTimeout(abrir, PAUSA_PARA_ABRIR);
      }}
      onPointerLeave={(e) => {
        cancelar();
        if (e.pointerType === "mouse" && !e.currentTarget.contains(document.activeElement)) relogio.current = setTimeout(fechar, PAUSA_PARA_FECHAR);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) fechar();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && aberta) {
          e.stopPropagation();
          e.preventDefault();
          devolverFoco();
        }
      }}
    >
      <button
        ref={ancora}
        type="button"
        className="referencia-contextual"
        aria-controls={id}
        aria-expanded={aberta}
        onClick={() => (temPopover() ? abrir() : aoAbrir?.())}
        onFocus={() => {
          if (ancora.current?.matches(":focus-visible")) abrir();
        }}
      >
        {rotulo}
      </button>
      {/* um span: a referência vive no meio de um parágrafo, onde o div não cabe */}
      <span
        ref={cartao}
        id={id}
        popover="auto"
        role="dialog"
        aria-label={typeof (titulo ?? rotulo) === "string" ? String(titulo ?? rotulo) : undefined}
        className="previa-contextual"
        onToggle={(e) => setAberta(e.newState === "open")}
      >
        <strong className="font-forte">{titulo ?? rotulo}</strong>
        {children && <span className="flex flex-col gap-1 text-apoio text-texto-secundario">{children}</span>}
        {aoAbrir && (
          <Botao
            tipo="secundario"
            tamanho="sm"
            onClick={() => {
              // o foco vai à referência antes de abrir: a pilha o guarda e o devolve a ela quando fecha
              devolverFoco();
              aoAbrir();
            }}
          >
            {acao}
          </Botao>
        )}
      </span>
    </span>
  );
}
