import { Check, Search } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "../lib/cn";

const base =
  "h-9 w-full rounded-controle border border-linha bg-superficie px-3 text-[13px] text-texto shadow-1 outline-none transition-[border,box-shadow] placeholder:text-texto-3 hover:border-linha-forte focus:border-cobalto focus:ring-3 focus:ring-cobalto-suave";

export function Campo({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />;
}

export function Busca({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-texto-3" />
      <input type="search" className={cn(base, "pl-9")} {...props} />
    </div>
  );
}

export function Rotulado({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-texto-2">{rotulo}</span>
      {children}
    </label>
  );
}

/** O texto longo (a descrição, a mensagem): o mesmo contorno do campo, com altura livre. */
export function AreaDeTexto({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "h-auto min-h-24 resize-y py-2 leading-relaxed", className)} {...props} />;
}

const ESTILO_DA_ESCOLHA =
  "h-9 w-full cursor-pointer rounded-controle border border-linha bg-superficie px-2.5 text-[13px] text-texto shadow-1 outline-none transition-[border,box-shadow] hover:border-linha-forte focus:border-cobalto focus:ring-3 focus:ring-cobalto-suave disabled:cursor-default disabled:bg-superficie-2 disabled:opacity-70";

/** A escolha entre opções; a vazia é o traço (o campo sem resposta). */
export function Escolha({
  opcoes,
  className,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & { opcoes: [string, string][] }) {
  return (
    <select className={cn(ESTILO_DA_ESCOLHA, className)} {...props}>
      <option value="">—</option>
      {opcoes.map(([valor, rotulo]) => (
        <option key={valor} value={valor}>
          {rotulo}
        </option>
      ))}
    </select>
  );
}

const SIM_NAO: [string, string][] = [
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
      {children && <span>{children}</span>}
    </label>
  );
}
