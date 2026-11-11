"use client";

import { Check, CircleAlert, Search, type LucideIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useId,
  type ChangeEvent,
  type ChangeEventHandler,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "../lib/cn";
import { Dica, type ConteudoDaDica } from "./dica";

// O contorno de todo campo: a borda, o anel azul no foco, o cinza do desabilitado e, com erro (`aria-invalid`), a
// borda e o anel vermelhos. A altura, o raio e o respiro vêm do tamanho.
const base =
  "w-full border-[1.5px] border-linha bg-superficie text-texto outline-none transition-[border-color,box-shadow] placeholder:text-texto-3 focus:border-cobalto focus:ring-3 focus:ring-cobalto-anel disabled:cursor-default disabled:bg-superficie-2 disabled:text-texto-3 aria-invalid:border-risco aria-invalid:focus:ring-risco-anel";

const TAMANHO_DO_CAMPO = {
  md: "h-[42px] rounded-controle px-3 text-sm",
  lg: "h-12 rounded-icone px-3.5 text-[15px]",
} as const;

// O ícone à esquerda e o recuo que o texto ganha por causa dele.
const ICONE_DO_CAMPO = {
  md: "left-3 size-4",
  lg: "left-3.5 size-[18px]",
} as const;

const RECUO_DO_ICONE = {
  md: "pl-9",
  lg: "pl-[42px]",
} as const;

/** O que o `Rotulado` em volta dá ao controle de dentro: o id (o `htmlFor` do rótulo) e se há erro. */
const DoRotulado = createContext<{ id: string; comErro: boolean } | undefined>(undefined);

/** O id e a marca de erro do controle: o id que veio por prop, senão o do `Rotulado` em volta; o erro pinta a borda. */
function useControle(id: string | undefined) {
  const doRotulado = useContext(DoRotulado);
  return { id: id ?? doRotulado?.id, "aria-invalid": doRotulado?.comErro || undefined };
}

/** O grupo de alternativas (a escolha segmentada) não é rotulável pelo `htmlFor`: aponta para o texto do rótulo,
 * que leva o id do controle mais `-rotulo` (o do `Rotulado` em volta; fora dele, o do `CampoDoFormulario`). */
function useGrupo(id: string | undefined) {
  const doRotulado = useContext(DoRotulado);
  const proprio = id ?? doRotulado?.id;
  const rotulado = doRotulado?.id ?? proprio;
  return { id: proprio, "aria-labelledby": rotulado ? `${rotulado}-rotulo` : undefined };
}

export type PropsDoCampo = InputHTMLAttributes<HTMLInputElement> & {
  /** O ícone à esquerda, quando ajuda a ler o campo (o mês, o e-mail). Com ele o campo ganha um invólucro da
   * largura do pai e o `className` segue no input: a classe de posição (`flex-1`, `col-span-2`, `w-48`) vai num
   * elemento de fora. */
  icone?: LucideIcon;
  /** `lg` é o campo de 48px do login. */
  tamanho?: keyof typeof TAMANHO_DO_CAMPO;
};

/** O campo de texto: 42px, com o anel azul no foco; dentro de um `Rotulado` com erro, a borda fica vermelha. */
export function Campo({ className, id, icone: Icone, tamanho = "md", ...props }: PropsDoCampo) {
  const controle = useControle(id);
  const campo = (
    <input
      {...controle}
      className={cn(base, TAMANHO_DO_CAMPO[tamanho], Icone && RECUO_DO_ICONE[tamanho], className)}
      {...props}
    />
  );
  if (!Icone) return campo;
  // O invólucro ocupa o que o input sozinho ocuparia: numa linha flex, sem a largura ele encolheria ao conteúdo.
  return (
    <div className="relative w-full min-w-0">
      <Icone
        aria-hidden
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-texto-3", ICONE_DO_CAMPO[tamanho])}
      />
      {campo}
    </div>
  );
}

/** O campo de busca, com a lupa à esquerda. */
export function Busca({ className, id, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const controle = useControle(id);
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-texto-3", ICONE_DO_CAMPO.md)}
      />
      <input {...controle} type="search" className={cn(base, TAMANHO_DO_CAMPO.md, RECUO_DO_ICONE.md)} {...props} />
    </div>
  );
}

/**
 * O rótulo em cima, o controle e, embaixo, a ajuda ou o erro da validação (a
 * frase com o ícone; o controle do kit de dentro ganha a borda vermelha). O
 * `<label>` fica só no texto (`htmlFor`); os controles do kit de dentro pegam o
 * id dele sozinhos. Controle nativo de fora do kit: passe `htmlFor` e o mesmo
 * `id` no controle. `obrigatorio` põe o asterisco, `opcional` o "(opcional)",
 * `dica` o (?) que explica o termo e `acao` vai à direita do rótulo (o
 * "Esqueceu a senha?").
 */
export function Rotulado({
  rotulo,
  erro,
  ajuda,
  htmlFor,
  obrigatorio,
  opcional,
  dica,
  acao,
  ocupa,
  className,
  children,
}: {
  rotulo: ReactNode;
  erro?: string;
  ajuda?: ReactNode;
  htmlFor?: string;
  obrigatorio?: boolean;
  opcional?: boolean;
  dica?: ConteudoDaDica;
  acao?: ReactNode;
  /** Dentro da `GradeDoFormulario`: quantas colunas o campo ocupa (a observação, o caminho do arquivo). */
  ocupa?: number;
  /** Aceito por compatibilidade: o rótulo já não envolve o controle. */
  como?: "label" | "div";
  className?: string;
  children: ReactNode;
}) {
  const gerado = useId();
  const id = htmlFor ?? gerado;
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-[5px]", ocupa && "sm:col-span-(--ocupa)", className)}
      style={ocupa ? ({ "--ocupa": ocupa } as CSSProperties) : undefined}
    >
      <div className="flex items-baseline gap-1.5">
        <label id={`${id}-rotulo`} htmlFor={id} className="text-[13px] font-bold text-texto">
          {rotulo}
          {obrigatorio && (
            <>
              <span aria-hidden className="ml-0.5 text-cobalto">*</span>
              <span className="sr-only"> obrigatório</span>
            </>
          )}
        </label>
        {dica && <Dica conteudo={dica} />}
        {opcional && <span className="text-[12.5px] font-semibold text-texto-3">(opcional)</span>}
        {acao && <div className="ml-auto text-[13px] font-bold [&_a]:text-cobalto [&_a:hover]:underline">{acao}</div>}
      </div>
      <DoRotulado.Provider value={{ id, comErro: Boolean(erro) }}>{children}</DoRotulado.Provider>
      {ajuda && !erro && <span className="text-[12.5px] leading-relaxed font-semibold text-texto-2">{ajuda}</span>}
      {erro && (
        <span className="flex items-center gap-[5px] text-[12.5px] font-bold text-risco">
          <CircleAlert aria-hidden className="size-3.5 shrink-0" />
          {erro}
        </span>
      )}
    </div>
  );
}

