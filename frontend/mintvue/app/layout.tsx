import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";


export const metadata: Metadata = {
  title: "MintVue",
  description: "The first social plarform where your viral content becomes an NFT instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body className={`${GeistSans.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
