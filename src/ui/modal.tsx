"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

import { avisar } from "../aviso/aviso";
import { cn } from "../lib/cn";

import { Botao } from "./botao";

/**
 * O modal de ação (formulário, confirmação), como no ArchFlow: o filete no
 * alto, o título de seção e o rodapé com os botões; só fecha pelo Cancelar ou
 * pelo ×, e o clique fora lembra disso.
 */
export function Modal({
  aberto,
  aoMudar,
  titulo,
  children,
  rodape,
  largura = 480,
}: {
  aberto: boolean;
  aoMudar: (aberto: boolean) => void;
  titulo: ReactNode;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: number;
}) {
  return (
    <Dialog.Root open={aberto} onOpenChange={aoMudar}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-entrar bg-(--veu) backdrop-blur-[3px]" />
        <Dialog.Content
          aria-describedby={undefined}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            avisar.info("Use o botão × ou Cancelar para fechar.");
          }}
          style={{ width: `min(${largura}px, calc(100% - 32px))` }}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[88vh] -translate-x-1/2 -translate-y-1/2 animate-subir flex-col overflow-hidden rounded-ficha border border-linha bg-superficie shadow-3 outline-none"
        >
          <div className="filete shrink-0" />
          <div className="flex shrink-0 items-center justify-between border-b border-linha px-6 py-4">
            <Dialog.Title className="titulo-secao m-0">{titulo}</Dialog.Title>
            <Dialog.Close asChild>
              <Botao tipo="fantasma" tamanho="icone-sm" aria-label="Fechar">
                <X />
              </Botao>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {rodape && (
            <div className={cn("flex shrink-0 justify-end gap-2 border-t border-linha bg-superficie-2/60 px-6 py-3")}>{rodape}</div>
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
      <Botao tipo="fantasma" disabled={disabled}>
        {rotulo}
      </Botao>
    </Dialog.Close>
  );
}
