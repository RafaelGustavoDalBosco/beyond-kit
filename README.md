# @dalbosco/kit

O kit de UI da Dal Bosco Systems: tokens, casca e componentes compartilhados pelos apps que o adotam. Chão azul-acinzentado, superfícies brancas de canto grande, sem borda e sem sombra; a lateral tingida, com o item marcado em azul cheio; a cor carrega o sentido (os blocos tingidos); vidro só no que flutua de verdade; azul só para interação. Letra Manrope, base de 16px. Tema claro (padrão) e escuro, a noite azulada da mesma família. Fonte TypeScript e CSS, sem build: cada projeto compila com o Tailwind 4 dele. Para React 19 e Tailwind 4 (Next.js 15/16 ou Vite).

Adotam: dalbosco-systems (hub), beyond-payments, beyond-rewards e ethos-integra. Fora: Dor3D, beyond-archflow, beyond-metric e o beyond-data, que tem UI própria.

**O kit é o pai.** Tokens, casca e componentes são iguais em todo produto. Cada produto liga a camada dele com `data-produto` no `<html>`, no CSS do próprio repositório, e só troca a marca e os tons de dado, além de acrescentar os componentes de domínio:

```css
/* globals.css do hub */
:root[data-produto="hub"] {
  --marca: var(--hint-fundo);       /* o quadrado da sigla em grafite */
  --marca-sobre: var(--hint-titulo);
}
```

O kit recebe conteúdo, ações e estados pela API dos componentes. Rotas, permissões, chamadas à API, textos e regras de domínio são do produto: o kit oferece a lista com o detalhe em modal e a prévia contextual; o produto escolhe mostrar uma nota, um produto ou um fornecedor.

A vitrine (o catálogo ao vivo) é a tela Kit do hub (`/kit`, aba Vitrine), na versão instalada nele: o fluxo de consulta com dados fictícios, os formatos pt-BR e cada peça solta. O tema troca pelo botão do cabeçalho.

## Adoção

1. **Instalar** o pacote pelo tarball da tag e os peers que faltarem:

   ```sh
   npm i https://github.com/RafaelGustavoDalBosco/beyond-kit/archive/refs/tags/v1.0.0.tar.gz
   npm i radix-ui lucide-react clsx tailwind-merge
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

   Ajuste o caminho do `@source` à pasta do CSS. Sem Google Fonts: a Manrope vem no pacote (`src/fontes`, com o `OFL-Manrope.txt`) e entra pelo `@font-face` do `tokens.css`; a pilha é `"Manrope","Segoe UI",-apple-system,BlinkMacSystemFont,"Onest",sans-serif`. A Onest (com o `OFL.txt`) fica no fim só como reserva dos sinais (↓ + ◇ ○ ◔ → ◑ ● ✕ ≈).

   Fora do CSS (favicon, `theme-color`, manifesto), o azul da marca é `#1D4ED8`.

3. **Tema e lateral antes de pintar**: o `SCRIPT_DO_TEMA` aplica o tema salvo e a lateral recolhida antes do primeiro quadro; sem escolha salva, fica o claro (nunca o tema do sistema) e a lateral aberta. Ele lê a chave padrão da lateral (`CHAVE_DA_LATERAL`); o app que passa outra `chaveDaLateral` ao `MenuLateral` não tem a recolhida aplicada antes de pintar.

   ```tsx
   // app/layout.tsx (Next): o arquivo não é "use client", então o layout de servidor lê o texto
   import { SCRIPT_DO_TEMA } from "@dalbosco/kit/script-do-tema";

   <html lang="pt-BR" data-produto="hub" suppressHydrationWarning>
     <head>
       <script dangerouslySetInnerHTML={{ __html: SCRIPT_DO_TEMA }} />
     </head>
   ```

   No Vite, o mesmo texto vai no `<head>` do `index.html`; quando a CSP bloqueia script inline, num arquivo do `public` (`<script src="/tema.js">`).

4. **Avisos e hint**, uma vez na raiz: `<Avisos />` (o toast, no rodapé, centrado) e `<CamadaDeHint />` (a janelinha escura que abre em qualquer elemento com `data-hint`, e `data-hint-titulo` e `data-hint-atalho` se quiser; é ela que mostra o nome dos itens da lateral recolhida). Se a API tiver um erro próprio, a frase dele:

   ```ts
   import { Avisos, CamadaDeHint, avisar, configurarAvisos } from "@dalbosco/kit";
   configurarAvisos({ fraseDoErro: (erro) => (erro instanceof ErroApi ? erro.message : "A plataforma não respondeu.") });
   avisar.sucesso("Salvo."); avisar.erro(erro);
   avisar.sucesso("3 itens rejeitados", { acao: { rotulo: "Desfazer", aoClicar: desfazer } });
   ```

   ```tsx
   <button data-hint="Exporta a lista filtrada" data-hint-titulo="Exportar" data-hint-atalho="Ctrl E">…</button>
   ```

5. **A casca**: o cabeçalho e a lateral são fixos, a página rola e o conteúdo recua pelos `RECUO_*`.

   ```tsx
   const [menu, setMenu] = useState(false);
   <CabecalhoDoApp sigla="BP" nome="Beyond Payments" contexto={<SeletorDeEmpresa />}
     busca={<BotaoDeBusca aoBuscar={abrirPaleta} />} sino={<Sino ... />} usuario={{ nome, papel }}
     itensDoUsuario={[...]} aoSair={sair} versao="v1.0.0" menuAberto={menu} aoAlternarMenu={() => setMenu(!menu)} />
   <MenuLateral sigla="BP" nome="Beyond Payments" hrefDaMarca="/" itens={itens} ativo={isARota} aberto={menu} aoFechar={() => setMenu(false)} Link={Link} />
   <BarraDeNavegacao itens={[{ rotulo: "Notas", href: "/notas" }, ...]} ativo={isARota} Link={Link} />
   <main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>
     <AreaDaTela respiro>...</AreaDaTela>
   </main>
   ```

6. **Detalhe e pilha de fichas**: o detalhe de um registro abre em modal centralizado, nunca em painel lateral; o que abre de dentro dele entra na pilha do mesmo modal (o "‹ Voltar" e a trilha no cabeçalho), nunca num modal por cima. Há duas pilhas:

   - **Na URL** (`?ficha=produto:1001|pedido:196`), o `PilhaDeFichas`: o `usePilha` vem do adaptador do roteador e a moldura recebe o registro das fichas.

     ```tsx
     import { usePilha } from "@dalbosco/kit/next"; // ou /tanstack, /react-router, /url
     import { PilhaDeFichas } from "@dalbosco/kit";

     <PilhaDeFichas
       usePilha={usePilha}
       fichas={{
         produto: { rotulo: "Produto", titulo: (id) => <TituloDoProduto codigo={id} />, render: (id) => <FichaProduto codigo={id} /> },
       }}
     />
     ```

     Abrir de qualquer lugar: `usePilha().abrir({ tipo: "produto", id: "1001" })`; `abrirSo` abre do zero (uma linha de lista); `voltar`, `voltarPara(i)` e `fechar` descem a pilha, pelo histórico do navegador enquanto ele cobrir. Para restringir os tipos que a URL pode abrir: `criarUsePilha(useAdaptadorDaPilha, ["produto", "pedido"] as const)`.

   - **Em memória**, o `ModalDoDetalhe` com o `usePilhaDoDetalhe`, para a leitura de uma linha da lista:

     ```tsx
     const detalhe = usePilhaDoDetalhe<{ tipo: "nota" | "produto"; id: string }>();
     <Lista aoAbrir={(id) => detalhe.abrirSo({ tipo: "nota", id })} />
     {detalhe.topo && (
       <ModalDoDetalhe aoFechar={detalhe.fechar} pilha={detalhe.trilha((f) => rotuloDe(f))} contexto="NF-e">
         <CabecaDoDetalhe titulo="NF-e 1284" selos={...} porque="..." />
         <AcoesDoDetalhe>...</AcoesDoDetalhe>
         <SecaoDoDetalhe titulo="Itens">
           <ItemDoDetalhe titulo="..." valor="..." aoAbrir={() => detalhe.abrir({ tipo: "produto", id })} />
         </SecaoDoDetalhe>
       </ModalDoDetalhe>
     )}
     ```

     O exemplo inteiro está em `ficha/Detalhe.tsx`.

   No Next:
   - o pacote é fonte TypeScript: `transpilePackages: ["@dalbosco/kit"]` no `next.config`;
   - os arquivos do kit com estado ou evento já trazem `"use client"`; a moldura que monta a pilha e a paleta é client component;
   - o `useSearchParams` do adaptador pede um `<Suspense>` por volta (um só, em volta do conteúdo, da pilha e da paleta, basta).

