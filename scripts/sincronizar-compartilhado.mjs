/**
 * Copia o núcleo compartilhado (stand-sistemas-de-informacao/compartilhado/)
 * para www/compartilhado/ do jogo em que o comando for executado.
 *
 * Por que copiar? O Capacitor empacota apenas a pasta www/ de cada jogo,
 * então o código comum precisa estar dentro dela. A fonte única continua
 * sendo a pasta compartilhado/ da raiz: edite sempre lá.
 *
 * Uso (dentro da pasta de um jogo):  npm run preparar
 */
import { cpSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raizDoStand = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origem = join(raizDoStand, "compartilhado");
const pastaWeb = resolve(process.cwd(), "www");
const destino = join(pastaWeb, "compartilhado");

if (!existsSync(pastaWeb)) {
  console.error("Pasta www/ não encontrada. Rode este comando dentro da pasta de um jogo.");
  process.exit(1);
}

rmSync(destino, { recursive: true, force: true });
cpSync(origem, destino, { recursive: true });
writeFileSync(
  join(destino, "LEIA-ME.txt"),
  "Pasta gerada automaticamente por scripts/sincronizar-compartilhado.mjs.\n" +
    "NAO edite aqui: edite stand-sistemas-de-informacao/compartilhado/ e rode `npm run preparar`.\n"
);

console.log(`Núcleo compartilhado copiado para ${destino}`);
