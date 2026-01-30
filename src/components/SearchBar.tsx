"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  // Inicializamos el enrutador para poder cambiar la URL
  const router = useRouter();
  // Obtenemos los parámetros actuales de la URL (para leer ?q=...)
  const searchParams = useSearchParams();

  // 1. ESTADO LOCAL
  // Guardamos lo que el usuario escribe. Si ya hay algo en la URL, lo usamos como valor inicial.
  const [term, setTerm] = useState(searchParams.get("q") || "");

  // EFECTO DEBOUNCE
  // Explicación: No queremos recargar la página por cada letra. Esperamos 500ms.
  // Docs useEffect: https://react.dev/reference/react/useEffect
  // Docs setTimeout: https://developer.mozilla.org/es/docs/Web/API/setTimeout
  useEffect(() => {
    // Creamos un temporizador (timer) que esperará 500ms
    const timer = setTimeout(() => {
      // Si hay texto, actualizamos la URL con ?q=texto
      if (term) router.push(`/?q=${term}`);
      // Si el usuario borró todo, volvemos a la raiz (/)
      else router.push("/");
    }, 500);// Tiempo de espera: medio segundo

    //  FUNCION DE LIMPIEZA (CLEANUP)
    // Si el usuario escribe otra letra ANTES de los 500ms, React ejecuta esto primero
    return () => clearTimeout(timer);
  }, [term, router]); // Este efecto se reinicia cada vez que cambia 'term' (lo que escribes)

  // 3. FUNCIÓN PARA BORRAR (La "X")
  const clearSearch = () => {
    setTerm(""); // Vaciamos el estado local (input)
    router.push("/"); // Forzamos la ida al inicio inmediatamente
  };

  return (
    <div className="form-control w-full max-w-lg mb-8 mx-auto">
      {/* DAISYUI: 'input input-bordered' crea el input con borde estándar.
         'flex items-center gap-2' nos permite poner el ícono adentro visualmente.
      */}
      <label className="input input-bordered input-lg w-full max-w-lg mx-auto">  
        
        {/* SVG de Lupa (Iconografía estándar) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
        
        {/* EL INPUT DE TEXTO */} 
        <input
          type="text"
          className="grow" // Ocupa todo el espacio disponible
          placeholder="Buscar Producto..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        {/* Botón de limpiar (Solo aparece si hay texto) */}
        {term && (
          // DAISYUI: 'btn-circle' hace un botón perfectamente redondo.
          <button onClick={clearSearch} className="btn btn-circle btn-ghost btn-xs text-base-content/50 hover:text-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </label>
    </div>
  );
}