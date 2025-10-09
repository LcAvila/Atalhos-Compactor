import type { Metadata } from "next";
// Import fonts via fontsource so the bundler includes them correctly
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import '@fontsource/fira-mono/400.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "Atalhos Compactor",
  description: "Atalhos Compactor",
  icons: {
    icon: '/favicon/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br"> 
      <head>
      <meta name="msapplication-TileColor" content="#da532c"></meta>
      <meta name="theme-color" content="#ffffff"></meta>
      </head>
              <body className="antialiased">
                {children}
              </body>
            </html>
            );
}
