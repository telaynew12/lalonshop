import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Cart from "@/components/CartSideBar/CartSideBar";
import CartSideBar from "@/components/CartSideBar/CartSideBar";
import OrderModal from "@/components/OrderModal/OrderModal";
import messangerIcon from "../../public/messenger.png";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Urbanist({ subsets: ["latin"] });

export async function generateMetadata({ params }, parent) {
  return {
    title: "Lalon Shop BD",
    description:
      "Lalonshop BD offers handcrafted musical instruments inspired by Lalon Shah's legacy, specializing in traditional folk instruments near the historic Lalon Majar.",
    keywords: [
      "Lalon",
      "Lalon Shah",
      "Lalon Shop BD",
      "Lalon Majar",
      "Folk Instruments",
      "Musical Instruments",
      "Handcrafted Instruments",
      "Baul",
      "Baul Music",
      "Baul Instruments",
    ],
    openGraph: {
      title: "Lalon Shop BD",
      description:
        "Lalonshop BD offers handcrafted musical instruments inspired by Lalon Shah's legacy, specializing in traditional folk instruments near the historic Lalon Majar.",
      url: "https://www.lalonshopbd.com",
      siteName: "Lalon Shop BD",
      type: "website",
    },
    alternates: {
      canonical: "https://www.lalonshopbd.com",
    },
    twitter: {
      card: "summary_large_image",
      site: "@brainwave_ds",
      title: "Lalon Shop BD",
      description:
        "Lalonshop BD offers handcrafted musical instruments inspired by Lalon Shah's legacy, specializing in traditional folk instruments near the historic Lalon Majar.",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StoreProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-y-auto bg-[#FBFAFA] text-black relative`}
        >
          <CartSideBar />
          <OrderModal />
          {children}
          <Link href="https://m.me/LalonShopBD" target="_blank">
            <Image
              className="fixed bottom-7 right-7 w-14 z-50 animate-pulse"
              src={messangerIcon}
              alt="messenger"
            />
          </Link>
        </body>
      </StoreProvider>
    </html>
  );
}
