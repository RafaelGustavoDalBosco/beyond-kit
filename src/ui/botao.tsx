"use client";

import { Slot } from "radix-ui";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

// Botão: o `.btn` (raio 12, peso forte; ao apertar encolhe). Um primário (azul cheio, sem
// sombra) por área; o secundário e o neutro (o Cancelar) são o cinza do preenchimento; o tonal é a ação de apoio, no
// azul claro; o fantasma é a ação leve, só texto azul. Vermelho só no que apaga: o `perigo` é o tonal (o botão que
// abre a confirmação, a saída que descarta) e o `perigo-cheio`, a ação sem volta (o botão da confirmação que a executa).
const TIPO = {
  primario: "btn-primary",
  secundario: "btn-secondary",
  /** A ação de apoio: o azul claro com o texto azul. */
  tonal: "btn-tonal",
  fantasma: "btn-ghost",
  /** O Cancelar: o secundário cinza. */
  neutro: "btn-secondary",
  positivo: "bg-ok text-acao-sobre hover:bg-ok/90",
  /** O vermelho tonal: a saída que descarta, o botão que abre a confirmação de apagar. */
  perigo: "btn-perigo-tonal",
  /** O vermelho cheio: só a ação sem volta. */
  "perigo-cheio": "btn-perigo",
  /** O item discreto (o menu lateral, o cabeçalho): texto cinza, o preenchimento sob o mouse. */
  lateral: "text-texto-secundario hover:bg-preenchimento",
} as const;

// As alturas, da menor à maior: sm, md, alto (o pé do modal), lg (o alerta, o login e o celular); o ícone é o
// redondo (icone) ou o redondo pequeno (icone-sm).
const TAMANHO = {
  lg: "btn-g [&_svg]:size-[18px]",
  alto: "btn-m [&_svg]:size-[18px]",
  md: "[&_svg]:size-4",
  sm: "btn-p [&_svg]:size-3.5",
  icone: "size-9 min-h-0 p-0 [&_svg]:size-[17px]",
  "icone-sm": "size-7 min-h-0 p-0 [&_svg]:size-4",
} as const;

export type TipoDoBotao = keyof typeof TIPO;
export type TamanhoDoBotao = keyof typeof TAMANHO;

function classeDoBotao(tipo: TipoDoBotao, tamanho: TamanhoDoBotao) {
  // só o ícone (fechar, mais ações, paginar), no fantasma, no neutro e no lateral: o `.btn-icon` redondo, cinza, sem
  // fundo até o mouse passar
  const soIcone = (tamanho === "icone" || tamanho === "icone-sm") && (tipo === "fantasma" || tipo === "neutro" || tipo === "lateral");
  const classe = soIcone
    ? cn("btn-icon", tamanho === "icone-sm" ? "btn-p [&_svg]:size-4" : "[&_svg]:size-[17px]")
    : cn(TIPO[tipo], TAMANHO[tamanho]);
  // o `.btn` desabilitado não recebe o mouse; aqui recebe, para o `title` aparecer (o clique continua sem disparar)
  return cn("btn shrink-0 select-none disabled:pointer-events-auto [&_svg]:shrink-0", classe);
}

export type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tipo?: TipoDoBotao | null;
  tamanho?: TamanhoDoBotao | null;
  /** O filho único (o `Link` do roteador, um `<a>`) leva o visual do botão. */
  asChild?: boolean;
  /** Enquanto a ação corre: o girador no lugar do ícone (ou antes do texto), desabilitado. Não vale com `asChild`. */
  carregando?: boolean;
  /** Com `carregando`, o texto no lugar dos filhos (ex.: "Salvando…"); sem ele, os filhos ficam. */
  textoCarregando?: ReactNode;
};

/** O botão do kit (`.btn`); desabilitado, guarda o `title` no hover e o clique não dispara. */
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
      {/* o girador na tinta do botão, como o `.is-carregando` */}
      {carregando && (
        <span aria-hidden className="size-4 shrink-0 animate-spin rounded-full border-2 border-current/35 border-t-current" />
      )}
      {carregando && textoCarregando !== undefined ? textoCarregando : children}
    </button>
  );
}

/** A tecla de um atalho (`Ctrl K`, `Esc`, `Enter`): o `.tecla`. */
export function Tecla({ children, className }: { children: ReactNode; className?: string }) {
  return <kbd className={cn("tecla", className)}>{children}</kbd>;
}
