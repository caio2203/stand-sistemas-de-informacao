import { ehAppNativo, pluginNativo } from "../../compartilhado/plataforma.js";

const BOM = "﻿"; // faz o Excel reconhecer os acentos do CSV

/**
 * Salva um arquivo de texto para o administrador.
 * - No APK: grava em Documentos usando o plugin @capacitor/filesystem.
 * - No navegador: baixa o arquivo.
 * Devolve { ok, mensagem }.
 */
export async function salvarArquivoTexto({ nome, conteudo, tipo = "text/csv" }) {
  if (ehAppNativo()) {
    const sistemaDeArquivos = pluginNativo("Filesystem");
    if (!sistemaDeArquivos) {
      return { ok: false, mensagem: "Plugin de arquivos não instalado. Copie o texto abaixo." };
    }
    try {
      await sistemaDeArquivos.writeFile({ path: nome, data: BOM + conteudo, directory: "DOCUMENTS", encoding: "utf8" });
      return { ok: true, mensagem: `Salvo em Documentos/${nome}` };
    } catch (erro) {
      return { ok: false, mensagem: "Não foi possível salvar o arquivo. Copie o texto abaixo." };
    }
  }

  const blob = new Blob([BOM + conteudo], { type: `${tipo};charset=utf-8` });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  return { ok: true, mensagem: `Arquivo ${nome} baixado.` };
}
