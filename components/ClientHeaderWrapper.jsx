"use client";
import Header from "@/components/header";
import { usePathname } from "next/navigation";

export default function ClientHeaderWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <Header />;
}
