import { useState, useEffect } from "react";

export function useIsTablet(min = 601, max = 1024) {
  const [isTablet, setIsTablet] = useState(
    window.matchMedia(`(min-width: ${min}px) and (max-width: ${max}px)`).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${min}px) and (max-width: ${max}px)`
    );
    const handleChange = (e) => setIsTablet(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [min, max]);

  return isTablet;
}
