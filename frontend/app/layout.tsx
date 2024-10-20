import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google"
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
  weight: '400',
});

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
        className={`${sfPro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
