"use client"; // 👈 Indica que este componente corre en el navegador (Client Component)

// Importamos los hooks necesarios de Next.js y React
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

  // 2. EFECTO "DEBOUNCE" (La espera inteligente)
  //  DOCS React: Synchronizing with Effects
  // https://react.dev/learn/synchronizing-with-effects
  useEffect(() => {
    // Creamos un temporizador (timer) que esperará 500ms
    const timer = setTimeout(() => {
      // Esta lógica se ejecuta SOLO si pasaron 500ms sin que el usuario escriba
      if (term) {
        // Si hay texto, actualizamos la URL con ?q=texto
        router.push(`/?q=${term}`);
      } else {
        // Si el usuario borró todo, volvemos a la raiz (/)
        router.push("/");
      }
    }, 500); // Tiempo de espera: medio segundo

    //  FUNCION DE LIMPIEZA (CLEANUP)
    // Si el usuario escribe otra letra ANTES de los 500ms, React ejecuta esto primero
    return () => {
      clearTimeout(timer); // Cancelamos el timer anterior para que no se ejecute
    };
  }, [term, router]); // Este efecto se reinicia cada vez que cambia 'term' (lo que escribes)

  // 3. FUNCIÓN PARA BORRAR (La "X")
  const clearSearch = () => {
    setTerm(""); // Vaciamos el estado local (input)
    router.push("/"); // Forzamos la ida al inicio inmediatamente
  };

  return (
    // Usamos 'relative' para poder posicionar la X adentro
    <div className="relative mb-8 max-w-full">
      
      {/* EL INPUT DE TEXTO */}
      <input
        type="text"
        placeholder="Buscar Producto..."
        // Clases de Tailwind:
        // pr-10: Padding a la derecha para que el texto no se monte sobre la X
        className="w-full p-3 pr-10 rounded bg-slate-800 text-white border border-slate-700 focus:border-yellow-500 outline-none transition-colors"
        
        // Conectamos el input con el estado
        value={term}
        // Cada vez que escribes, actualizamos el estado 'term' (y esto dispara el useEffect arriba)
        onChange={(e) => setTerm(e.target.value)}
      />

      {/* EL BOTÓN "X" PARA BORRAR */}
      {/* Solo mostramos la X si hay algo escrito (term existe) */}
      {term && (
        <button
          onClick={clearSearch} // Al hacer clic, ejecuta la limpieza
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Borrar búsqueda"
        >
          {/* Ícono de X simple (SVG) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}