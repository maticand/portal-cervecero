"use client";

import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";
import { useEffect, useState } from "react";
import Link from "next/link"; // IMPORTANTE: Usamos Link para navegación interna rápida

export default function CartSummary() {
  const { items, total } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  // Si no hay items, no renderizamos nada (return null) para no ocupar espacio.
  if (items.length === 0) return null;

  // CALCULO DE UNIDADES TOTALES
  // Usamos .reduce() para sumar la propiedad 'quantity' de cada objeto en el array.
  // 0 es el valor inicial del acumulador.
  // DOCS: Array Reduce - https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 p-4 shadow-2xl z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* LADO IZQUIERDO: RESUMEN */}
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg">
            Total: {siteConfig.currency}{total()}
          </span>
          <span className="text-yellow-500 text-sm font-bold">
            {/* Lógica ternaria: Si es 1 dice "unidad", si son más dice "unidades" */}
            {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"}
          </span>
        </div>

        {/* LADO DERECHO: BOTÓN DE ACCIÓN */}
        {/* DOCS: Usamos <Link> en lugar de <a> porque es una ruta interna (/checkout).
            Esto hace que la carga sea instantánea (Client-Side Navigation) sin recargar el navegador.
            https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
        */}
        <Link
          href="/checkout"
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2 shadow-lg"
        >
          Ver Pedido →
        </Link>
      </div>
    </div>
  );
}