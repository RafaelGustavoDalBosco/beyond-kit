"use client";

import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

// Botão: o `.btn` do Lastro (raio 7, 32px). Um primário (azul cheio) por área; o secundário e o neutro (o
// Cancelar) são o branco com contorno cinza; o fantasma é a ação leve, só texto azul; vermelho só no que apaga ou
// rejeita. `lg` é o botão de 48px do celular e do login.
const TIPO = {
  primario: "btn-primary",
  secundario: "btn-secondary",
  fantasma: "btn-ghost",
  /** O Cancelar: o secundário cinza. */
  neutro: "btn-secondary",
  positivo: "border-transparent bg-positivo text-acao-sobre hover:bg-positivo/90",
  perigo: "btn-perigo",
  "perigo-cheio": "border-transparent bg-erro text-acao-sobre hover:bg-erro/90",
  /** O item discreto (o menu lateral, o cabeçalho): texto cinza, o fundo leve sob o mouse. */
  lateral: "text-texto-secundario hover:bg-hover",
} as const;

// md e icone têm os 32px do `.btn` e do `.btn-icon`; sm e icone-sm, 28px, para baterem na mesma linha.
const TAMANHO = {
  lg: "min-h-12 px-5 text-botao-celular [&_svg]:size-[18px]",
  md: "h-8 [&_svg]:size-4",
  sm: "h-7 px-2.5 [&_svg]:size-3.5",
  icone: "size-8 p-0 [&_svg]:size-[17px]",
  "icone-sm": "size-7 p-0 [&_svg]:size-4",
} as const;

export type TipoDoBotao = keyof typeof TIPO;
export type TamanhoDoBotao = keyof typeof TAMANHO;

function classeDoBotao(tipo: TipoDoBotao, tamanho: TamanhoDoBotao) {
  // só o ícone (fechar, mais ações, paginar), no fantasma, no neutro e no lateral: o `.btn-icon` cinza, sem contorno
  const soIcone = (tamanho === "icone" || tamanho === "icone-sm") && (tipo === "fantasma" || tipo === "neutro" || tipo === "lateral");
  // o `.btn` desabilitado não recebe o mouse; aqui recebe, para o `title` aparecer (o clique continua sem disparar)
  return cn("btn shrink-0 select-none disabled:pointer-events-auto [&_svg]:shrink-0", soIcone ? "btn-icon" : TIPO[tipo], TAMANHO[tamanho]);
}

export type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tipo?: TipoDoBotao | null;
  tamanho?: TamanhoDoBotao | null;
  /** O filho único (o `Link` do roteador, um `<a>`) leva o visual do botão. */
  asChild?: boolean;
  /** Enquanto a ação corre: o giro no lugar do ícone (ou antes do texto), desabilitado. Não vale com `asChild`. */
  carregando?: boolean;
  /** Com `carregando`, o texto no lugar dos filhos (ex.: "Salvando…"); sem ele, os filhos ficam. */
  textoCarregando?: ReactNode;
};

/** O botão do kit (`.btn` do Lastro); desabilitado, guarda o `title` no hover e o clique não dispara. */
export function Botao({ className, tipo, tamanho, type = "button", asChild, carregando, textoCarregando, children, ...props }: BotaoProps) {
  const classe = classeDoBotao(tipo ?? "secundario", tamanho ?? "md");
  if (asChild)
    return (
      <Slot.Root className={cn(classe, className)} {...props}>
        {children}
      </Slot.Root>
    );
  return (
    <button
      type={type}
      className={cn(classe, carregando && "disabled:cursor-wait [&>svg]:hidden", className)}
      {...props}
      disabled={props.disabled || carregando}
      aria-busy={carregando || undefined}
    >
      {carregando && (
        <span aria-hidden className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {carregando && textoCarregando !== undefined ? textoCarregando : children}
    </button>
  );
}

/** A tecla de um atalho (`Ctrl K`, `Esc`, `Enter`): o `.tecla` do Lastro. */
export function Tecla({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cn("tecla", className)}>{children}</kbd>;
}
