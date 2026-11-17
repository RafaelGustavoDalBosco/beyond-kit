"use client";

// As telas de acesso (entrar, esqueci a senha, redefinir, criar conta,
// confirmar o e-mail) e a moldura pública delas: o kit desenha, o consumidor
// passa a chamada à API e os links (o Link do roteador dele). O token, o e-mail
// e quem pode se cadastrar são do backend de cada projeto.

import type { LucideIcon } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { fraseDoErro } from "../aviso/aviso";
import { cn } from "../lib/cn";
import { Brasao, SeloDalBosco } from "../marca/marca";
import { Botao } from "../ui/botao";
import { Caixa, Campo, Rotulado } from "../ui/campo";
import { CampoDeSenha } from "../ui/campo-de-senha";

/**
 * A tela sem menu, no modelo do Beyond Data, dividida em duas: à esquerda o painel escuro do produto (a família do
 * hint) e à direita o formulário, no fundo da página. O painel `produto` (padrão) fala do produto: a marca, o
 * `rotulo`, o título, a frase, os `pontos` com ícone, a `amostra` (um cartão claro com um pedaço do produto) e, no
 * pé, o selo "Um produto da Dal Bosco Systems" e o `rodape`. O painel `brasao` (o hub) leva o brasão inteiro no lugar
 * da marca, e aí o selo sai. Do lado do formulário, `topo` é a linha do alto ("Ainda não usa?" com o link) e `pe`, os
 * links de baixo (Termos, Privacidade, Suporte). Até 1020px o painel vira a faixa do alto, com a marca e o título, e o
 * selo desce para baixo do formulário. `marcaDoPainel` é a marca na versão para o escuro (sem ela, vale a `marca`).
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
  /** O conteúdo do cartão claro do painel do produto: uma amostra do que o produto mostra. */
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
    <div className={cn("pub pub-acesso", painel === "brasao" && "is-brasao")}>
      <aside className="pub-painel">
        <div>
          {/* no painel do brasão a marca só aparece na faixa da tela estreita: na larga o brasão já traz o nome */}
          <div className="pub-marca pub-painel-marca">{marcaDoPainel}</div>
          {painel === "produto" && (
            <div className="pub-painel-miolo">
              {rotulo && <span className="pub-rotulo">{rotulo}</span>}
              {titulo && <h2>{titulo}</h2>}
              {frase && <p className="pub-painel-frase">{frase}</p>}
              {pontos && pontos.length > 0 && (
                <ul className="pub-pontos">
                  {pontos.map(({ icone: Icone, texto }, i) => (
                    <li key={i}>
                      <b aria-hidden>
                        <Icone />
                      </b>
                      {texto}
                    </li>
                  ))}
                </ul>
              )}
              {amostra && <div className="pub-amostra">{amostra}</div>}
            </div>
          )}
        </div>
        {painel === "brasao" && (
          <div className="pub-painel-brasao">
            <Brasao className="w-[min(220px,60%)] max-[1020px]:hidden" />
            {rotulo && <span className="pub-rotulo max-[1020px]:hidden">{rotulo}</span>}
            {titulo && <h2>{titulo}</h2>}
            {frase && <p className="pub-painel-frase">{frase}</p>}
          </div>
        )}
        {(selo || rodape) && (
          <div className="pub-painel-pe">
            {selo && <SeloDalBosco sobreEscuro className="justify-start" />}
            {rodape && <div className="pub-painel-rodape">{rodape}</div>}
          </div>
        )}
      </aside>

      <div className="pub-acesso-lado">
        {topo && <div className="pub-acesso-topo">{topo}</div>}
        <div className="pub-cartao">
          {children}
          {selo && <SeloDalBosco tamanho="sm" className="mt-2.5 hidden max-[1020px]:flex" />}
        </div>
        {pe && <div className="pub-acesso-pe">{pe}</div>}
      </div>
    </div>
  );
}

/**
 * O bloco de um formulário de acesso, solto no lado do formulário da moldura (sem cartão em volta): a linha de cima
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
    <div className="flex w-full flex-col gap-[18px]">
      <div>
        {rotulo && <span className="pub-rotulo mb-1.5">{rotulo}</span>}
        <h1>{titulo}</h1>
        {frase && <p className="pub-cartao-frase">{frase}</p>}
      </div>
      {children}
      {links && <div className="pub-cartao-links">{links}</div>}
    </div>
  );
}

const AVISO_DO_TOM = { erro: "aviso-erro", positivo: "aviso-ok", neutro: "" } as const;

/** O aviso do Lastro acima dos campos (o sinal vem do próprio aviso): a recusa, o que deu certo, o link em conferência
 * (com o girador no lugar do sinal). */
