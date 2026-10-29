// O núcleo do kit: nada aqui depende de roteador, de API nem de TanStack Query.
// A pilha de fichas e a paleta recebem o `usePilha` dos adaptadores
// (`@dalbosco/kit/tanstack`, `@dalbosco/kit/next`) e os dados do consumidor.

export * from "./ui/abas";
export * from "./ui/bloco";
export * from "./ui/botao";
export * from "./ui/campo";
export * from "./ui/confirmacao";
export * from "./ui/destaque";
export * from "./ui/estados";
export * from "./ui/mestre-detalhe";
export * from "./ui/modal";
export * from "./ui/selo";
export * from "./ui/tabela";

export * from "./aviso/aviso";

export * from "./ficha/partes";
export * from "./ficha/pilha";
export * from "./ficha/PilhaDeFichas";

export * from "./busca/Paleta";

export * from "./formulario/formulario";

export * from "./lib/cn";
export * from "./lib/formato";
