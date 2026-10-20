/**
 * Servidor estático mínimo para testar um jogo no navegador, sem instalar nada.
 * Uso: node scripts/servidor-local.mjs <pasta www do jogo> <porta>
 * Ex.: node scripts/servidor-local.mjs quiz-perfil-profissional/www 8080
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, normalize, extname, resolve } from "node:path";

const [, , pasta = "www", porta = "8080"] = process.argv;
const raiz = resolve(pasta);
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

createServer(async (pedido, resposta) => {
  let caminho = decodeURIComponent(new URL(pedido.url, "http://local").pathname);
  if (caminho.endsWith("/")) caminho += "index.html";
  const arquivo = normalize(join(raiz, caminho));
  if (!arquivo.startsWith(raiz)) {
    resposta.writeHead(403).end();
    return;
  }
  try {
    const conteudo = await readFile(arquivo);
    resposta.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] || "application/octet-stream", "Cache-Control": "no-store" });
    resposta.end(conteudo);
  } catch {
    resposta.writeHead(404).end("Arquivo não encontrado");
  }
}).listen(Number(porta), () => console.log(`Servindo ${raiz} em http://localhost:${porta}`));