function Faixa({
  tom,
  papel,
  girando,
  children,
}: {
  tom: keyof typeof AVISO_DO_TOM;
  papel: "alert" | "status";
  girando?: boolean;
  children: ReactNode;
}) {
  return (
    <div role={papel} className={cn("aviso", AVISO_DO_TOM[tom], girando && "items-center before:hidden")}>
      {girando && <span aria-hidden className="girador" />}
      <span className="min-w-0">{children}</span>
    </div>
  );
}

/** A recusa que fica na tela (a senha errada, o link vencido), com a frase do erro da API. */
function Recusa({ frase }: { frase: string | null }) {
  if (!frase) return null;
  return (
    <Faixa tom="erro" papel="alert">
      {frase}
    </Faixa>
  );
}

/** O texto de um campo do formulário enviado (pelo `name`). */
function lido(dados: FormData, nome: string) {
  const v = dados.get(nome);
  return typeof v === "string" ? v : "";
}

/** O que deu certo, no aviso verde (o link enviado, a entrada aceita, a senha trocada). */
function Sucesso({ frase }: { frase: ReactNode }) {
  return (
    <Faixa tom="positivo" papel="status">
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

/** O botão principal do formulário, na largura toda; enviando, o giro entra no lugar do texto. */
function BotaoDeEnviar({ enviando, children }: { enviando: boolean; children: ReactNode }) {
  return (
    <Botao type="submit" tipo="primario" tamanho="lg" className="w-full" carregando={enviando}>
      {children}
    </Botao>
  );
}

/**
 * O fim de um passo que não se repete (a senha trocada, a conta criada): o aviso fica no lugar do formulário, com
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
 * no aviso verde acima dos campos enquanto o app abre a tela seguinte.
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
  /** A frase do aviso verde depois que `aoEntrar` dá certo; sem ela, nada aparece. */
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
            autoComplete="username"
            required
            autoFocus
          />
        </Rotulado>
        <Rotulado rotulo="Senha" acao={linkEsqueci}>
          <CampoDeSenha name="senha" autoComplete="current-password" required />
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
 * `frasePronto` fica no aviso verde acima do campo e o formulário continua à
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
              autoComplete="new-password"
              onChange={(e) => setSenha(e.target.value)}
              required
              autoFocus
            />
          </Rotulado>
          <Rotulado rotulo="Repita a senha" erro={problema ?? undefined}>
            <CampoDeSenha
              name="senha_repetida"
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
            <div className="rounded-m bg-mesa px-3 py-2.5 text-texto-secundario">{contexto}</div>
          )}
          <Rotulado rotulo="Nome">
            <Campo name="nome" autoComplete="name" defaultValue={valoresIniciais?.nome} required autoFocus />
          </Rotulado>
          <Rotulado rotulo="E-mail">
            <Campo name="email" type="email" autoComplete="email" defaultValue={valoresIniciais?.email} required />
          </Rotulado>
          <Rotulado rotulo="Senha" ajuda={ajuda ?? `Pelo menos ${minimo} caracteres.`}>
            <CampoDeSenha
              name="senha"
              autoComplete="new-password"
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Rotulado>
          <Rotulado rotulo="Repita a senha" erro={problema ?? undefined}>
            <CampoDeSenha
              name="senha_repetida"
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
  confirmando: { tom: "neutro", frase: "Conferindo o link…" },
  confirmado: { tom: "positivo", frase: "E-mail confirmado. Já dá para entrar." },
  falhou: { tom: "erro", frase: "Este link não vale mais. Peça outro para confirmar o e-mail." },
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
  const { tom, frase: padrao } = ESTADO_DO_LINK[estado];
  return (
    <CartaoDeAcesso titulo="Confirmar o e-mail">
      <div className="flex flex-col gap-4">
        <Faixa tom={tom} papel="status" girando={estado === "confirmando"}>
          {frase ?? padrao}
        </Faixa>
        {estado !== "confirmando" && acao}
      </div>
    </CartaoDeAcesso>
  );
}
