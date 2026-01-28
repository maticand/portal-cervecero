// Importamos la conexión a Supabase
import { supabase } from "@/lib/supabase";
// Importamos nuestras tarjetas de producto
import ProductCard from "@/components/ProductCard";
// IMPORTAMOS EL NUEVO CARRITO FLOTANTE 👇
import CartSummary from "@/components/CartSummary";

export default async function Home() {
  // Pedimos los datos al servidor (supebase)
  const { data: products } = await supabase.from('products').select('*');

  return (
    // Agregamos pb-32 (padding bottom 32) para que el carrito flotante no tape el último producto
    <div className="min-h-screen bg-slate-900 text-white p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-yellow-500 mb-4">
            🍺 Catálogo Cervecero
          </h1>
          <p className="text-gray-400 text-lg">
            Las mejores birras, directo de fábrica.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* AQUÍ AGREGAMOS EL COMPONENTE DEL CARRITO 👇 */}
      <CartSummary />
      
    </div>
  );
}