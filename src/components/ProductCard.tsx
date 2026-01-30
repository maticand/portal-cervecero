"use client";

import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  // Conectamos con el estado global (Zustand)
  const { addItem, removeItem, items } = useCartStore();
  
  // Buscamos si este producto ya está en el carrito para saber su cantidad
  const cartItem = items.find((item) => item.id === product.id);
    // Si existe, guardamos su cantidad. Si no, es 0.
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    // DAISYUI: 'card' crea el contenedor con bordes y sombras automáticas.
    // 'bg-base-100' usa el color de fondo base del tema (blanco o negro según modo).
    // 'hover:scale-[1.02]' es Tailwind puro para la animación al pasar el mouse.
    <div className="card bg-base-100 border border-base-300 hover:scale-[1.02] transition-transform duration-300">
      
      {/* SECCIÓN IMAGEN */}
      {/* DAISYUI: 'figure' es requerido por DaisyUI para la zona de la imagen */}
      <figure className="relative h-48 w-full">
        <img
          src={product.image_url || siteConfig.placeholderImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Etiqueta de Categoría (Genérica) */}
        {/* DAISYUI: 'badge' crea la etiqueta redondeada. 'badge-warning' le da el color amarillo. */}
        <div className="badge badge-warning p-3 rounded-badge absolute top-2 right-2 font-bold">
          {product.categories?.name || "Sin Categoria"}
        </div>
      </figure>

      {/* SECCIÓN INFO */}
      {/* DAISYUI: 'card-body' aplica el padding correcto automáticamente */}
      <div className="card-body p-4 flex flex-col">
        {/* 'card-title' asegura el tamaño y peso de fuente correcto */}
        <h2 className="card-title text-base-content">{product.name}</h2>
        
        {/* 'line-clamp-2' corta el texto si es muy largo (Tailwind Line Clamp plugin) */}
        <p className="text-sm text-base-content/70 line-clamp-2 flex-grow">
          {product.description || "Sin descripción disponible."}
        </p>
        
        {/* PRECIO Y BOTONES */}
        {/* DAISYUI: 'card-actions' posiciona los botones al final */}
        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
          {/* 'text-success' usa el color verde semántico del tema */}
          <span className="text-2xl font-bold text-success">
            {siteConfig.currency}{product.price}
          </span>

          {/* RENDERIZADO CONDICIONAL: ¿Botón simple o Controles? */}
          {quantity === 0 ? (
            // DAISYUI: 'btn btn-primary' crea un botón con el color principal.
            // 'btn-sm' lo hace pequeño. 'rounded-full' lo hace redondo.

            // Opción A: No está en el carrito -> Botón "Agregar"
            <button
              onClick={() => addItem(product)}
              className="btn btn-active btn-warning btn-md px-8"
            >
              Agregar
            </button>
          ) : (
            // DAISYUI: 'join' agrupa botones pegados (como un grupo de inputs).

            // Opción B: Ya está en el carrito -> Botones [- 1 +]
            <div className="join border border-base-300">
              <button
                onClick={() => removeItem(product.id)}
                // 'btn-ghost' quita el fondo (transparente). 'text-error' lo pone rojo.
                className="btn btn-ghost btn-error btn-md join-item font-bold text-lg shadow-none"
              >
                -
              </button>
              
              {/* Contador Central */}
              <span className="join-item px-3 flex items-center font-bold text-base-content select-none">
                {quantity}
              </span>

              {/* Botón Sumar */}
              <button
                onClick={() => addItem(product)}
                className="btn btn-ghost btn-md join-item font-bold text-lg shadow-none"
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