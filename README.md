# @dalbosco/kit

O kit de UI da Dal Bosco Systems: Cobalto com a gramática do ArchFlow, só claro, só Sora. Fonte TypeScript e CSS, sem build: cada projeto compila com o Tailwind 4 dele. Para React 19 e Tailwind 4 (Next.js 15/16 ou Vite); projeto em React 18 ou Tailwind 3 sobe antes de adotar.

Adotam: beyond-data, dalbosco-systems (hub), beyond-metric, beyond-payments, beyond-rewards e ethos-integra. Fora: Dor3D e beyond-archflow.

## Adoção

1. **Instalar** o pacote pelo tarball da tag e os peers que faltarem:

   ```sh
   npm i https://github.com/RafaelGustavoDalBosco/beyond-kit/archive/refs/tags/v0.3.2.tar.gz
   npm i radix-ui lucide-react class-variance-authority clsx tailwind-merge
   npm i @tanstack/react-table   # se usar a Tabela
   ```

   Nunca `github:` nem `git+https:`: o npm grava `git+ssh://` no lock e o `npm ci` do CI cai sem chave SSH. O tarball grava HTTPS com `integrity` e não pede git. O bump é trocar a tag na URL.

   `import { ... } from "@dalbosco/kit"` traz o núcleo inteiro (inclusive a `Tabela`, que pede o `@tanstack/react-table`); quem não a usa importa componente a componente por `@dalbosco/kit/ui/botao`, `@dalbosco/kit/ui/modal` etc.

2. **CSS**: no `globals.css` (Next) ou `index.css` (Vite):

   ```css
   @import "tailwindcss";
   @import "@dalbosco/kit/css";
   @source "../node_modules/@dalbosco/kit/src";
   ```

   Ajuste o caminho do `@source` à pasta do CSS. Sem Google Fonts: a Sora vem no pacote (`@font-face` no `kit.css`).

3. **Avisos** (o toast): `<Avisos />` uma vez na raiz e, se a API tiver um erro próprio, a frase dele:

   ```ts
   import { Avisos, avisar, configurarAvisos } from "@dalbosco/kit";
   configurarAvisos({ fraseDoErro: (erro) => (erro instanceof ErroApi ? erro.message : "A plataforma não respondeu.") });
   avisar.sucesso("Salvo."); avisar.erro(erro);
   ```

4. **Pilha de fichas** (o modal empilhado que mora na URL, `?ficha=produto:1001|nota:196`): o `usePilha` vem do adaptador do roteador e a moldura recebe o registro das fichas:

   ```tsx
   import { usePilha } from "@dalbosco/kit/next"; // ou /tanstack, /react-router, /url
   import { PilhaDeFichas } from "@dalbosco/kit";

   <PilhaDeFichas
     usePilha={usePilha}
     fichas={{
       produto: { icone: Package, rotulo: "Produto", titulo: (id) => <TituloDoProduto codigo={id} />, render: (id) => <FichaProduto codigo={id} /> },
     }}
   />
   ```

   Abrir de qualquer lugar: `usePilha().abrir({ tipo: "produto", id: "1001" })`; `abrirSo` abre do zero (uma linha de lista); `voltar`, `voltarPara(i)` e `fechar` descem a pilha, pelo histórico do navegador enquanto ele cobrir. Para restringir os tipos que a URL pode abrir: `criarUsePilha(useAdaptadorDaPilha, ["produto", "nota"] as const)`.

   No Next:
   - o pacote é fonte TypeScript: `transpilePackages: ["@dalbosco/kit"]` no `next.config`;
   - os arquivos do kit com estado ou evento já trazem `"use client"`; a moldura que monta a pilha e a paleta é client component;
   - o `useSearchParams` do adaptador pede um `<Suspense>` por volta (um só, em volta do conteúdo, da pilha e da paleta, basta).

5. **A gramática**: cobalto é ação e seleção, verde ganho, laranja o que pede ação, vermelho risco. Toda lista é master/detail (`MestreDetalhe`); formulário e confirmação abrem em modal (`Modal`, `BotaoDeConfirmar`); o resultado de uma ação vai ao toast (`avisar`); número e código levam a classe `numero`; `titulo-secao` e `filete` nas fichas, nos detalhes e nos modais; `rotulo` no texto em caixa alta apagado; `aurora` no alto da área de conteúdo.

## Componentes

