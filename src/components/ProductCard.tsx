"use client"; // 👈 ESTO ES LA CLAVE. Convierte el archivo en Client Component.

import { useCartStore } from "@/store/cart";

// Definimos qué datos recibe la tarjeta
interface ProductProps {
  product: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category: string | null;
  }
}

export default function ProductCard({ product }: ProductProps) {
  // Conectamos con el cerebro (Zustand)
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-yellow-500 transition-colors shadow-lg flex flex-col h-full">
      {/* Imagen */}
      <div className="h-48 overflow-hidden bg-slate-700 relative">
        <img 
          src={product.image_url || "https://placehold.co/600x400/png"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
        />
        <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow">
          {product.category || 'General'}
        </span>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold mb-2 text-white">{product.name}</h2>
        <p className="text-gray-400 text-sm mb-4 flex-grow">
          {product.description || "Sin descripción"}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
          <span className="text-2xl font-bold text-green-400">
            ${product.price}
          </span>
          
          <button 
            onClick={() => {
              addItem(product);
              alert(`¡Sumaste una ${product.name}! 🍺`); // Feedback temporal
            }}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition active:scale-95 transform"
          >
            Agregar +
          </button>
        </div>
      </div>
    </div>
  );
}