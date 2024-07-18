import "./globals.css";
import { fira, inter } from "../util";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";

import type { ReactNode } from "react";

export const metadata = {
  title:
    "Maximilian Walterskirchen: Aspiring Security Professional & Full Stack Developer",
  description:
    "Enter the dynamic tech world of Maximilian Walterskirchen, a Full Stack Web Developer with a growing focus on Security. " +
    "Delve into his professional experiences at functn, his educational journey in Computer Science at TU Wien, and his dedication to expanding his security knowledge, " +
    "complemented by his love for CTFs and espresso artistry.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col bg-zinc-950 text-white ${fira.variable} ${inter.variable} font-mono min-h-screen`}
      >
        <header>
          <Navigation />
        </header>
        <main className="h-full flex-1 flex items-center flex-col max-w-screen-xl m-auto  pl-24 pr-24 pt-8 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
