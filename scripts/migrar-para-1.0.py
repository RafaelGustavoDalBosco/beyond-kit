"""Troca as classes e os tons do kit 0.x pelos do kit 1.0 (desenho Lastro) nos .ts/.tsx de uma pasta.

Uso (de dentro do projeto, uma vez só: o `text-base` antigo vira `text-enfase` e o novo `text-base` é outro):
    python <kit>/scripts/migrar-para-1.0.py frontend/src

É a parte mecânica da migração: cor, tamanho de fonte, peso, raio, sombra e os valores de `tom`. O que muda de
desenho (Emblema, BlocoDestaque, a lista que vira tabela) e o que o script não reconhece fica para a revisão: ao
fim ele lista as classes que sobraram sem par no tema novo.
"""

import pathlib
import re
import sys

CORES = {
    "superficie-3": "mesa", "superficie-2": "sub", "superficie": "ficha",
    "linha-forte": "borda-forte", "linha": "borda", "fio": "borda-suave",
    "texto-cabeca": "texto-apoio", "texto-2": "texto-apoio", "texto-3": "texto-apoio",
    "cabeca-tabela": "sub", "zebra": "sub", "cabeca-detalhe": "fundo",
    "cobalto-forte": "acao-700", "cobalto-suave": "acao-100", "cobalto-tinta": "acao-800",
    "cobalto-anel": "acao-200", "sobre-cobalto": "acao-sobre", "cobalto": "acao",
    "ganho-suave": "positivo-fundo", "ganho": "positivo",
    "aviso-suave": "atencao-fundo", "aviso": "atencao",
    "risco-suave": "erro-fundo", "risco-anel": "erro-fundo", "risco": "erro",
    "neutro-suave": "mesa", "neutro": "texto-secundario",
    "agua-suave": "estado-andamento-fundo", "agua": "estado-andamento",
    "cabecalho-texto": "texto", "cabecalho-2": "hover", "cabecalho-3": "hover", "cabecalho": "ficha",
    "lateral-2": "hover", "lateral-linha": "borda", "lateral-texto": "texto-secundario",
    "lateral-ativo": "acao-texto", "lateral-cheio": "ficha", "lateral-apagado": "texto-apoio",
    "lateral-aviso": "atencao", "lateral-ganho": "positivo", "lateral": "mesa",
    "destaque-de": "ficha", "destaque-meio": "ficha", "destaque-ate": "ficha", "destaque-anel": "borda",
    "destaque-texto-2": "texto-apoio", "destaque-texto": "texto",
    "lote": "hint", "white": "acao-sobre", "black": "texto",
}
PREFIXOS = r"bg|text|border(?:-[trblxyse])?|ring(?:-offset)?|outline|divide|fill|stroke|from|via|to|decoration|placeholder|caret|accent|shadow"

TAMANHOS = {
    "text-[10px]": "text-micro", "text-[11px]": "text-micro", "text-[11.5px]": "text-micro",
    "text-xs": "text-apoio", "text-[12px]": "text-apoio", "text-[12.5px]": "text-apoio",
    "text-sm": "text-base", "text-[13px]": "text-base", "text-[13.5px]": "text-base", "text-[14px]": "text-base",
    "text-base": "text-enfase", "text-[15px]": "text-enfase", "text-[16px]": "text-enfase",
    "text-lg": "text-subtitulo", "text-[17px]": "text-subtitulo", "text-[18px]": "text-subtitulo", "text-[19px]": "text-subtitulo",
    "text-xl": "text-titulo", "text-[20px]": "text-titulo", "text-[21px]": "text-titulo", "text-[22px]": "text-titulo",
    "text-2xl": "text-numero-p", "text-[24px]": "text-numero-p", "text-[26px]": "text-numero-p",
    "text-3xl": "text-numero-m", "text-[28px]": "text-numero-m", "text-[30px]": "text-numero-m",
    "text-4xl": "text-numero-g", "text-[32px]": "text-numero-g", "text-[34px]": "text-numero-g", "text-[36px]": "text-numero-g",
    "text-5xl": "text-numero-xg", "text-6xl": "text-numero-xg",
}
PESOS = {
    "font-black": "font-forte", "font-extrabold": "font-forte", "font-bold": "font-forte", "font-semibold": "font-forte",
    "font-medium": "font-medio", "font-light": "font-normal", "font-thin": "font-normal",
}
RAIOS = {"controle": "m", "icone": "m", "cartao": "g", "bloco": "g", "ficha": "g", "sm": "p", "md": "m", "lg": "g", "xl": "g", "2xl": "g", "3xl": "g"}
SOMBRAS = {"shadow-1": "shadow-p", "shadow-bloco": "shadow-p", "shadow-sm": "shadow-p", "shadow-xs": "shadow-p",
           "shadow-2": "shadow-m", "shadow-md": "shadow-m", "shadow-lg": "shadow-m", "shadow-gaveta": "shadow-m",
           "shadow-3": "shadow-g", "shadow-xl": "shadow-g", "shadow-2xl": "shadow-g", "shadow-folha": "shadow-g"}
TONS = {"cobalto": "acao", "ganho": "positivo", "aviso": "atencao", "risco": "erro", "agua": "andamento"}

