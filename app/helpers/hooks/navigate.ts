"use client";

import { useRouter } from "next/navigation";

export function useNavigate() {
  const router = useRouter();

  return (path: string) => {
    const formattedPath = path.startsWith("/") ? path : `/${path}`;
    router.push(formattedPath);
  };
}