## As cores e as medidas

Só por token, nunca hex: o `kit.css` zera as paletas, os tamanhos de fonte, os pesos, os raios e as sombras padrão do Tailwind, e só os do kit existem como utilitário. O espaçamento (passo de 4px) e os pontos `sm`/`md`/`lg`/`xl` continuam os do Tailwind.

- **Superfícies**: `fundo` (o chão, `#EDF1F6`, atrás de tudo e do cabeçalho), `ficha` (a superfície branca: bloco, tabela, painel, modal), `campo`, `mesa` (o recuo dentro de uma superfície), `sub` (o cabeçalho de tabela dentro de painel), `busca` (a busca do cabeçalho), `hover` (a linha sob o cursor); `preenchimento` e `preenchimento-forte` (o controle em repouso e sob o cursor: segmentado, botão neutro, contador).
- **Texto e borda**: `texto`, `texto-secundario`, `texto-apoio`, `texto-fraco` (só glifo, ícone, traço e o exemplo do campo; nunca texto pequeno), `texto-inverso`; `borda` (o contorno do campo), `borda-suave` (o fio entre linhas e blocos), `borda-forte`; a rampa azul-acinzentada `neutro-200` a `neutro-900`.
- **Ação**: `acao` (`#1D4ED8`, o fundo do botão principal e do item marcado na lateral), `acao-viva` (`#2563EB`: seleção, foco, ícone ativo, caixa marcada), `acao-texto` (link e texto de ação), `acao-sobre` (texto sobre o azul e sobre os fundos cheios), `acao-foco` (o anel), `acao-100` (o fundo do selecionado), `acao-200`, `acao-300`, `acao-400`, `acao-700` (`#1E40AF`, o hover do principal), `acao-800` (o texto da aba e do filtro escolhidos).
- **Marca**: `--marca` e `--marca-sobre`, o quadrado da sigla na lateral e no cabeçalho (o azul de ação por padrão); é o que a camada do produto troca.
- **Sentido**: `positivo` (verde: entrou, deu certo, ganho), `destaque` (roxo: o segundo realce, que não é ação), `atencao` (laranja: risco, vencido, atrasado, pede olho). Cada um tem o `-fundo` (o fundo do selo), o `-bloco` (o fundo tingido do bloco do tom) e o `-forte` (o texto sobre o bloco). `positivo-sobre-escuro`. `erro` e `erro-fundo`, só para falha de sistema e ação sem volta; `erro-forte` (o fundo do botão sem volta); `ok` (gravou, conferido, o ponto de "em dia"). Os fundos vivos do ícone do alerta: `erro-vivo`, `atencao-viva`, `neutro-vivo`.
- **Estados de um registro**, sempre com o sinal: `estado-aberto` ○, `estado-marcado` ◔, `estado-andamento` →, `estado-aplicado` ◑, `estado-concluido` ●, `estado-erro` ✕, `estado-cancelado` (riscado), `estado-conferir` ?; os seis primeiros com o `-fundo`. Só o erro tem cor e fundo próprios: os outros são tinta. O `Selo estado="..."` já desenha.
- **Séries** de gráfico, legenda e ponto de aba: `serie-1` a `serie-5`, na ordem, azuis-acinzentados calmos longe do sentido e do azul de ação (o dado é tinta).
- **Lateral**: `bg-lateral` e `bg-lateral-hover` (os tokens `--lateral-fundo` e `--lateral-hover`); o item marcado vem de `--lateral-ativo` (o azul de ação) e `--lateral-ativo-texto`.
- **Materiais** (o vidro, só no que flutua): `material-barra` (pé do modal, barra do celular), `material-menu` (menu, toast, barra do lote, paleta), `material-alerta`; `seg-indicador` (o indicador que desliza no segmentado). O desfoque vem de `--desfoque-barra`, `--desfoque-menu` e `--desfoque-veu`, e o reflexo das bordas de `--brilho`.
- **Escuros**: `hint`, `hint-titulo`, `hint-texto` (o hint, a chamada final da home e o painel do brasão); `veu`; `painel`, `painel-2`, `painel-3`, `painel-linha`, `painel-texto`, `painel-texto-2`, `painel-texto-3`, `painel-destaque` (o painel de TV, sempre escuro); `brasao-ouro`.
- **Fonte**: `text-micro` (12, o piso), `text-apoio` (14), `text-tabela` (15, o corpo das tabelas), `text-base` (16), `text-base-celular` (16), `text-botao-celular` (16), `text-enfase` (17), `text-subtitulo` (20), `text-titulo` (24), `text-numero-p` (26), `text-numero-m` (32), `text-numero-g` (40), `text-numero-xg` (60). Pesos: `font-normal` (400), `font-medio` (500), `font-forte` (700). `leading-texto`, `leading-titulo`, `leading-numero` e `tracking-titulo`. Texto nunca abaixo de 12px.
- **Raios**, maiores quanto maior a superfície: `rounded-p` (8: selo, caixa de seleção, tecla), `rounded-m` (12: botão, campo, item de navegação, item de menu), `rounded-grupo` (18: lista agrupada, menu flutuante, toast, área recuada), `rounded-g` (18: superfície, painel, cartão), `rounded-modal` (24), `rounded-alerta` (28), `rounded-pilula` (filtros, contador).
- **Sombras**, só no que flutua (superfície não tem sombra): `shadow-p` (o controle sobre o fundo, o indicador do segmentado), `shadow-m` (menu, barra flutuante, toast), `shadow-g` (modal, alerta), `shadow-controle` (a bolinha do interruptor) e `shadow-acao` (o botão principal, que não tem sombra).
- **Movimento**, curto e pelos tokens: `--dur-1` (120ms, pressão e hover), `--dur-2` (200ms, troca de estado), `--dur-3` (320ms, o que desliza), `--dur-4` (460ms, a entrada do modal); `--curva`, `--curva-saida` (desacelera ao entrar) e `--curva-mola` (passa do ponto e volta). Com "reduzir movimento" ligado no sistema, tudo vira troca imediata. Animações: `animate-entrar`, `animate-subir`, `animate-deslizar`, `animate-folha`, `animate-surgir` (espera 200 ms invisível), `animate-correr`.
- **Casca**: `--topo-altura` (68px), `--trilha-altura` (36px), `--lateral-largura` (248px), `--lateral-recolhida` (76px), `--conteudo-largura` (1320px) e a `--coluna-lateral` (a faixa que a lateral ocupa: 248 aberta, 76 recolhida, 0 até 960px e sem lateral).
- **Variantes**: `celular:` (abaixo de 640px) e `mesa:` (640px para cima). Utilitários: `numero` (algarismos tabulares; o `body` já liga) e `sem-barra`.

O tema escuro é só a troca das variáveis sob `<html data-tema="escuro">`: nenhuma classe `dark:`, e nenhum componente sabe qual tema está ativo. O produto troca só a marca e os tons de dado; o azul de ação, os tons de sentido, o vermelho do erro, o foco, as superfícies e os materiais são do kit.

Os arquivos: `tokens.css` (os valores, nos dois temas, e as fontes), `componentes.css` (o visual dos componentes), `casca.css` (o cabeçalho, a lateral, a trilha e a barra do celular), `modal.css` (o modal, o alerta e a ficha do detalhe) e `publico.css` (a home e as telas sem login); o `kit.css` importa todos e liga os tokens ao Tailwind.

## A gramática

