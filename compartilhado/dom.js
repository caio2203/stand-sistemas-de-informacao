/**
 * Pequenos utilitários de DOM usados pelas telas.
 */

/** Junta todos os elementos com data-ref="nome" dentro de `raiz` em um objeto. */
export function referencias(raiz) {
  const refs = {};
  raiz.querySelectorAll("[data-ref]").forEach((elemento) => {
    refs[elemento.dataset.ref] = elemento;
  });
  return refs;
}

/** Remove e recoloca uma classe de animação para que ela rode de novo. */
export function reiniciarAnimacao(elemento, classe) {
  elemento.classList.remove(classe);
  void elemento.offsetWidth; // força o navegador a aplicar a remoção
  elemento.classList.add(classe);
}

/**
 * Agendador de tarefas atrasadas que podem ser canceladas em bloco.
 * Útil quando a pessoa sai da tela no meio de uma animação.
 */
export function criarAgendador() {
  const pendentes = new Set();
  return {
    depois(ms, tarefa) {
      const id = setTimeout(() => {
        pendentes.delete(id);
        tarefa();
      }, ms);
      pendentes.add(id);
      return id;
    },
    cancelar(id) {
      clearTimeout(id);
      pendentes.delete(id);
    },
    cancelarTudo() {
      pendentes.forEach(clearTimeout);
      pendentes.clear();
    }
  };
}
