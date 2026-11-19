"use client";

import { Check, Search, type LucideIcon } from "lucide-react";
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

// O campo é o `.input` do Lastro (34px, raio 7, a borda azul e o anel claro no foco, o cinza do desabilitado); com
// erro (`aria-invalid`, que o `Rotulado` com erro põe), a borda fica vermelha.
const base = "input placeholder:text-texto-apoio aria-invalid:border-erro aria-invalid:outline-erro-fundo";

const TAMANHO_DO_CAMPO = {
  md: "",
  lg: "h-12 px-3.5 text-enfase",
} as const;

// O ícone à esquerda e o recuo que o texto ganha por causa dele.
const ICONE_DO_CAMPO = {
  md: "left-2.5 size-4",
  lg: "left-3.5 size-[18px]",
} as const;

const RECUO_DO_ICONE = {
  md: "pl-8",
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
  /** `lg` é o campo de 48px do login e do celular. */
  tamanho?: keyof typeof TAMANHO_DO_CAMPO;
};

/** O campo de texto (`.input` do Lastro); dentro de um `Rotulado` com erro, a borda fica vermelha. */
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
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-texto-apoio", ICONE_DO_CAMPO[tamanho])}
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
        className={cn("pointer-events-none absolute top-1/2 -translate-y-1/2 text-texto-apoio", ICONE_DO_CAMPO.md)}
      />
      <input {...controle} type="search" className={cn(base, RECUO_DO_ICONE.md)} {...props} />
    </div>
  );
}

