const Loader = ({ size = "text-5xl", color = "text-orange-500", spin = false, bounce = true }) => {
  return (
    <div className="flex justify-center items-center">
      <span className={`${size} ${color} ${bounce && !spin ? "animate-bounce ease-in-out duration-2000" : ""}`}>
        🐾
      </span>
    </div>
  );
};

export default Loader;