// O envio de arquivo com progresso e resposta em NDJSON: o `fetch` sobre XHR
// (o fetch não dá o progresso do envio) e a leitura linha a linha da resposta.
// Nada aqui conhece a API do consumidor: o erro da leitura sobe como veio, e
// quem chama o traduz.

const SEM_CORPO = new Set([101, 204, 205, 304]);

/** O `fetch` do envio, sobre XHR: o mesmo pedido que o cliente montou (cabeçalhos inclusive), o progresso do envio em
 * bytes e a resposta em stream, à medida que chega. Serve de `fetch` ao openapi-fetch (`api.POST(..., { fetch })`). */
export function fetchComProgresso(aoEnviar: (enviados: number, total: number) => void, sinal: AbortSignal) {
  return async (pedido: Request): Promise<Response> => {
    const corpo = await pedido.blob();
    return new Promise((resolver, rejeitar) => {
      const xhr = new XMLHttpRequest();
      let lido = 0;
      let saida: ReadableStreamDefaultController<Uint8Array> | undefined;
      const resposta = new ReadableStream<Uint8Array>({ start: (c) => void (saida = c) });
      const codificar = new TextEncoder();
      const empurrar = () => {
        const texto = xhr.responseText;
        if (texto.length > lido) saida?.enqueue(codificar.encode(texto.slice(lido)));
        lido = texto.length;
      };
      const falhar = (erro: Error) => {
        rejeitar(erro);
        try {
          saida?.error(erro);
        } catch {
          // o stream já fechou
        }
      };
      xhr.open(pedido.method, pedido.url);
      pedido.headers.forEach((valor, nome) => xhr.setRequestHeader(nome, valor));
      xhr.upload.onprogress = (e) => aoEnviar(e.loaded, e.total);
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.HEADERS_RECEIVED) return;
        const cabecalhos = new Headers();
        for (const linha of xhr.getAllResponseHeaders().trim().split(/[\r\n]+/)) {
          const i = linha.indexOf(":");
          if (i > 0) cabecalhos.append(linha.slice(0, i).trim(), linha.slice(i + 1).trim());
        }
        resolver(new Response(SEM_CORPO.has(xhr.status) ? null : resposta, { status: xhr.status, headers: cabecalhos }));
      };
      xhr.onprogress = empurrar;
      xhr.onload = () => {
        empurrar();
        saida?.close();
      };
      xhr.onerror = () => falhar(new TypeError("rede"));
      xhr.onabort = () => falhar(new DOMException("cancelado", "AbortError"));
      sinal.addEventListener("abort", () => xhr.abort(), { once: true });
      xhr.send(corpo);
    });
  };
}

/** Lê a resposta NDJSON linha a linha, entregando cada uma a `aoLinha`. Devolve a linha `resumo`, ou null quando a
 * resposta acabou sem ela (o processamento não terminou). A falha da leitura sobe como veio. */
export async function lerNdjson<L extends { tipo: string }>(
  fluxo: ReadableStream<Uint8Array> | null | undefined,
  aoLinha: (linha: L) => void,
): Promise<L | null> {
  let resumo: L | null = null;
  if (!fluxo) return resumo;
  // TextDecoder no laço, não o TextDecoderStream: o pipeThrough dele não fecha os tipos no TypeScript 5.9.
  const leitor = fluxo.getReader();
  const decodificador = new TextDecoder();
  let resto = "";
  const ler = (texto: string) => {
    if (!texto.trim()) return;
    const linha = JSON.parse(texto) as L;
    if (linha.tipo === "resumo") resumo = linha;
    aoLinha(linha);
  };
  for (;;) {
    const { value, done } = await leitor.read();
    if (done) break;
    resto += decodificador.decode(value, { stream: true });
    const linhas = resto.split("\n");
    resto = linhas.pop() ?? "";
    linhas.forEach(ler);
  }
  ler(resto + decodificador.decode());
  return resumo;
}

const MB = 1024 * 1024;

/** Os bytes em MB, com uma casa (o valor das barras do envio). */
export const megabytes = (bytes: number) => Math.round((bytes / MB) * 10) / 10;

export const eZip = (arquivo: File) => arquivo.name.toLowerCase().endsWith(".zip");

/** Os arquivos escolhidos mais os novos, sem repetir o mesmo nome com o mesmo tamanho. */
export const juntarArquivos = (atuais: File[], novos: File[]) => [
  ...atuais,
  ...novos.filter((n) => !atuais.some((a) => a.name === n.name && a.size === n.size)),
];
