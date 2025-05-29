import { useEffect, useState } from "react";
import type { Package } from "../../../server/models/packageModel.ts";

export function usePendingPackages() {
  const [pendingPackages, setPendingPackages] = useState<Package[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pendingPackages");
    if (saved) {
      setPendingPackages(JSON.parse(saved));
    }
  }, []);

  return pendingPackages;
}