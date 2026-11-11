"use client";

// As telas de acesso (entrar, esqueci a senha, redefinir, criar conta,
// confirmar o e-mail) e a moldura pública delas: o kit desenha, o consumidor
// passa a chamada à API e os links (o Link do roteador dele). O token, o e-mail
// e quem pode se cadastrar são do backend de cada projeto.

import { CircleAlert, CircleCheck, Loader2, Lock, Mail, MailCheck, User, type LucideIcon } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { fraseDoErro } from "../aviso/aviso";
import { cn } from "../lib/cn";
import { Brasao, SeloDalBosco } from "../marca/marca";
import { Botao } from "../ui/botao";
import { Caixa, Campo, Rotulado } from "../ui/campo";
import { CampoDeSenha } from "../ui/campo-de-senha";
import { PAR_DO_TOM, type TomDoEmblema } from "../ui/emblema";

/**
 * A tela sem menu, dividida em duas: à esquerda o painel em azul cheio e à direita o formulário, no branco. O painel
 * `produto` (padrão) fala do produto: a marca, o título em frase grande, a frase de apoio, os `pontos` com ícone, a
 * `amostra` (um cartão branco com um pedaço do produto) e, no pé, o selo "Um produto da Dal Bosco Systems". O
 * painel `brasao` leva o brasão grande (o da própria Dal Bosco Systems, no hub), e aí o selo sai. Do lado do
 * formulário, `topo` é a linha do alto ("Ainda não usa?" com o link) e `pe`, os links de baixo (Termos,
 * Privacidade, Suporte). Até 860px o painel vira só uma faixa azul no alto, com a marca e o título, e o selo desce
 * para baixo do formulário. `marcaDoPainel` é a marca na versão clara, para o azul (sem ela, vale a `marca`).
 */
