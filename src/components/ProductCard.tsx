"use client"; // 👈 Obligatorio porque tiene interactividad (botones)

import { Product } from "@/types"; // Revisa que la ruta sea correcta según tu proyecto
import { useCartStore } from "@/store/cart";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  // 📚 DOCS: Zustand - Using the store
  // Extraemos las funciones y la lista de items del cerebro
  const { addItem, removeItem, items } = useCartStore();

  // 🧠 LÓGICA VISUAL:
  // Buscamos si ESTE producto específico ya está en el carrito
  const cartItem = items.find((item) => item.id === product.id);
  // Si existe, guardamos su cantidad. Si no, es 0.
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-slate-800 flex flex-col transition-transform hover:scale-[1.02] duration-300">
      
      {/* 🖼️ SECCIÓN IMAGEN */}
      <div className="relative h-48 w-full bg-slate-800">
        <img
          src={product.image_url || "https://placehold.co/400x300?text=Sin+Imagen"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Etiqueta de Categoría (Genérica) */}
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow">
          {product.categories?.name || "Sin Categoria"}
        </span>
      </div>

      {/* 📝 SECCIÓN INFO */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
        
        <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
          {product.description || "Descripción no disponible."}
        </p>
        
        {/* 💰 PRECIO Y BOTONES */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
          <span className="text-xl font-bold text-green-400">
            ${product.price}
          </span>

          {/* 👇 RENDERIZADO CONDICIONAL: ¿Botón simple o Controles? */}
          {quantity === 0 ? (
            // Opción A: No está en el carrito -> Botón "Agregar"
            <button
              onClick={() => addItem(product)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full transition-colors shadow-md"
            >
              Agregar
            </button>
          ) : (
            // Opción B: Ya está en el carrito -> Botones [- 1 +]
            <div className="flex items-center gap-3 bg-slate-800 rounded-full px-2 py-1 border border-slate-700 shadow-inner">
              {/* Botón Restar */}
              <button
                onClick={() => removeItem(product.id)}
                className="w-8 h-8 flex items-center justify-center bg-slate-700 text-white rounded-full hover:bg-red-500 hover:text-white transition-colors font-bold"
                aria-label="Restar unidad"
              >
                -
              </button>
              
              {/* Contador Central */}
              <span className="text-white font-bold w-6 text-center select-none">
                {quantity}
              </span>

              {/* Botón Sumar */}
              <button
                onClick={() => addItem(product)}
                className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors font-bold"
                aria-label="Sumar unidad"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}