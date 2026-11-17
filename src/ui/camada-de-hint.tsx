"use client";

// Hint: a janelinha de leitura que abre ao parar o mouse 400ms sobre o elemento, ou ao focá-lo pelo teclado.
// Qualquer elemento com `data-hint` (e, se quiser, `data-hint-titulo` e `data-hint-atalho`) ganha a dica; a camada
// (`<CamadaDeHint />`) fica montada uma vez na raiz, ao lado do `<Avisos />`. Fecha ao sair, ao rolar ou com Esc; abre embaixo e sobe se não couber; nunca recebe
// clique (só leitura). No celular não há mouse: a dica abre ao tocar no elemento (o que não é link nem botão, que
// tocados fazem a ação deles) e fecha no toque seguinte ou ao rolar.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";


const eCelular = () => window.matchMedia?.("(max-width: 639px)").matches ?? false;

type Aberta = { el: HTMLElement; titulo: string | null; texto: string; atalho: string | null };

const doAlvo = (alvo: EventTarget | null) => (alvo instanceof Element ? alvo.closest<HTMLElement>("[data-hint]") : null);

export function CamadaDeHint() {
  const [aberta, setAberta] = useState<Aberta | null>(null);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let espera: ReturnType<typeof setTimeout> | undefined;
    let atual: HTMLElement | null = null;
    const ler = (el: HTMLElement): Aberta => ({
      el,
      titulo: el.getAttribute("data-hint-titulo"),
      texto: el.getAttribute("data-hint") ?? "",
      atalho: el.getAttribute("data-hint-atalho"),
    });
    const fechar = () => {
      clearTimeout(espera);
      atual = null;
      setAberta(null);
    };
    const sobre = (e: MouseEvent) => {
      const el = doAlvo(e.target);
      if (!el || el === atual || !el.getAttribute("data-hint")) return;
      clearTimeout(espera);
      atual = el;
      espera = setTimeout(() => setAberta(ler(el)), 400);
    };
    const fora = (e: MouseEvent) => {
      const el = doAlvo(e.target);
      if (el && !el.contains(e.relatedTarget as Node | null)) fechar();
    };
    const foco = (e: FocusEvent) => {
      const el = doAlvo(e.target);
      // o foco por clique do mouse não abre; só o do teclado
      if (el && el.getAttribute("data-hint") && (e.target as HTMLElement).matches(":focus-visible")) {
        atual = el;
        setAberta(ler(el));
      }
    };
    const toque = (e: MouseEvent) => {
      if (!eCelular()) return;
      const el = doAlvo(e.target);
      if (!el || !el.getAttribute("data-hint") || el.closest("a, button")) return;
      clearTimeout(espera);
      atual = el;
      setAberta(ler(el));
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    document.addEventListener("mouseover", sobre);
    document.addEventListener("mouseout", fora);
    document.addEventListener("focusin", foco);
    document.addEventListener("focusout", fechar);
    document.addEventListener("keydown", tecla);
    document.addEventListener("mousedown", fechar);
    document.addEventListener("click", toque);
    addEventListener("scroll", fechar, true);
    return () => {
      clearTimeout(espera);
      document.removeEventListener("mouseover", sobre);
      document.removeEventListener("mouseout", fora);
      document.removeEventListener("focusin", foco);
      document.removeEventListener("focusout", fechar);
      document.removeEventListener("keydown", tecla);
      document.removeEventListener("mousedown", fechar);
      document.removeEventListener("click", toque);
      removeEventListener("scroll", fechar, true);
    };
  }, []);

  useLayoutEffect(() => {
    const h = caixa.current;
    if (!aberta || !h) return;
    const r = aberta.el.getBoundingClientRect();
    const t = h.getBoundingClientRect();
    let top = r.bottom + 8;
    if (top + t.height > innerHeight - 8) top = r.top - t.height - 8;
    const left = Math.max(8, Math.min(r.left + r.width / 2 - t.width / 2, innerWidth - t.width - 8));
    h.style.left = `${left}px`;
    h.style.top = `${Math.max(8, top)}px`;
  }, [aberta]);

  if (!aberta) return null;
  return createPortal(
    <div ref={caixa} className="hint" role="tooltip" style={{ left: 0, top: 0 }}>
      {aberta.titulo && <b>{aberta.titulo}</b>}
      <span>{aberta.texto}</span>
      {aberta.atalho && <kbd className="tecla">{aberta.atalho}</kbd>}
    </div>,
    document.body,
  );
}

/** O hint aberto, parado (só para a vitrine de componentes). */
export function HintEstatico({ titulo, texto, atalho }: { titulo?: string; texto: string; atalho?: string }) {
  return (
    <div className="hint is-estatico">
      {titulo && <b>{titulo}</b>}
      <span>{texto}</span>
      {atalho && <kbd className="tecla">{atalho}</kbd>}
    </div>
  );
}
