"use client";

import { ChevronLeft, CircleHelp, Info, Maximize2, Minimize2, OctagonAlert, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "../lib/cn";

import { Botao, type TipoDoBotao } from "./botao";

// O modal e o alerta, sobre o `Dialog` do Radix, que garante o
// foco preso, o Esc só no diálogo mais alto e a volta do foco a quem abriu. O véu (`.modal-fundo`) é o mesmo nos dois.
// A saída é animada: o fechar pelo `aberto` encolhe pelo `data-state` (o Radix espera a animação), e o desmontar com
// ele aberto (`{x && <Modal aberto ...>}`) deixa no lugar uma cópia inerte, marcada com `data-saindo`, que o CSS
// encolhe e apaga; ninguém precisa esperar a animação para largar o estado.

/** Os diálogos abertos (o modal e o alerta), do mais fundo ao mais alto; o que está saindo não conta. */
const ABERTOS = '.modal-fundo:not([data-saindo]):not([data-state="closed"]) > :is([role="dialog"], [role="alertdialog"])';

const CAMPOS = 'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)';

/** Se o diálogo é o mais alto dos abertos: o atalho de um modal (J/K, Alt ←) só vale nele. */
export function isDialogoNoAlto(caixa: Element | null) {
  if (!caixa) return false;
  const abertos = document.querySelectorAll(ABERTOS);
  return abertos[abertos.length - 1] === caixa;
}

/** A tecla dada num campo, com um menu aberto ou com Ctrl/⌘ não é atalho do modal. */
export function isTeclaDeCampo(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) return true;
  const alvo = e.target as HTMLElement | null;
  if (alvo instanceof HTMLInputElement || alvo instanceof HTMLTextAreaElement || alvo instanceof HTMLSelectElement || alvo?.isContentEditable) return true;
  return !!document.querySelector('.flutuante, [role="menu"], [role="listbox"]');
}

/** A cópia inerte do véu que o React acabou de tirar, só para o CSS encolher e apagar; some sozinha no fim. */
function sairAnimado(veu: HTMLElement, rolagem: number) {
  const copia = veu.cloneNode(true) as HTMLElement;
  copia.setAttribute("data-saindo", "");
  copia.setAttribute("aria-hidden", "true");
  copia.setAttribute("inert", "");
  document.body.appendChild(copia);
  // a cópia nasce rolada no alto: volta para onde o corpo estava
  const corpo = copia.querySelector<HTMLElement>(".dialog-corpo");
  if (corpo) corpo.scrollTop = rolagem;
  const tirar = () => copia.remove();
  copia.addEventListener("animationend", (e) => {
    if (e.target === copia) tirar();
  });
  // a animação pode não acabar (aba em segundo plano): a cópia nunca fica na tela
  setTimeout(tirar, 600);
}

/** O véu guardado enquanto aberto e, se ele sair do documento com o diálogo aberto (o componente desmontou), a
 * cópia da saída. Fechado pelo `aberto`, o véu continua no documento enquanto o Radix anima, e nada acontece; no
 * ensaio do modo estrito, também não. */
function useSaidaAnimada(aberto: boolean) {
  const veu = useRef<HTMLDivElement | null>(null);
  const rolagem = useRef(0);
  const guardarVeu = useCallback((no: HTMLDivElement | null) => {
    if (no) veu.current = no;
  }, []);
  useLayoutEffect(() => {
    if (!aberto) return;
    rolagem.current = 0;
    return () => {
      const no = veu.current;
      queueMicrotask(() => {
        if (no && !no.isConnected) sairAnimado(no, rolagem.current);
      });
    };
  }, [aberto]);
  return { guardarVeu, rolagem };
}

function atribuir<T>(ref: Ref<T> | undefined, valor: T | null) {
  if (typeof ref === "function") ref(valor);
  else if (ref) ref.current = valor;
}

