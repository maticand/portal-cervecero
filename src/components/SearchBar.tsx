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
    <div className="w-full max-w-md mx-auto mb-8">
      {/* CORRECCIÓN DE ALINEACIÓN:
         1. 'flex': Convierte la caja en una fila flexible.
         2. 'items-center': Alinea todo verticalmente al centro.
         3. 'gap-2': Da espacio entre la lupa, el texto y la X.
         4. 'input input-bordered': Estilos base de DaisyUI.
      */}
      <label className="input input-bordered flex items-center gap-2 h-12 shadow-sm">
        
        {/* ÍCONO (Izquierda) */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 16 16" 
          fill="currentColor" 
          className="w-5 h-5 opacity-70 shrink-0" // shrink-0 evita que se aplaste
        >
          <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
        </svg>
        
        {/* CAMPO DE TEXTO (Centro) */}
        <input
          type="text"
          className="grow bg-transparent outline-none border-none h-full" // 'grow' ocupa todo el espacio sobrante
          placeholder="Buscar..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        {/* BOTÓN BORRAR (Derecha) */}
        {term && (
          <button 
            onClick={clearSearch} 
            className="btn btn-circle btn-ghost btn-xs shrink-0 text-base-content/60 hover:text-error"
            aria-label="Borrar búsqueda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </label>
    </div>
  );
}