const COLUNAS_DA_GRADE = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
  7: "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7",
  8: "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8",
};

/** Os campos de um formulário em grade (duas colunas por padrão; uma só abaixo de `sm`); o `Rotulado` estende com
 * `ocupa`. De 5 colunas para cima, a grade chega a elas só no `xl` (2 no `sm`, 4 no `lg`). */
export function GradeDoFormulario({
  colunas = 2,
  className,
  children,
}: {
  colunas?: keyof typeof COLUNAS_DA_GRADE;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4", COLUNAS_DA_GRADE[colunas], className)}>
      {children}
    </div>
  );
}

/** Um grupo do formulário: o título de seção em frase (opcionalmente com ícone), o fio embaixo dele e os campos. */
export function SecaoDoFormulario({
  titulo,
  icone: Icone,
  children,
  className,
}: {
  titulo: ReactNode;
  icone?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h3 className="m-0 mb-4 flex items-center gap-2 border-b border-fio pb-2.5 text-[15px] font-extrabold text-texto">
        {Icone && <Icone aria-hidden className="size-4 shrink-0 text-cobalto" />}
        {titulo}
      </h3>
      {children}
    </section>
  );
}

/** O texto longo (a descrição, a mensagem): o mesmo contorno do campo, com altura livre. */
export function AreaDeTexto({ className, id, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...useControle(id)}
      className={cn(base, "h-auto min-h-[78px] resize-y rounded-controle px-3 py-2.5 text-sm leading-relaxed", className)}
      {...props}
    />
  );
}