- Azul só para interação: link, botão, seleção, foco, o item marcado na lateral. Nenhum dado é azul: número e barra de gráfico ficam na tinta do texto, dos neutros, das séries ou dos tons de sentido.
- A cor carrega o sentido: verde para o favorável, roxo para o segundo realce, laranja para o risco e o que pede olho; vermelho só para falha de sistema e ação sem volta. Sempre com texto, sinal ou ícone. O produto diz o que o valor significa (uma queda pode ser economia numa tela e perda em outra); o kit só apresenta.
- Superfície branca sobre o chão, de canto grande, sem borda e sem sombra. Vidro só no que flutua de verdade: menus, toast, alertas, véu, barra do lote, pé do modal, barra do celular. O cabeçalho e a lateral são opacos. Leitura, tabela e dado ficam em superfície opaca.
- Parâmetro binário é o `Interruptor`; marcar registros de uma lista é a `Caixa`. Quando o parâmetro tem três estados, as três opções ficam à mostra (`SimNao semDado`). Trocar a visão sem trocar de tela é o `Segmentado`.
- Estado é sinal mais texto, nunca só cor (o `Selo estado`: o círculo que enche ○ ◔ ◑ ●, → a caminho, ✕ erro, ? para conferir). O sentido também leva sinal: o `Selo` com `tom` o desenha (✓ positivo, + destaque, ◇ atenção, ✕ erro, → andamento, • ação), e as classes `.positivo`, `.destaque` e `.atencao` do CSS põem ↓, + e ◇ no selinho tonal antes do valor.
- Estimativa: `.estimativa`, com o ≈ e o pontilhado embaixo (no gráfico, a barra pontilhada). Sem dado: `SemValor` ("sem dado", no texto de apoio), nunca zero nem travessão.
- Números tabulares e à direita (`numero`, `meta.numero` na `Tabela`). Títulos em frase, peso 700, nunca em caixa alta.
- O detalhe de um registro abre em modal centralizado (`ModalDoDetalhe`, `PilhaDeFichas`, `MestreDetalhe`), nunca em painel lateral; o que abre de dentro dele entra na pilha do mesmo modal. O formulário abre no `Modal`, por cima; a confirmação é o `Alerta` (`BotaoDeConfirmar`, `useConfirmar`); o resultado de uma ação vai ao toast (`avisar`), no rodapé.
- Carregamento: na primeira carga, o esqueleto no formato da tela (`Carregando`); ao recarregar o que já está na tela (outra aba, outro filtro, outro mês), a barra fina e a lista antiga apagada no lugar (`BarraDeCarga`, `Recarregando`); nunca um giro no meio da tela vazia.
- A casca: o `MenuLateral` preso à borda, opaco e tingido, de 248px, que recolhe a 76px (só os ícones, o nome na dica) e fica lembrado no navegador; o `CabecalhoDoApp` de 68px, no chão, à direita dela; a trilha de 36px (`BarraDoTopo`) presa sob o cabeçalho. Até 960px a lateral sai da tela e desliza da esquerda sobre o véu, aberta pelo ☰, e a marca passa ao cabeçalho; no celular (abaixo de 640px), a `BarraDeNavegacao` de vidro embaixo e o modal ocupa a tela (o alerta segue no meio). O conteúdo recua com `<main className={cn(RECUO_DO_CABECALHO, RECUO_DO_MENU, RECUO_DA_BARRA)}>` e vai até 1320px de largura (`AreaDaTela`).
- Regra de domínio não é do kit: nada fiscal, nenhuma regra de negócio. A particularidade de cada produto (qual estado é "Vencida", "Baixa confiança") o projeto monta sobre os tokens do kit; candidato ao kit só se servir a mais de um produto.

## Componentes

### Base

- `Botao` (`tipo`, `tamanho`, `asChild`, `carregando`, `textoCarregando`) e os tipos `BotaoProps`, `TipoDoBotao` e `TamanhoDoBotao`. Tipos: `primario` (o azul cheio, sem sombra, um por área), `secundario` (padrão) e `neutro` (o cinza do preenchimento; o neutro para o Cancelar), `tonal` (a ação de apoio, no azul claro com o texto azul), `fantasma` (só o texto azul), `positivo` (o verde cheio), `perigo` (o vermelho tonal: o botão que abre a confirmação de apagar, a saída que descarta), `perigo-cheio` (o vermelho cheio, só a ação sem volta) e `lateral` (o item discreto). Tamanhos: `lg` de 50px (o alerta, o login e o celular), `alto` de 44 (o pé do modal), `md` de 36 (padrão), `sm` de 28, `icone` de 36 e `icone-sm` de 28; só o ícone em fantasma, neutro ou lateral é o `.btn-icon` redondo, sem fundo até o mouse passar. Raio 12; ao apertar encolhe 3%. `asChild` dá o visual a um `Link` ou `<a>`; `carregando` põe o girador e desabilita, `textoCarregando` troca o texto; desabilitado, fica a 38% e guarda o `title` no hover.
- `Tecla`: o `kbd` de um atalho.
- `BotaoDeCopiar` (`valor`, `rotulo`, `copiado`, `avisoAoCopiar`, `onClick` e as props do `Botao`): neutro por padrão; só o ícone em `icone`/`icone-sm`; copiado, o ✓ no verde de ok por 1,4 s.
- `BotaoDoTema` (a lua no claro, o sol no escuro; já vem no `CabecalhoDoApp`), `useTema` (`"claro"` ou `"escuro"`), `alternarTema` (troca e salva neste navegador), `iniciarTema` (aplica a escolha salva), `SCRIPT_DO_TEMA` e o tipo `Tema`.
- `CamadaDeHint`: o hint, montado uma vez na raiz. Abre depois de 400 ms com o mouse parado ou com o foco pelo teclado (o foco pelo clique não abre); fecha ao sair, ao rolar, com Esc ou quando o elemento sai do documento (e, nesse caso, nem chega a abrir); abre embaixo e sobe se não couber; nunca recebe clique. No celular abre ao tocar no elemento que não é link nem botão. `HintEstatico` (`titulo`, `texto`, `atalho`) é o hint parado, para a vitrine.
- `Dica` (o (?)) e `TermoComDica` (o termo sublinhado em pontos, para cabeçalho de tabela e texto corrido): o balão escuro do hint, que abre com o mouse em cima e fica aberto com o clique ou o toque. `conteudo` em texto é o balão curto; `{ titulo, texto, exemplo }` é o completo; o tipo `ConteudoDaDica`. `Rotulado` e `Par` têm a prop `dica`. Só nos termos difíceis, com os textos num glossário único do app.
- `Emblema` (`icone` ou `sigla`; `tom` neutro, acao, positivo, destaque, atencao, erro ou andamento; `tamanho` xs, sm, md ou lg; `cheio`), `PAR_DO_TOM` e o tipo `TomDoEmblema`: o quadrado de raio 12 no fundo recuado, com o ícone ou a sigla no traço do tom; `cheio` pinta o quadrado no par claro/forte do tom.
- `Selo` (`tom`, `estado`, `tamanho`, `contorno`, `comPonto`, `title`) e os tipos `Tom` e `EstadoDoSelo`. `tom`: os de `TomDoEmblema` e `contorno` (o círculo pontilhado do que ainda não existe); o texto vai no tom e o sinal no selinho tonal, desenhado pelo CSS (✓ positivo, + destaque, ◇ atencao, ✕ erro, → andamento, • acao); o `neutro` é a etiqueta no preenchimento, sem sinal. `estado`: aberto, marcado, andamento, aplicado, concluido, erro, cancelado ou conferir, com o sinal do ciclo, e aí o `tom` fica de fora. `tamanho` md (14px) ou sm (12px, o da linha de lista); `contorno` tira o sinal e põe o fio de dentro; `comPonto` troca o sinal pelo ponto na cor do texto.
- `Nota` (`tom`, `icone`, `titulo`, `acao`) e o tipo `TomDaNota`: a faixa de aviso que fica na tela, no fundo tonal, sem borda, com o sinal antes da frase (i no neutro, ✓ no positivo, ◇ na atenção, ✕ no erro, que é `role="alert"`; acao, destaque e andamento são o neutro com o texto no tom) e a ação à direita (no celular, embaixo).

### Casca

