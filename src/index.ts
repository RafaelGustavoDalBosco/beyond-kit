// O núcleo do kit: nada aqui depende de roteador, de API nem de TanStack Query.
// A pilha de fichas e a paleta recebem o `usePilha` dos adaptadores
// (`@dalbosco/kit/tanstack`, `@dalbosco/kit/next`) e os dados do consumidor.

export * from "./ui/abas";
export * from "./ui/barra-de-navegacao";
export * from "./ui/bloco";
export * from "./ui/botao";
export * from "./ui/cabecalho";
export * from "./ui/campo";
export * from "./ui/campo-de-senha";
export * from "./ui/campo-moeda";
export * from "./ui/carregamento";
export * from "./ui/com-coluna";
export * from "./ui/confirmacao";
export * from "./ui/copiar";
export * from "./ui/de-para";
export * from "./ui/dica";
export * from "./ui/destaque";
export * from "./ui/emblema";
export * from "./ui/estados";
export * from "./ui/faixa-de-numeros";
export * from "./ui/filtros";
export * from "./ui/grafico";
export * from "./ui/interruptor";
export * from "./ui/linha-de-lista";
export * from "./ui/lote";
export * from "./ui/menu-lateral";
export * from "./ui/mestre-detalhe";
export * from "./ui/modal";
export * from "./ui/nota";
export * from "./ui/novidades";
export * from "./ui/quadro";
export * from "./ui/registro";
export * from "./ui/segredo";
export * from "./ui/selo";
export * from "./ui/sino";
export * from "./ui/tabela";
export * from "./ui/tela";
export * from "./ui/topo";

export * from "./aviso/aviso";

export * from "./acesso/acesso";

export * from "./marca/marca";

export * from "./home/home";

export * from "./ficha/partes";
export * from "./ficha/pilha";
export * from "./ficha/PilhaDeFichas";
export * from "./ficha/Gaveta";

export * from "./busca/Paleta";

export * from "./tv/painel";

export * from "./formulario/formulario";

export * from "./envio/fluxo";
export * from "./envio/Envio";

export * from "./lib/cn";
export * from "./lib/formato";
