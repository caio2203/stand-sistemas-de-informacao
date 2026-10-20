/** Formata segundos como mm:ss (ex.: 90 -> "01:30"). */
export function mmss(segundos) {
  const total = Math.max(0, Math.ceil(segundos));
  const minutos = Math.floor(total / 60);
  return `${String(minutos).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
