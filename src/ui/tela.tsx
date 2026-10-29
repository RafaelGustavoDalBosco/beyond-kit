import type { ReactNode } from "react";

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
        <h1 className="m-0 text-2xl leading-tight font-semibold tracking-[-0.02em]">{titulo}</h1>
        {descricao && <p className="m-0 mt-1 text-[13px] text-texto-2">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  );
}
