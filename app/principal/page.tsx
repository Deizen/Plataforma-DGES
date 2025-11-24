"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PaginaPrincipal from "@/components/PaginaPrincipal";

export default function PrincipalPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/");
  }, []);

  return <PaginaPrincipal />;
}