/**
 * O rótulo em cima (o `.field` do Lastro: 12px, cinza), o controle e, embaixo,
 * a ajuda ou o erro da validação (o controle do kit de dentro ganha a borda
 * vermelha). O `<label>` fica só no texto (`htmlFor`); os controles do kit de
 * dentro pegam o id dele sozinhos. Controle nativo de fora do kit: passe
 * `htmlFor` e o mesmo `id` no controle. `obrigatorio` põe o asterisco,
 * `opcional` o "(opcional)", `dica` o (?) que explica o termo e `acao` vai à
 * direita do rótulo (o "Esqueceu a senha?").
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
      className={cn("field flex min-w-0 flex-col", ocupa && "sm:col-span-(--ocupa)", className)}
      style={ocupa ? ({ "--ocupa": ocupa } as CSSProperties) : undefined}
    >
      <div className="mb-[5px] flex items-baseline gap-1.5">
        <label id={`${id}-rotulo`} htmlFor={id} className="text-apoio font-medio text-texto-secundario">
          {rotulo}
          {obrigatorio && (
            <>
              <span aria-hidden className="ml-0.5 text-texto-apoio">*</span>
              <span className="sr-only"> obrigatório</span>
            </>
          )}
        </label>
        {dica && <Dica conteudo={dica} />}
        {opcional && <span className="text-apoio text-texto-apoio">(opcional)</span>}
        {acao && <div className="ml-auto text-apoio">{acao}</div>}
      </div>
      <DoRotulado.Provider value={{ id, comErro: Boolean(erro) }}>{children}</DoRotulado.Provider>
      {ajuda && !erro && <span className="field-ajuda">{ajuda}</span>}
      {erro && (
        <span className="field-erro" role="alert">
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
    <div className={cn("grid grid-cols-1 gap-x-4 gap-y-3.5", COLUNAS_DA_GRADE[colunas], className)}>
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
      <h3 className="m-0 mb-3.5 flex items-center gap-2 border-b border-borda-suave pb-2 text-enfase font-forte text-texto">
        {Icone && <Icone aria-hidden className="size-4 shrink-0 text-texto-apoio" />}
        {titulo}
      </h3>
      {children}
    </section>
  );
}

/** O texto longo (a descrição, a mensagem): o mesmo contorno do campo, com altura livre. */
export function AreaDeTexto({ className, id, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...useControle(id)} className={cn(base, "min-h-[78px] resize-y py-2 leading-texto", className)} {...props} />;
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
    <select {...useControle(id)} className={cn(base, "cursor-pointer pr-2", className)} {...props}>
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

// A escolha segmentada: o `.seg`, o trilho recuado da mesa. Cada opção é um radio escondido no rótulo; a marcada
// sobe para a ficha, com o texto azul e a sombra pequena (o `.seg-opt.is-ativa`, pelo `has-checked`, que vale também
// sem `value`). O anel de foco vai por dentro.
const SEGMENTO =
  "seg-opt relative whitespace-nowrap has-checked:bg-ficha has-checked:font-medio has-checked:text-acao-texto has-checked:shadow-p has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-acao has-disabled:cursor-default has-disabled:opacity-45";

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
    <div role="radiogroup" {...useGrupo(id)} aria-label={rotulo} className={cn("seg max-w-full", className)}>
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
  semDado,
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  /** O terceiro estado à mostra, como a terceira opção (valor ""): "Sem dado", "Não informado". Sem ele, o vazio é
   * o clique de novo no segmento marcado. */
  semDado?: string;
}) {
  const gerado = useId();
  const opcoes: (readonly [string, string])[] = semDado ? [...SIM_NAO, ["", semDado]] : [...SIM_NAO];
  return (
    <div role="radiogroup" {...useGrupo(id)} aria-label={rotulo} className={cn("seg max-w-full", className)}>
      {opcoes.map(([v, r]) => (
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
              if (semDado !== undefined || required || value === undefined || String(value) !== v) return;
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

// O rótulo ao lado da caixa e da alternativa: o texto do corpo; desligado, apagado.
const AO_LADO = "inline-flex cursor-pointer items-center gap-2 text-base text-texto has-disabled:cursor-default has-disabled:opacity-45";

/** A caixa de seleção do Lastro (o `.caixa`: 14px, raio 2, o ✓ azul na caixa branca), com o rótulo ao lado. */
export function Caixa({ children, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
  return (
    <label className={cn(AO_LADO, className)}>
      <span className="relative flex size-3.5 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute inset-0 m-0 size-3.5 cursor-pointer appearance-none rounded-[2px] border border-borda-forte bg-campo checked:border-acao disabled:cursor-default disabled:border-borda disabled:bg-mesa"
          {...props}
        />
        <Check aria-hidden className="pointer-events-none relative size-2.5 text-acao-texto opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      {children && <span className="min-w-0 flex-1">{children}</span>}
    </label>
  );
}

// O cartão da escolha com explicação: sem o ponto do radio; o marcado leva a borda azul e o fundo azul claro (a
// seleção, como a linha aberta da tabela).
const ALTERNATIVA_EM_CARTAO =
  "relative flex min-w-0 cursor-pointer flex-col gap-0.5 rounded-m border border-borda bg-campo px-3 py-2.5 text-left text-base text-texto hover:border-borda-forte has-checked:border-acao has-checked:bg-acao-100 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-acao has-disabled:cursor-default has-disabled:opacity-45";

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
        {titulo && <span className="font-medio">{titulo}</span>}
        {descricao && <span className="text-apoio text-texto-apoio">{descricao}</span>}
        {children}
      </label>
    );
  return (
    <label className={cn(AO_LADO, className)}>
      <span className="relative flex size-3.5 shrink-0 items-center justify-center">
        <input
          type="radio"
          className="peer absolute inset-0 m-0 size-3.5 cursor-pointer appearance-none rounded-full border border-borda-forte bg-campo checked:border-acao disabled:cursor-default disabled:border-borda disabled:bg-mesa"
          {...props}
        />
        <span className="pointer-events-none relative size-1.5 rounded-full bg-acao opacity-0 peer-checked:opacity-100" />
      </span>
      {children && <span className="min-w-0 flex-1">{children}</span>}
    </label>
  );
}
