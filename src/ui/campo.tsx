"use client";

import { Check, Search } from "lucide-react";
import {
  createContext,
  useContext,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "../lib/cn";

const base =
  "h-9 w-full rounded-controle border border-linha bg-superficie px-3 text-[13px] text-texto shadow-1 outline-none transition-[border,box-shadow] placeholder:text-texto-3 enabled:hover:border-linha-forte focus:border-cobalto focus:ring-3 focus:ring-cobalto-suave disabled:cursor-default disabled:bg-superficie-2 disabled:text-texto-2";

/** O id que o `Rotulado` dá ao controle de dentro (o `htmlFor` do rótulo). */
const IdDoRotulado = createContext<string | undefined>(undefined);

/** O id do controle: o que veio por prop, senão o do `Rotulado` em volta. */
function useIdDoControle(id: string | undefined) {
  const doRotulado = useContext(IdDoRotulado);
  return id ?? doRotulado;
}

export function Campo({ className, id, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input id={useIdDoControle(id)} className={cn(base, className)} {...props} />;
}

export function Busca({ className, id, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const idDoControle = useIdDoControle(id);
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-texto-3" />
      <input id={idDoControle} type="search" className={cn(base, "pl-9")} {...props} />
    </div>
  );
}

/**
 * O rótulo, o controle e, embaixo, a ajuda ou o erro da validação. O `<label>`
 * fica só no texto (`htmlFor`); os controles do kit de dentro pegam o id dele
 * sozinhos. Controle nativo de fora do kit: passe `htmlFor` e o mesmo `id` no
 * controle. `obrigatorio` põe o asterisco, `opcional` o "(opcional)" e `acao`
 * vai à direita do rótulo (o "Esqueceu a senha?").
 */
export function Rotulado({
  rotulo,
  erro,
  ajuda,
  htmlFor,
  obrigatorio,
  opcional,
  acao,
  className,
  children,
}: {
  rotulo: ReactNode;
  erro?: string;
  ajuda?: ReactNode;
  htmlFor?: string;
  obrigatorio?: boolean;
  opcional?: boolean;
  acao?: ReactNode;
  /** Aceito por compatibilidade: o rótulo já não envolve o controle. */
  como?: "label" | "div";
  className?: string;
  children: ReactNode;
}) {
  const gerado = useId();
  const id = htmlFor ?? gerado;
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex items-baseline gap-1.5">
        <label htmlFor={id} className="text-xs font-medium text-texto-2">
          {rotulo}
          {obrigatorio && (
            <>
              <span aria-hidden className="ml-0.5 text-cobalto">*</span>
              <span className="sr-only"> obrigatório</span>
            </>
          )}
        </label>
        {opcional && <span className="text-xs text-texto-3">(opcional)</span>}
        {acao && <div className="ml-auto text-xs [&_a]:text-cobalto [&_a:hover]:underline">{acao}</div>}
      </div>
      <IdDoRotulado.Provider value={id}>{children}</IdDoRotulado.Provider>
      {ajuda && !erro && <span className="text-[11.5px] leading-relaxed text-texto-3">{ajuda}</span>}
      {erro && <span className="text-[11.5px] text-risco">{erro}</span>}
    </div>
  );
}

/** O texto longo (a descrição, a mensagem): o mesmo contorno do campo, com altura livre. */
export function AreaDeTexto({ className, id, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea id={useIdDoControle(id)} className={cn(base, "h-auto min-h-24 resize-y py-2 leading-relaxed", className)} {...props} />;
}

const ESTILO_DA_ESCOLHA =
  "h-9 w-full cursor-pointer rounded-controle border border-linha bg-superficie px-2.5 text-[13px] text-texto shadow-1 outline-none transition-[border,box-shadow] hover:border-linha-forte focus:border-cobalto focus:ring-3 focus:ring-cobalto-suave disabled:cursor-default disabled:bg-superficie-2 disabled:opacity-70";

/**
 * A escolha entre opções. A vazia é o traço (o campo sem resposta); `vazio`
 * troca o rótulo dela ("Todos", "Sem projeto") e `vazio={false}` a tira (a
 * escolha obrigatória). Os `children` entram depois das `opcoes` (os `optgroup`).
 */
export function Escolha({
  opcoes = [],
  vazio = "—",
  className,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { opcoes?: ReadonlyArray<readonly [string, string]>; vazio?: string | false }) {
  return (
    <select id={useIdDoControle(id)} className={cn(ESTILO_DA_ESCOLHA, className)} {...props}>
      {vazio !== false && <option value="">{vazio}</option>}
      {opcoes.map(([valor, rotulo]) => (
        <option key={valor} value={valor}>
          {rotulo}
        </option>
      ))}
      {children}
    </select>
  );
}

const SIM_NAO: ReadonlyArray<readonly [string, string]> = [
  ["true", "Sim"],
  ["false", "Não"],
];

export function SimNao(props: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  return <Escolha opcoes={SIM_NAO} {...props} />;
}

/** A caixa de seleção: a marca cobalto quando ligada, com o rótulo ao lado. */
export function Caixa({ children, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
  return (
    <label className={cn("group inline-flex cursor-pointer items-center gap-2 text-[13px] text-texto has-disabled:cursor-default has-disabled:opacity-60", className)}>
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <input type="checkbox" className="peer absolute inset-0 m-0 size-4 cursor-pointer appearance-none rounded-[5px] border border-linha-forte bg-superficie shadow-1 transition-[background,border] checked:border-cobalto checked:bg-cobalto hover:border-cobalto focus-visible:ring-3 focus-visible:ring-cobalto-suave disabled:cursor-default" {...props} />
        <Check className="pointer-events-none relative size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
      </span>
      {children && <span className="min-w-0 flex-1">{children}</span>}
    </label>
  );
}

/**
 * A alternativa (o radio): uma entre várias do mesmo `name`, com o ponto
 * cobalto quando marcada. `variante="cartao"` a põe numa caixa com borda
 * (marcada, borda e fundo cobalto), com o título e a descrição nos `children`.
 */
export function Alternativa({
  variante = "padrao",
  children,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { variante?: "padrao" | "cartao"; children?: ReactNode }) {
  const cartao = variante === "cartao";
  return (
    <label
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2 text-[13px] text-texto has-disabled:cursor-default has-disabled:opacity-60",
        cartao &&
          "flex items-start gap-3 rounded-controle border border-linha bg-superficie p-3 shadow-1 transition-[border,background] has-checked:border-cobalto has-checked:bg-cobalto-suave",
        className,
      )}
    >
      <span className={cn("relative flex size-4 shrink-0 items-center justify-center", cartao && "mt-0.5")}>
        <input type="radio" className="peer absolute inset-0 m-0 size-4 cursor-pointer appearance-none rounded-full border border-linha-forte bg-superficie shadow-1 transition-[border] checked:border-cobalto hover:border-cobalto focus-visible:ring-3 focus-visible:ring-cobalto-suave disabled:cursor-default" {...props} />
        <span className="pointer-events-none relative size-2 rounded-full bg-cobalto opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      {children && <span className={cn("min-w-0 flex-1", cartao && "flex flex-col gap-0.5")}>{children}</span>}
    </label>
  );
}
