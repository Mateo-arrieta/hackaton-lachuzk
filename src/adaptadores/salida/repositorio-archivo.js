/**
 * ADAPTADOR DE SALIDA · repositorio en un archivo JSON                     (ETAPA 2 · tu trabajo)
 *
 * Cumple EL MISMO puerto que el de memoria, pero guarda las evaluaciones en un archivo: un arreglo JSON.
 * Así los datos sobreviven a un reinicio del servidor (y, en la Etapa 6, a un contenedor nuevo).
 *
 *   crearRepositorioArchivo('/ruta/evaluaciones.json')
 *
 * Detalles que las pruebas comprueban:
 *   · si el archivo todavía no existe, `listar()` devuelve [] (no es un error);
 *   · al guardar por primera vez se crea el archivo… y también su carpeta, si hace falta (mira mkdirSync con { recursive: true });
 *   · otra instancia apuntando al mismo archivo ve lo que guardó la primera;
 *   · las mismas reglas del contrato que el de memoria (ids, copias, orden).
 *
 * Usa node:fs en su versión síncrona (readFileSync, writeFileSync, existsSync, mkdirSync) y node:path.
 *
 * Comprueba con:   npm run verificar -- 2
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function crearRepositorioArchivo(ruta) {
  function leer() {
    if (!existsSync(ruta)) return [];
    const texto = readFileSync(ruta, 'utf8');
    return texto.trim() === '' ? [] : JSON.parse(texto);
  }

  function escribir(lista) {
    mkdirSync(dirname(ruta), { recursive: true });
    writeFileSync(ruta, JSON.stringify(lista, null, 2));
  }

  const copia = (e) => ({ ...e });
  const siguienteId = (lista) => lista.reduce((mayor, e) => Math.max(mayor, e.id), 0) + 1;

  return {
    listar() {
      return leer().map(copia);
    },

    obtener(id) {
      const encontrada = leer().find((e) => e.id === id);
      return encontrada ? copia(encontrada) : undefined;
    },

    guardar(evaluacion) {
      const lista = leer();
      const nueva = copia(evaluacion);
      if (nueva.id === undefined || nueva.id === null) nueva.id = siguienteId(lista);

      const indice = lista.findIndex((e) => e.id === nueva.id);
      if (indice >= 0) lista[indice] = nueva;
      else lista.push(nueva);

      escribir(lista);
      return copia(nueva);
    },

    eliminar(id) {
      const lista = leer();
      const indice = lista.findIndex((e) => e.id === id);
      if (indice < 0) return false;
      lista.splice(indice, 1);
      escribir(lista);
      return true;
    },
  };
}
