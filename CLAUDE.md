# @dalbosco/kit

## Tickets no hub

Sigla no hub: **KIT**.

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
- **Cor por produto**: o produto pode trocar a família `--acao*`, e a loja também pode, no portal do Beyond Rewards. Os outros tokens são fixos.
- **O que o Lastro não desenha** continua no kit, redesenhado sobre os tokens dele: `PainelDeTv`, `Quadro`, `GraficoDeBarras`, `Interruptor`, `Segredo` e `SenhaGerada`.
- **Tema**: claro e escuro, pelo `data-tema` do Lastro. Sem escolha salva, o app abre no claro e nunca segue o tema do sistema.
