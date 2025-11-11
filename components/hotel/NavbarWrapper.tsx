"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/hotel/Navbar";
import { Footer } from "@/components/hotel/Footer";
export default function NavbarWrapper({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  
  const hideOnRoutes = ["/admin"];
  const shouldHide = hideOnRoutes.some((r) => pathname.startsWith(r));

  return (
    <>
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
}
