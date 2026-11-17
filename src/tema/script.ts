// O tema antes de pintar, para não piscar: só a escolha salva vale, e sem ela fica o claro (nunca o do sistema).
// Fica fora do tema.tsx (que é "use client") para o layout de servidor do Next poder ler o texto: no Next,
// `import { SCRIPT_DO_TEMA } from "@dalbosco/kit/script-do-tema"`; no Vite, o mesmo texto num arquivo do public.

export const CHAVE_DO_TEMA = "kit-tema";

export const SCRIPT_DO_TEMA = `(function(){try{if(localStorage.getItem("${CHAVE_DO_TEMA}")==="escuro")document.documentElement.setAttribute("data-tema","escuro")}catch(e){}})();`;
