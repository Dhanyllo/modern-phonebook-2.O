import { useState, useEffect } from "react";

export function useBreakpoint() {
  const [breakpoints, setBreakpoints] = useState({
    isMobile: window.matchMedia("(max-width: 599.99px)").matches,
    isTablet: window.matchMedia("(min-width: 600px) and (max-width: 1024px)")
      .matches,
    isDesktop: window.matchMedia("(min-width: 1025px)").matches,
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 599.99px)");
    const tabletQuery = window.matchMedia(
      "(min-width: 600px) and (max-width: 1024px)"
    );
    const desktopQuery = window.matchMedia("(min-width: 1025px)");

    const updateBreakpoints = () =>
      setBreakpoints({
        isMobile: mobileQuery.matches,
        isTablet: tabletQuery.matches,
        isDesktop: desktopQuery.matches,
      });

    // Initial check and event listeners
    updateBreakpoints();
    mobileQuery.addEventListener("change", updateBreakpoints);
    tabletQuery.addEventListener("change", updateBreakpoints);
    desktopQuery.addEventListener("change", updateBreakpoints);

    return () => {
      mobileQuery.removeEventListener("change", updateBreakpoints);
      tabletQuery.removeEventListener("change", updateBreakpoints);
      desktopQuery.removeEventListener("change", updateBreakpoints);
    };
  }, []);

  return breakpoints;
}
