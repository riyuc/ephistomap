import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins, Kanit } from "next/font/google"
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const sfPro = localFont({
  src: "./fonts/SF-Pro.ttf",
  variable: "--font-sf-pro",
  weight: "400"
})
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100','200', '300', '400', '500', '600', '700', '800', '900'],
});
const marlinSoft = localFont({
  src: "./fonts/MarlinSoftBasic-Regular.otf",
  variable: "--font-marlin-soft",
  weight: "400"
})


export const metadata: Metadata = {
  title: "Ephistomap",
  description: "Visualize your code base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${marlinSoft.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