/** O foco ao abrir: o primeiro campo; sem campo, quem pede (`data-foco-inicial`); senão o próprio diálogo. */
function focarAoAbrir(caixa: HTMLElement | null) {
  if (!caixa) return;
  const alvo = caixa.querySelector<HTMLElement>(CAMPOS) ?? caixa.querySelector<HTMLElement>("[data-foco-inicial]") ?? caixa;
  alvo.focus({ preventScroll: true });
}

// O clique num aviso por cima (o ✕ e o Desfazer dele) não é uma tentativa de fechar o diálogo.
const isNoAviso = (alvo: EventTarget | null) => !!(alvo as Element | null)?.closest?.("[data-avisos]");

const DentroDoModal = createContext(false);

/** Se o componente está no corpo de um `Modal` (as partes da ficha recuam nele). */
export function useDentroDoModal() {
  return useContext(DentroDoModal);
}

/** O que o `Modal` recebe em `pilha`: os rótulos dos níveis e os caminhos de volta. */
export type TrilhaDoModal = {
  /** O rótulo de cada nível, do primeiro ao atual. */
  niveis: ReactNode[];
  aoVoltar: () => void;
  /** Volta ao nível escolhido na trilha (0 é o primeiro); sem ele, os níveis da trilha não são clicáveis. */
  aoIrPara?: (nivel: number) => void;
};

export type TamanhoDoModal = "p" | "m" | "g" | "xg" | "cheio";

export type PropsDoModal = {
  aberto: boolean;
  /** Recebe `false` ao fechar (✕, Esc, clique fora, `Cancelar`). */
  aoMudar?: (aberto: boolean) => void;
  /** O mesmo fechar, para quem prefere sem o booleano. */
  aoFechar?: () => void;
  titulo: ReactNode;
  /** A linha pequena acima do título (o tipo, a empresa, "cliente 3 de 50"). */
  contexto?: ReactNode;
  /** A linha embaixo do título. */
  subtitulo?: ReactNode;
  /** Os selos embaixo do título. */
  selos?: ReactNode;
  children?: ReactNode;
  /** Os botões do pé de vidro, à direita (o `Cancelar` e o primário); sem eles, não há pé. */
  rodape?: ReactNode;
  /** As ações do cabeçalho, antes do maximizar e do fechar (a anterior e a próxima, o "Abrir em …"). */
  acoesDoTopo?: ReactNode;
  /** p 420 · m 680 · g 1040 · xg 1360 · cheio 96% da janela. */
  tamanho?: TamanhoDoModal;
  /** A largura em px, para quem não usa um dos tamanhos; sem as duas, 540. */
  largura?: number;
  /** Mostra o botão que leva o modal a cheio e de volta (some no celular, onde o modal já é tela cheia). */
  maximizavel?: boolean;
  /** A navegação dentro do mesmo modal: com mais de um nível, o cabeçalho mostra o voltar e a trilha. */
  pilha?: TrilhaDoModal;
  /** Enquanto grava: Esc, o ✕ e o clique fora não fecham. */
  preso?: boolean;
  className?: string;
  /** O diálogo (o `[role=dialog]`), para quem confere se ele é o mais alto (`isDialogoNoAlto`). */
  ref?: Ref<HTMLDivElement>;
};

/**
 * O modal (`.dialog`): o ambiente de leitura e de decisão, centralizado sobre o véu desfocado. O cabeçalho leva a
 * trilha (o `contexto` e, com a `pilha`, o voltar e os níveis), o título, os selos, o subtítulo e, à direita, as
 * `acoesDoTopo`, o maximizar e o fechar redondo; o corpo é o único que rola; o pé, de vidro, só existe com `rodape`.
 * Fecha com Esc, no ✕, no `Cancelar` ou clicando fora, e devolve o foco a quem abriu, sem mexer na página de trás.
 * Com a pilha, o Alt ← volta um nível. No celular é tela cheia, com os botões de 48px presos embaixo.
 */
