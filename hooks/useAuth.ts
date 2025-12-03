"use client";

export function useAuth() {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return parsed ?? null;
  } catch {
    return null;
  }
}