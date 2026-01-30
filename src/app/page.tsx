import { supabase } from "@/lib/supabase";// Importamos la conexión a Supabase
import ProductCard from "@/components/ProductCard";// Importamos nuestras tarjetas de producto
import CartSummary from "@/components/CartSummary";// Importamos el carrito flotante
import SearchBar from "@/components/SearchBar"; // Importamos el componente nuevo

// Esto es vital para que el buscador funcione en tiempo real
export const dynamic = "force-dynamic";

// Definimos qué tipo de datos esperamos recibir
interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

// Solo puede haber UN "export default function Home"
export default async function Home(props: HomeProps) {
  // 1. Leemos los parámetros de búsqueda (ej: ?q=rubia)
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";

  // 2. Preparamos la consulta base a Supabase (traer productos y sus categorías)
  let supabaseQuery = supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `);

  // 3. Si hay búsqueda, aplicamos el filtro .ilike
  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  // 4. Ejecutamos la consulta final - Pedimos los datos al servidor (supebase)
  const { data: products } = await supabaseQuery;

  return (
    <main className="min-h-screen p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-yellow-500 mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-gray-400 text-lg">
            ¡Explorá y encontrá lo que buscás! 
          </p>
        </header>
		
        {/* AQUÍ AGREGAMOS EL COMPONENTE BUSCADOR */}
        <SearchBar />

        {/* AQUÍ AGREGAMOS EL COMPONENTE DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-400 col-span-2 text-center py-10">
              No encontramos nada con el nombre "{query}". Probá con otro término.
            </p>
          )}
        </div>
      </div>

		{/* AQUÍ AGREGAMOS EL COMPONENTE DEL CARRITO */}	
	    <CartSummary />
    </main>
  );
}