export function Modal({
  aberto,
  aoMudar,
  aoFechar,
  titulo,
  contexto,
  subtitulo,
  selos,
  children,
  rodape,
  acoesDoTopo,
  tamanho,
  largura,
  maximizavel,
  pilha,
  preso,
  className,
  ref,
}: PropsDoModal) {
  const caixa = useRef<HTMLDivElement | null>(null);
  const corpo = useRef<HTMLDivElement>(null);
  const [isMaximizado, setIsMaximizado] = useState(false);
  const { guardarVeu, rolagem } = useSaidaAnimada(aberto);
  const fechar = () => {
    aoFechar?.();
    aoMudar?.(false);
  };

  // fechado, volta ao tamanho dele: a próxima abertura não nasce maximizada
  useEffect(() => {
    if (!aberto) setIsMaximizado(false);
  }, [aberto]);

  const niveis = pilha?.niveis ?? [];
  const profundidade = niveis.length;
  // a pilha com mais de um nível: tem para onde voltar
  const volta = pilha && profundidade > 1 ? pilha : undefined;

  // outro nível da pilha começa do alto; o foco, que saiu junto com o conteúdo trocado, fica no diálogo
  const nivelAnterior = useRef(profundidade);
  useEffect(() => {
    if (nivelAnterior.current === profundidade) return;
    nivelAnterior.current = profundidade;
    if (corpo.current) corpo.current.scrollTop = 0;
    rolagem.current = 0;
    if (!caixa.current?.contains(document.activeElement)) caixa.current?.focus({ preventScroll: true });
  }, [profundidade, rolagem]);

  // Alt ← volta um nível da pilha, só com este modal no alto
  const voltarAgora = useRef(volta?.aoVoltar);
  voltarAgora.current = volta?.aoVoltar;
  const temVolta = !!volta;
  useEffect(() => {
    if (!aberto || !temVolta) return;
    const tecla = (e: KeyboardEvent) => {
      if (!e.altKey || e.key !== "ArrowLeft" || !isDialogoNoAlto(caixa.current)) return;
      e.preventDefault();
      voltarAgora.current?.();
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [aberto, temVolta]);

  const isCheio = tamanho === "cheio" || isMaximizado;
  const pe = rodape;

  return (
    <Dialog.Root open={aberto} onOpenChange={(a) => (a ? aoMudar?.(true) : fechar())}>
      <Dialog.Portal>
        {/* o diálogo vai dentro do véu, que o centra (e, no celular, o estica à tela) */}
        <Dialog.Overlay ref={guardarVeu} className="modal-fundo">
          <Dialog.Content
            ref={(no: HTMLDivElement | null) => {
              caixa.current = no;
              atribuir(ref, no);
            }}
            aria-describedby={undefined}
            tabIndex={-1}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              focarAoAbrir(caixa.current);
            }}
            onEscapeKeyDown={(e) => {
              if (preso) e.preventDefault();
            }}
            onInteractOutside={(e) => {
              if (preso || isNoAviso(e.target)) e.preventDefault();
            }}
            className={cn("dialog", isCheio ? "dialog-cheio" : tamanho && `dialog-${tamanho}`, className)}
            style={isCheio || tamanho ? undefined : ({ "--largura": `${largura ?? 540}px` } as CSSProperties)}
          >
            <div className="dialog-topo">
              <div className="dialog-cabeca">
                {(volta || contexto) && (
                  <div className="dialog-trilha">
                    {volta && (
                      <>
                        {niveis.slice(0, -2).map((rotulo, i) => (
                          <Fragment key={i}>
                            {volta.aoIrPara ? (
                              <button type="button" className="dialog-nivel" onClick={() => volta.aoIrPara?.(i)}>
                                {rotulo}
                              </button>
                            ) : (
                              <span>{rotulo}</span>
                            )}
                            <span aria-hidden>›</span>
                          </Fragment>
                        ))}
                        <Botao tipo="secundario" tamanho="sm" title="Voltar (Alt ←)" onClick={volta.aoVoltar}>
                          <ChevronLeft aria-hidden />
                          <span className="sr-only">Voltar para </span>
                          {niveis[profundidade - 2]}
                        </Botao>
                      </>
                    )}
                    {contexto && <span>{contexto}</span>}
                  </div>
                )}
                <Dialog.Title className="dialog-title">{titulo}</Dialog.Title>
                {selos && <div className="dialog-selos">{selos}</div>}
                {subtitulo && <div className="dialog-sub">{subtitulo}</div>}
              </div>
              <div className="dialog-topo-acoes">
                {acoesDoTopo}
                {maximizavel && tamanho !== "cheio" && (
                  <Botao
                    tipo="fantasma"
                    tamanho="icone"
                    className="is-cheio dialog-maximizar"
                    aria-label={isMaximizado ? "Restaurar o tamanho" : "Maximizar"}
                    title={isMaximizado ? "Restaurar o tamanho" : "Maximizar"}
                    aria-pressed={isMaximizado}
                    onClick={() => setIsMaximizado((x) => !x)}
                  >
                    {isMaximizado ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
                  </Botao>
                )}
                <Botao tipo="fantasma" tamanho="icone" className="is-cheio" aria-label="Fechar" title="Fechar (Esc)" disabled={preso} onClick={fechar}>
                  <X aria-hidden />
                </Botao>
              </div>
            </div>
            <div
              ref={corpo}
              className="dialog-corpo"
              onScroll={(e) => {
                rolagem.current = e.currentTarget.scrollTop;
              }}
            >
              <DentroDoModal.Provider value>{children}</DentroDoModal.Provider>
            </div>
            {pe && <div className="dialog-actions">{pe}</div>}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** O Cancelar do pé, que fecha o modal; `rotulo` troca o texto ("Voltar" ao lado de "Cancelar cobrança"). */
export function Cancelar({ disabled, rotulo = "Cancelar" }: { disabled?: boolean; rotulo?: ReactNode }) {
  return (
    <Dialog.Close asChild>
      <Botao tipo="neutro" disabled={disabled}>
        {rotulo}
      </Botao>
    </Dialog.Close>
  );
}

// ---------- ALERTA ----------

export type VarianteDoAlerta = "acao" | "perigo" | "atencao" | "sucesso" | "neutro";

export type AcaoDoAlerta = {
  rotulo: ReactNode;
  /** Recebe o clique, para quem só aceita o gesto de uma pessoa (o `isTrusted`). Quem fecha o alerta é quem chama. */
  aoClicar: (evento: MouseEvent<HTMLButtonElement>) => void;
  /** `perigo` é a ação sem volta (o vermelho cheio, só ela); `primario`, o passo que não é risco; sem ele, o neutro. */
  tipo?: "primario" | "perigo" | "secundario";
  carregando?: boolean;
  desligada?: boolean;
};

const BOTAO_DA_ACAO = { primario: "primario", perigo: "perigo-cheio", secundario: "secundario" } as const satisfies Record<
  NonNullable<AcaoDoAlerta["tipo"]>,
  TipoDoBotao
>;

/** O desenho de cada variante quando quem chama não passa o seu; o sucesso não tem: é o check que se desenha. */
const ICONE_DA_VARIANTE: Record<VarianteDoAlerta, LucideIcon | null> = {
  acao: CircleHelp,
  perigo: OctagonAlert,
  atencao: TriangleAlert,
  neutro: Info,
  sucesso: null,
};

/** O ícone com cara de ícone de app, sobre o halo tonal da variante. */
export function IconeDeApp({ variante = "acao", children }: { variante?: VarianteDoAlerta; children: ReactNode }) {
  return (
    <span className={cn("icone-app", variante !== "acao" && `icone-app-${variante}`)} aria-hidden>
      {children}
    </span>
  );
}

/** O check que se desenha: primeiro o círculo, depois o traço. Com `rotulo`, o leitor de tela o anuncia. */
export function CheckAnimado({ rotulo }: { rotulo?: string }) {
  return (
    <svg className="check" viewBox="0 0 72 72" role={rotulo ? "img" : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}>
      <circle cx="36" cy="36" r="33" />
      <path d="M22 37.5l9.5 9.5L51 27.5" />
    </svg>
  );
}

/**
 * O alerta (`.alerta`): a confirmação. O ícone de app sobre o halo tonal da `variante` (ação, perigo,
 * atenção, sucesso, neutro), o título no meio, a `mensagem` curta, o conteúdo extra (`children`: o campo do que se
 * digita) e os botões grandes empilhados na ordem em que vêm; vermelho só na ação sem volta. O foco abre no campo,
 * se houver; senão, na última ação que não destrói. Esc e o clique fora fecham (é o cancelar). No sucesso sem
 * `icone`, o traço do check se desenha. No celular segue no meio da tela.
 */
export function Alerta({
  aberto,
  aoMudar,
  aoFechar,
  variante = "acao",
  icone,
  titulo,
  mensagem,
  children,
  acoes,
  preso,
  ref,
}: {
  aberto: boolean;
  /** Recebe `false` no Esc e no clique fora (o cancelar). */
  aoMudar?: (aberto: boolean) => void;
  aoFechar?: () => void;
  variante?: VarianteDoAlerta;
  /** O desenho dentro do ícone de app; sem ele, o da variante (no sucesso, o check que se desenha). */
  icone?: LucideIcon;
  titulo: ReactNode;
  /** A frase curta. */
  mensagem?: ReactNode;
  /** O conteúdo extra, embaixo da mensagem. */
  children?: ReactNode;
  /** Os botões, empilhados na ordem em que vêm (a ação em cima, o cancelar embaixo). */
  acoes: AcaoDoAlerta[];
  /** Enquanto grava: Esc e o clique fora não fecham. */
  preso?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const caixa = useRef<HTMLDivElement | null>(null);
  const { guardarVeu } = useSaidaAnimada(aberto);
  const fechar = () => {
    aoFechar?.();
    aoMudar?.(false);
  };

  // o foco abre na ação que não destrói: a última que não é de perigo (o cancelar vem embaixo); se todas são, a última
  const semPerigo = acoes.map((a) => a.tipo !== "perigo").lastIndexOf(true);
  const comFoco = semPerigo >= 0 ? semPerigo : acoes.length - 1;
  const Icone = icone ?? ICONE_DA_VARIANTE[variante];

  return (
    <Dialog.Root open={aberto} onOpenChange={(a) => (a ? aoMudar?.(true) : fechar())}>
      <Dialog.Portal>
        <Dialog.Overlay ref={guardarVeu} className="modal-fundo">
          <Dialog.Content
            role="alertdialog"
            ref={(no: HTMLDivElement | null) => {
              caixa.current = no;
              atribuir(ref, no);
            }}
            {...(mensagem ? {} : { "aria-describedby": undefined })}
            tabIndex={-1}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              focarAoAbrir(caixa.current);
            }}
            onEscapeKeyDown={(e) => {
              if (preso) e.preventDefault();
            }}
            onInteractOutside={(e) => {
              if (preso || isNoAviso(e.target)) e.preventDefault();
            }}
            className="alerta"
          >
            {Icone ? (
              <IconeDeApp variante={variante}>
                <Icone />
              </IconeDeApp>
            ) : (
              <CheckAnimado />
            )}
            <Dialog.Title className="alerta-titulo">{titulo}</Dialog.Title>
            {mensagem && (
              <Dialog.Description asChild>
                <div className="alerta-frase">{mensagem}</div>
              </Dialog.Description>
            )}
            {children && <div className="alerta-extra">{children}</div>}
            <div className="alerta-acoes">
              {acoes.map((a, i) => (
                <Botao
                  key={i}
                  tipo={BOTAO_DA_ACAO[a.tipo ?? "secundario"]}
                  tamanho="lg"
                  className="btn-largo"
                  carregando={a.carregando}
                  disabled={a.desligada}
                  data-foco-inicial={i === comFoco ? "" : undefined}
                  onClick={a.aoClicar}
                >
                  {a.rotulo}
                </Botao>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
