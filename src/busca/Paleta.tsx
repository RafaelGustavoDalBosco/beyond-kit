"use client";

// A paleta de busca (Ctrl K), a `.busca-caixa` de vidro: um texto e grupos de resultados; quem busca é o
// consumidor, que passa os grupos, o carregando e o erro. A paleta cuida do Dialog, das setas, do Enter, do Esc, dos
// estados e do rodapé com as teclas.

import { Search } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { Erro } from "../ui/estados";

/** Uma linha da lista de resultados: o que mostra e o que faz ao ser escolhida. */
export type ItemDaPaleta = { chave: string; principal: ReactNode; secundario?: ReactNode; aoAbrir: () => void };
/** Um grupo de resultados: o rótulo em caixa alta pequena e os itens dele. */
export type GrupoDaPaleta = {
  titulo: string;
  itens: ItemDaPaleta[];
};

/** O texto depois da pausa na digitação (para buscar só quando o usuário para). */
export function usePausa(texto: string, ms = 250) {
  const [pausado, setPausado] = useState(texto);
  useEffect(() => {
    const t = setTimeout(() => setPausado(texto), ms);
    return () => clearTimeout(t);
  }, [texto, ms]);
  return pausado;
}

/** A paleta Ctrl K, em vidro sobre o véu: o campo no alto (com o girador enquanto busca), os grupos de resultados
 * (a linha ativa em azul claro, com o "Enter ↵") e o pé com as teclas. Fecha pelo Esc, por fora ou ao escolher.
 * `titulo` é o nome do diálogo para o leitor de tela. */
export function Paleta({
  grupos,
  texto,
  aoMudarTexto,
  carregando,
  erro,
  aberta,
  aoMudar,
  placeholder = "Buscar",
  titulo = "Buscar",
  minimo = 2,
}: {
  grupos: GrupoDaPaleta[];
  texto: string;
  aoMudarTexto: (texto: string) => void;
  carregando?: boolean;
  erro?: { frase: string; referencia?: string | null; tentar?: () => void } | null;
  aberta: boolean;
  aoMudar: (aberta: boolean) => void;
  placeholder?: string;
  titulo?: ReactNode;
  /** Quantos caracteres antes de buscar; abaixo disso a paleta diz "Digite para buscar". */
  minimo?: number;
}) {
  const vale = texto.trim().length >= minimo;
  const campo = useRef<HTMLInputElement>(null);
  const rolagem = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const idDaLista = useId();

  const visiveis = useMemo(() => grupos.filter((g) => g.itens.length > 0), [grupos]);
  const lista = useMemo(() => visiveis.flatMap((g) => g.itens), [visiveis]);

  // O destaque volta ao primeiro a cada resultado novo e acompanha as setas.
  useEffect(() => setAtivo(0), [lista]);
  const mudarTexto = useRef(aoMudarTexto);
  mudarTexto.current = aoMudarTexto;
  useEffect(() => {
    if (!aberta) mudarTexto.current("");
  }, [aberta]);
  useEffect(() => {
    rolagem.current?.querySelector<HTMLElement>(`[data-paleta-ativo="true"]`)?.scrollIntoView({ block: "nearest" });
  }, [ativo]);

  const escolher = (item: ItemDaPaleta) => {
    aoMudar(false);
    item.aoAbrir();
  };

  const teclas = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!lista.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((i) => (i + 1) % lista.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo((i) => (i - 1 + lista.length) % lista.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = lista[ativo];
      if (r) escolher(r);
    }
  };

  const vazio = (frase: string) => (
    <div className="busca-vazio">
      <span>{frase}</span>
    </div>
  );

  return (
    <Dialog.Root open={aberta} onOpenChange={aoMudar}>
      <Dialog.Portal>
        {/* o véu é o `.busca-veu`, que já centra a caixa no alto; clicar nele fecha */}
        <Dialog.Overlay className="busca-veu">
          <Dialog.Content
            aria-describedby={undefined}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              campo.current?.focus();
            }}
            className="busca-caixa outline-none"
          >
            <Dialog.Title className="sr-only">{titulo}</Dialog.Title>
            <label className="busca-campo">
              <Search aria-hidden className="size-5 shrink-0" />
              <input
                ref={campo}
                type="search"
                placeholder={placeholder}
                aria-label={placeholder}
                value={texto}
                onChange={(e) => aoMudarTexto(e.target.value)}
                onKeyDown={teclas}
                role="combobox"
                aria-expanded={lista.length > 0}
                aria-controls={idDaLista}
                aria-autocomplete="list"
                autoComplete="off"
                className="min-w-0"
              />
              {vale && carregando && <span className="girador" role="status" aria-label="Buscando" />}
            </label>
            <div ref={rolagem} id={idDaLista} role="listbox" className="busca-lista min-h-0 flex-1">
              {!vale && vazio("Digite para buscar")}
              {vale && erro && <Erro frase={erro.frase} referencia={erro.referencia} tentar={erro.tentar} />}
              {vale && !erro && carregando && lista.length === 0 && vazio("Buscando…")}
              {vale && !erro && !carregando && lista.length === 0 && vazio("Nada encontrado")}
              {visiveis.map((g) => (
                <section key={g.titulo}>
                  <h3 className="busca-grupo m-0">{g.titulo}</h3>
                  {g.itens.map((r) => {
                    const i = lista.indexOf(r);
                    const marcado = i === ativo;
                    return (
                      <button
                        key={r.chave}
                        type="button"
                        role="option"
                        aria-selected={marcado}
                        data-paleta-ativo={marcado || undefined}
                        onMouseMove={() => setAtivo(i)}
                        onClick={() => escolher(r)}
                        // o botão perde a borda e o fundo do navegador; a ativa fica com o azul claro do `.is-ativa`
                        className={cn("busca-linha w-full cursor-pointer border-0 text-left", marcado ? "is-ativa" : "bg-transparent")}
                      >
                        <b>{r.principal}</b>
                        {r.secundario && <span>{r.secundario}</span>}
                        <i>Enter ↵</i>
                      </button>
                    );
                  })}
                </section>
              ))}
            </div>
            <div className="busca-rodape">
              <span>↑ ↓ andar</span>
              <span>Enter abrir</span>
              <span>Esc fechar</span>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const CAMPO_DE_TEXTO = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/** Ctrl K / Cmd K na janela abre a busca; dentro de um campo de texto a tecla é do campo. */
export function useAtalhoDaBusca(aoAbrir: () => void) {
  const fn = useRef(aoAbrir);
  fn.current = aoAbrir;
  useEffect(() => {
    const ouvir = (e: globalThis.KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return;
      const alvo = e.target as HTMLElement | null;
      if (alvo && (CAMPO_DE_TEXTO.has(alvo.tagName) || alvo.isContentEditable)) return;
      e.preventDefault();
      fn.current();
    };
    window.addEventListener("keydown", ouvir);
    return () => window.removeEventListener("keydown", ouvir);
  }, []);
}
