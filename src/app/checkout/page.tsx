"use client";

import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items, addItem, removeItem, total } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  // ESTADO VACÍO
  if (items.length === 0) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">Carrito Vacío 🛒</h1>
            <p className="py-6 text-base-content/70">No tienes productos seleccionados.</p>
            <Link href="/" className="btn btn-primary rounded-full px-8">Volver al Catálogo</Link>
          </div>
        </div>
      </div>
    );
  }

  const message = `Hola! Pedido: \n${items.map(i => `${i.quantity}x ${i.name}`).join("\n")}\nTotal: ${total()}`;
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
              <p className="text-xs opacity-70 mt-1">{siteConfig.currency}{item.price} unit.</p>
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
                  className="btn btn-xs sm:btn-sm btn-ghost join-item text-error hover:bg-base-200 px-1"
                >
                  -
                </button>
                
                <span className="join-item flex items-center px-2 text-xs sm:text-sm font-bold bg-base-100 tabular-nums">
                  {item.quantity}
                </span>

                <button 
                  onClick={() => addItem(item)} 
                  className="btn btn-xs sm:btn-sm btn-ghost join-item text-success hover:bg-base-200 px-1"
                >
                  +
                </button>
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