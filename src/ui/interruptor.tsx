"use client";

import { Switch } from "radix-ui";
import { useId, type ReactNode } from "react";

import { cn } from "../lib/cn";

// O interruptor (liga/desliga) e a linha de opção do cadastro do usuário, como no ArchFlow.

const TRILHO = { ganho: "data-[state=checked]:bg-ganho", cobalto: "data-[state=checked]:bg-cobalto" };
const ROTULO = { ganho: "text-ganho", cobalto: "text-cobalto" };

/** O interruptor: verde (`ganho`) ligado, cinza desligado, a bolinha branca corre de um lado ao outro. */
export function Interruptor({
  checked,
  onCheckedChange,
  disabled,
  id,
  tom = "ganho",
  "aria-label": rotulo,
  className,
}: {
  checked: boolean;
  onCheckedChange?: (ligado: boolean) => void;
  disabled?: boolean;
  id?: string;
  /** A cor do trilho ligado. */
  tom?: "ganho" | "cobalto";
  "aria-label"?: string;
  className?: string;
}) {
  return (
    <Switch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={rotulo}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-linha-forte outline-none transition-colors focus-visible:ring-3 focus-visible:ring-cobalto-suave disabled:cursor-default disabled:opacity-50",
        TRILHO[tom],
        className,
      )}
    >
      <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow-1 transition-transform data-[state=checked]:translate-x-[22px]" />
    </Switch.Root>
  );
}

/** A linha de opção do cadastro (o status do usuário, uma integração): o título e a frase de ajuda à esquerda; à
 * direita o estado (na cor do `tomLigado` quando ligado, apagado quando desligado) e o `Interruptor`. */
export function OpcaoDoCadastro({
  titulo,
  descricao,
  checked,
  onCheckedChange,
  rotuloLigado = "Ativo",
  rotuloDesligado = "Desativado",
  tomLigado = "ganho",
  disabled,
  className,
}: {
  titulo: ReactNode;
  descricao?: ReactNode;
  checked: boolean;
  onCheckedChange?: (ligado: boolean) => void;
  rotuloLigado?: ReactNode;
  rotuloDesligado?: ReactNode;
  tomLigado?: "ganho" | "cobalto";
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-bloco border border-linha bg-superficie p-4", className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-texto">
          {titulo}
        </label>
        {descricao && <p className="m-0 mt-0.5 text-xs text-texto-2">{descricao}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span aria-hidden className={cn("text-sm font-medium", checked ? ROTULO[tomLigado] : "text-texto-3")}>
          {checked ? rotuloLigado : rotuloDesligado}
        </span>
        <Interruptor id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} tom={tomLigado} />
      </div>
    </div>
  );
}