- `Botao` (primario, secundario, fantasma, ganho, perigo; md, sm, icone, icone-sm; `asChild` dá o visual a um `Link` ou `<a>`) e `Tecla` (o kbd).
- `CabecaDaTela`: o alto da tela (rótulo, título, frase e ações).
- `Campo`, `Busca`, `Rotulado` (com `erro`, `ajuda` e `como="div"`), `AreaDeTexto`, `Escolha` (`vazio` troca ou tira a opção vazia; `children` para `optgroup`), `SimNao`, `Caixa`, `Alternativa` (o radio): os controles de formulário; `CampoMoeda` (o R$ fixo, formata ao sair, vazio é null).
- `Segredo` e `SenhaGerada`: o que aparece uma vez só (a chave, o link, a senha), destacado e copiável.
- `Bloco`, `CabecaDoBloco`, `Destaque`: a unidade da tela e o número de destaque dentro dela.
- `BlocoDestaque`, `SeloDoDestaque`, `LinhaDoDestaque`: o "Cobalto claro", o número que abre a tela; `Indicador`: o cartão de número com ícone e filete.
- `Selo` (neutro, cobalto, ganho, aviso, risco, contorno; `comPonto`) e o tipo `Tom`.
- `Abas`, `TrilhoDeAbas`, `Aba`, `ConteudoDaAba`: as abas segmentadas, com contagem.
- `MestreDetalhe`, `ItemDaLista`, `PaginasDaLista`: a lista à esquerda, o detalhe à direita (empilha abaixo de `lg`).
- `Tabela` (TanStack Table; `meta.numero` alinha à direita, `meta.principal` fica com a sobra, `meta.quebra` deixa o texto em várias linhas, `meta.fixa` prende a coluna à esquerda; `classeDaLinha`, `grupo` para a faixa de título e o `footer` das colunas no rodapé) e o tipo `Pagina`.
- `Modal` e `Cancelar`: o modal de ação (filete, título de seção, rodapé; fecha só pelo × ou Cancelar).
- `BotaoDeConfirmar`: o botão do que não se desfaz, com a confirmação em modal (`tipoDoConfirmar="primario"` quando não é risco).
- `SemValor`, `Esqueleto`, `Carregando`, `Erro`, `Vazio`: os estados (o rótulo e a frase vêm por prop).
- `Avisos`, `avisar`, `configurarAvisos`: o toast.
- `CabecaDaFicha` (com `acoes`), `Codigo`, `Pares`, `Par` (`longo` não corta, `ocupa` estende), `Entidade`: as partes de uma ficha.
- `PilhaDeFichas`, `criarUsePilha`, `lerPilha`, `escreverPilha`, os tipos `Ficha`, `AdaptadorDaPilha`, `UsePilha`, `DefinicaoDaFicha`, `RegistroDeFichas`.
- `Paleta`, `useAtalhoDaBusca`, `usePausa`: a paleta Ctrl K (os grupos vêm do consumidor) e os tipos `GrupoDaPaleta`, `ItemDaPaleta`.
- `CartaoDoFormulario`, `CampoDoFormulario`, `Mes`, `BarraDeSalvar`: o formulário de parâmetros e a barra presa no pé.
- `SoltarArquivos`, `ListaDeArquivos`, `BarraDeProgresso`: a tela de envio de arquivos; `fetchComProgresso` (o `fetch` sobre XHR, com o progresso do envio e a resposta em stream) e `lerNdjson` (a resposta linha a linha, até o `resumo`), com `juntarArquivos`, `eZip`, `megabytes` e `tamanhoDoArquivo`.
- `cn` e a formatação pt-BR (`moeda`, `moedaUnitaria`, `numero`, `contagem`, `percentual`, `documento`, `ncm`, `data`, `dataHora`, `periodo`, `periodoLongo`, `iniciais`).

Adaptadores: `@dalbosco/kit/tanstack` (TanStack Router), `@dalbosco/kit/next` (App Router), `@dalbosco/kit/react-router` (React Router 6.4+ e 7) e `@dalbosco/kit/url` (app sem roteador: `pushState` e `popstate` direto) exportam `useAdaptadorDaPilha` e o `usePilha` pronto.

## O que não está no kit

O seletor de mês, as fichas da plataforma (produto, nota, fornecedor), os rótulos do `/rotulos`, o cliente da API e os erros dele (`ErroApi`, `ErroRede`): isso é de cada projeto, montado em cima do kit.

## Mudar o kit

- A sessão de um projeto nunca edita o kit: o que falta ela escreve no próprio projeto, no padrão do kit, e registra no ticket como candidato. Uma sessão só do kit junta os candidatos e solta a versão.
- Antes de cada tag: `npm i` e `npm run tipos` (o TypeScript mais novo dos projetos e o 5.7); a tag só sai com os dois limpos.
- Versão: o que só acrescenta sobe o patch ou o minor; o que muda a tela de quem já usa (como o `MestreDetalhe` empilhar no celular) sobe o minor e vai dito no commit, para os projetos saberem no bump.