# a classe com os prefixos de variante (hover:, celular:, [&_svg]:) e o modificador de opacidade
CLASSE = re.compile(r"(?<![\w-])((?:[\w\[\]&>_.:*-]+:)*)(!?)([a-z][\w\[\].-]*)(/\d+)?(?![\w-])")
COR = re.compile(rf"^({PREFIXOS})-(.+)$")


def trocar_classe(m: re.Match) -> str:
    variantes, imp, nucleo, opac = m.group(1), m.group(2), m.group(3), m.group(4) or ""
    novo = nucleo
    if nucleo in TAMANHOS:
        novo = TAMANHOS[nucleo]
    elif nucleo in PESOS:
        novo = PESOS[nucleo]
    elif nucleo in SOMBRAS:
        novo = SOMBRAS[nucleo]
    elif nucleo == "shadow":
        novo = "shadow-p"
    elif nucleo == "rounded":
        novo = "rounded-p"
    elif nucleo.startswith("rounded-"):
        partes = nucleo.split("-")
        if partes[-1] in RAIOS:
            partes[-1] = RAIOS[partes[-1]]
            novo = "-".join(partes)
    elif nucleo == "barra-escolhida":
        novo = "shadow-[inset_2px_0_0_var(--acao)]"
    elif nucleo == "reluzir":
        novo = "esq"
    else:
        c = COR.match(nucleo)
        if c and c.group(2) in CORES:
            alvo = CORES[c.group(2)]
            if c.group(1) == "text" and alvo == "acao":
                alvo = "acao-texto"
            novo = f"{c.group(1)}-{alvo}"
    return f"{variantes}{imp}{novo}{opac}"


def trocar_strings(texto: str) -> str:
    # só dentro de strings e template literals: identificadores e props ficam intactos
    def dentro(m: re.Match) -> str:
        return m.group(0)[0] + CLASSE.sub(trocar_classe, m.group(0)[1:-1]) + m.group(0)[-1]
    texto = re.sub(r"\"[^\"\n]*\"|'[^'\n]*'|`[^`]*`", dentro, texto)
    # as variáveis CSS antigas escritas à mão (`style={{ color: "var(--cobalto)" }}`)
    texto = re.sub(r"var\(--([\w-]+)\)", lambda m: f"var(--{VARIAVEIS.get(m.group(1), m.group(1))})", texto)
    # os valores de tom: "cobalto", "ganho" e "agua" só existem como tom; "aviso" e "risco" só na linha que fala de tom
    linhas = []
    for linha in texto.split("\n"):
        alvo = r"cobalto|ganho|agua|aviso|risco" if re.search(r"tom", linha, re.I) else r"cobalto|ganho|agua"
        linhas.append(re.sub(rf"([\"'])({alvo})\1", lambda m: m.group(1) + TONS[m.group(2)] + m.group(1), linha))
    return "\n".join(linhas)


VARIAVEIS = {
    "superficie": "superficie-ficha", "superficie-2": "superficie-sub", "superficie-3": "superficie-mesa",
    "linha": "borda", "linha-forte": "borda-forte", "fio": "borda-suave",
    "texto-2": "texto-apoio", "texto-3": "texto-apoio", "texto-cabeca": "texto-apoio",
    "cobalto": "acao", "cobalto-forte": "acao-700", "cobalto-suave": "acao-100", "cobalto-tinta": "acao-800",
    "sobre-cobalto": "acao-sobre", "ganho": "positivo", "ganho-suave": "positivo-fundo",
    "aviso": "atencao", "aviso-suave": "atencao-fundo", "risco": "erro", "risco-suave": "erro-fundo",
    "neutro": "texto-secundario", "neutro-suave": "superficie-mesa",
    "agua": "estado-andamento", "agua-suave": "estado-andamento-fundo", "lote": "hint-fundo", "veu": "veu-modal",
}


SOBRA = re.compile(rf"\b(?:{PREFIXOS})-(?:cobalto|ganho|aviso|risco|agua|linha|fio|superficie|texto-[23]|lateral|cabecalho|zebra|cabeca)[\w-]*|\brounded-(?:controle|icone|cartao|bloco|ficha)\b|\bshadow-(?:1|2|3|bloco|gaveta|folha)\b|\bfont-(?:bold|extrabold|semibold|medium)\b|\btext-(?:xs|sm|lg|[2-6]?xl)\b")


def main(pasta: str) -> None:
    mudados = 0
    sobras: dict[str, set[str]] = {}
    for p in pathlib.Path(pasta).rglob("*"):
        if p.suffix not in (".ts", ".tsx") or "node_modules" in p.parts:
            continue
        antes = p.read_text(encoding="utf-8")
        depois = trocar_strings(antes)
        if depois != antes:
            p.write_text(depois, encoding="utf-8")
            mudados += 1
        for s in SOBRA.findall(depois):
            sobras.setdefault(str(p), set()).add(s)
    print(f"{mudados} arquivo(s) mudados")
    for arq, s in sorted(sobras.items()):
        print(f"  sem par: {arq}: {' '.join(sorted(s))}")


if __name__ == "__main__":
    main(sys.argv[1])
