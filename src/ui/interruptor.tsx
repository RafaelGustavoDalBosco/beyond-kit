"use client";

import { Switch } from "radix-ui";
import { useId, type ReactNode } from "react";

import { cn } from "../lib/cn";

// O interruptor (liga/desliga) e a linha de opção do cadastro do usuário.

const TRILHO = { cobalto: "data-[state=checked]:bg-cobalto", ganho: "data-[state=checked]:bg-ganho" };
const ROTULO = { cobalto: "text-cobalto", ganho: "text-ganho" };

/** O interruptor: azul ligado (ou verde, com `tom="ganho"`), cinza desligado; a bolinha branca corre de um lado ao
 * outro. */
export function Interruptor({
  checked,
  onCheckedChange,
  disabled,
  id,
  tom = "cobalto",
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
        "relative inline-flex h-[23px] w-10 shrink-0 cursor-pointer items-center rounded-full bg-linha-forte outline-none transition-colors focus-visible:ring-3 focus-visible:ring-cobalto-anel disabled:cursor-not-allowed disabled:opacity-45",
        TRILHO[tom],
        className,
      )}
    >
      <Switch.Thumb className="block size-[17px] translate-x-[3px] rounded-full bg-white shadow-1 transition-transform data-[state=checked]:translate-x-5" />
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
  tomLigado = "cobalto",
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
    <div className={cn("flex items-center justify-between gap-4 rounded-cartao border border-linha bg-superficie p-4", className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-bold text-texto">
          {titulo}
        </label>
        {descricao && <p className="m-0 mt-0.5 text-[12.5px] font-semibold text-texto-2">{descricao}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span aria-hidden className={cn("text-[13px] font-bold", checked ? ROTULO[tomLigado] : "text-texto-3")}>
          {checked ? rotuloLigado : rotuloDesligado}
        </span>
        <Interruptor id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} tom={tomLigado} />
      </div>
    </div>
  );
}
