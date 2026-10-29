"use client";

// As telas de acesso (entrar, esqueci a senha, redefinir, criar conta,
// confirmar o e-mail) e a moldura pública delas: o kit desenha, o consumidor
// passa a chamada à API e os links (o Link do roteador dele). O token, o e-mail
// e quem pode se cadastrar são do backend de cada projeto.

import { CircleAlert, CircleCheck, Loader2, MailCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { fraseDoErro } from "../aviso/aviso";
import { cn } from "../lib/cn";
import { Botao } from "../ui/botao";
import { Brasao, SeloDalBosco } from "../marca/marca";
import { Campo, Rotulado } from "../ui/campo";
import { CampoDeSenha } from "../ui/campo-de-senha";

/**
 * A tela sem menu: o painel à esquerda e o cartão do formulário à direita,
 * com o selo "Um produto Dal Bosco Systems" embaixo. O painel `produto`
 * (padrão) é cobalto e fala do produto (a marca, o rótulo, o título e a
 * frase); o painel `brasao` é o cobalto escuro do menu com o brasão grande (o
 * da própria Dal Bosco Systems, no hub), e aí o selo sai. Abaixo de `lg` o
 * painel some e fica só a marca no alto do cartão. `marcaDoPainel` troca a
 * marca do painel cobalto (a versão clara), e `marca` fica no alto do cartão.
 */
export function MolduraPublica({
  marca,
  marcaDoPainel = marca,
  rotulo,
  titulo,
  frase,
  rodape,
  painel = "produto",
  selo = painel === "produto",
  children,
}: {
  marca: ReactNode;
  marcaDoPainel?: ReactNode;
  rotulo?: ReactNode;
  titulo?: ReactNode;
  frase?: ReactNode;
  rodape?: ReactNode;
  painel?: "produto" | "brasao";
  selo?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {painel === "produto" ? (
        <div className="hidden w-1/2 flex-col justify-between bg-cobalto p-12 text-sobre-cobalto lg:flex">
          <div className="flex items-center gap-3 text-xl font-semibold">{marcaDoPainel}</div>
          <div>
            {rotulo && <div className="rotulo mb-3 text-sobre-cobalto/80">{rotulo}</div>}
            {titulo && <h1 className="m-0 text-5xl leading-tight font-semibold tracking-[-0.02em] text-sobre-cobalto">{titulo}</h1>}
            {frase && <p className="mt-4 max-w-md text-sobre-cobalto/70">{frase}</p>}
          </div>
          <div className="text-xs text-sobre-cobalto/70">{rodape}</div>
        </div>
      ) : (
        <div className="hidden w-1/2 flex-col items-center justify-between bg-lateral p-12 text-lateral-ativo lg:flex">
          {rotulo ? <div className="rotulo self-start text-lateral-texto">{rotulo}</div> : <span />}
          <div className="flex w-full flex-col items-center gap-6 text-center">
            <Brasao className="w-[min(360px,80%)] drop-shadow-[0_8px_24px_rgb(0_0_0/0.35)]" />
            {titulo && <h1 className="m-0 max-w-md text-3xl leading-tight font-semibold tracking-[-0.02em]">{titulo}</h1>}
            {frase && <p className="m-0 max-w-md text-lateral-texto">{frase}</p>}
          </div>
          <div className="self-start text-xs text-lateral-texto">{rodape}</div>
        </div>
      )}
      <div className="flex w-full flex-col items-center justify-center gap-6 bg-fundo p-6 lg:w-1/2">
        <div className="flex items-center gap-3 text-lg font-semibold lg:hidden">{marca}</div>
        {children}
        {selo && <SeloDalBosco />}
      </div>
    </div>
  );
}

/** O cartão de um formulário de acesso: o filete, o rótulo, o título, a frase, o conteúdo e os links do pé. */
export function CartaoDeAcesso({
  rotulo = "Acesso",
  titulo,
  frase,
  links,
  children,
}: {
  rotulo?: ReactNode;
  titulo: ReactNode;
  frase?: ReactNode;
  links?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-bloco border border-linha bg-superficie shadow-1">
      <div className="filete" />
      <div className="p-6">
        <div className="rotulo">{rotulo}</div>
        <h2 className="m-0 mt-1 text-3xl font-semibold tracking-[-0.02em] text-texto">{titulo}</h2>
        {frase && <p className="m-0 mt-2 text-[13px] leading-relaxed text-texto-2">{frase}</p>}
        <div className="mt-6">{children}</div>
        {links && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-linha pt-4 text-[13px] [&_a]:text-cobalto [&_a:hover]:underline">
            {links}
          </div>
        )}
      </div>
    </div>
  );
}

