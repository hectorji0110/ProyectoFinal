/**
 * Función: cn
 * @description
 * Función utilitaria para concatenar clases CSS condicionalmente.
 * Filtra valores falsy (undefined, null, false, "", 0) y une los
 * valores restantes con un espacio. Muy útil para usar con TailwindCSS
 * o cualquier librería de clases dinámicas.
 *
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
