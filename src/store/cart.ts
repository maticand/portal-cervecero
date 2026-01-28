import { create } from 'zustand';

// Definimos cómo se ve un Producto en el carrito
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Definimos qué acciones tiene el carrito
interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product) => set((state) => {
    // 1. Buscamos si ya existe en el carrito
    const existing = state.items.find((i) => i.id === product.id);
    
    if (existing) {
      // Si existe, le sumamos 1 a la cantidad
      return {
        items: state.items.map((i) => 
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    
    // Si no existe, lo agregamos como nuevo
    return { 
      items: [...state.items, { ...product, quantity: 1 }] 
    };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id)
  })),

  // Calculadora automática de total
  total: () => {
    const items = get().items;
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}));