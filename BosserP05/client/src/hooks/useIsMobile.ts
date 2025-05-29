// Puedes poner esto en un archivo hooks/useIsMobile.tsx
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) { // Cambia aquí el breakpoint
  const getWidth = () =>
    typeof globalThis !== "undefined" && "innerWidth" in globalThis
      ? (globalThis as unknown as { innerWidth: number }).innerWidth
      : breakpoint + 1;

  const [isMobile, setIsMobile] = useState(getWidth() < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(getWidth() < breakpoint);
    if (typeof globalThis !== "undefined" && "addEventListener" in globalThis) {
      globalThis.addEventListener("resize", handleResize);
      return () => globalThis.removeEventListener("resize", handleResize);
    }
  }, [breakpoint]);

  return isMobile;
}