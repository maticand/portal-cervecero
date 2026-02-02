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
      // DAISYUI: Componente 'Hero' para pantallas completas de aviso
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">🛒 Carrito Vacío</h1>
            <p className="py-6">Parece que aún no has elegido nada.</p>
            <Link href="/" className="btn btn-primary">Volver al Catálogo</Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. GENERACIÓN DEL MENSAJE DE WHATSAPP
  // Creamos un string de texto con el resumen.
  // .map() transforma cada producto en una línea de texto "- 2x Cerveza ($100)".
  // .join("\n") une todas esas líneas con un salto de línea.
  // DOCS: Array.prototype.join() - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/join
  const message = `Hola! Quiero confirmar mi pedido: \n${items.map((i) => `- ${i.quantity}x ${i.name} ($${i.price * i.quantity})`).join("\n")}\n\n*Total Final: ${siteConfig.currency}${total()}*`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(message)}`;


  return (
    <div className="container mx-auto p-3 max-w-2xl pb-32"> 
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <Link href="/" className="btn btn-circle btn-ghost text-xl">
          ←
        </Link>
        <h1 className="text-2xl font-bold">Resumen del Pedido</h1>
      </div>

      {/* LISTA DE ITEMS */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          // Tarjeta principal con items centrados verticalmente
          <div key={item.id} className="card bg-base-100 shadow-sm border border-base-200 p-3 flex-row items-center gap-3">
            
            {/* 1. FOTO MÁS CHICA (Izquierda) */}
            <div className="avatar shrink-0">
              <div className="w-14 h-14 rounded-lg sm:w-16 sm:h-16">
                <img 
                  src={item.image_url || siteConfig.placeholderImage} 
                  alt={item.name} 
                  className="object-cover"
                />
              </div>
            </div>

            {/* 2. INFO TEXTO FLUIDO (Centro) */}
            <div className="flex flex-col flex-grow justify-center min-w-0 overflow-hidden">
              <h3 className="font-bold text-sm sm:text-base leading-tight break-words">
                {item.name}
              </h3>
              <p className="text-xs opacity-70 mt-1">{siteConfig.currency}{item.price} c/u</p>
            </div>

            {/* 3. ACCIONES (Derecha) */}
            <div className="flex flex-col items-end gap-2 shrink-0 ml-1">
              
              {/* Subtotal */}
              <span className="font-bold text-base sm:text-lg text-primary">
                {siteConfig.currency}{item.price * item.quantity}
              </span>

              {/* Botones */}
              <div className="join border border-base-300 shadow-sm bg-base-200/50 rounded-lg h-7">
                <button 
                  onClick={() => removeItem(item.id)} 
                  // Botones un poco más compactos
                  className="btn btn-xs sm:btn-sm btn-ghost join-item text-error hover:bg-base-200 px-3"
                > - </button>
                
                <span className="join-item flex items-center px-2 text-xs sm:text-sm font-bold bg-base-100 tabular-nums">
                  {item.quantity}
                </span>

                <button 
                  onClick={() => addItem(item)} 
                  className="btn btn-xs sm:btn-sm btn-ghost join-item text-success hover:bg-base-200 px-3"
                > + </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* FOOTER TOTAL */}
      <div className="mt-6 pt-4 border-t border-base-300/50">
        <div className="flex justify-between items-end mb-6 px-1">
          <span className="text-base font-medium opacity-80 pb-1">Total</span>
          <span className="text-3xl font-extrabold text-success tracking-tight">
            {siteConfig.currency}{total()}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer" // DOCS: Seguridad para links externos (evita ataques de phishing)
          className="btn btn-success btn-block btn-lg text-white shadow-lg transform active:scale-95 transition-transform"
        >
          Confirmar Pedido en WhatsApp 📲
        </a>
      </div>
    </div>
  );
}