/** A recusa que fica na tela (a senha errada, o link vencido), com a frase do erro da API. */
function Recusa({ frase }: { frase: string | null }) {
  if (!frase) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-controle bg-risco-suave px-3 py-2 text-[13px] text-risco">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{frase}</span>
    </div>
  );
}

/** O texto de um campo do formulário enviado (pelo `name`). */
function lido(dados: FormData, nome: string) {
  const v = dados.get(nome);
  return typeof v === "string" ? v : "";
}

/**
 * O formulário que espera a promessa do consumidor: guarda o "enviando" e a
 * recusa. Os valores saem do FormData do form, não do estado: o gerenciador
 * de senhas preenche e envia antes de o React ver o que entrou.
 */
function useEnvio() {
  const [enviando, setEnviando] = useState(false);
  const [recusa, setRecusa] = useState<string | null>(null);
  const enviar = (fazer: (dados: FormData) => unknown, depois?: () => void) => async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setRecusa(null);
    setEnviando(true);
    try {
      await fazer(dados);
      depois?.();
    } catch (erro) {
      setRecusa(fraseDoErro(erro));
    } finally {
      setEnviando(false);
    }
  };
  return { enviando, recusa, setRecusa, enviar };
}

function BotaoDeEnviar({ enviando, children }: { enviando: boolean; children: ReactNode }) {
  return (
    <Botao type="submit" tipo="primario" className="w-full" disabled={enviando}>
      {enviando ? <Loader2 className="animate-spin" /> : children}
    </Botao>
  );
}

/** O fim de um passo que deu certo (o link enviado, a senha trocada, o e-mail confirmado). */
function Pronto({ frase, acao }: { frase: ReactNode; acao?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div role="status" className="flex items-start gap-2 rounded-controle bg-ganho-suave px-3 py-2 text-[13px] text-ganho">
        <CircleCheck className="mt-0.5 size-4 shrink-0" />
        <span>{frase}</span>
      </div>
      {acao}
    </div>
  );
}

/** As frases do problema da senha nova; o consumidor troca as duas. */
type FrasesDaSenha = { fraseDoMinimo?: (minimo: number) => string; fraseDasSenhasDiferentes?: string };

/** Confere a senha nova: o mínimo e a repetição. Devolve a frase do problema, ou null. */
function problemaDaSenha(senha: string, repetida: string, minimo: number, frases: FrasesDaSenha) {
  if (senha.length < minimo) return frases.fraseDoMinimo?.(minimo) ?? `A senha precisa de pelo menos ${minimo} caracteres.`;
  if (senha !== repetida) return frases.fraseDasSenhasDiferentes ?? "As senhas não conferem.";
  return null;
}

/**
 * Entrar: o login (e-mail, por padrão) e a senha. `links` leva o "Esqueci a
 * senha" e o "Criar conta"; `linkEsqueci` põe o link à direita do rótulo da senha.
 */
export function Entrar({
  aoEntrar,
  rotuloDoLogin = "E-mail",
  tipoDoLogin = "email",
  titulo = "Entrar",
  links,
  linkEsqueci,
}: {
  aoEntrar: (dados: { login: string; senha: string }) => unknown;
  rotuloDoLogin?: string;
  tipoDoLogin?: "email" | "text";
  titulo?: ReactNode;
  links?: ReactNode;
  linkEsqueci?: ReactNode;
}) {
  const { enviando, recusa, enviar } = useEnvio();
  return (
    <CartaoDeAcesso titulo={titulo} links={links}>
      <form method="post" onSubmit={enviar((d) => aoEntrar({ login: lido(d, "login"), senha: lido(d, "senha") }))} className="flex flex-col gap-4">
        <Rotulado rotulo={rotuloDoLogin}>
          <Campo name="login" type={tipoDoLogin} autoComplete="username" required autoFocus />
        </Rotulado>
        <Rotulado rotulo="Senha" acao={linkEsqueci}>
          <CampoDeSenha name="senha" autoComplete="current-password" required />
        </Rotulado>
        <Recusa frase={recusa} />
        <BotaoDeEnviar enviando={enviando}>Entrar</BotaoDeEnviar>
      </form>
    </CartaoDeAcesso>
  );
}

/**
 * Esqueci a senha: pede o link por e-mail. A resposta é a mesma exista ou não
 * a conta (não revela quem está cadastrado). Com `tipoDoLogin="text"` o campo
 * se chama `login` (com e-mail, `email`, como sempre).
 */
