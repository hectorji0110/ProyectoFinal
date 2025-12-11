import { useState } from "react";
/**
 * SelectCustom
 *
 * Componente de selección personalizado (dropdown) que permite al usuario
 * elegir una opción de una lista de elementos. Soporta tema oscuro y truncado de texto largo,
 * ademas de sermas funcional para pantallas pequeñas.
 *
 * FUNCIONALIDAD PRINCIPAL:
 * 1. Muestra un botón principal con la opción seleccionada o un texto por defecto.
 * 2. Al hacer click en el botón, despliega la lista de opciones disponibles.
 * 3. Permite seleccionar una opción y llama a la función `onChange` con el valor seleccionado.
 * 4. Cierra automáticamente la lista al seleccionar una opción.
 * 5. Maneja truncado de texto para opciones largas.
 *
 * @component
 * @param {Object} props - Props del componente
 * @param {string} [props.label] - Etiqueta opcional del select
 * @param {Array<{ label: string, value: any }>} [props.options] - Opciones disponibles
 * @param {any} props.value - Valor seleccionado actualmente
 * @param {function} props.onChange - Función llamada al cambiar la opción
 * @returns {JSX.Element} Dropdown personalizado
 */
const SelectCustom = ({ label, options = [], value, onChange }) => {
  const [open, setOpen] = useState(false);
  const opcionSeleccionada = options.find((opt) => opt.value === value);
  return (
    <div className="relative min-w-[150px] w-auto mb-2">
      {label && <label className="block mb-1 ">{label}</label>}
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border p-2 w-full  dark:bg-gray-800 text-left truncate rounded cursor-pointer"
      >
        {opcionSeleccionada
          ? opcionSeleccionada.label
          : label || "Seleccionar..."}
        {/* Flecha */}
        <span className="absolute right-3 pointer-events-none text-gray-500 dark:text-gray-300">
          ▼
        </span>
      </button>
      {/* Lista */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border rounded shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-2 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 truncate"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SelectCustom;
