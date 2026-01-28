// "use client" es OBLIGATORIO porque este componente necesita escuchar cambios en tiempo real (el carrito)
"use client"; 

// Importamos el "gancho" (hook) de nuestra memoria global (Zustand)
import { useCartStore } from "@/store/cart";

// Definimos el componente visual
export default function CartSummary() {
  
  // 1. CONEXIÓN CON LA MEMORIA
  // Extraemos la lista de items del store para saber qué compró
  const items = useCartStore((state) => state.items);
  // Extraemos la función que calcula el total ($)
  const totalAmount = useCartStore((state) => state.total());

  // 2. LÓGICA DE VISIBILIDAD
  // Si no hay items en el carrito (length es 0), no mostramos nada (return null)
  // Esto hace que la barra sea invisible hasta que el usuario compre algo
  if (items.length === 0) {
    return null;
  }

  // 3. LÓGICA DE WHATSAPP
  // Esta función crea el mensaje de texto para enviar
  const handleCheckout = () => {
    // Definimos el número de teléfono de la fábrica (Reemplazalo por el tuyo real)
    // Formato internacional: 549 + código de área + número (sin el 15)
    const phoneNumber = "5491138530655"; 

    // Creamos el encabezado del mensaje
    let message = "Hola! Quiero hacer este pedido: \n\n";

    // Recorremos cada producto del carrito para agregarlo al texto
    items.forEach((item) => {
      // Agregamos una línea: "- 2x IPA Galáctica ($9000)"
      message += `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
    });

    // Agregamos el total final al mensaje
    message += `\n*Total a Pagar: $${totalAmount}*`;
    message += `\n\n(Enviado desde la App)`;

    // Codificamos el texto para que pueda viajar en una URL (cambia espacios por %20, etc.)
    const encodedMessage = encodeURIComponent(message);

    // Abrimos WhatsApp en una pestaña nueva con el mensaje precargado
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  // 4. EL DISEÑO VISUAL (HTML/Tailwind)
  return (
    // Contenedor principal: Fijo abajo (fixed bottom-0), ancho total (w-full), fondo oscuro con transparencia (backdrop-blur)
    <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-700 p-4 shadow-2xl z-50">
      
      {/* Contenedor interno para centrar y limitar el ancho máximo */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Lado Izquierdo: Resumen de Cantidad y Total */}
        <div className="flex flex-col">
          {/* Texto pequeño indicando cuántos items únicos hay */}
          <span className="text-gray-400 text-sm">
            Tu pedido actual ({items.length} items)
          </span>
          {/* Precio Total Grande y Verde */}
          <span className="text-3xl font-bold text-green-400">
            ${totalAmount}
          </span>
        </div>

        {/* Lado Derecho: Botón de WhatsApp */}
        {/* Al hacer clic (onClick), ejecutamos la función handleCheckout que definimos arriba */}
        <button 
          onClick={handleCheckout}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-green-900/20"
        >
          {/* Icono de WhatsApp (SVG simple) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Finalizar Pedido por WhatsApp
        </button>
      </div>
    </div>
  );
}