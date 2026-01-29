import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Catálogo de Productos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* El contenido de la página principal */}
        <main>
          {children}
        </main>

        {/* El Footer global */}
        {/* <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #ccc' }}>
          <p>© 2026 Mi Empresa</p>
        </footer> */}
      </body>
    </html>
  );
}