- `CabecalhoDoApp` (`sigla`, `nome`, `hrefDaMarca`/`aoClicarNaMarca`, `contexto`, `busca`, `sino`, `hrefDaAjuda`/`aoAjudar`, `usuario` com `nome`, `papel` e `email`, `itensDoUsuario` com `rotulo`, `icone`, `href` ou `aoClicar` e `contagem`, `aoSair`, `versao`/`hrefDaVersao`, `menuAberto`/`aoAlternarMenu`, `Link`): o cabeçalho de 68px, no chão (sem vidro nem fio), preso no alto à direita da lateral (começa na `--coluna-lateral`). Da esquerda para a direita: o ☰ (até 960px, só para quem passa `aoAlternarMenu`), a marca (o quadrado `--marca` com a sigla e o nome; acima de 960px some quando o `MenuLateral` leva a dele), o `contexto` e a `busca` em superfícies brancas de 48px, o sino, a ajuda, o tema e o usuário num círculo em tinta com as iniciais (o nome na dica), que abre o menu de vidro: o nome, o papel e o e-mail no alto, os itens do app e, no pé, a versão e o Sair. O `contexto` em texto solto vai em negrito; o seletor do app é o botão dele com `className="topo-contexto"`, o nome em `<b>` e a linha de apoio em `<small>`. Ao estreitar nada rola de lado: pela largura do cabeçalho, a linha de apoio do contexto e a tecla da busca saem até 900px e a busca vira só a lupa até 800px; até 960px de janela fica só o quadrado da marca; no celular sai o tema. `RECUO_DO_CABECALHO`, `ALTURA_DO_CABECALHO` (68), `useNoCabecalho` e os tipos `ItemDoUsuario` e `PropsDoCabecalho`.
- `MenuLateral` (`itens`, `ativo`, `aberto`/`aoFechar`, `pe`, `nome`, `sigla`, `hrefDaMarca`/`aoClicarNaMarca`, `chaveDaLateral`, `Link`): a lateral presa à borda, opaca e tingida, sem sombra, sem vidro e sem margem, ao lado do conteúdo e nunca por cima dele. No alto, a marca do produto (o quadrado `--marca` com a `sigla`, ou as iniciais do `nome`, e o nome; sem `nome`, não há marca) e o botão redondo de recolher; embaixo, a navegação. Cada item (`rotulo`, `icone`, `href`, `ativo`, `filhos`, `contagem`) tem 40px e raio 12; o `icone` de 18px vem antes do texto e a `contagem` fica discreta à direita. Com `filhos`, o item é grupo: abre e fecha, um aberto por vez, e o do item ativo abre sozinho; o grupo de um filho só vira item direto, com o nome do grupo; o item sem `href` fica apagado e sem clique. O ativo vai em azul cheio com o texto branco. `pe` é a linha de situação no pé, com o ponto verde. Recolhida (76px), mostra só os ícones (o item sem ícone, a inicial; o grupo, o ícone dele), com o nome na dica; fica lembrada neste navegador pela `chaveDaLateral` (padrão `kit-lateral`) e vai no `data-lateral` do `<html>`, de onde o cabeçalho e o `RECUO_DO_MENU` tiram a coluna. Até 960px fica fora da tela e só aparece com `aberto`, deslizando da esquerda sobre o véu; o Esc e o véu fecham. `RECUO_DO_MENU`, `LARGURA_DO_MENU` (248), `LARGURA_DO_MENU_RECOLHIDO` (76), `CHAVE_DA_LATERAL` e os tipos `ItemDoMenu`, `LinkDoMenu` e `PropsDoMenuLateral`.
- `BarraDeNavegacao` (`itens` com `rotulo`, `href` ou `aoAbrir` e `ativo`; `ativo`, `Link`, `className`): a navegação do celular, presa embaixo, de vidro, só em texto: até cinco itens em partes iguais, o ativo em azul com o fio em cima; um deles pode abrir o resto do menu (o `aoAbrir` ligando o `aberto` do `MenuLateral`). De 640px para cima não aparece. `RECUO_DA_BARRA`, `ALTURA_DA_BARRA` (49) e os tipos `ItemDaBarra` e `PropsDaBarraDeNavegacao`.
- `BarraDoTopo` (`trilha`, `titulo`, `subtitulo`, `acoes`, `carregando`, `voltaUmPasso`, `className`): a trilha discreta de 36px, sem faixa (o chão por trás), presa sob o cabeçalho, com os passos até a tela em texto de apoio (Comercial › Clientes), o `titulo` como passo atual em tinta, a frase ao lado (some no celular) e as ações à direita. `voltaUmPasso` liga o Alt ← (o `history.back()`) e a dica dele, que some até 1180px; `carregando` corre a barra fina no pé (o app diz quando, como o `useIsFetching` do TanStack). `useLugaresDoTopo`, `ProvedorDoTopo` e `NoTopo` (`titulo`, `frase`, `acoes`), com o tipo `LugaresDoTopo`: a ponte para a tela pôr a frase, as ações e o título dela na barra da casca (o exemplo está em `ui/topo.tsx`).
- `AreaDaTela` (`largura` estreita, media ou larga; `respiro`): o conteúdo no meio da área, sobre o chão (sem fundo próprio: as superfícies são os blocos da tela), com largura máxima, nunca esticado. A `larga` (padrão) vai até 1320px, o `--conteudo-largura`. A casca envolve as telas com `respiro` (16 em cima, 24 dos lados, 32 embaixo; 16 dos lados no celular); a tela de formulário ou registro se fecha na `media` ou `estreita`.
- `CabecaDaTela` (`rotulo`, `titulo`, `descricao`, `acoes`, `trilha` com os `PassoDaTrilha`, `Link`): o alto da tela, dentro da área: o título em frase (24px, 700; 20 no celular), a frase embaixo e as ações à direita; `rotulo` é a linha pequena do assunto sobre o título; `trilha` é o "Tela › Subtela" acima dele, para a tela que não está no menu.
- `Sino` (`notificacoes`, `naoLidas`, `aoAbrir`, `aoMarcarTodas`, `vazio`) e o tipo `Notificacao` (`id`, `titulo`, `texto`, `quando`, `lida`, `icone`): o sino com o ponto vermelho enquanto há não lido e o flutuante de vidro dos avisos, com "Não lidos" e "Todos" no alto, o não lido em azul claro, o item sob o cursor no azul da ação e "Marcar todos como lidos" no pé. Os dados e a marcação de lida são do app.
- `BotaoDeBusca` (`aoBuscar`, `exemplo`): a busca do cabeçalho, na superfície branca, que abre a paleta, com a tecla (Ctrl K, ⌘ K no Mac).
- `Paleta` (`grupos`, `texto`, `aoMudarTexto`, `carregando`, `erro`, `aberta`, `aoMudar`, `placeholder`, `titulo`, `minimo`), `useAtalhoDaBusca` e `usePausa`, com os tipos `GrupoDaPaleta` (`titulo`, `itens`) e `ItemDaPaleta` (`chave`, `principal`, `secundario`, `aoAbrir`): a paleta Ctrl K (os grupos vêm do consumidor), de vidro sobre o véu, no alto da janela: o campo no alto, os grupos com o rótulo pequeno, a linha ativa em azul claro e o pé com as teclas.
- `Novidades` (`versoes`, `titulo`, `frase`, `vazio`) e o tipo `VersaoDasNovidades`: a tela de Novidades inteira, a linha do tempo das versões com as seções Novidades, Melhorias e Correções, no formato que o hub entrega; o app só formata a data.

### Blocos, números e listas

