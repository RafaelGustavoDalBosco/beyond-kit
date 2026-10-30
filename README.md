# @dalbosco/kit

O kit de UI da Dal Bosco Systems: Cobalto com a gramática do ArchFlow, só claro, só Sora. Fonte TypeScript e CSS, sem build: cada projeto compila com o Tailwind 4 dele. Para React 19 e Tailwind 4 (Next.js 15/16 ou Vite); projeto em React 18 ou Tailwind 3 sobe antes de adotar.

Adotam: beyond-data, dalbosco-systems (hub), beyond-metric, beyond-payments, beyond-rewards e ethos-integra. Fora: Dor3D e beyond-archflow.

## Adoção

1. **Instalar** o pacote pelo tarball da tag e os peers que faltarem:

   ```sh
   npm i https://github.com/RafaelGustavoDalBosco/beyond-kit/archive/refs/tags/v0.12.0.tar.gz
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

5. **As cores**: só por token (`bg-superficie`, `text-texto-2`, `text-cobalto`...), nunca hex. Sobre o `BlocoDestaque`, o texto é `text-destaque-texto` e o apagado `text-destaque-texto-2`; as séries de um gráfico são `serie-1` a `serie-5`, na ordem; o estado sobre o menu escuro é `lateral-aviso` e `lateral-ganho`.

6. **A gramática**: cobalto é ação e seleção, verde ganho, laranja o que pede ação, vermelho risco. Toda lista é master/detail (`MestreDetalhe`), em cartões: cada item da lista é um cartão e o detalhe vem em cartões ao lado; formulário e confirmação abrem em modal (`Modal`, `BotaoDeConfirmar`); o resultado de uma ação vai ao toast (`avisar`); número e código levam a classe `numero`; `titulo-secao` e `filete` nas fichas, nos detalhes e nos modais; o título da tela e o do registro em caixa alta; `rotulo` no texto em caixa alta apagado; `aurora` no alto da área de conteúdo.

## Componentes

- `Botao` (primario, secundario, fantasma, ganho, perigo, lateral; md, sm, icone, icone-sm; `asChild` dá o visual a um `Link` ou `<a>`; `carregando` e `textoCarregando`), `Tecla` (o kbd) e `BotaoDeCopiar` (só ícone em `icone`/`icone-sm`, `avisoAoCopiar`, `onClick`).
- `BarraDoTopo`: a barra presa no alto da área de conteúdo (ícone, trilha, título em caixa alta, ações). `useLugaresDoTopo`, `ProvedorDoTopo` e `NoTopo`: a ponte para a tela pôr a frase, as ações e o título dela na barra da casca (o exemplo está em `ui/topo.tsx`).
- `CabecaDaTela`: o alto da tela (rótulo, título em caixa alta, frase e ações).
- `CabecaDoRegistro` (com `BotaoDeVoltar` e a faixa de `indicadores`, que aceita `tom` e `progresso`), `Informacoes` (`solto` sem o cartão) e `Informacao` (rótulo à esquerda, valor à direita), `Historico` (um cartão por evento: criação, alteração, exclusão ou a ação livre com rótulo e tom, com o valor antigo riscado e o novo): a tela de um registro, como a obra e o cliente do ArchFlow.
- `Campo`, `Busca`, `CampoDeSenha` (com o olho), `Rotulado` (o rótulo liga ao controle do kit por id, sem envolvê-lo; `erro`, `ajuda`, `obrigatorio`, `opcional`, `acao`; controle nativo dentro dele leva `htmlFor` e o mesmo `id`), `AreaDeTexto`, `Escolha` (`vazio` troca ou tira a opção vazia; `children` para `optgroup`), `SimNao`, `Caixa`, `Alternativa` (o radio; `variante="cartao"`): os controles de formulário; `GradeDoFormulario` (2 a 8 colunas, de 5 para cima só no `xl`; o `Rotulado` estende com `ocupa`) e `SecaoDoFormulario` (o grupo na caixa cinza com título de seção); `CampoMoeda` (o R$ fixo, formata ao sair e no Enter, vazio é null; `comoTexto` para dinheiro em string decimal).
- `Segredo` e `SenhaGerada`: o que aparece uma vez só (a chave, o link, a senha), destacado e copiável.
- `Bloco`, `CabecaDoBloco`, `Destaque`: a unidade da tela e o número de destaque dentro dela.
- `BlocoDestaque`, `SeloDoDestaque`, `LinhaDoDestaque`: o "Cobalto claro", o número que abre a tela; `Indicador`: o cartão de número com ícone e filete.
- `Quadro`, `ColunaDoQuadro` (ponto da cor, contagem, legenda), `CartaoDoQuadro` (`href`, `aoAbrir`, `asChild`; `acoes` no pé, fora do clique): o quadro por situação (até 5 colunas), como o de clientes do ArchFlow.
- `Selo` (neutro, cobalto, ganho, aviso, risco, contorno; `comPonto`) e o tipo `Tom`.
- `Abas`, `TrilhoDeAbas` (`largo` ocupa a largura toda), `Aba` (`icone`, `contagem`), `ConteudoDaAba`: as abas segmentadas.
- `MestreDetalhe`, `ItemDaLista`, `GrupoDaLista`, `PaginasDaLista`: a lista de cartões à esquerda, o detalhe num cartão à direita (empilha abaixo de `lg`; `titulo` e `contagem` fazem a cabeça padrão da lista, com a busca e os filtros na `cabeca` embaixo; `GrupoDaLista` é o rótulo de grupo entre os cartões, com o valor à direita; `CarregarMais` é o pé da lista que vem aos pedaços, com `emBloco` no pé de um bloco; `embutido` tira o cartão do detalhe, para dentro de um bloco ou para o detalhe que monta os cartões dele; `ItemDaLista` com `href` ou `asChild` vira link e `em="linha"` põe ícone, texto e seta lado a lado).
- `Tabela` (TanStack Table; `meta.numero` alinha à direita, `meta.principal` fica com a sobra, `meta.quebra` deixa o texto em várias linhas, `meta.fixa` prende a coluna à esquerda, `meta.centro` centraliza, `meta.esconderAbaixo` some abaixo de sm/md/lg; `expandir` abre uma linha de detalhe embaixo, `podeAbrir` limita quais linhas abrem, `atributosDaLinha` põe data-*/aria-* no `<tr>`, `idDaLinha` mantém as linhas abertas quando os dados mudam, `vazio` aceita ReactNode; `classeDaLinha`, `grupo` para a faixa de título e o `footer` das colunas no rodapé) e o tipo `Pagina`.
- `Modal` e `Cancelar` (`rotulo`): o modal de ação (filete, título de seção, rodapé; fecha só pelo × ou Cancelar).
- `Nota`: o aviso que fica na tela, em linha (neutro, cobalto, ganho, aviso, risco); o resultado de uma ação continua no toast.
- `BotaoDeConfirmar`: o botão do que não se desfaz, com a confirmação em modal (`tipoDoConfirmar="primario"` quando não é risco, `rotuloDoCancelar`); `useConfirmar` para a confirmação que não nasce de um botão só (`await confirmar({...})`).
- `SemValor`, `Esqueleto`, `Carregando`, `Erro`, `Vazio` (`solto`, `icone`, `filete`): os estados (o rótulo e a frase vêm por prop).
- `Avisos`, `avisar`, `configurarAvisos`, `fraseDoErro`: o toast (e a frase da recusa que fica na tela).
- `Brasao` (`inteiro` ou `escudo`), `AssinaturaDalBosco` e `SeloDalBosco`: a marca da Dal Bosco Systems (as imagens vêm no pacote). A página pública (a home, fora do login) leva a `AssinaturaDalBosco` no pé, nunca as telas de dentro do app; todo login, a `MolduraPublica` com o painel do produto e o selo embaixo do cartão (o hub usa `painel="brasao"`).
- `CabecalhoPublico`, `HeroiDoProduto`, `TelaDoProduto`, `SecaoPublica`, `Passos`, `Recursos`, `ChamadaFinal`, `RodapePublico`: a página pública (a home, fora do login), no modelo "vitrine do produto". Toda home é montada com eles, nesta ordem: cabeçalho, herói com a tela do produto, como funciona (`Passos`), recursos, chamada final e rodapé (que já traz a `AssinaturaDalBosco`). Os textos, os links do roteador e a imagem da tela são do projeto; o SEO e a rota também.
- `MolduraPublica` (`painel` produto ou brasao, `selo`, `marcaDoPainel`), `CartaoDeAcesso`, `Entrar`, `EsqueciASenha`, `RedefinirASenha`, `CriarConta`, `ConfirmarEmail`: as telas de acesso, prontas e iguais em todo projeto. O kit só desenha: o consumidor passa a chamada à API (`aoEntrar`, `aoPedir`, `aoRedefinir`, `aoCriar`, que devolvem a promessa; a recusa aparece no cartão com a `fraseDoErro`) e os links do roteador dele em `links`. Títulos, frases e rótulos têm padrão e se trocam por prop (o `RedefinirASenha` serve para aceitar convite; o `CriarConta` recebe o `FormData` com os `extras`, `valoresIniciais` e `contexto`; o `EsqueciASenha` aceita usuário com `tipoDoLogin="text"`). O token do link, o e-mail, o limite de tentativas e quem pode criar conta são do backend de cada projeto.
- `CabecaDaFicha` (com `acoes`; título em caixa alta), `SecaoDaFicha` (título de seção, `selos` ao lado e `acao` à direita), `Codigo`, `Pares`, `Par` (`longo` não corta, `ocupa` estende), `Entidade`: as partes de uma ficha.
- `PilhaDeFichas`, `criarUsePilha`, `lerPilha`, `escreverPilha`, os tipos `Ficha`, `AdaptadorDaPilha`, `UsePilha`, `DefinicaoDaFicha`, `RegistroDeFichas`.
- `Paleta`, `useAtalhoDaBusca`, `usePausa`: a paleta Ctrl K (os grupos vêm do consumidor) e os tipos `GrupoDaPaleta`, `ItemDaPaleta`.
- `CartaoDoFormulario`, `CampoDoFormulario`, `Mes`, `BarraDeSalvar`: o formulário de parâmetros e a barra presa no pé.
- `SoltarArquivos`, `ListaDeArquivos`, `BarraDeProgresso` (`tom`), `LinhasComProblema` (as linhas recusadas da simulação de uma importação): a tela de envio de arquivos; `fetchComProgresso` (o `fetch` sobre XHR, com o progresso do envio e a resposta em stream) e `lerNdjson` (a resposta linha a linha, até o `resumo`), com `juntarArquivos`, `eZip`, `megabytes` e `tamanhoDoArquivo`.
- `cn` e a formatação pt-BR (`moeda`, `moedaUnitaria`, `numero`, `contagem`, `percentual`, `documento`, `ncm`, `data`, `dataHora`, `periodo`, `periodoLongo`, `iniciais`).

Adaptadores: `@dalbosco/kit/tanstack` (TanStack Router), `@dalbosco/kit/next` (App Router), `@dalbosco/kit/react-router` (React Router 6.4+ e 7) e `@dalbosco/kit/url` (app sem roteador: `pushState` e `popstate` direto) exportam `useAdaptadorDaPilha` e o `usePilha` pronto.

## O que não está no kit

O seletor de mês, as fichas da plataforma (produto, nota, fornecedor), os rótulos do `/rotulos`, o cliente da API e os erros dele (`ErroApi`, `ErroRede`): isso é de cada projeto, montado em cima do kit.

## Mudar o kit

- Uma linha de versão só: o projeto sempre sobe para a tag mais nova, nunca para um patch de versão antiga. Antes do bump, `gh release list -R RafaelGustavoDalBosco/beyond-kit` e o Release de cada tag desde a sua dizem o que muda para quem usa.
- Quem edita o kit é a sessão do kit ou a do hub (dalbosco-systems). A sessão de outro projeto nunca edita o kit: o que falta ela escreve no próprio projeto, no padrão do kit, e registra como candidato (ou como problema do kit) no ticket aberto do projeto **KIT** no hub (`ticket.py abertos KIT`), não no ticket do próprio projeto. Uma sessão só do kit lê esse ticket, junta os candidatos e solta a versão.
- Toda tag sai com o Release no GitHub: o que muda para quem usa e o comando do bump.
- Antes de cada tag: `npm i` e `npm run tipos` (o TypeScript mais novo dos projetos e o 5.7); a tag só sai com os dois limpos.
- Versão: o que só acrescenta sobe o patch ou o minor; o que muda a tela de quem já usa (como o `MestreDetalhe` empilhar no celular) sobe o minor e vai dito no commit, para os projetos saberem no bump.
