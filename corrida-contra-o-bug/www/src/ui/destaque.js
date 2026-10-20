import { tokenizarPython } from "../dominio/sintaxe.js";

// No máximo 4 cores (DESIGN.md). Nomes de função ficam na cor do texto.
const CLASSES = {
  comentario: "s-comentario",
  texto: "s-texto",
  numero: "s-numero",
  palavra: "s-palavra"
};

/** Monta a linha de código colorida. Usa textContent: nenhum texto vira HTML. */
export function linhaDestacada(linha) {
  const fragmento = document.createDocumentFragment();
  for (const { tipo, texto } of tokenizarPython(linha)) {
    if (CLASSES[tipo]) {
      const span = document.createElement("span");
      span.className = CLASSES[tipo];
      span.textContent = texto;
      fragmento.appendChild(span);
    } else {
      fragmento.appendChild(document.createTextNode(texto));
    }
  }
  return fragmento;
}