- `Bloco`: a superfície, a unidade da tela: branca sobre o chão, raio 18, sem borda e sem sombra. Corta o que passa do canto; o que precisa sair dela fica fora ou passa `overflow-visible`.
- `BlocoDeNumero` (`numero`, `titulo`, `porque`, `acao`, `tom` positivo, destaque ou atencao) e `BlocosDeNumero`: o bloco com o número grande, o título, o porquê e a ação no pé (um `Botao` ou o `Link` do roteador). Com `tom`, o bloco é tingido na cor do tom, com o título e o porquê no tom forte; sem `tom`, é a superfície branca. A grade quebra linha em colunas de 260px.
- `CabecaDoBloco` (`titulo`, `detalhe`, `icone` pequeno e neutro, `acaoDeTexto` no fantasma com `aoAbrir` ou `href`, `acao` para o que não é texto).
- `Destaque` (`rotulo`, `valor`, `selo`, `detalhe`, `tom` texto, positivo, destaque, atencao ou erro, que colore só o rótulo; `grande`; `emCaixa`, na área recuada, como um mini cartão): o número de destaque de uma caixa, com o valor em tinta.
- `CartoesDeNumero` (`compacto`) e `Indicador` (`rotulo`, `valor`, `detalhe`, `icone`, `tom`, `aoAbrir`, `href`, `asChild`, `ativo`, `realce`, `compacto`, `carregando`): os cartões de número que abrem a tela, numa superfície só, separados pelo fio (até quatro por linha; dois no celular). O cartão: o rótulo com o ícone pequeno e neutro, o valor em tinta e a nota embaixo. Com `tom` de sentido (positivo, destaque, atencao), o cartão é o bloco tingido do tom, com o rótulo no tom forte, nunca tracejado; `erro` só colore o rótulo; os outros tons ficam sem cor. `realce` pinta o fundo claro e só vale para os tons que não são de sentido (neutro, erro, andamento). `ativo` marca o escolhido com o contorno azul por dentro; com `aoAbrir`, `href` ou `asChild`, o cartão leva a outra tela. `compacto` tira o ícone e aperta; o contexto `IndicadorCompacto` liga em tudo o que estiver dentro. `carregando` põe o esqueleto no valor.
- `BlocoDestaque` (`rotulo`, `valor`, `selo`, `aoAbrir`): a caixa do número grande, na superfície branca, com o valor em tinta (`text-numero-g`); com `aoAbrir` a caixa toda é clicável e os links de dentro seguem por cima. `SeloDoDestaque` (a etiqueta neutra) e `LinhaDoDestaque` (`rotulo`, `valor`, `fatia`, a barra da fatia em tinta).
- `FaixaDeNumeros`, `Segmento` (`rotulo`, `valor`, `detalhe`, `selos`, `tom` erro ou positivo, que colore o rótulo, `apagado`, `largo`, `aoAbrir` com `ativo`) e `DivisorDaFaixa`: a faixa baixa de números, para quando a altura conta; não é o padrão de abertura de tela.
- `GraficoDeBarras` (`barras` com `rotulo`, `valor`, `referencia` e `projecao` de `minimo` a `maximo`; `formatar`, `altura`, `rotuloDaProjecao`), `LegendaDoGrafico` (`itens` com `tipo` e `rotulo`) e o tipo `BarraDoGrafico`: o gráfico de barras sem biblioteca, na tinta das séries (nenhuma barra é azul): os fechados na `serie-4`, a referência na `serie-1` com o valor em cima e a projeção como estimativa, no contorno pontilhado, com a faixa no preenchimento e o traço do valor provável, depois de uma linha vertical pontilhada. A legenda vai na `acao` da `CabecaDoBloco`.
- `Quadro` (`colunas` 2 a 5), `ColunaDoQuadro` (`titulo`, `tom` do ponto, `contagem`, `legenda`) e `CartaoDoQuadro` (`href`, `aoAbrir`, `asChild`; `acoes` no pé, fora do clique): o quadro por situação, as colunas no preenchimento e os cartões brancos dentro, sem borda nem sombra.
- `LinhaDeLista` (`icone` ou `sigla`, `titulo`, `apoio`, `colunas`, `valor` com `tomDoValor`, `selo`, `larguras`, `escolhida`, `aoAbrir`/`href`/`asChild`, `selecionada`/`aoSelecionar`/`rotuloDaSelecao`), `ListaDeLinhas` e o tipo `PropsDaLinhaDeLista`: a linha da lista agrupada dentro de um `Bloco`, de 52px no mínimo, com o fio de cima começando no recuo do texto: o marcador pequeno e neutro, o título em peso forte com a linha de apoio, as colunas curtas, o valor tabular à direita (o `acao` fica na cor do texto) e o selo. A escolhida fica em azul claro; `aoSelecionar` põe a caixa de seleção do lote. No celular as colunas curtas somem e o valor e o selo se empilham.
- `Tabela` (TanStack Table: `dados`, `colunas`, `carregando`, `aoAbrir` e `podeAbrir`, `escolhida`, `expandir`, `atributosDaLinha`, `idDaLinha`, `vazio`, `classeDaLinha`, `grupo`, `densa`, `pagina` com `aoMudarPagina`, `tamanhosDaPagina` e `aoMudarTamanhoDaPagina`) e o tipo `Pagina`. No `meta` da coluna: `numero` alinha à direita, `principal` fica com a sobra, `quebra` quebra o texto, `fixa` prende a coluna à esquerda, `centro` centraliza, `esconderAbaixo` some abaixo de sm/md/lg; o `footer` das colunas vira o rodapé. O título da coluna em 12px apagado, que nunca quebra, as linhas de 15px no fio suave, o hover na linha, a escolhida em azul claro, sem zebra. `densa` é a tabela curta de dentro de uma ficha, com o `SemValor` compacto.
- `Paginacao` (`page`, `page_size`, `total`, `aoMudar`, `tamanhos`/`aoMudarTamanho`, `compacta`, os rótulos): "1–25 de 342", as setas e as páginas no fantasma, a atual em azul claro, e o "Por página". Some quando tudo cabe numa página; no celular, só a atual entre as setas.
- `BarraDeFiltros` (`abas`, `etiquetas`), `Filtros` (`ativos`, `aoAplicar`, `aoLimpar`, `aberto`/`aoMudarAberto`, os rótulos), `GrupoDeFiltros` (`titulo`), `EtiquetaDeFiltro` (`rotulo`, `aoTirar`, `rotuloDeTirar`), `Ordenacao` (`opcoes`, `valor`, `aoMudar`, `rotulo`) e o tipo `OpcaoDeOrdenacao`: os filtros de uma lista, nas pílulas `.filtro` de 32px. O botão "Filtros", com a contagem dos ativos, abre o painel de vidro (os grupos, Limpar, Cancelar e Aplicar); o filtro aplicado vira a pílula em tinta com o ✕; a ordenação é o menu de vidro, com o destacado no azul da ação e o marcado em peso forte. O rascunho e o que vale depois do Aplicar são do app (o exemplo está em `ui/filtros.tsx`).
- `BarraDeLote` (`contagem`, `total`, `aoLimpar`, `rotuloDeLimpar`) e `AcaoDoLote`: a barra de vidro que flutua embaixo da lista enquanto há linha marcada, com a contagem, o total no positivo, as ações e o ✕ redondo que limpa. Vai depois do `Bloco` da lista, fora dele. A ação principal é um `Botao` primário `sm`; a secundária, a `AcaoDoLote`.
- `Abas`, `TrilhoDeAbas` (`largo`, `aria-label`), `Aba` (`value`, `icone`, `contagem`) e `ConteudoDaAba`: as abas sublinhadas sobre o fio suave, a ativa no azul com o traço de 2px e peso forte, a contagem dentro do texto ("Pendentes 12"); no celular o trilho rola de lado. `largo` é o segmentado da largura toda, com o indicador branco que desliza com mola até a ativa. O anel de foco aparece só pelo teclado. Aceitam "" como valor (o filtro "Todos").
- `Segmentado` (`opcoes` com `chave`, `rotulo`, `hint` e `desligada`; `valor`, `aoMudar`, `rotulo` para o leitor de tela, `className`) e o tipo `OpcaoDoSegmentado`: o controle segmentado, que troca a visão sem mudar de tela. As opções têm a mesma largura e o indicador branco desliza com mola até a escolhida; as setas andam entre as opções ligadas; a desligada fica apagada, sem clique, e a dica (`hint`) diz o porquê.
- `Expansivel` (`titulo`, `detalhe`, `aberto`/`aoMudar` ou `padraoAberto`): a seção que abre e fecha, o `<details>` com a seta que gira; várias em fila, separadas pelo fio.
- `ComColuna` (`coluna`, `largura` 340, `ponto` do contêiner 2xl a 5xl, `lado` direita ou esquerda, `topo` 72): o conteúdo com a coluna lateral presa no alto na rolagem, que sobe para cima do principal quando o contêiner é estreito.

### Formulário