/**
 * A escolha entre opções. A vazia é o traço (o campo sem resposta); `vazio`
 * troca o rótulo dela ("Todos", "Sem projeto") e `vazio={false}` a tira (a
 * escolha obrigatória). Os `children` entram depois das `opcoes` (os `optgroup`).
 */
export function Escolha({
  opcoes = [],
  vazio = "—",
  className,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { opcoes?: ReadonlyArray<readonly [string, string]>; vazio?: string | false }) {
  return (
    <select {...useControle(id)} className={cn(base, TAMANHO_DO_CAMPO.md, "cursor-pointer px-2.5", className)} {...props}>
      {vazio !== false && <option value="">{vazio}</option>}
      {opcoes.map(([valor, rotulo]) => (
        <option key={valor} value={valor}>
          {rotulo}
        </option>
      ))}
      {children}
    </select>
  );
}

// A escolha segmentada: o trilho cinza em pílula e, dentro, cada opção (um radio escondido no rótulo); a marcada
// fica branca.
const TRILHO_DOS_SEGMENTOS = "inline-flex max-w-full rounded-pilula bg-neutro-suave p-[3px]";

const SEGMENTO =
  "relative cursor-pointer rounded-pilula px-3.5 py-1.5 text-[13.5px] font-bold whitespace-nowrap text-texto-2 transition-[background-color,color,box-shadow] hover:text-texto has-checked:bg-superficie has-checked:text-texto has-checked:shadow-1 has-focus-visible:ring-3 has-focus-visible:ring-cobalto-anel has-disabled:cursor-default has-disabled:opacity-60";

// Sem `name`, o nome gerado só agrupa os radios (é ele que dá a seta do teclado): o `form` vazio os deixa sem
// formulário dono, fora do envio do `<form>` em volta, como o select sem nome.
const FORA_DO_ENVIO = "";

/** A escolha curta entre poucas opções lado a lado (Mês, Trimestre, Ano): `opcoes` em pares valor e rótulo, o
 * `valor` marcado e o `aoMudar`. Dentro de um `Rotulado`, o grupo leva o nome do rótulo. */
export function EscolhaSegmentada<V extends string = string>({
  opcoes,
  valor,
  aoMudar,
  name,
  id,
  disabled,
  className,
  "aria-label": rotulo,
}: {
  opcoes: ReadonlyArray<readonly [V, ReactNode]>;
  valor: V | null | undefined;
  aoMudar: (valor: V) => void;
  /** O nome do grupo no envio do formulário. */
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const gerado = useId();
  return (
    <div role="radiogroup" {...useGrupo(id)} aria-label={rotulo} className={cn(TRILHO_DOS_SEGMENTOS, className)}>
      {opcoes.map(([v, r]) => (
        <label key={v} className={SEGMENTO}>
          <input
            type="radio"
            className="sr-only"
            name={name ?? gerado}
            form={name === undefined ? FORA_DO_ENVIO : undefined}
            value={v}
            checked={valor === v}
            onChange={() => aoMudar(v)}
            disabled={disabled}
          />
          {r}
        </label>
      ))}
    </div>
  );
}

const SIM_NAO: ReadonlyArray<readonly [string, string]> = [
  ["true", "Sim"],
  ["false", "Não"],
];

/** O sim ou não, em escolha segmentada. Guarda o contrato do select que já foi: `value` "true", "false" ou vazio
 * (nenhum marcado) e o `onChange` com o `e.target.value`; com `value`, o clique no segmento já marcado desmarca
 * (volta ao vazio), a não ser com `required`. As outras props do select ficam aceitas, sem efeito. */
export function SimNao({
  value,
  defaultValue,
  onChange,
  name,
  id,
  disabled,
  required,
  className,
  "aria-label": rotulo,
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  const gerado = useId();
  return (
    <div role="radiogroup" {...useGrupo(id)} aria-label={rotulo} className={cn(TRILHO_DOS_SEGMENTOS, className)}>
      {SIM_NAO.map(([v, r]) => (
        <label key={v} className={SEGMENTO}>
          <input
            type="radio"
            className="sr-only"
            name={name ?? gerado}
            // O obrigatório fica no formulário mesmo sem nome: fora dele o envio não cobraria a resposta.
            form={name === undefined && !required ? FORA_DO_ENVIO : undefined}
            value={v}
            checked={value === undefined ? undefined : String(value) === v}
            defaultChecked={defaultValue === undefined ? undefined : String(defaultValue) === v}
            // Quem usa lê só o `e.target.value`, que o radio entrega igual ao select.
            onChange={onChange as unknown as ChangeEventHandler<HTMLInputElement> | undefined}
            // O vazio do select: o clique (ou o Espaço) no segmento já marcado desmarca. O clique no outro segmento
            // e a seta do teclado caem num radio ainda não marcado e saem pelo `onChange`.
            onClick={() => {
              if (required || value === undefined || String(value) !== v) return;
              onChange?.({ target: { value: "" }, currentTarget: { value: "" } } as unknown as ChangeEvent<HTMLSelectElement>);
            }}
            disabled={disabled}
            required={required}
          />
          {r}
        </label>
      ))}
    </div>
  );
}

/** A caixa de seleção: o quadrado azul com a marca quando ligada, com o rótulo ao lado. */
export function Caixa({ children, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
  return (
    <label className={cn("group inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-texto has-disabled:cursor-default has-disabled:opacity-60", className)}>
      <span className="relative flex size-[19px] shrink-0 items-center justify-center">
        <input type="checkbox" className="peer absolute inset-0 m-0 size-[19px] cursor-pointer appearance-none rounded-md border-[1.5px] border-linha-forte bg-superficie outline-none transition-[background-color,border-color,box-shadow] checked:border-cobalto checked:bg-cobalto hover:border-cobalto focus-visible:ring-3 focus-visible:ring-cobalto-anel disabled:cursor-default" {...props} />
        <Check aria-hidden className="pointer-events-none relative size-3 text-sobre-cobalto opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
      </span>
      {children && <span className="min-w-0 flex-1">{children}</span>}
    </label>
  );
}

const ALTERNATIVA =
  "group inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-texto has-disabled:cursor-default has-disabled:opacity-60";

// O cartão da escolha com explicação: sem o ponto do radio; o marcado leva a borda azul e o fundo azul claro.
const ALTERNATIVA_EM_CARTAO =
  "group relative flex min-w-0 cursor-pointer flex-col gap-0.5 rounded-icone border-[1.5px] border-linha bg-superficie px-3 py-2.5 text-left text-sm text-texto transition-[background-color,border-color,box-shadow] hover:border-linha-forte has-checked:border-cobalto has-checked:bg-cobalto-suave has-checked:ring-1 has-checked:ring-cobalto has-focus-visible:ring-3 has-focus-visible:ring-cobalto-anel has-disabled:cursor-default has-disabled:opacity-60";

/**
 * A alternativa (o radio): uma entre várias do mesmo `name`, com o ponto azul
 * quando marcada. `variante="cartao"` é a escolha em cartões com explicação
 * (marcada, borda azul e fundo azul claro): o `titulo` e a `descricao` saem no
 * desenho do kit, e os `children` entram depois deles.
 */
export function Alternativa({
  variante = "padrao",
  titulo,
  descricao,
  children,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  variante?: "padrao" | "cartao";
  /** No cartão: o nome da alternativa. */
  titulo?: ReactNode;
  /** No cartão: a frase que explica a alternativa. */
  descricao?: ReactNode;
  children?: ReactNode;
}) {
  if (variante === "cartao")
    return (
      <label className={cn(ALTERNATIVA_EM_CARTAO, className)}>
        <input type="radio" className="sr-only" {...props} />
        {titulo && <span className="font-extrabold">{titulo}</span>}
        {descricao && <span className="text-[12.5px] font-semibold text-texto-2">{descricao}</span>}
        {children}
      </label>
    );
  return (
    <label className={cn(ALTERNATIVA, className)}>
      <span className="relative flex size-[19px] shrink-0 items-center justify-center">
        <input type="radio" className="peer absolute inset-0 m-0 size-[19px] cursor-pointer appearance-none rounded-full border-[1.5px] border-linha-forte bg-superficie outline-none transition-[border-color,box-shadow] checked:border-cobalto hover:border-cobalto focus-visible:ring-3 focus-visible:ring-cobalto-anel disabled:cursor-default" {...props} />
        <span className="pointer-events-none relative size-[9px] rounded-full bg-cobalto opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      {children && <span className="min-w-0 flex-1">{children}</span>}
    </label>
  );
}
