"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// A ponte entre a tela e a `BarraDoTopo` da casca: a tela põe a frase, as ações e o título dela na barra, que mora
// no layout. A casca guarda os lugares com `useLugaresDoTopo` e os entrega pelo `ProvedorDoTopo`:
//
//   const topo = useLugaresDoTopo();
//   <BarraDoTopo titulo={topo.titulo ?? tituloDaRota} subtitulo={<span ref={topo.setFrase} />}
//     acoes={<div ref={topo.setAcoes} className="flex items-center gap-2" />} />
//   <ProvedorDoTopo lugares={topo}>{conteudo}</ProvedorDoTopo>
//
// e a tela escreve `<NoTopo frase="..." acoes={<Botao>...</Botao>} />`.

/** Os lugares da barra: onde vão a frase e as ações da tela, e o título que troca o da rota. */
export type LugaresDoTopo = {
  frase: HTMLElement | null;
  acoes: HTMLElement | null;
  setTitulo: (titulo: string | null) => void;
};

const Lugares = createContext<LugaresDoTopo>({ frase: null, acoes: null, setTitulo: () => {} });

/** O estado dos lugares, na casca: `setFrase` e `setAcoes` vão como `ref` nos elementos da barra. */
export function useLugaresDoTopo() {
  const [frase, setFrase] = useState<HTMLElement | null>(null);
  const [acoes, setAcoes] = useState<HTMLElement | null>(null);
  const [titulo, setTitulo] = useState<string | null>(null);
  return { frase, setFrase, acoes, setAcoes, titulo, setTitulo };
}

export function ProvedorDoTopo({ lugares, children }: { lugares: LugaresDoTopo; children: ReactNode }) {
  const { frase, acoes, setTitulo } = lugares;
  return <Lugares.Provider value={{ frase, acoes, setTitulo }}>{children}</Lugares.Provider>;
}

/** Põe a frase e as ações da tela na barra do topo; `titulo` troca o da rota (o registro de uma tela de detalhe). */
export function NoTopo({ titulo, frase, acoes }: { titulo?: string; frase?: ReactNode; acoes?: ReactNode }) {
  const lugares = useContext(Lugares);
  const { setTitulo } = lugares;

  useEffect(() => {
    if (!titulo) return;
    setTitulo(titulo);
    return () => setTitulo(null);
  }, [titulo, setTitulo]);

  return (
    <>
      {frase && lugares.frase ? createPortal(frase, lugares.frase) : null}
      {acoes && lugares.acoes ? createPortal(acoes, lugares.acoes) : null}
    </>
  );
}