- `Campo` (`icone`, `tamanho` md ou lg, e as props do `<input>`) e o tipo `PropsDoCampo`: o `.input`, de 36px solto e 44 dentro do `Rotulado`, raio 12, com o contorno por dentro, que não cresce no foco; no foco, o contorno azul e o anel. `icone` vai à esquerda, e aí a classe de posição vai num elemento de fora; `tamanho="lg"` é o de 50px.
- `Busca`: o `.campo-busca`, a lupa e o campo no preenchimento, na altura dos botões.
- `CampoDeSenha`: o campo com o olho no botão redondo.
- `AreaDeTexto`: o texto longo, no mesmo contorno, com altura livre.
- `Rotulado` (`rotulo`, `erro`, `ajuda`, `htmlFor`, `obrigatorio`, `opcional`, `dica`, `acao`, `ocupa`): o rótulo em cima, em 14px e peso forte, ligado ao controle do kit de dentro por id, sem envolvê-lo; `erro` pinta o contorno e o anel de vermelho; controle nativo de fora leva `htmlFor` e o mesmo `id`.
- `Escolha` (`opcoes`; `vazio` troca ou tira a opção vazia; `children` para `optgroup`): o seletor (`select.input`), numa linha só, com reticências e a seta fina presa à direita, que vira para cima aberto; dentro da `BarraDeFiltros` tem a largura do que mostra, até 280px. Onde o navegador desenha o select (`appearance: base-select`), abre o painel de opções de vidro, com a escolhida em peso forte e a destacada no azul da ação; o teclado é o do select.
- `EscolhaSegmentada` (`opcoes`, `valor`, `aoMudar`, `name`, `disabled`) e `SimNao` (o contrato do select: `value` "true", "false" ou vazio e o `onChange` com `e.target.value`; o clique no já marcado volta ao vazio, menos com `required`; `semDado` põe o terceiro estado à mostra, como a terceira opção, de valor vazio): o segmentado deslizante, com o indicador branco que desliza até a marcada.
- `Caixa` (20px, raio 6; marcada, o azul vivo com o traço branco que se desenha) e `Alternativa` (o radio de 20px, marcado no azul vivo com o miolo branco; `variante="cartao"` com `titulo` e `descricao`, o marcado com o contorno azul e o fundo azul claro).
- `Interruptor` (51×31: `checked`, `onCheckedChange`, `disabled`, `tom` acao ou positivo) e `OpcaoDoCadastro` (`titulo`, `descricao`, `checked`, `onCheckedChange`, `rotuloLigado`/`rotuloDesligado`, `tomLigado`, `disabled`): o liga/desliga (o azul vivo ligado, ou o verde com `positivo`; o preenchimento desligado; a bolinha branca desliza com mola e alarga enquanto apertada) e a linha do cadastro, branca, de raio 18, com título, frase, estado escrito e interruptor.
- `GradeDoFormulario` (`colunas` 2 a 8; de 5 para cima só no `xl`) e `SecaoDoFormulario` (`titulo`, `icone`).
- `CampoMoeda` (`valor`, `aoMudar`; o R$ fixo, formata ao sair e no Enter, vazio é null; `comoTexto` para dinheiro em string decimal; o colado com "R$" entra limpo), `CampoNumero` (`valor` e `aoMudar` em string decimal, `casas`, 2 por padrão, `unidade` fixa à direita; vazio é null, diferente de "0.000") e `CampoMascarado` (`mascara` cpf, cnpj, documento, telefone ou cep; `valor` e `aoMudar` só com os dígitos: formata enquanto se digita ou cola, o cursor fica entre os mesmos dígitos), com `aplicarMascara`, `lerDecimal`, `escreverDecimal` e os tipos `Mascara`, `PropsDoCampoMoeda`, `PropsDoCampoNumero` e `PropsDoCampoMascarado`.
- `CartaoDoFormulario` (`titulo`, `selos`, `informadoPor`, `informadoEm`, `informadoRotulo`, `regras`, `mudou`), `CampoDoFormulario` (`id`, `rotulo`, `ajuda`, `rodape`, `mudou`), `Mes` (o campo AAAA-MM no seletor ‹ mês ›) e `BarraDeSalvar` (`grupos`, `salvando`, `aoDescartar`, `aoSalvar`): o formulário de parâmetros, na superfície branca, com as regras numa faixa recuada; com `mudou`, o campo marcado como alterado; a barra de vidro presa no pé.
- `Segredo` (`icone`, `nome`, `valor`, `aviso`, `aoFechar`) e `SenhaGerada` (`usuario`, `senha`, `aviso`): o que aparece uma vez só (a chave, o link, a senha), na área recuada, copiável.
- `SoltarArquivos` (`aceitar`, `titulo`, `dica`, `aoJuntar`), `ListaDeArquivos` (`arquivos`, `aoTirar`, `extra`, `aviso`), `LinhasComProblema` (`titulo`, `linhas`: as recusadas da simulação de uma importação) e o tipo `LinhaComProblema`: a tela de envio de arquivos, com a `BarraDeProgresso`. `fetchComProgresso` (o `fetch` sobre XHR, com o progresso do envio e a resposta em stream) e `lerNdjson` (a resposta linha a linha), com `juntarArquivos`, `eZip`, `megabytes` e `tamanhoDoArquivo`.

### Modal, alerta e aviso

- `Modal` (`aberto`, `aoMudar`/`aoFechar`, `titulo`, `contexto`, `subtitulo`, `selos`, `rodape`, `acoesDoTopo`, `tamanho`, `largura`, `maximizavel`, `pilha`, `preso`, `className`, `ref`), `Cancelar` (`rotulo`, `disabled`) e os tipos `PropsDoModal`, `TamanhoDoModal` e `TrilhaDoModal`: o modal centralizado sobre o véu desfocado, de raio 24, sempre dentro da área útil. `tamanho` p (420), m (680), g (1040), xg (1360) ou cheio (96% da janela); `largura` em px para quem não usa um tamanho; sem os dois, 540. O cabeçalho leva a trilha (o `contexto` e, com a `pilha` de mais de um nível, o "‹ Voltar" e os níveis clicáveis), o título, os selos, o subtítulo e, à direita, as `acoesDoTopo`, o maximizar (`maximizavel`) e o fechar redondo; o corpo é o único que rola; o pé, de vidro, com os botões à direita, só existe com `rodape`. Fecha com Esc, no ✕, no `Cancelar` ou no clique fora (o clique num aviso por cima, não) e devolve o foco a quem abriu; `preso`, enquanto grava, segura os três. Com a `pilha`, o Alt ← volta um nível. Entra com escala e sai encolhendo, também quando desmonta aberto. No celular ocupa a tela, com os botões de 48px presos embaixo. `isDialogoNoAlto`, `isTeclaDeCampo` (para o atalho que só vale no modal do alto, fora de campo) e `useDentroDoModal`.
- `Alerta` (`aberto`, `aoMudar`/`aoFechar`, `variante` acao, perigo, atencao, sucesso ou neutro, `icone`, `titulo`, `mensagem`, `children`, `acoes`, `preso`, `ref`), os tipos `VarianteDoAlerta` e `AcaoDoAlerta` (`rotulo`, `aoClicar`, `tipo` primario, perigo ou secundario, `carregando`, `desligada`), `IconeDeApp` e `CheckAnimado`: a confirmação, de vidro, com 400px e raio 28, que entra com mola: o ícone sobre o halo tonal da variante, o título no meio, a frase curta, o conteúdo extra (o campo do que se digita) e os botões grandes empilhados na ordem em que vêm; o `perigo` é o vermelho cheio, só na ação sem volta. O foco abre no campo, se houver; senão, na última ação que não destrói. Esc e o clique fora fecham (é o cancelar). No sucesso sem `icone`, o check se desenha. No celular segue no meio da tela.
- `BotaoDeConfirmar` (`titulo`, `frase`, `confirmar`, `aoConfirmar`, `tipoDoConfirmar` perigo ou primario, `iconeDaConfirmacao`, `rotuloDoCancelar`, `digitar`, `rotuloDoDigitar` e as props do `Botao`): o botão do que não se desfaz, que abre o `Alerta`: o título em pergunta, a frase, o confirmar em cima (no vermelho cheio no `perigo`; no primário quando o passo não é risco) e o Cancelar embaixo, com o foco; `digitar` só libera com o texto digitado. `useConfirmar` para a confirmação que não nasce de um botão (`await confirmar({...})`, com o `dialogo` no JSX) e o tipo `OpcoesDaConfirmacao`.
- `Avisos`, `avisar` (`sucesso`, `erro`, `aviso`, `info`), `configurarAvisos`, `fraseDoErro` e os tipos `AcaoDoAviso` e `OpcoesDoAviso`: o toast, a faixa de vidro que sobe no rodapé, centrada. O tipo é o sinal no selinho: ✓ no sucesso, i no info, ◇ no aviso, ✕ no erro. Somem em 2 s (4 s com a `acao`, o "Desfazer"). O texto é o título; as opções trazem a `frase` de baixo e a `acao`; no `avisar.erro`, a frase do erro é o título e, com `titulo` nas opções, desce para a linha de baixo. O mesmo aviso repetido troca o que está na tela; no máximo quatro.

### Estados e carregamento

