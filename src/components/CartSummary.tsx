"use client"; // 👈 Obligatorio: corre en el navegador

import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

// Si todavía no creaste el archivo config/site.ts, podés borrar esta línea
// y cambiar "siteConfig.currency" por "$" manualmente abajo.
import { siteConfig } from "@/config/site";

export default function CartSummary() {
  // 📚 DOCS: Zustand
  // Traemos la lista de items y la función para calcular el dinero total
  const { items, total } = useCartStore();
  
  // Lógica para evitar errores de hidratación de Next.js
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  // Si el carrito está vacío, la barra desaparece
  if (items.length === 0) return null;

  // 🧮 MATEMÁTICA PURA (La solución a tu problema)
  // items.length devuelve 1 (porque hay 1 producto).
  // items.reduce suma las CANTIDADES de cada producto.
  // 📚 DOCS: Array.prototype.reduce() - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  const totalUnits = items.reduce((acumulado, item) => acumulado + item.quantity, 0);

  // Mensaje para WhatsApp
  const message = `Hola! Quiero hacer este pedido: \n${items
    .map((i) => `- ${i.quantity}x ${i.name}`)
    .join("\n")}\n\nTotal a Pagar: $${total()}`;
    
  // Usamos el número de siteConfig o un número por defecto si no lo tienes configurado
  const phone = siteConfig?.whatsappPhone || "5491100000000"; 
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 p-4 shadow-2xl z-50">

      {/* Contenedor interno para centrar y limitar el ancho máximo */}
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* LADO IZQUIERDO: Información */}
        <div className="flex flex-col">
          <span className="text-green-400 font-bold text-2xl">
            {/* Muestra el Dinero Total */}
            Total: ${total()}
          </span>
          <span className="text-yellow-500 text-sm font-bold">
            {/* 👇 AQUÍ ESTÁ EL CAMBIO: Usamos totalUnits en vez de items.length */}
            Tu pedido actual ({totalUnits} {totalUnits === 1 ? "item" : "items"})
          </span>
        </div>

        {/* LADO DERECHO: Botón WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2 shadow-lg"
        >
          {/* Ícono simple de WhatsApp */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Finalizar Pedido por WhatsApp
        </a>
      </div>
    </div>
  );
}