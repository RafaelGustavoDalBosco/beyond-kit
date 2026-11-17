"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

import { avisar } from "../aviso/aviso";

import { Botao } from "./botao";

/**
 * O modal de ação: o `.dialog` do Lastro sobre o `.modal-fundo`. O de
 * formulário tem o título com o ✕, o conteúdo e o pé com os botões à direita (o
 * `Cancelar` e o primário), preso embaixo quando o conteúdo rola; no celular, o
 * modal ocupa a tela, com os botões de 48px presos embaixo. Com `emblema`, é a
 * confirmação: o emblema ao lado do título, sem o ✕. Só fecha pelo Cancelar,
 * pelo ✕ ou pelo Esc, e o clique fora lembra disso.
 */
export function Modal({
  aberto,
  aoMudar,
  titulo,
  children,
  rodape,
  largura = 540,
  emblema,
}: {
  aberto: boolean;
  aoMudar: (aberto: boolean) => void;
  titulo: ReactNode;
  children: ReactNode;
  rodape?: ReactNode;
  largura?: number;
  /** A confirmação: o `Emblema` ao lado do título, no lugar do ✕. */
  emblema?: ReactNode;
  /** Aceito por compatibilidade: no Lastro os botões do pé ficam sempre à direita. */
  rodapeNoMeio?: boolean;
}) {
  return (
    <Dialog.Root open={aberto} onOpenChange={aoMudar}>
      <Dialog.Portal>
        {/* o diálogo vai dentro do fundo, que o centra (e, no celular, o estica à tela) */}
        <Dialog.Overlay className="modal-fundo animate-[surgir_160ms_ease-out] motion-reduce:animate-none">
          <Dialog.Content
            aria-describedby={undefined}
            onPointerDownOutside={(e) => {
              e.preventDefault();
              // o clique num aviso por cima (o ✕ e o Desfazer dele) não é uma tentativa de fechar o modal
              if ((e.target as Element | null)?.closest("[data-avisos]")) return;
              avisar.info(emblema ? "Use Cancelar para fechar." : "Use o botão ✕ ou Cancelar para fechar.");
            }}
            // o `.dialog` rola por inteiro: é o que deixa o pé (`.dialog-actions`) preso embaixo
            style={{ width: `min(${largura}px, 100%)` }}
            className="dialog max-h-full overflow-y-auto outline-none animate-subir motion-reduce:animate-none"
          >
            <div className="flex items-start gap-3">
              {emblema}
              <Dialog.Title className="dialog-title m-0 min-w-0 flex-1 self-center">{titulo}</Dialog.Title>
              {!emblema && (
                <Dialog.Close asChild>
                  <Botao tipo="fantasma" tamanho="icone" aria-label="Fechar" className="-mt-1 -mr-2">
                    <X />
                  </Botao>
                </Dialog.Close>
              )}
            </div>
            <div className="min-w-0">{children}</div>
            {rodape && <div className="dialog-actions flex-wrap">{rodape}</div>}
          </Dialog.Content>
        </Dialog.Overlay>
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
