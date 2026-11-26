# @dalbosco/kit

## Tickets no hub

Sigla no hub: **KIT**.

## Quem adota

Adotam: dalbosco-systems (hub), beyond-payments, beyond-rewards e ethos-integra. Ficam fora: Dor3D, beyond-archflow, beyond-metric e o beyond-data (Data e Fiscal), que tem UI própria e nunca é migrado para o kit.

Quem edita o kit e solta versão é a sessão do kit ou a do hub. A sessão de outro projeto só registra candidato ou problema no ticket aberto do projeto KIT.

## Desenho

- **Fonte de verdade**: a UI tonal do Beyond Data (`C:\Projetos\beyond-data\frontend\src`), só para leitura: os valores em `estilo/tokens.css`, o visual em `estilo/componentes.css` e `estilo/publico.css`, as fontes em `fontes/`, a casca em `componentes/casca/` e os componentes em `componentes/ui/`. O kit nunca muda o beyond-data.
- **O kit é o pai**: tokens, casca e componentes são iguais em todo produto. O produto liga a camada dele com `data-produto` no `<html>`, no CSS do próprio repositório, e só troca a marca (`--marca`, `--marca-sobre`) e os tons de dado (séries, a cor de um cadastro), além de acrescentar os componentes de domínio. Nenhum produto troca o azul de ação, os tons de sentido, o foco nem as superfícies. Exceção: a loja no portal do Beyond Rewards troca a família `--acao*`.
- **Nomes genéricos**: o `tokens.css` do kit tem os valores do Beyond Data com nomes sem domínio; a atualização passa por esta tabela, nunca por cópia.
  - `efeito-reduz` é `positivo` (entrou, deu certo, ganho);
  - `efeito-credito` é `destaque` (o segundo realce, que não é ação);
  - `efeito-risco` é `atencao` (risco, vencido, atrasado, pede olho);
  - cada tom tem o `-fundo` (o selo), o `-bloco` (o fundo tingido do bloco) e o `-forte` (o texto sobre o bloco);
  - `erro` é só falha de sistema e ação sem volta;
  - os estados de um registro, com os sinais ○ ◔ → ◑ ● ✕ ?, são `estado-aberto`, `estado-marcado`, `estado-andamento`, `estado-aplicado`, `estado-concluido`, `estado-erro`, `estado-cancelado` e `estado-conferir`;
  - `tributo-*` é `serie-1` a `serie-5`.
- **Nada fiscal no kit**: regra de domínio ("nada se soma entre efeitos", a fonte de cada número, "sem vencimento") mora no produto. O kit leva só a estimativa (≈, pontilhada) e o "sem dado" no lugar de zero. A particularidade de um produto (qual estado é "Vencida", "Baixa confiança") o projeto monta sobre os tokens; candidato ao kit só entra se servir a mais de um produto.
- **Sentido**: azul só para interação (ação, seleção, foco); a cor carrega o sentido em blocos tingidos, sempre com texto, sinal ou ícone; vermelho só para erro e ação sem volta. O produto diz o que o valor significa; o kit só apresenta.
- **Superfície e vidro**: chão azul-acinzentado, superfícies brancas de canto grande, sem borda e sem sombra. Vidro (`--material-*`, `--desfoque-*`) só em menus, alertas, toast, véu, barra do lote, pé do modal e barra do celular; nunca no cabeçalho nem na lateral.
- **Casca**: a lateral é presa à borda, opaca e tingida, com o item marcado em azul cheio; o cabeçalho fica no chão, sem vidro nem fio. As medidas moram no `tokens.css` e as constantes exportadas (`ALTURA_DO_CABECALHO`, `LARGURA_DO_MENU`, `LARGURA_DO_MENU_RECOLHIDO`) acompanham.
- **Detalhe em modal**: o detalhe de um registro abre em modal centralizado, nunca em painel lateral; o que abre de dentro dele entra na pilha do mesmo modal (voltar e trilha no cabeçalho), nunca num modal por cima. A confirmação é o alerta. O modal de formulário fecha ao clicar fora.
- **Telas sem login**: todo login leva o brasão. A `MolduraPublica` é centralizada: a marca do produto, o cartão branco e, embaixo dele, o brasão com o fio dourado, "Um produto da Dal Bosco Systems" e a versão, desenhados pela própria moldura; o `RodapePublico` é opcional. Só o hub usa o painel do brasão (`painel="brasao"`).
- **Tema**: claro e escuro, pelo `data-tema` no `<html>`; nenhuma classe `dark:`. Sem escolha salva, o app abre no claro e nunca segue o tema do sistema.
- **Fonte**: a Manrope, hospedada em `src/fontes` com o `OFL-Manrope.txt`; a Onest só como reserva dos sinais. Texto nunca abaixo de 12px.
- **Valores só por token**: nenhum hex fora do `tokens.css` (o ouro do brasão e o painel de TV ficam no `kit.css`); movimento só por `--dur-*` e `--curva*`. Fora do CSS (favicon, theme-color, manifesto) o azul é o `#1D4ED8`.
- **Hub**: a marca DBS em grafite e o painel do brasão no login.

## Versão

Uma linha de versão só: o projeto sempre sobe para a tag mais nova. Toda tag sai com o Release no GitHub (o que muda para quem usa e o comando do bump). Antes de cada tag, `npm run tipos` limpo. O que só acrescenta sobe o patch ou o minor; o que muda a tela de quem já usa sobe o minor e vai dito no Release; a troca do desenho inteiro sobe a versão maior.
