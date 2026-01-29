// DEFINICIÓN MAESTRA DE PRODUCTO
// Aquí le decimos a la App qué propiedades tiene OBLIGATORIAMENTE un producto.

export interface Product {
  id: number;
  name: string;         
  price: number;
  description: string | null; // Puede ser texto o null
  image_url: string | null;   // Puede ser texto o null
  
  // Relación con Categorías (para que no falle si usas categorías)
  category_id: number;
  categories: {
    name: string;
  } | null;
}