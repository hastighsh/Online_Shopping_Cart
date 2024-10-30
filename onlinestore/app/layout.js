
import { Fugaz_One, Inter } from "next/font/google";
import '/styles/globals.css';

const inter = Inter({subsets:["latin"]});
const fugaz = Fugaz_One({subsets:["latin"], weight:['400']});

export const metadata = {
  title: "REA",
  description: "Buy handmade clothes and accessories!",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>REA</h1>
      <div className="flex items-center justify-between">
        PLACEHOLDER CTA || STATS || CART
      </div>
      
    </header>
  )
//add your names to footer please
  const footer = (
    <footer className="p-4 sm:p-8  flex grid place-items-center" >
      <p className={'text-[#F67280] ' + fugaz.className}>Created by Jacob Abarrota...</p> 
    </footer>
  )

  return (
    <html lang="en">
      <body
        className={'w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-700 ' + inter.className}>
          {header}
          {/* this will add a header to all children pages. Must write "main" within a child page.js: <main> main </main> */}
          {children}
          {footer}
      </body>
    </html>
  );
}
