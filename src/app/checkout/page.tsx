"use client"; // DOCS: Indica que este componente usa interactividad (hooks) en el navegador.
// https://nextjs.org/docs/app/building-your-application/rendering/client-components

import { useCartStore } from "@/store/cart"; // Importamos nuestro estado global (el cerebro)
import { siteConfig } from "@/config/site";  // Importamos la configuración del sitio (moneda, teléfono)
import Link from "next/link";                // DOCS: Componente optimizado para navegar entre páginas sin recargar.
                                             // https://nextjs.org/docs/app/api-reference/components/link
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // DOCS: Hook para redirigir al usuario programáticamente.
                                             // https://nextjs.org/docs/app/api-reference/functions/use-router

export default function CheckoutPage() {
  // 1. CONEXIÓN CON ZUSTAND
  // Extraemos los datos y funciones que necesitamos del store.
  const { items, addItem, removeItem, total } = useCartStore();
  
  // 2. SOLUCIÓN AL PROBLEMA DE HIDRATACIÓN
  // Next.js renderiza en el servidor, pero el carrito vive en el navegador (LocalStorage).
  // Esperamos a que el componente se "monte" en el navegador para mostrar datos.
  // DOCS: React useEffect - https://react.dev/reference/react/useEffect
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Si no está montado, devolvemos null para evitar errores visuales rápidos.
  if (!isMounted) return null;

  // 3. VALIDACIÓN DE CARRITO VACÍO
  // Si el usuario entra aquí directamente sin productos, lo mandamos al inicio.
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío 🛒</h2>
        <Link 
          href="/" 
          className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition"
        >
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  // 4. GENERACIÓN DEL MENSAJE DE WHATSAPP
  // Creamos un string de texto con el resumen.
  // .map() transforma cada producto en una línea de texto "- 2x Cerveza ($100)".
  // .join("\n") une todas esas líneas con un salto de línea.
  // DOCS: Array.prototype.join() - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join
  const message = `Hola! Quiero Pedir: \n${items
    .map((i) => `- ${i.quantity}x ${i.name} ($${i.price * i.quantity})`)
    .join("\n")}\n\n*Total: ${siteConfig.currency}${total()}*`;

  // Construimos la URL. encodeURIComponent convierte espacios y enters en códigos seguros para URL (%20, etc).
  // DOCS: encodeURIComponent - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 pb-32">
      <div className="max-w-2xl mx-auto">
        
        {/* ENCABEZADO CON NAVEGACIÓN */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            ← Volver
          </Link>
          <h1 className="text-3xl font-bold text-yellow-500">Resumen del Pedido</h1>
        </div>

        {/* LISTA DE PRODUCTOS (Iteramos sobre los items) */}
        <div className="bg-slate-900 rounded-lg p-6 shadow-xl border border-slate-800 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-slate-800 pb-6 last:border-0 last:pb-0">
              
              {/* IMAGEN DEL PRODUCTO */}
              <div className="w-16 h-16 rounded overflow-hidden bg-slate-800 flex-shrink-0">
                <img 
                  // Usamos un "Placeholder" si la imagen viene vacía de la base de datos
                  src={item.image_url || "https://placehold.co/400x300"} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* INFORMACIÓN DEL ITEM */}
              <div className="flex-grow">
                <h3 className="text-white font-bold">{item.name}</h3>
                <p className="text-gray-400 text-sm">
                  {siteConfig.currency}{item.price} x unidad
                </p>
              </div>

              {/* CONTROLES DE CANTIDAD (Reutilizamos la lógica del Store) */}
              <div className="flex items-center gap-3 bg-slate-800 rounded-full px-2 py-1 border border-slate-700">
                {/* Botón Restar */}
                <button
                  onClick={() => removeItem(item.id)} // Llama a la lógica de Zustand
                  className="w-8 h-8 flex items-center justify-center bg-slate-700 text-white rounded-full hover:bg-red-500 transition font-bold"
                >
                  -
                </button>
                
                {/* Cantidad Actual */}
                <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                
                {/* Botón Sumar */}
                <button
                  onClick={() => addItem(item)} // Llama a la lógica de Zustand
                  className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* TOTAL FINAL */}
          <div className="pt-4 flex justify-between items-center text-xl">
            <span className="text-gray-400">Total a pagar:</span>
            <span className="text-green-400 font-bold text-2xl">
              {siteConfig.currency}{total()}
            </span>
          </div>
        </div>

        {/* BOTÓN FINAL DE CONFIRMACIÓN (Link externo a WhatsApp) */}
        <a
          href={whatsappUrl}
          target="_blank" // Abre en pestaña nueva
          rel="noopener noreferrer" // DOCS: Seguridad para links externos (evita ataques de phishing)
                                    // https://web.dev/articles/external-anchors-use-rel-noopener
          className="mt-8 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-center block text-lg shadow-lg hover:scale-[1.02] transition-transform"
        >
          Enviar Pedido a WhatsApp 📲
        </a>
      </div>
    </main>
  );
}