- `SemValor` (`rotulo`, `compacto`; o contexto `SemValorCompacto`), `Esqueleto`, `Carregando` (`forma`, `linhas`, `rotulo`, `demora`), `Erro` (`frase`, `titulo`, `referencia`, `tentar`, `rotuloTentar`, `icone`, `contorno`, `tela`) e `Vazio` (`titulo`, `descricao`, `icone`, `acao`, `solto`, `tela`): os estados. O vazio é o ícone no quadrado do preenchimento (a caixa vazia, ou o `icone` do assunto), o título, a frase e uma saída; `solto` tira a superfície em volta. O erro é o ícone de alerta no quadrado vermelho claro (`icone` troca), a frase e o "Tentar de novo"; `contorno` põe a superfície em volta. `tela` ocupa a área inteira. O `Carregando` é o esqueleto da primeira carga, com a barra fina no alto, na `forma` do que vem: `tela`, `cartoes`, `caixa`, `lista`, `tabela`, `grafico` ou `linhas`. Só aparece depois de 200 ms; depois de uns 2,5 s entra a linha com o girador e a frase de `demora` (sem ela, a genérica do kit). `useDemora` e `LinhaDeDemora` são essa espera para quem monta o próprio estado.
- `BarraDeCarga` (`ativa`), `Recarregando` (`ativa`, `demora`, `barra`), `Etapas` (`titulo`, `acao`, `itens` com `rotulo` e `estado` feito, atual ou pendente, `parte`; o tipo `Etapa`) e `BarraDeProgresso` (`rotulo`, `valor`, `parte`, `esperando`, `tom` acao, positivo, atencao ou erro, `comPercentual`): o carregamento depois da primeira carga. Ao trocar aba, filtro ou mês, a barra fina de 2px no alto e a lista antiga apagada no lugar, sem clique e sem foco, até a nova chegar (`keepPreviousData` no TanStack Query); as abas e os filtros que disparam a troca ficam fora do `Recarregando`. A tarefa longa é a `Etapas`: a barra e os passos (o feito com ✓ no verde, o atual no azul vivo).

### Detalhe, ficha e registro

- `ModalDoDetalhe` (`aoFechar`, `aberto`, true por padrão; `contexto`, `titulo`, `subtitulo`, `selos`, `tamanho` m por padrão, `largura`, `maximizavel`, `pilha`, `posicao` com `atual` e `total`, `nomeDoItem`, `aoAnterior`/`aoProximo`, `rotuloDoAnterior`/`rotuloDoProximo`, `acoesDoTopo`, `rodape`, `className`) e o tipo `PosicaoNaLista`: o detalhe de um registro, o `Modal` com o cabeçalho do registro e a pilha. A `CabecaDoDetalhe` entre os filhos sobe para o cabeçalho do modal (o título, os selos e o porquê como subtítulo) e as `AcoesDoDetalhe` vão para a linha do alto do corpo, onde quer que estejam. Com `posicao`, o contexto ganha "cliente 3 de 50" (com o `nomeDoItem`); `aoAnterior` e `aoProximo` ligam as setas do alto e o K/J, só com este modal no alto, fora de campo e de menu, e só na raiz da pilha. A `pilha` (o `trilha` do `usePilhaDoDetalhe`) põe o voltar e os níveis no cabeçalho; o Alt ← volta um nível; o Esc, o ✕ e o clique fora fecham o modal inteiro. O `rodape` é o pé de vidro, para o detalhe que edita. Monte-o só com o registro aberto (`{topo && <ModalDoDetalhe …>}`) ou passe `aberto`.
- As partes do detalhe: `CabecaDoDetalhe` (`selos`, `titulo`, `porque`; fora do modal, desenha-se onde está), `AcoesDoDetalhe` (os `Botao`, a principal primeiro; quebram em linhas), `ValorDoDetalhe` (`tom`, `valor`, `legenda`: o número grande numa área recuada, com a cor do sentido no `positivo`, `destaque` ou `atencao` e neutro nos outros), `DeParaDoDetalhe` (o `DePara` no destaque), `SecaoDoDetalhe` (`titulo`, `acao`: o rótulo pequeno em cima, a ação à direita e o conteúdo numa área recuada, sem borda) e `ItemDoDetalhe` (`titulo`, `apoio`, `valor`, `aoAbrir`: a linha de lista da seção, separada pelo fio suave; com `aoAbrir`, abre o item na pilha do mesmo modal).
- `usePilhaDoDetalhe`: a pilha em memória. `abrirSo` abre do zero (a linha da lista), `abrir` empilha (o item de dentro do detalhe), `voltar`, `voltarPara(nivel)` e `fechar`; `pilha`, `topo` (o que o modal mostra), `aberto` e `trilha(rotulo)`, que monta o que o `ModalDoDetalhe` recebe em `pilha`.
- `PilhaDeFichas` (`usePilha`, `fichas`, `tamanho` g por padrão), `criarUsePilha`, `lerPilha`, `escreverPilha` e os tipos `Ficha`, `AdaptadorDaPilha`, `UsePilha`, `DefinicaoDaFicha` (`rotulo`, `titulo`, `render`) e `RegistroDeFichas`: a pilha que mora na URL, num modal centralizado só, maximizável, por cima da tela, sem trocá-la. A ficha que abre de dentro de outra entra na pilha do mesmo modal. O cabeçalho leva o tipo (o `rotulo`), o título da ficha do alto e, com mais de uma, o "‹ Voltar" e os níveis clicáveis da trilha; à direita, o copiar o link, o maximizar e o ✕. O Alt ← volta um nível; o Esc, o ✕ e o clique fora fecham tudo, e o foco volta a quem abriu a primeira; a tela de baixo não muda, então filtros, seleção e rolagem ficam como estavam. As duas fichas logo abaixo da do alto ficam montadas, escondidas, e voltar não perde o que estava nelas. No celular o modal ocupa a tela.
- `MestreDetalhe` (`titulo`, `contagem`, `cabeca`, `lista`, `rodape`, `detalhe`, `aberto`, `aoVoltar`, `tituloDoDetalhe`, `tamanhoDoDetalhe` g por padrão, `emCaixa`, `largura` 360), `ItemDaLista` (`ativo`, `aoEscolher`, `href`, `asChild`, `em` coluna ou linha), `GrupoDaLista` (`titulo`, `valor`), `PaginasDaLista` e `CarregarMais` (`temMais`, `carregando`, `aoCarregar`, `emBloco`, `rotulo`): a lista na tela, numa superfície, em linhas separadas pelo fio (a escolhida em azul claro com o fio azul à esquerda), e o detalhe no `ModalDoDetalhe`, maximizável, com o `tituloDoDetalhe` (ou o `titulo`) no cabeçalho. Sem `aberto`, o modal abre quando se escolhe um `ItemDaLista` e fecha sozinho, chamando o `aoVoltar`; o detalhe que o app escolhe sozinho (o primeiro da lista, ao carregar) não abre nada. Com `aberto`, o app comanda o modal, e o fechar (✕, Esc, clique fora) chama o `aoVoltar`. A lista não desmonta: o foco volta ao item, com a mesma escolha e os mesmos filtros. `emCaixa` é o de dentro de um `Bloco` (uma ficha): a lista com o fio à direita, de `largura` px, e o detalhe ao lado, na mesma caixa; empilha no celular.
- `PreviaContextual` (`rotulo`, `titulo`, `children`, `acao` "Ver detalhes", `aoAbrir`): a referência vinculada, sublinhada em pontos no meio do texto, que abre o cartão da consulta complementar: depois de uma pausa do mouse (o ponteiro desce para o cartão e lê), pelo foco do teclado ou pelo toque; Esc ou o clique fora fecham, e o Esc devolve o foco à referência. A ação de dentro abre o detalhe (a ficha na pilha). Os campos do cartão e a ação são do produto. Sem a Popover API, a referência abre o detalhe direto.
- As partes de uma ficha: `CabecaDaFicha` (`icone`, `tipo` ou `sobretitulo`, `titulo`, `selos`, `codigos`, `numero` com `rotuloDoNumero`, `acoes`; no modal, o título do registro é o do cabeçalho do modal, e aqui ficam a identificação, os códigos e o número), `DadosRapidos` (`itens`, do tipo `DadoRapido`: o resumo numa faixa de células recuadas separadas pelo fio suave, quantas couberem por linha), `SecaoDaFicha` (`titulo`, `selos`, `acao`; na tela, na caixa do `Bloco`; no modal, o rótulo pequeno em cima e o conteúdo numa área recuada, sem borda; `solto` tira a caixa e o recuo e põe o título pequeno sobre o fio suave), `Codigo` (`nome`, `valor`, `copiavel`, `empilhado`; o valor comprido corta com reticências), `Pares` (`colunas` até 4, pela largura do contêiner; `compacto` abre as colunas mais cedo; `denso` é a lista de definição em duas colunas, com o rótulo de 120px e linhas de 34px separadas pelo fio suave, o conteúdo da `SecaoDoDetalhe`), `Par` (`rotulo`, `longo`, `ocupa`, `ocupa="inteiro"`, `dica`; o último par da linha estica, sem lugar vazio), `Faixa` (a linha de totais com lugar fixo: `itens`, do tipo `ItemDaFaixa`, com `rotulo`, `valor` e `apagado` para o zero; `grupos`; quebra em mais linhas, sem buraco) e `Entidade` (`aoAbrir`: o link que abre a ficha de uma entidade na pilha do mesmo modal).
- `CabecaDoRegistro` (`voltar` com o `BotaoDeVoltar`, `icone`, `rotulo`, `titulo`, `tituloFrase`, `subtitulo`, `selos`, `acoes`, `indicadores`, do tipo `IndicadorDoRegistro`, com `tom`, que colore o rótulo, e `progresso`), `Informacoes` (`titulo`, `solto`) e `Informacao` (rótulo à esquerda, valor à direita), `Historico` (`eventos`, `vazio`; uma caixa por evento: criação, alteração, exclusão ou a ação livre com rótulo e tom, com o `DePara` de cada campo) e o tipo `EventoDoHistorico`: a tela de um registro. Todo histórico ou auditoria de registro, em todo app, é o `Historico`.
- `DePara` (`de`, `para`, `rotulo`, `tamanho` normal ou destaque, `rotuloDe`/`rotuloPara`, `conferir`): o antigo riscado, a seta e o novo em peso forte, com `null` como `SemValor`; o `destaque` é o bloco com os dois lados recuados, só o novo tingido de azul (é o que se vai autorizar), "De" e "Para" em cima; `conferir`, no destaque, é o novo sem valor certo a sugerir, sem tinta, no contorno pontilhado.

