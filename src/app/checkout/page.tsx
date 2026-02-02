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
            <h1 className="text-5xl font-bold">🛒 Carrito Vacío</h1>
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
    // 'bg-base-200' es un gris muy suave, ideal para fondos de aplicación
    <main className="min-h-screen bg-base-200 p-4 md:p-8 pb-32">
      <div className="max-w-3xl mx-auto">
        
        {/* Header con botón de volver */}
        <div className="flex items-center gap-4 mb-6">
          {/* 'btn-circle' + 'btn-ghost' crea un botón redondo transparente */}
          <Link href="/" className="btn btn-circle btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-3xl font-bold">Resumen del Pedido</h1>
        </div>

        {/* DAISYUI: Tabla Contenedora */}
        {/* 'overflow-x-auto' permite scroll horizontal en móviles si la tabla es muy ancha */}
        <div className="overflow-x-auto bg-base-100 rounded-box shadow-xl border border-base-300">
          <table className="table">
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-base-200">
                  
                  {/* Columna 1: Imagen con Máscara */}
                  <td>
                    <div className="avatar">
                      {/* 'mask mask-squircle' le da esa forma entre cuadrada y redonda moderna (tipo iOS) */}
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={item.image_url || siteConfig.placeholderImage} alt={item.name} />
                      </div>
                    </div>
                  </td>
                  
                  {/* Columna 2: Nombre y Precio Unitario */}
                  <td className="w-full">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-sm opacity-50">{siteConfig.currency}{item.price} c/u</div>
                  </td>

                  {/* Columna 3: Controles de Cantidad */}
                  <td>
                    <div className="join border border-base-300">
                      <button onClick={() => removeItem(item.id)} 
                      className="btn btn-ghost btn-error btn-sm join-item font-bold text-lg shadow-none"> - </button>

                      <span className="join-item px-1 flex items-center font-bold text-base-content select-none">{item.quantity}</span>

                      <button onClick={() => addItem(item)} 
                      className="btn btn-ghost btn-warning btn-sm join-item font-bold text-lg shadow-none"> + </button>
                    </div>
                  </td>

                  {/* Columna 4: Subtotal del Item */}
                  <th className="text-right whitespace-nowrap">
                    {siteConfig.currency}{item.price * item.quantity}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Footer Personalizado de la Tabla (Total General) */}
          <div className="p-5 bg-base-200 flex justify-between items-center border-t border-base-300">
            <span className="font-bold text-lg">Total a Pagar</span>
            <span className="font-extrabold text-2xl text-success">{siteConfig.currency}{total()}</span>
          </div>
        </div>

        {/* Botón Final */}
        {/* 'btn-block' hace que ocupe todo el ancho. 'btn-lg' lo hace grande y fácil de tocar. */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer" // DOCS: Seguridad para links externos (evita ataques de phishing)
          className="btn btn-success btn-block btn-lg mt-8 text-white shadow-lg transform active:scale-95 transition-transform"
        >
          Confirmar Pedido en WhatsApp 📲
        </a>
      </div>
    </main>
  );
}