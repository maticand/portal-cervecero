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
    <div className="container mx-auto p-4 max-w-2xl pb-32">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <Link href="/" className="btn btn-circle btn-ghost text-xl">
          ←
        </Link>
        <h1 className="text-2xl font-bold">Resumen del Pedido</h1>
      </div>

      {/* LISTA DE ITEMS (DISEÑO MOBILE-FRIENDLY)*/}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="card card-side bg-base-100 shadow-md border border-base-200 p-3 items-center">
            
            {/* 1. Imagen (Izquierda) */}
            <figure className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <img 
                src={item.image_url || siteConfig.placeholderImage} 
                alt={item.name} 
                className="h-full w-full object-cover"
              />
            </figure>

            {/* 2. Info y Controles (Derecha) */}
            <div className="flex flex-col flex-grow ml-4 justify-between">
              
              {/* Fila Superior: Nombre y Precio Total */}
              <div className="flex justify-between items-start w-full">
                <div>
                  <h3 
                    className="font-bold text-sm sm:text-base leading-tight">{item.name}</h3>
                  <p className="text-xs opacity-60 mt-1">{siteConfig.currency}{item.price} c/u</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary block">
                    {siteConfig.currency}{item.price * item.quantity}
                  </span>
                </div>
              </div>

              {/* Fila Inferior: Controles de Cantidad */}
              <div className="flex justify-end">
                <div className="join border border-base-300 ">
                      <button onClick={() => removeItem(item.id)} 
                      className="btn btn-ghost btn-error btn-xs join-item font-bold shadow-none"> - </button>

                      <span className="join-item px-3 btn-xs flex items-center font-bold text-base-content select-none">{item.quantity}</span>

                      <button onClick={() => addItem(item)} 
                      className="btn btn-ghost btn-warning btn-xs join-item font-bold   shadow-none"> + </button> 
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* FOOTER FIJO DE PAGO */}
      <div className="mt-8 border-t border-base-300 pt-4">
        <div className="flex justify-between items-center mb-6 px-2">
          <span className="text-lg opacity-80">Total a Pagar</span>
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