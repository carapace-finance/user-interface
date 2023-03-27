import { useEffect, useState } from "react";

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => setIsMobile(window.screen.width < 414), []);
  return isMobile;
};

export default useIsMobile;
