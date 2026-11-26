"use client";

import { Switch } from "radix-ui";
import { useId, type ReactNode } from "react";

import { cn } from "../lib/cn";

// O interruptor (o parâmetro binário; para marcar registro, a `Caixa`) e a
// linha de opção do cadastro do usuário. O `.interruptor`: o azul vivo ligado, o preenchimento
// desligado e a bolinha branca, com a sombra de controle, que desliza com mola e alarga enquanto apertada.

// O estado escrito ao lado: o dado nunca é azul; ligado fica no texto forte (ou no verde, com `positivo`).
const ROTULO = { acao: "text-texto", positivo: "text-positivo" };

/** O interruptor: azul ligado (ou verde, com `tom="positivo"`), cinza desligado; a bolinha branca corre de um lado ao
 * outro. */
export function Interruptor({
  checked,
  onCheckedChange,
  disabled,
  id,
  tom = "acao",
  "aria-label": rotulo,
  className,
}: {
  checked: boolean;
  onCheckedChange?: (ligado: boolean) => void;
  disabled?: boolean;
  id?: string;
  /** A cor do trilho ligado. */
  tom?: "acao" | "positivo";
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
      className={cn("interruptor", tom === "positivo" && "is-positivo", className)}
    >
      <Switch.Thumb className="interruptor-bolinha" />
    </Switch.Root>
  );
}

/** A linha de opção do cadastro (o status do usuário, uma integração): o título e a frase de ajuda à esquerda; à
 * direita o estado (forte quando ligado, apagado quando desligado) e o `Interruptor`. */
export function OpcaoDoCadastro({
  titulo,
  descricao,
  checked,
  onCheckedChange,
  rotuloLigado = "Ativo",
  rotuloDesligado = "Desativado",
  tomLigado = "acao",
  disabled,
  className,
}: {
  titulo: ReactNode;
  descricao?: ReactNode;
  checked: boolean;
  onCheckedChange?: (ligado: boolean) => void;
  rotuloLigado?: ReactNode;
  rotuloDesligado?: ReactNode;
  tomLigado?: "acao" | "positivo";
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("flex min-h-14 items-center justify-between gap-4 rounded-grupo bg-ficha px-4 py-2.5", className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="text-base font-medio text-texto">
          {titulo}
        </label>
        {descricao && <p className="m-0 mt-0.5 text-apoio text-texto-apoio">{descricao}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span aria-hidden className={cn("text-base", checked ? cn("font-medio", ROTULO[tomLigado]) : "text-texto-apoio")}>
          {checked ? rotuloLigado : rotuloDesligado}
        </span>
        <Interruptor id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} tom={tomLigado} />
      </div>
    </div>
  );
}