export function MolduraPublica({
  marca,
  marcaDoPainel = marca,
  rotulo,
  titulo,
  frase,
  pontos,
  amostra,
  rodape,
  painel = "produto",
  selo = painel === "produto",
  topo,
  pe,
  children,
}: {
  marca: ReactNode;
  marcaDoPainel?: ReactNode;
  /** A linha pequena acima do título do painel. */
  rotulo?: ReactNode;
  titulo?: ReactNode;
  frase?: ReactNode;
  /** Os pontos do painel do produto (três), cada um com o ícone no círculo. */
  pontos?: { icone: LucideIcon; texto: ReactNode }[];
  /** O conteúdo do cartão branco do painel do produto: uma amostra do que o produto mostra. */
  amostra?: ReactNode;
  /** A linha do pé do painel, embaixo do selo. */
  rodape?: ReactNode;
  painel?: "produto" | "brasao";
  selo?: boolean;
  topo?: ReactNode;
  pe?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-[minmax(0,1.1fr)_minmax(420px,1fr)] bg-superficie max-[860px]:grid-cols-1 max-[860px]:grid-rows-[auto_1fr]">
      <aside className="flex flex-col overflow-hidden bg-cobalto px-14 py-10 text-sobre-cobalto max-[860px]:px-5 max-[860px]:pt-[22px] max-[860px]:pb-6">
        {/* No painel do brasão a marca só aparece na faixa do celular: na tela larga o brasão já traz o nome. */}
        <div
          className={cn(
            "flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.01em]",
            painel === "brasao" && "min-[861px]:hidden",
          )}
        >
          {marcaDoPainel}
        </div>
        {painel === "produto" ? (
          <div className="my-auto py-8 max-[860px]:my-0 max-[860px]:py-0">
            {rotulo && <div className="mb-2 text-[13px] font-bold text-sobre-cobalto/85 max-[860px]:hidden">{rotulo}</div>}
            {titulo && (
              <h1 className="m-0 max-w-[520px] text-[38px] leading-[1.15] font-extrabold tracking-[-0.02em] max-[860px]:mt-[18px] max-[860px]:text-[22px]">
                {titulo}
              </h1>
            )}
            {frase && (
              <p className="m-0 mt-3.5 max-w-[480px] text-base leading-[1.55] text-sobre-cobalto/85 max-[860px]:hidden">{frase}</p>
            )}
            {pontos && pontos.length > 0 && (
              <ul className="m-0 mt-[26px] flex list-none flex-col gap-3 p-0 max-[860px]:hidden">
                {pontos.map(({ icone: Icone, texto }, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] font-bold">
                    <span aria-hidden className="grid size-[30px] shrink-0 place-items-center rounded-full bg-cabecalho-2">
                      <Icone className="size-4" />
                    </span>
                    {texto}
                  </li>
                ))}
              </ul>
            )}
            {amostra && (
              <div className="mt-[30px] max-w-[460px] rounded-bloco bg-superficie p-4 text-texto shadow-2 max-[860px]:hidden">
                {amostra}
              </div>
            )}
          </div>
        ) : (
          <div className="my-auto flex flex-col items-center gap-4 py-8 text-center max-[860px]:my-0 max-[860px]:items-start max-[860px]:gap-0 max-[860px]:py-0 max-[860px]:text-left">
            <Brasao className="w-[min(220px,60%)] max-[860px]:hidden" />
            {rotulo && <div className="text-[13px] font-bold text-sobre-cobalto/85 max-[860px]:hidden">{rotulo}</div>}
            {titulo && (
              <h1 className="m-0 text-[28px] leading-tight font-extrabold tracking-[-0.02em] max-[860px]:mt-[18px] max-[860px]:text-[22px]">
                {titulo}
              </h1>
            )}
            {frase && <p className="m-0 max-w-[420px] text-base leading-[1.55] text-sobre-cobalto/85 max-[860px]:hidden">{frase}</p>}
          </div>
        )}
        {(selo || rodape) && (
          <div className="flex flex-col items-start gap-3 max-[860px]:hidden">
            {selo && <SeloDalBosco sobreCobalto className="justify-start" />}
            {rodape && <div className="text-[13px] font-semibold text-sobre-cobalto/85">{rodape}</div>}
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-col px-14 py-10 max-[860px]:px-5 max-[860px]:pt-7 max-[860px]:pb-[22px]">
        {topo && (
          <div className="flex justify-end font-semibold text-texto-2 max-[860px]:hidden [&_a]:ml-1.5 [&_a]:font-extrabold [&_a]:text-cobalto [&_a:hover]:underline">
            {topo}
          </div>
        )}
        <div className="m-auto w-full max-w-[400px] py-6 max-[860px]:my-0 max-[860px]:py-0">
          {children}
          {selo && <SeloDalBosco tamanho="sm" className="mt-4 hidden max-[860px]:flex" />}
        </div>
        {pe && (
          <div className="flex justify-center gap-[18px] text-[13px] font-bold text-texto-3 max-[860px]:mt-7 max-[860px]:flex-wrap [&_a]:text-texto-2 [&_a:hover]:text-cobalto">
            {pe}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * O bloco de um formulário de acesso, solto no lado branco da moldura (sem cartão em volta): a linha de cima
 * (`rotulo`, só quando o app passa), o título, a frase, o conteúdo e os links do pé.
 */
export function CartaoDeAcesso({
  rotulo,
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
    <div className="w-full">
      {rotulo && <div className="mb-1 text-[13px] font-bold text-cobalto">{rotulo}</div>}
      <h2 className="m-0 text-[28px] leading-tight font-extrabold tracking-[-0.015em] text-texto max-[860px]:text-2xl">{titulo}</h2>
      {frase && <p className="m-0 mt-1.5 leading-normal text-texto-2">{frase}</p>}
      <div className="mt-[26px]">{children}</div>
      {links && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-extrabold [&_a]:text-cobalto [&_a:hover]:underline">
          {links}
        </div>
      )}
    </div>
  );
}

/** A faixa colorida que fica acima dos campos: a recusa, o que deu certo, o estado do link. */
function Faixa({
  tom,
  icone: Icone,
  papel,
  girando,
  children,
}: {
  tom: TomDoEmblema;
  icone: LucideIcon;
  papel: "alert" | "status";
  girando?: boolean;
  children: ReactNode;
}) {
  return (
    <div role={papel} className={cn("flex items-start gap-2.5 rounded-icone px-3.5 py-3 leading-[1.45] font-bold", PAR_DO_TOM[tom])}>
      <Icone aria-hidden className={cn("mt-px size-[18px] shrink-0", girando && "animate-spin")} />
      <span className="min-w-0">{children}</span>
    </div>
  );
}

/** A recusa que fica na tela (a senha errada, o link vencido), com a frase do erro da API. */
function Recusa({ frase }: { frase: string | null }) {
  if (!frase) return null;
  return (
    <Faixa tom="risco" icone={CircleAlert} papel="alert">
      {frase}
    </Faixa>
  );
}

/** O texto de um campo do formulário enviado (pelo `name`). */
function lido(dados: FormData, nome: string) {
  const v = dados.get(nome);
  return typeof v === "string" ? v : "";
}

/** O que deu certo, na faixa verde (o link enviado, a entrada aceita, a senha trocada). */
function Sucesso({ frase }: { frase: ReactNode }) {
  return (
    <Faixa tom="ganho" icone={CircleCheck} papel="status">
      {frase}
    </Faixa>
  );
}

/**
 * O formulário que espera a promessa do consumidor: guarda o "enviando", a
 * recusa e o "pronto" (o último envio deu certo). Os valores saem do FormData
 * do form, não do estado: o gerenciador de senhas preenche e envia antes de o
 * React ver o que entrou.
 */
function useEnvio() {
  const [enviando, setEnviando] = useState(false);
  const [recusa, setRecusa] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);
  const enviar = (fazer: (dados: FormData) => unknown) => async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setRecusa(null);
    setPronto(false);
    setEnviando(true);
    try {
      await fazer(dados);
      setPronto(true);
    } catch (erro) {
      setRecusa(fraseDoErro(erro));
    } finally {
      setEnviando(false);
    }
  };
  return { enviando, recusa, pronto, setRecusa, enviar };
}

/** O botão do formulário, em pílula na largura toda; enviando, o giro entra antes do texto. */
function BotaoDeEnviar({ enviando, children }: { enviando: boolean; children: ReactNode }) {
  return (
    <Botao type="submit" tipo="primario" tamanho="lg" className="w-full" carregando={enviando}>
      {children}
    </Botao>
  );
}

/**
 * O fim de um passo que não se repete (a senha trocada, a conta criada): a faixa fica no lugar do formulário, com
 * o passo seguinte embaixo.
 */
function Pronto({ frase, acao }: { frase: ReactNode; acao?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <Sucesso frase={frase} />
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
 * Entrar: o login (e-mail, por padrão) e a senha. `links` leva o "Criar conta"; `linkEsqueci` põe o "Esqueci minha
 * senha" na linha do rótulo da senha. `manterConectado` mostra a caixa "Manter conectado" (o valor é como ela
 * nasce, marcada ou não) e a escolha chega em `aoEntrar` como `manter`. Com `frasePronto`, a entrada aceita aparece
 * na faixa verde acima dos campos enquanto o app abre a tela seguinte.
 */
export function Entrar({
  aoEntrar,
  rotuloDoLogin = "E-mail",
  tipoDoLogin = "email",
  titulo = "Entrar",
  frase,
  links,
  linkEsqueci,
  manterConectado,
  rotuloDoManter = "Manter conectado neste aparelho",
  frasePronto,
}: {
  aoEntrar: (dados: { login: string; senha: string; manter: boolean }) => unknown;
  rotuloDoLogin?: string;
  tipoDoLogin?: "email" | "text";
  titulo?: ReactNode;
  /** O texto abaixo do título. */
  frase?: ReactNode;
  links?: ReactNode;
  linkEsqueci?: ReactNode;
  manterConectado?: boolean;
  rotuloDoManter?: ReactNode;
  /** A frase da faixa verde depois que `aoEntrar` dá certo; sem ela, nada aparece. */
  frasePronto?: ReactNode;
}) {
  const { enviando, recusa, pronto, enviar } = useEnvio();
  return (
    <CartaoDeAcesso titulo={titulo} frase={frase} links={links}>
      <form
        method="post"
        onSubmit={enviar((d) => aoEntrar({ login: lido(d, "login"), senha: lido(d, "senha"), manter: d.get("manter") === "on" }))}
        className="flex flex-col gap-4"
      >
        <Recusa frase={recusa} />
        {pronto && frasePronto && <Sucesso frase={frasePronto} />}
        <Rotulado rotulo={rotuloDoLogin}>
          <Campo
            name="login"
            type={tipoDoLogin}
            tamanho="lg"
            icone={tipoDoLogin === "email" ? Mail : User}
            autoComplete="username"
            required
            autoFocus
          />
        </Rotulado>
        <Rotulado rotulo="Senha" acao={linkEsqueci}>
          <CampoDeSenha name="senha" tamanho="lg" icone={Lock} autoComplete="current-password" required />
        </Rotulado>
        {manterConectado !== undefined && (
          <Caixa name="manter" defaultChecked={manterConectado} className="mb-1.5 self-start">
            {rotuloDoManter}
          </Caixa>
        )}
        <BotaoDeEnviar enviando={enviando}>Entrar</BotaoDeEnviar>
      </form>
    </CartaoDeAcesso>
  );
}

/**
 * Esqueci a senha: pede o link por e-mail. A resposta é a mesma exista ou não
 * a conta (não revela quem está cadastrado). Com `tipoDoLogin="text"` o campo
 * se chama `login` (com e-mail, `email`, como sempre). Depois de pedir, a
 * `frasePronto` fica na faixa verde acima do campo e o formulário continua à
 * vista (dá para pedir de novo).
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
  const { enviando, recusa, pronto, enviar } = useEnvio();
  const nome = tipoDoLogin === "email" ? "email" : "login";
  return (
    <CartaoDeAcesso titulo={titulo} frase={frase} links={links}>
      <form method="post" onSubmit={enviar((d) => aoPedir(lido(d, nome)))} className="flex flex-col gap-4">
        <Recusa frase={recusa} />
        {pronto && <Sucesso frase={frasePronto} />}
        <Rotulado rotulo={rotuloDoLogin}>
          <Campo
            name={nome}
            type={tipoDoLogin}
            tamanho="lg"
            icone={tipoDoLogin === "email" ? Mail : User}
            autoComplete={tipoDoLogin === "email" ? "email" : "username"}
            required
            autoFocus
          />
        </Rotulado>
        <BotaoDeEnviar enviando={enviando}>Enviar o link</BotaoDeEnviar>
      </form>
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
  /** O texto abaixo do título. */
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
  const { enviando, recusa, pronto, setRecusa, enviar } = useEnvio();
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
            void enviar((d) => aoRedefinir(lido(d, "senha")))(e);
          }}
          className="flex flex-col gap-4"
        >
          <Recusa frase={recusa} />
          <Rotulado rotulo="Senha nova" ajuda={ajuda ?? `Pelo menos ${minimo} caracteres.`}>
            <CampoDeSenha
              name="senha"
              tamanho="lg"
              icone={Lock}
              autoComplete="new-password"
              onChange={(e) => setSenha(e.target.value)}
              required
              autoFocus
            />
          </Rotulado>
          <Rotulado rotulo="Repita a senha" erro={problema ?? undefined}>
            <CampoDeSenha
              name="senha_repetida"
              tamanho="lg"
              icone={Lock}
              autoComplete="new-password"
              onChange={(e) => setRepetida(e.target.value)}
              required
            />
          </Rotulado>
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
  const { enviando, recusa, pronto, setRecusa, enviar } = useEnvio();
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
            void enviar((d) => aoCriar({ nome: lido(d, "nome"), email: lido(d, "email"), senha: lido(d, "senha") }, d))(e);
          }}
          className="flex flex-col gap-4"
        >
          <Recusa frase={recusa} />
          {contexto && (
            <div className="rounded-icone bg-superficie-2 px-3.5 py-3 text-[13px] leading-normal font-semibold text-texto-2">{contexto}</div>
          )}
          <Rotulado rotulo="Nome">
            <Campo name="nome" tamanho="lg" icone={User} autoComplete="name" defaultValue={valoresIniciais?.nome} required autoFocus />
          </Rotulado>
          <Rotulado rotulo="E-mail">
            <Campo name="email" type="email" tamanho="lg" icone={Mail} autoComplete="email" defaultValue={valoresIniciais?.email} required />
          </Rotulado>
          <Rotulado rotulo="Senha" ajuda={ajuda ?? `Pelo menos ${minimo} caracteres.`}>
            <CampoDeSenha
              name="senha"
              tamanho="lg"
              icone={Lock}
              autoComplete="new-password"
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Rotulado>
          <Rotulado rotulo="Repita a senha" erro={problema ?? undefined}>
            <CampoDeSenha
              name="senha_repetida"
              tamanho="lg"
              icone={Lock}
              autoComplete="new-password"
              onChange={(e) => setRepetida(e.target.value)}
              required
            />
          </Rotulado>
          {extras}
          <BotaoDeEnviar enviando={enviando}>Criar conta</BotaoDeEnviar>
        </form>
      )}
    </CartaoDeAcesso>
  );
}

const ESTADO_DO_LINK = {
  confirmando: { tom: "neutro", icone: Loader2, frase: "Conferindo o link…" },
  confirmado: { tom: "ganho", icone: MailCheck, frase: "E-mail confirmado. Já dá para entrar." },
  falhou: { tom: "risco", icone: CircleAlert, frase: "Este link não vale mais. Peça outro para confirmar o e-mail." },
} as const;

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
  const { tom, icone, frase: padrao } = ESTADO_DO_LINK[estado];
  return (
    <CartaoDeAcesso titulo="Confirmar o e-mail">
      <div className="flex flex-col gap-4">
        <Faixa tom={tom} icone={icone} papel="status" girando={estado === "confirmando"}>
          {frase ?? padrao}
        </Faixa>
        {estado !== "confirmando" && acao}
      </div>
    </CartaoDeAcesso>
  );
}
