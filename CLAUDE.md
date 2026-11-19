# @dalbosco/kit

## Tickets no hub

Sigla no hub: **KIT**.

## Desenho: Beyond Design System

Decidido em 18/11/2026 (KIT-28, Rafael). O kit é a implementação compartilhada do Beyond Design System para os apps que adotam o kit.

- **O Beyond Data continua fora do kit** (BOD-70, 12/11/2026; corrigido em 19/11/2026, KIT-28, Rafael): o Data e o Fiscal, no repositório beyond-data, têm UI própria e não adotam versão do kit. O kit não migra o beyond-data; o que ele diz sobre isso nesta seção antes de 19/11 não vale.
- **Referência**: a UI do Beyond Design System no beyond-data (`C:\Projetos\beyond-data`), só para leitura: os valores em `frontend/src/estilo/tokens.css` e o visual dos componentes em `frontend/src/estilo/beyond-data.css`, os dois iguais no Data e no Fiscal, sem seletor por produto (BOD-69, 18/11/2026; a regra está no topo do `.claude/rules/frontend.md` de lá). A camada `:root[data-produto="data"]` que o Codex fez só para o Data saiu de lá em 18/11 e nunca é referência. Ela substitui a entrega do Lastro como fonte de verdade do visual; o resto da seção do Lastro continua valendo.
- **O kit é o pai**: tokens, casca e componentes iguais em todo produto. O produto liga a camada dele com `data-produto` no `<html>`, no CSS do próprio repositório, e só acrescenta: a marca (`--marca`, `--marca-sobre`), os tons de dado (séries, a cor de um cadastro) e os componentes de domínio. Nenhum produto troca o azul de ação, o verde e o vermelho de sentido, o foco nem as superfícies (a loja no portal do Beyond Rewards continua trocando a família `--acao*`).
- **Sentido**: azul para ação e seleção; verde para o favorável (`positivo`, e `destaque`, que deixou o violeta); vermelho para risco, desfavorável e o que apaga (`atencao`, no vinho; `erro` continua só falha de sistema). Sempre com texto, sinal ou ícone. O produto diz o que o valor significa (a queda pode ser economia numa tela e perda em outra); o kit só apresenta.
- **Hub** (os mockups aprovados): a marca DBS em grafite; herda o corpo de 14px e os raios 6/11/18; a prioridade alta no `atencao` com ▲.

## Desenho: Lastro

Decidido em 17/11/2026 (KIT-27, Rafael). Substitui a direção do KIT-13 (base Conta Azul, Nunito Sans). A troca sai numa versão maior, e o Release diz o que cada projeto muda ao subir.

- **Fonte de verdade**: a entrega do Lastro em `C:\Users\Rafael\Desktop\NOVA UI\Lastro_ Sistema visual e telas\entrega` (`tokens.css`, `base.css`, `componentes.html`, `docs/`). A implementação React que já roda é a do Beyond Data (`C:\Projetos\beyond-data\frontend\src`, regras em `.claude/rules/frontend.md`): serve de referência e nunca se copia às cegas. O Beyond Data continua fora do kit.
- **Login**: a moldura das telas sem login segue o modelo do Beyond Data. A tela é dividida: à esquerda, o painel do produto, escuro, na família do hint (`--hint-fundo`, `--hint-titulo`, `--hint-texto`), com o selo da Dal Bosco no pé; à direita, o formulário com os campos do Lastro. O hub mantém o painel do brasão.
- **Home pública**: os blocos de home, o `RodapePublico` e a `AssinaturaDalBosco` continuam no kit, redesenhados sobre os tokens do Lastro. A referência é o `estilo/publico.css` do Beyond Data. A home do Portal Ethos mantém a marca própria.
- **Nomes das cores**: os nomes são genéricos e os valores são os do Lastro. O `tokens.css` do kit não é cópia da entrega: quando o Lastro mudar, a atualização passa por esta tabela.
  - `efeito-reduz` vira `positivo` (entrou, deu certo, ganho);
  - `efeito-credito` vira `destaque` (o segundo realce, que não é ação);
  - `efeito-risco` vira `atencao` (vencido, atrasado, pede olho);
  - `erro` continua `erro` (só falha de sistema);
  - os estados, com os mesmos sinais (○ ◔ → ◑ ● ✕ ?), viram `estado-aberto`, `estado-marcado`, `estado-andamento`, `estado-aplicado`, `estado-concluido`, `estado-erro`, `estado-cancelado` e `estado-conferir`;
  - `tributo-*` vira `serie-1` a `serie-5`.
- **Regra fiscal fica fora do kit**: "nada se soma entre efeitos", a fonte de cada número e "sem vencimento" são do Beyond Data. Do Lastro, o kit leva a estimativa (≈, inclinada e pontilhada) e o "sem dado" no lugar de zero.
- **Particularidade de domínio mora no projeto**: o projeto monta sobre os tokens do kit o que é só dele, como qual estado é "Vencida" no Payments ou "Baixa confiança" no Ethos. Candidato ao kit só entra se servir a mais de um produto.
- **Cor por produto**: substituída pelo Beyond Design System (acima): o produto troca só a marca e os tons de dado; a família `--acao*` só a loja, no portal do Beyond Rewards.
- **O que o Lastro não desenha** continua no kit, redesenhado sobre os tokens dele: `PainelDeTv`, `Quadro`, `GraficoDeBarras`, `Interruptor`, `Segredo` e `SenhaGerada`.
- **Tema**: claro e escuro, pelo `data-tema` do Lastro. Sem escolha salva, o app abre no claro e nunca segue o tema do sistema.