export function EsqueciASenha({
  aoPedir,
  rotuloDoLogin = "E-mail",
  tipoDoLogin = "email",
  titulo = "Esqueci a senha",
  frase = "Digite o e-mail da sua conta e enviamos um link para criar uma senha nova.",
  links,
  frasePronto = "Se o e-mail estiver cadastrado, o link para criar uma senha nova chega em instantes.",
}: {
  aoPedir: (login: string) => unknown;
  rotuloDoLogin?: string;
  tipoDoLogin?: "email" | "text";
  titulo?: ReactNode;
  frase?: ReactNode;
  links?: ReactNode;
  frasePronto?: ReactNode;
}) {
  const [pronto, setPronto] = useState(false);
  const { enviando, recusa, enviar } = useEnvio();
  const nome = tipoDoLogin === "email" ? "email" : "login";
  return (
    <CartaoDeAcesso titulo={titulo} frase={!pronto && frase} links={links}>
      {pronto ? (
        <Pronto frase={frasePronto} />
      ) : (
        <form method="post" onSubmit={enviar((d) => aoPedir(lido(d, nome)), () => setPronto(true))} className="flex flex-col gap-4">
          <Rotulado rotulo={rotuloDoLogin}>
            <Campo name={nome} type={tipoDoLogin} autoComplete={tipoDoLogin === "email" ? "email" : "username"} required autoFocus />
          </Rotulado>
          <Recusa frase={recusa} />
          <BotaoDeEnviar enviando={enviando}>Enviar o link</BotaoDeEnviar>
        </form>
      )}
    </CartaoDeAcesso>
  );
}

/**
 * Redefinir a senha: a senha nova duas vezes, pelo link do e-mail (o token fica
 * com o consumidor). `ajuda` é a regra da senha. Serve também para aceitar o
 * convite e criar a primeira senha (`titulo`, `frase`, `rotuloDoBotao`, `frasePronto`).
 */
export function RedefinirASenha({
  aoRedefinir,
  minimo = 8,
  ajuda,
  titulo = "Senha nova",
  frase,
  rotuloDoBotao = "Trocar a senha",
  frasePronto = "Senha trocada. Já dá para entrar com ela.",
  fraseDasSenhasDiferentes,
  fraseDoMinimo,
  links,
  acaoPronto,
}: {
  aoRedefinir: (senha: string) => unknown;
  minimo?: number;
  ajuda?: ReactNode;
  titulo?: ReactNode;
  /** O texto acima dos campos. */
  frase?: ReactNode;
  rotuloDoBotao?: ReactNode;
  frasePronto?: ReactNode;
  links?: ReactNode;
  /** O que aparece depois de trocar (o link para entrar). */
  acaoPronto?: ReactNode;
} & FrasesDaSenha) {
  const frases = { fraseDoMinimo, fraseDasSenhasDiferentes };
  const [senha, setSenha] = useState("");
  const [repetida, setRepetida] = useState("");
  const [pronto, setPronto] = useState(false);
  const { enviando, recusa, setRecusa, enviar } = useEnvio();
  const problema = repetida ? problemaDaSenha(senha, repetida, minimo, frases) : null;
  return (
    <CartaoDeAcesso titulo={titulo} frase={!pronto && frase} links={!pronto && links}>
      {pronto ? (
        <Pronto frase={frasePronto} acao={acaoPronto} />
      ) : (
        <form
          method="post"
          onSubmit={(e) => {
            const dados = new FormData(e.currentTarget);
            const p = problemaDaSenha(lido(dados, "senha"), lido(dados, "senha_repetida"), minimo, frases);
            if (p) {
              e.preventDefault();
              setRecusa(p);
              return;
            }
            void enviar((d) => aoRedefinir(lido(d, "senha")), () => setPronto(true))(e);
          }}
          className="flex flex-col gap-4"
        >
          <Rotulado rotulo="Senha nova" ajuda={ajuda ?? `Pelo menos ${minimo} caracteres.`}>
            <CampoDeSenha name="senha" autoComplete="new-password" onChange={(e) => setSenha(e.target.value)} required autoFocus />
          </Rotulado>
          <Rotulado rotulo="Repita a senha" erro={problema ?? undefined}>
            <CampoDeSenha name="senha_repetida" autoComplete="new-password" onChange={(e) => setRepetida(e.target.value)} required />
          </Rotulado>
          <Recusa frase={recusa} />
          <BotaoDeEnviar enviando={enviando}>{rotuloDoBotao}</BotaoDeEnviar>
        </form>
      )}
    </CartaoDeAcesso>
  );
}

/**
 * Criar conta: nome, e-mail e senha duas vezes. `extras` entra antes do botão
 * (a empresa, o aceite dos termos); o `aoCriar` recebe o FormData como segundo
 * argumento, para ler os campos dos `extras` pelo `name`. `contexto` vai no
 * alto, acima dos campos (a conta de qual empresa). Depois de criar, a frase
 * manda confirmar o e-mail (`frasePronto` troca).
 */
