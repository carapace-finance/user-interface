"use client";
import { useEffect, useState } from "react";

const useIsMounted = (): boolean => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

export default useIsMounted;
