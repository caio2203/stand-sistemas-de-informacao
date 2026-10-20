/**
 * Conjunto único de ícones (traço). Só dois: certo e errado.
 * Sempre usados junto com texto, nunca sozinhos (WCAG 1.4.1).
 */
const ATRIBUTOS = 'class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

export const ICONES = Object.freeze({
  certo: `<svg ${ATRIBUTOS}><polyline points="4 12.5 9.5 18 20 6"/></svg>`,
  errado: `<svg ${ATRIBUTOS}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`
});

/** Cria um <span> com ícone + texto. O texto é inserido como texto, nunca como HTML. */
export function rotuloComIcone(nomeIcone, texto) {
  const span = document.createElement("span");
  span.innerHTML = ICONES[nomeIcone];
  span.append(` ${texto}`);
  return span;
}
