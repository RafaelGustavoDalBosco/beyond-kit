// A página pública (a home, fora do login), no modelo "vitrine do produto": o cabeçalho, o herói com
// a tela do produto, as seções (como funciona, recursos), a chamada final no escuro e o rodapé com a assinatura da
// Dal Bosco Systems. O visual mora no publico.css (classes .pub-*); cada bloco funciona solto, na ordem que o
// projeto montar. Os textos, os links (o Link do roteador) e a imagem da tela são do projeto; o SEO e a rota também.

import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";
import { AssinaturaDalBosco } from "../marca/marca";

/** O cabeçalho preso no alto: a marca, os links das seções (somem na tela estreita) e as ações (Entrar e o botão
 * principal, que some no celular). */
export function CabecalhoPublico({ marca, links, acoes }: { marca: ReactNode; links?: ReactNode; acoes?: ReactNode }) {
  return (
    <header className="pub-topo">
      <div className="pub-envolve">
        <div className="pub-marca">{marca}</div>
        {links && <nav aria-label="Seções">{links}</nav>}
        {acoes && <div className="pub-topo-acoes">{acoes}</div>}
      </div>
    </header>
  );
}

/**
 * O herói, no fundo da página (nunca em azul cheio): a linha de cima (`rotulo`), o título (o trecho em <em> ganha a
 * cor de ação), a frase e os botões à esquerda, e a tela do produto à direita (empilha na tela estreita). `provas`
 * são as frases curtas de baixo ("ICMS, ST e PIS/COFINS"), com a parte forte em <b>.
 */
export function HeroiDoProduto({
  rotulo,
  titulo,
  frase,
  acoes,
  provas,
  midia,
}: {
  rotulo?: ReactNode;
  titulo: ReactNode;
  frase?: ReactNode;
  acoes?: ReactNode;
  provas?: ReactNode[];
  midia?: ReactNode;
}) {
  return (
    <section className={cn("pub-heroi", !midia && "is-sem-midia")}>
      <div className="pub-envolve">
        <div className="min-w-0">
          {rotulo && <span className="pub-rotulo">{rotulo}</span>}
          <h1>{titulo}</h1>
          {frase && <p className="pub-heroi-frase">{frase}</p>}
          {acoes && <div className="pub-heroi-botoes">{acoes}</div>}
          {provas && provas.length > 0 && (
            <div className="pub-provas">
              {provas.map((p, i) => (
                <span key={i}>{p}</span>
              ))}
            </div>
          )}
        </div>
        {midia && <div className="min-w-0">{midia}</div>}
      </div>
    </section>
  );
}

/** A moldura de uma tela do produto no herói (a barra com os três pontos, levemente inclinada); dentro vai a imagem
 * da tela ou o JSX dela. */
export function TelaDoProduto({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("pub-palco", className)}>
      <div className="pub-tela">
        <div aria-hidden className="pub-tela-barra">
          <i />
          <i />
          <i />
        </div>
        {children}
      </div>
    </div>
  );
}

/** Uma seção da home: a linha de cima (`rotulo`), o título e a frase, e o conteúdo. `id` é a âncora dos links do cabeçalho. */
export function SecaoPublica({
  id,
  rotulo,
  titulo,
  frase,
  children,
}: {
  id?: string;
  rotulo?: ReactNode;
  titulo?: ReactNode;
  frase?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="pub-secao">
      <div className="pub-envolve">
        {(rotulo || titulo || frase) && (
          <div className="pub-secao-cab">
            {rotulo && <span className="pub-rotulo">{rotulo}</span>}
            {titulo && <h2>{titulo}</h2>}
            {frase && <p>{frase}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Os passos de "como funciona", numerados (a ordem é a do processo). */
export function Passos({ itens }: { itens: { titulo: ReactNode; frase: ReactNode }[] }) {
  return (
    <ol className="pub-passos">
      {itens.map((p, i) => (
        <li key={i} className="pub-passo">
          <span aria-hidden className="pub-passo-n numero">
            {i + 1}
          </span>
          <h3>{p.titulo}</h3>
          <p>{p.frase}</p>
        </li>
      ))}
    </ol>
  );
}

/** A grade dos recursos: o ícone num quadrado neutro, o título e a frase. */
export function Recursos({ itens }: { itens: { icone: LucideIcon; titulo: ReactNode; frase: ReactNode }[] }) {
  return (
    <div className="pub-recursos">
      {itens.map(({ icone: Icone, titulo, frase }, i) => (
        <article key={i} className="pub-recurso">
          <div aria-hidden className="pub-recurso-ic">
            <Icone />
          </div>
          <h3>{titulo}</h3>
          <p>{frase}</p>
        </article>
      ))}
    </div>
  );
}

/** A chamada final: a faixa escura de ponta a ponta com a pergunta, a frase e o botão (o `Botao` primário do kit). */
export function ChamadaFinal({ titulo, frase, acao }: { titulo: ReactNode; frase?: ReactNode; acao?: ReactNode }) {
  return (
    <section className="pub-chamada">
      <div className="pub-envolve">
        <div className="min-w-0">
          <h2>{titulo}</h2>
          {frase && <p>{frase}</p>}
        </div>
        {acao && <div className="pub-chamada-acao">{acao}</div>}
      </div>
    </section>
  );
}

/** O rodapé público, o da home e o das telas sem login (o `rodape` da `MolduraPublica`): a marca e a frase do
 * produto, as colunas de links e, embaixo, a assinatura com o brasão da Dal Bosco Systems. */
export function RodapePublico({
  marca,
  sobre,
  colunas,
}: {
  marca: ReactNode;
  sobre?: ReactNode;
  colunas: { titulo: string; links: ReactNode[] }[];
}) {
  return (
    <footer className="pub-rodape">
      <div className="pub-envolve pub-rodape-grade" style={{ "--colunas": colunas.length || 1 } as CSSProperties}>
        <div className="min-w-0">
          <div className="pub-marca">{marca}</div>
          {sobre && <p className="pub-rodape-sobre">{sobre}</p>}
        </div>
        {colunas.map((c) => (
          <nav key={c.titulo} aria-label={c.titulo} className="pub-rodape-coluna">
            <b>{c.titulo}</b>
            <ul>
              {c.links.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="pub-rodape-assinatura">
        <AssinaturaDalBosco como="div" className="mt-0 pb-0" />
      </div>
    </footer>
  );
}
