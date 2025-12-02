const Loader = ({ size = "text-6xl", color = "text-orange-500", spin = false, bounce = true, text = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Emoji animado */}
      <span className={`${size} ${color} ${bounce && !spin ? "animate-bounce ease-in-out duration-2000" : ""}`}>
        🐾
      </span>
      {/* Texto debajo */}
      <span className="text-gray-700 dark:text-gray-300 font-semibold">{text}</span>
    </div>
  );
};

export default Loader;