### Telas sem login e marca

- `MolduraPublica` (`marca`, `versao`, `rodape`, `painel`, `rotulo`, `titulo`, `frase`): a moldura centralizada das telas sem login. No meio da página, sobre o chão, a `marca` do produto, o cartão branco com o formulário e, embaixo dele, o brasão da Dal Bosco com o fio dourado, "Um produto da Dal Bosco Systems" e a `versao` (todo login leva o brasão: a moldura o desenha sozinha); o `rodape` (o `RodapePublico` do app) é opcional, no pé da página. `painel="brasao"` é a moldura do hub: a tela dividida, com o painel escuro do brasão à esquerda (o brasão inteiro, o `rotulo`, o `titulo`, a `frase` e, no pé, a linha do `rodape`) e o cartão à direita; até 1020px o painel vira a faixa do alto, com a marca e o título.
- `CartaoDeAcesso` (`rotulo`, `titulo`, `frase`, `links`), `Entrar`, `EsqueciASenha`, `RedefinirASenha`, `CriarConta` e `ConfirmarEmail`: as telas de acesso, iguais em todo projeto, com os campos do kit. A recusa e o sucesso aparecem no aviso acima dos campos. O kit só desenha: o consumidor passa a chamada à API (`aoEntrar`, `aoPedir`, `aoRedefinir`, `aoCriar`, que devolvem a promessa; a recusa usa a `fraseDoErro`) e os links do roteador. Títulos, frases e rótulos têm padrão e se trocam por prop:
  - `Entrar` (`aoEntrar`, `rotuloDoLogin`, `tipoDoLogin`, `titulo`, `frase`, `links`, `linkEsqueci`, `manterConectado`, que chega em `aoEntrar` como `manter`, `rotuloDoManter`, `frasePronto`);
  - `EsqueciASenha` (`aoPedir`, `rotuloDoLogin`, `tipoDoLogin`, `titulo`, `frase`, `links`, `frasePronto`): aceita usuário com `tipoDoLogin="text"` e mantém o formulário à vista depois de pedir;
  - `RedefinirASenha` (`aoRedefinir`, `minimo`, `ajuda`, `titulo`, `frase`, `rotuloDoBotao`, `frasePronto`, `fraseDoMinimo`, `fraseDasSenhasDiferentes`, `links`, `acaoPronto`): serve também para aceitar convite;
  - `CriarConta` (`aoCriar`, que recebe os dados e o `FormData`; `minimo`, `ajuda`, `extras`, `valoresIniciais`, `contexto`, `fraseDoMinimo`, `fraseDasSenhasDiferentes`, `links`, `frasePronto`, `acaoPronto`);
  - `ConfirmarEmail` (`estado` confirmando, confirmado ou falhou; `frase`, `acao`).

  O token do link, o e-mail, o limite de tentativas e quem pode criar conta são do backend de cada projeto.
- `CabecalhoPublico` (`marca`, `links`, `acoes`), `HeroiDoProduto` (`rotulo`, `titulo`, `frase`, `acoes`, `provas`, `midia`), `TelaDoProduto`, `SecaoPublica` (`id`, `rotulo`, `titulo`, `frase`), `Passos` (`itens`), `Recursos` (`itens`), `ChamadaFinal` (`titulo`, `frase`, `acao`) e `RodapePublico` (`marca`, `sobre`, `colunas`): a página pública (a home, fora do login), no modelo vitrine do produto, sobre os tokens do kit: o cabeçalho preso, o herói no fundo da página (nunca em azul cheio; o trecho em `<em>` do título ganha a cor de ação) com a tela do produto, como funciona, os recursos, a chamada final na faixa escura e o rodapé, que já traz a `AssinaturaDalBosco`. Os textos, os links do roteador e a imagem da tela são do projeto; o SEO e a rota também.
- `Brasao` (`variante` inteiro ou escudo) e `AssinaturaDalBosco` (`ano`, `como`): a marca da Dal Bosco Systems (as imagens vêm no pacote). A assinatura vai no pé da página pública e das telas sem login, nunca nas telas de dentro do app.

### Painel de TV

- `PainelDeTv` (`voltar`, `marca`, `rotulo`, `titulo`, `filtros`, `atualizadoEm`, `aoAtualizar`), `ConteudoDoPainel`, `useApresentacao`, `ControlesDaApresentacao`, `usePreferenciasDoPainel`, `TEMPOS_DA_APRESENTACAO` e o tipo `Apresentacao`: o painel de TV, sempre escuro nos dois temas (os tokens `painel-*`), com relógio, "atualizado há", tela cheia e um item por vez passando sozinho (setas e espaço do controle remoto) ou a lista; a cor dos dados vem das séries e dos tons de sentido, o azul só do que se toca. Peças: `SegmentosDoPainel`, `SelecaoDoPainel`, `BarraDoPainel`, `SeloDoPainel`.

### Utilitários

- `cn` e a formatação pt-BR: `moeda`, `moedaUnitaria`, `numero`, `contagem`, `percentual` (com as `casas` opcionais), `decimal` e `quantidade` (com a precisão do campo e a unidade), `documento` (com ou sem máscara na entrada), `telefone`, `cep`, `digitos`, `ncm`, `cest`, `data`, `dataHora`, `periodo`, `periodoLongo`, `iniciais`. Zero é zero e o sem valor é o `SemValor`.
- `nomeDoArquivo` (o nome no `Content-Disposition` da resposta) e `salvarArquivo` (entrega o blob como download).

Adaptadores: `@dalbosco/kit/tanstack` (TanStack Router), `@dalbosco/kit/next` (App Router), `@dalbosco/kit/react-router` (React Router 6.4+ e 7) e `@dalbosco/kit/url` (app sem roteador: `pushState` e `popstate` direto) exportam `useAdaptadorDaPilha` e o `usePilha` pronto.

## O que não está no kit

As fichas de cada plataforma (produto, nota, fornecedor), os rótulos e glossários, o seletor de período do app, o cliente da API e os erros dele (`ErroApi`, `ErroRede`), rotas e permissões: isso é de cada projeto, montado em cima do kit. Nada fiscal nem regra de domínio mora aqui.

## Mudar o kit

- Uma linha de versão só: o projeto sempre usa a tag mais nova. No bump, `gh release list -R RafaelGustavoDalBosco/beyond-kit` e o Release de cada tag dizem o que muda para quem usa.
- Quem edita o kit é a sessão do kit ou a do hub (dalbosco-systems). A sessão de outro projeto nunca edita o kit: o que falta ela escreve no próprio projeto, no padrão do kit, e registra como candidato (ou como problema do kit) no ticket aberto do projeto **KIT** no hub (`ticket.py abertos KIT`), não no ticket do próprio projeto. A sessão do kit lê esse ticket, junta os candidatos e solta a versão.
- As decisões do desenho moram no `CLAUDE.md` do kit; os valores, no `tokens.css`.
- Toda tag sai com o Release no GitHub: o que muda para quem usa e o comando do bump.
- Para soltar uma tag: `npm i` e `npm run tipos` (o TypeScript mais novo dos projetos e o 5.7); a tag só sai com os dois limpos.
- Versão: o que só acrescenta sobe o patch ou o minor; o que muda a tela de quem já usa sobe o minor e vai dito no commit e no Release, para os projetos saberem no bump; a troca do desenho inteiro sobe a versão maior.
