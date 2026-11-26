// O tema e a lateral antes de pintar, para não piscar: só a escolha salva vale; sem ela fica o claro (nunca o do
// sistema) e a lateral aberta. Fica fora do tema.tsx (que é "use client") para o layout de servidor do Next poder ler
// o texto: no Next, `import { SCRIPT_DO_TEMA } from "@dalbosco/kit/script-do-tema"`; no Vite, o mesmo texto num
// arquivo do public. A lateral recolhida usa a chave padrão do `MenuLateral` (`CHAVE_DA_LATERAL`).

export const CHAVE_DO_TEMA = "kit-tema";
const CHAVE_DA_LATERAL_PADRAO = "kit-lateral";

export const SCRIPT_DO_TEMA = `(function(){try{var h=document.documentElement;if(localStorage.getItem("${CHAVE_DO_TEMA}")==="escuro")h.setAttribute("data-tema","escuro");if(localStorage.getItem("${CHAVE_DA_LATERAL_PADRAO}")==="recolhida")h.setAttribute("data-lateral","recolhida")}catch(e){}})();`;
