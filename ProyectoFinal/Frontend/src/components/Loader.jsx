/**
 * Loader
 *
 * Componente visual que muestra un indicador de carga.
 * Utiliza un emoji 🐾 animado y un texto descriptivo.
 *
 * Props:
 * - size: Tamaño del emoji (clases de Tailwind). Ej: "text-4xl", "text-6xl".
 * - color: Color del emoji (Tailwind). Ej: "text-orange-500".
 * - spin: Si es true, desactiva el bounce y permite usar animaciones externas.
 * - bounce: Si es true, el emoji tendrá animación "bounce".
 * - text: Texto que se muestra debajo del emoji.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.size="text-6xl"] - Tamaño del emoji.
 * @param {string} [props.color="text-orange-500"] - Color del emoji.
 * @param {boolean} [props.spin=false] - Controla si se usa animación externa o no.
 * @param {boolean} [props.bounce=true] - Activa animación bounce si spin no está activo.
 * @param {string} [props.text="Cargando..."] - Texto mostrado debajo del icono.
 * @returns {JSX.Element} Indicador animado de carga.
 */
const Loader = ({
  size = "text-6xl",
  color = "text-orange-500",
  spin = false,
  bounce = true,
  text = "Cargando...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Emoji animado */}
      <span
        className={`${size} ${color} ${
          bounce && !spin ? "animate-bounce ease-in-out duration-2000" : ""
        }`}
      >
        🐾
      </span>
      {/* Texto debajo */}
      <span className="text-gray-700 dark:text-gray-300 font-semibold">
        {text}
      </span>
    </div>
  );
};
export default Loader;
