import { createContext, useContext, useState, useEffect } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [activeModal, setActiveModal] = useState("null");
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <UIContext.Provider
      value={{
        isMobile,
        isTablet,
        isDesktop,
        activeModal,
        setActiveModal,
        isSearchMode,
        setIsSearchMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
