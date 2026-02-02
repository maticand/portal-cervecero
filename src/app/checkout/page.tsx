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
    <div className="container mx-auto p-4 max-w-2xl pb-32">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <Link href="/" className="btn btn-circle btn-ghost text-xl">
          ←
        </Link>
        <h1 className="text-2xl font-bold">Resumen del Pedido</h1>
      </div>

      {/* LISTA DE ITEMS ESTILIZADA */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          // USAMOS 'items-center' PARA CENTRAR TODO VERTICALMENTE
          <div key={item.id} className="card bg-base-100 shadow-md border border-base-200 p-4 flex-row items-center gap-4">
            
            {/* 1. FOTO (Izquierda) */}
            <div className="avatar shrink-0">
              <div className="w-20 h-20 rounded-xl">
                <img 
                  src={item.image_url || siteConfig.placeholderImage} 
                  alt={item.name} 
                  className="object-cover"
                />
              </div>
            </div>

            {/* 2. INFO (Centro - Ocupa el espacio sobrante) */}
            <div className="flex flex-col flex-grow justify-center min-w-0">
              <h3 className="font-bold text-base truncate pr-2">{item.name}</h3>
              <p className="text-sm opacity-60">{siteConfig.currency}{item.price} unit.</p>
            </div>

            {/* 3. ACCIONES (Derecha - Alineado al final) */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              
              {/* Subtotal destacado */}
              <span className="font-bold text-lg text-primary">
                {siteConfig.currency}{item.price * item.quantity}
              </span>

              {/* Botones compactos y elegantes */}
              <div className="join border border-base-300 shadow-sm bg-base-200/50 rounded-lg">
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="btn btn-sm btn-ghost join-item text-error hover:bg-base-200 px-4"
                >
                  -
                </button>
                
                {/* Cantidad centrada */}
                <span className="join-item flex items-center px-3 text-sm font-bold bg-base-100 tabular-nums">
                  {item.quantity}
                </span>

                <button 
                  onClick={() => addItem(item)} 
                  className="btn btn-sm btn-ghost join-item text-success hover:bg-base-200 px-4"
                >
                  +
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* FOOTER TOTAL */}
      <div className="mt-8 pt-6 border-t border-base-300/50">
        <div className="flex justify-between items-end mb-6 px-2">
          <span className="text-lg font-medium opacity-80 pb-1">Total a Pagar</span>
          <span className="text-4xl font-extrabold text-success tracking-tight">
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