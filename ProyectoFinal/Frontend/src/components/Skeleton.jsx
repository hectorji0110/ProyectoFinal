/**
 * Componente: Skeleton
 * @description
 * Componente de placeholder animado (Skeleton Loader) para mostrar mientras
 * se cargan los datos reales en la UI. Utiliza animación de pulso para dar
 * sensación de carga y mantiene consistencia en modo claro y oscuro.
 */
const Skeleton = () => {
  return (
    <div className="animate-pulse rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Bloque simulado para imagen */}
      <div className="w-full h-56 bg-gray-300 dark:bg-gray-700"></div>
      {/* Contenido simulado */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
      </div>
    </div>
  );
};
export default Skeleton;
