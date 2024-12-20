// layout.js

import { Fugaz_One, Inter } from "next/font/google";
import '/styles/globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/AuthContext'; // Import the AuthProvider to track authentication on local storage.
import { CartProvider } from '@/context/CartContext'; // Import the CartProvider to track cart on localstorage.

const inter = Inter({ subsets: ["latin"] });
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export const metadata = {
  title: "REA",
  description: "Buy handmade clothes and accessories!",
};

export default function RootLayout({ children }) {
  const footer = (
    <footer className="p-4 sm:p-8 flex grid place-items-center">
      <p className={'text-[#F67280] ' + fugaz.className}></p>
    </footer>
  );

  return (
    <html lang="en">
      <body
        className={
          'w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-700 ' +
          inter.className
        }
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            {footer}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}