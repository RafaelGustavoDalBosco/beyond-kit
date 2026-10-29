import { ChevronRight, type LucideIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { cn } from "../lib/cn";

/** A barra presa no alto da área de conteúdo: o ícone da seção, a trilha (Comercial › Clientes), o título em caixa
 * alta e as ações à direita (o sino, o usuário). Os itens da trilha podem ser o `Link` do roteador. */
export function BarraDoTopo({
  icone: Icone,
  trilha,
  titulo,
  subtitulo,
  acoes,
  className,
}: {
  icone?: LucideIcon;
  trilha?: ReactNode[];
  titulo: ReactNode;
  subtitulo?: ReactNode;
  acoes?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 border-b border-linha bg-superficie/85 px-4 shadow-[0_6px_20px_-18px_rgb(13_17_23/0.55)] backdrop-blur-md sm:px-6",
        className,
      )}
    >
      <div className="flex h-full items-center gap-3 sm:gap-4">
        {Icone && (
          <div className="icone-cheio hidden size-10 shrink-0 items-center justify-center rounded-xl sm:flex">
            <Icone className="size-[18px]" strokeWidth={2.2} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {trilha && trilha.length > 0 && (
            <nav aria-label="Trilha" className="mb-0.5 flex items-center gap-1 leading-none">
              {trilha.map((t, i) => (
                <Fragment key={i}>
                  {i > 0 && <ChevronRight className="size-[11px] shrink-0 text-texto-3" />}
                  <span className="truncate text-[11px] font-medium text-texto-3 [&_a:hover]:text-cobalto">{t}</span>
                </Fragment>
              ))}
            </nav>
          )}
          <h1 className="m-0 truncate text-[15px] leading-tight font-bold tracking-[0.07em] uppercase">{titulo}</h1>
          {subtitulo && <p className="m-0 hidden truncate text-xs text-texto-3 md:block">{subtitulo}</p>}
        </div>
        {acoes && <div className="flex shrink-0 items-center gap-2">{acoes}</div>}
      </div>
    </header>
  );
}

/** O alto da tela: o rótulo do assunto, o título, a frase e as ações à direita. */
export function CabecaDaTela({
  rotulo,
  titulo,
  descricao,
  acoes,
}: {
  rotulo?: ReactNode;
  titulo: ReactNode;
  descricao?: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {rotulo && <div className="rotulo mb-1">{rotulo}</div>}
        <h1 className="m-0 text-2xl leading-tight font-bold tracking-tight uppercase">{titulo}</h1>
        {descricao && <p className="m-0 mt-1 text-sm text-texto-2">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  );
}
