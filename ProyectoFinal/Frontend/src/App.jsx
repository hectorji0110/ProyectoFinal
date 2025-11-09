import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
function App() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="grow flex items-center justify-center ">
      <Hero />
      </main>
    </div>
  );
}

export default App;