export function CriarConta({
  aoCriar,
  minimo = 8,
  ajuda,
  extras,
  valoresIniciais,
  contexto,
  fraseDasSenhasDiferentes,
  fraseDoMinimo,
  links,
  frasePronto = "Conta criada. Enviamos um link para confirmar o seu e-mail.",
  acaoPronto,
}: {
  aoCriar: (dados: { nome: string; email: string; senha: string }, formulario: FormData) => unknown;
  minimo?: number;
  ajuda?: ReactNode;
  extras?: ReactNode;
  /** O nome e o e-mail já preenchidos (o convite). */
  valoresIniciais?: { nome?: string; email?: string };
  contexto?: ReactNode;
  links?: ReactNode;
  frasePronto?: ReactNode;
  acaoPronto?: ReactNode;
} & FrasesDaSenha) {
  const frases = { fraseDoMinimo, fraseDasSenhasDiferentes };
  const [senha, setSenha] = useState("");
  const [repetida, setRepetida] = useState("");
  const [pronto, setPronto] = useState(false);
  const { enviando, recusa, setRecusa, enviar } = useEnvio();
  const problema = repetida ? problemaDaSenha(senha, repetida, minimo, frases) : null;
  return (
    <CartaoDeAcesso titulo="Criar conta" links={!pronto && links}>
      {pronto ? (
        <Pronto frase={frasePronto} acao={acaoPronto} />
      ) : (
        <form
          method="post"
          onSubmit={(e) => {
            const dados = new FormData(e.currentTarget);
            const p = problemaDaSenha(lido(dados, "senha"), lido(dados, "senha_repetida"), minimo, frases);
            if (p) {
              e.preventDefault();
              setRecusa(p);
              return;
            }
            void enviar(
              (d) => aoCriar({ nome: lido(d, "nome"), email: lido(d, "email"), senha: lido(d, "senha") }, d),
              () => setPronto(true),
            )(e);
          }}
          className="flex flex-col gap-4"
        >
          {contexto && <div className="rounded-controle bg-superficie-2 px-3 py-2 text-[13px] text-texto-2">{contexto}</div>}
          <Rotulado rotulo="Nome">
            <Campo name="nome" autoComplete="name" defaultValue={valoresIniciais?.nome} required autoFocus />
          </Rotulado>
          <Rotulado rotulo="E-mail">
            <Campo name="email" type="email" autoComplete="email" defaultValue={valoresIniciais?.email} required />
          </Rotulado>
          <Rotulado rotulo="Senha" ajuda={ajuda ?? `Pelo menos ${minimo} caracteres.`}>
            <CampoDeSenha name="senha" autoComplete="new-password" onChange={(e) => setSenha(e.target.value)} required />
          </Rotulado>
          <Rotulado rotulo="Repita a senha" erro={problema ?? undefined}>
            <CampoDeSenha name="senha_repetida" autoComplete="new-password" onChange={(e) => setRepetida(e.target.value)} required />
          </Rotulado>
          {extras}
          <Recusa frase={recusa} />
          <BotaoDeEnviar enviando={enviando}>Criar conta</BotaoDeEnviar>
        </form>
      )}
    </CartaoDeAcesso>
  );
}

/**
 * Confirmar o e-mail: o estado do link que o consumidor conferiu na API
 * (`confirmando` enquanto espera). `acao` é o passo seguinte (entrar, pedir
 * outro link); `frase` troca a do estado (a recusa vinda da API).
 */
export function ConfirmarEmail({
  estado,
  frase,
  acao,
}: {
  estado: "confirmando" | "confirmado" | "falhou";
  frase?: ReactNode;
  acao?: ReactNode;
}) {
  const padrao = {
    confirmando: "Conferindo o link…",
    confirmado: "E-mail confirmado. Já dá para entrar.",
    falhou: "Este link não vale mais. Peça outro para confirmar o e-mail.",
  }[estado];
  return (
    <CartaoDeAcesso titulo="Confirmar o e-mail">
      <div className="flex flex-col gap-4">
        <div
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-controle px-3 py-2 text-[13px]",
            estado === "confirmando" && "bg-superficie-2 text-texto-2",
            estado === "confirmado" && "bg-ganho-suave text-ganho",
            estado === "falhou" && "bg-risco-suave text-risco",
          )}
        >
          {estado === "confirmando" && <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />}
          {estado === "confirmado" && <MailCheck className="mt-0.5 size-4 shrink-0" />}
          {estado === "falhou" && <CircleAlert className="mt-0.5 size-4 shrink-0" />}
          <span>{frase ?? padrao}</span>
        </div>
        {estado !== "confirmando" && acao}
      </div>
    </CartaoDeAcesso>
  );
}
