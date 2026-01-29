import { create } from 'zustand';
// Asegúrate de que la ruta a tus tipos sea correcta
import { Product } from '@/types'; 

// Definimos cómo se ve un item en el carrito (Producto + Cantidad)
interface CartItem extends Product {
  quantity: number;
}

// Definimos qué funciones tiene nuestro "Cerebro"
interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  total: () => number;
}

// 📚 DOCS: Zustand - Create Store
// https://docs.pmnd.rs/zustand/getting-started/introduction
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  // ✅ FUNCIÓN SUMAR / AGREGAR
  addItem: (product) => {
    set((state) => {
      // 1. Buscamos si el producto ya está en el carrito
      const existingItem = state.items.find((i) => i.id === product.id);

      if (existingItem) {
        // 📚 Lógica JS: Si existe, creamos un nuevo array actualizando solo la cantidad (+1)
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      // 2. Si no existe, lo agregamos al final con cantidad = 1
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  // ✅ FUNCIÓN RESTAR / QUITAR
  removeItem: (productId) => {
    set((state) => {
      // 1. Buscamos el item
      const existingItem = state.items.find((i) => i.id === productId);
      
      if (!existingItem) return state; // Si no está, no hacemos nada

      // 2. Si la cantidad es mayor a 1, solo restamos
      if (existingItem.quantity > 1) {
        return {
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
          ),
        };
      }

      // 3. Si la cantidad es 1, lo borramos de la lista (Filter)
      // 📚 DOCS: MDN Array Filter
      // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
      return {
        items: state.items.filter((i) => i.id !== productId),
      };
    });
  },

  // Limpiar todo el carrito
  clearCart: () => set({ items: [] }),

  // Calcular precio total (Precio x Cantidad de cada uno)
  total: () => {
    return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },
}));