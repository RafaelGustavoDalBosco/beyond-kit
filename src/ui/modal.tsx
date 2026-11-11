"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

import { avisar } from "../aviso/aviso";
import { cn } from "../lib/cn";

import { Botao } from "./botao";

/**
 * O modal de ação. O de formulário tem o cabeçalho com o título e o ×, o
 * conteúdo (as seções) e o pé com os botões (o `Cancelar` e o primário). Com
 * `emblema`, é a confirmação: pequeno, sem o cabeçalho, com o ícone em
 * círculo, o título em pergunta e a frase centrados, e o mesmo pé do
 * formulário (`rodapeNoMeio` põe os botões no meio, sem o fio). Só fecha pelo
 * Cancelar, pelo × ou pelo Esc, e o clique fora lembra disso.
 */
export function Modal({
  aberto,
  aoMudar,
  titulo,
  children,
  rodape,
  largura = 480,
  emblema,
  rodapeNoMeio,
}: {
  aberto: boolean;
  aoMudar: (aberto: boolean) => void;
  titulo: ReactNode;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: number;
  /** A confirmação: o `Emblema` em círculo que vai acima do título, no lugar do cabeçalho com o ×. */
  emblema?: ReactNode;
  /** Na confirmação que não é risco: os botões no meio, sem o fio nem o fundo do pé. */
  rodapeNoMeio?: boolean;
}) {
  return (
    <Dialog.Root open={aberto} onOpenChange={aoMudar}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-entrar bg-veu" />
        <Dialog.Content
          aria-describedby={undefined}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            // o clique num aviso por cima (o × e o Desfazer dele) não é uma tentativa de fechar o modal
            if ((e.target as Element | null)?.closest("[data-avisos]")) return;
            avisar.info(emblema ? "Use Cancelar para fechar." : "Use o botão × ou Cancelar para fechar.");
          }}
          style={{ width: `min(${largura}px, calc(100% - 32px))` }}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[88vh] -translate-x-1/2 -translate-y-1/2 animate-subir flex-col overflow-hidden rounded-ficha bg-superficie shadow-3 outline-none"
        >
          {emblema ? (
            <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 pt-[26px] text-center", rodapeNoMeio ? "pb-2" : "pb-5")}>
              <div className="mb-3 flex justify-center">{emblema}</div>
              <Dialog.Title className="m-0 mb-1.5 text-[19px] leading-snug font-extrabold text-texto">{titulo}</Dialog.Title>
              {children}
            </div>
          ) : (
            <>
              <div className="flex shrink-0 items-center gap-3 border-b border-fio px-[22px] py-[18px]">
                <Dialog.Title className="m-0 min-w-0 flex-1 text-lg leading-snug font-extrabold text-texto">{titulo}</Dialog.Title>
                <Dialog.Close asChild>
                  <Botao
                    tipo="fantasma"
                    tamanho="icone-sm"
                    aria-label="Fechar"
                    className="size-[34px] bg-neutro-suave hover:bg-superficie-3"
                  >
                    <X />
                  </Botao>
                </Dialog.Close>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-[22px] py-5">{children}</div>
            </>
          )}
          {rodape && (
            <div
              className={
                emblema && rodapeNoMeio
                  ? "flex shrink-0 flex-wrap justify-center gap-2 px-6 pt-3 pb-[22px]"
                  : "flex shrink-0 flex-wrap justify-end gap-2 border-t border-fio bg-zebra px-[22px] py-3.5"
              }
            >
              {rodape}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** O Cancelar do rodapé, que fecha o modal; `rotulo` troca o texto ("Voltar" ao lado de "Cancelar cobrança"). */
export function Cancelar({ disabled, rotulo = "Cancelar" }: { disabled?: boolean; rotulo?: ReactNode }) {
  return (
    <Dialog.Close asChild>
      <Botao tipo="neutro" disabled={disabled}>
        {rotulo}
      </Botao>
    </Dialog.Close>
  );
}
