"use client";

import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";
import Link from "next/link"; // IMPORTANTE: Usamos Link para navegación interna rápida

export default function CartSummary() {
  const { items, total } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Evitamos errores de hidratación esperando a que el componente se monte
  useEffect(() => setIsMounted(true), []);

  if (!isMounted || items.length === 0) return null;

  // CALCULO DE UNIDADES TOTALES
  // Usamos .reduce() para sumar la propiedad 'quantity' de cada objeto en el array.
  // 0 es el valor inicial del acumulador.
  // DOCS: Array Reduce - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-2 pb-4">
      {/* DAISYUI: 'navbar' es un componente flexbox pre-configurado.
          'bg-neutral' usa el color gris oscuro del tema.
          'text-neutral-content' asegura que el texto sea legible sobre el fondo oscuro.
          'rounded-box' da bordes redondeados bonitos.
          'shadow-2xl' da el efecto de elevación.
      */}
      <div className="navbar bg-neutral text-neutral-content rounded-box shadow-2xl flex justify-between container mx-auto max-w-4xl">
        
        {/* LADO IZQUIERDO: INFORMACIÓN DEL PEDIDO */}
        <div className="flex flex-col px-2">
          <span className="text-lg font-bold">
            Total: {siteConfig.currency}{total()}
          </span>
          {/* 'text-warning' pone el texto en amarillo/naranja */}
          <span className="text-xs text-warning font-bold uppercase tracking-wide">
            {totalUnits} {totalUnits === 1 ? "item" : "items"} en tu pedido
          </span>
        </div>

        {/* LADO DERECHO: BOTÓN DE ACCIÓN */}
        {/* DAISYUI: 'btn-primary' destaca la acción principal.
            'animate-pulse' (Tailwind) hace que llame la atención sutilmente.
        */}
        <Link href="/checkout" className="btn btn-warning px-6 shadow-lg animate-pulse hover:animate-none">
          Ver Pedido
          {/* Ícono de flecha derecha */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </div>
    </div>
  );
}