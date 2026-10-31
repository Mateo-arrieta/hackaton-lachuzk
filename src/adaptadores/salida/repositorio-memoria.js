/**
 * ADAPTADOR DE SALIDA · repositorio en memoria                             (ETAPA 2 · tu trabajo)
 *
 * Cumple el puerto de ../../aplicacion/puerto-repositorio.js guardando las evaluaciones en un arreglo.
 * Es el adaptador más simple: sirve para las pruebas y para arrancar sin configurar nada.
 *
 * Lo importante es el CONTRATO (lee el puerto): ids que asigna él mismo (mayor + 1), copias en vez de las referencias
 * originales y los cuatro métodos con el significado exacto. Las pruebas de la Etapa 2 son las MISMAS para el
 * adaptador de archivo: si los dos las pasan, son intercambiables y el resto de la aplicación no se entera.
 *
 * Comprueba con:   npm run verificar -- 2
 */

export function crearRepositorioMemoria() {
  let lista = [];

  const copia = (e) => ({ ...e });
  const siguienteId = () => lista.reduce((mayor, e) => Math.max(mayor, e.id), 0) + 1;

  return {
    listar() {
      return lista.map(copia);
    },

    obtener(id) {
      const encontrada = lista.find((e) => e.id === id);
      return encontrada ? copia(encontrada) : undefined;
    },

    guardar(evaluacion) {
      const nueva = copia(evaluacion);
      if (nueva.id === undefined || nueva.id === null) nueva.id = siguienteId();

      const indice = lista.findIndex((e) => e.id === nueva.id);
      if (indice >= 0) lista[indice] = nueva;
      else lista.push(nueva);

      return copia(nueva);
    },

    eliminar(id) {
      const indice = lista.findIndex((e) => e.id === id);
      if (indice < 0) return false;
      lista.splice(indice, 1);
      return true;
    },
  };
}