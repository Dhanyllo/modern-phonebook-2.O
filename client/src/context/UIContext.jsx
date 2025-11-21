import { createContext, useContext, useState } from "react";
import { useBreakpoint } from "../hooks/useBreakpoint";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const { isMobile, isTablet, isDesktop } = useBreakpoint(); //delete|create|logout|mobilesidebar|
  // mobileprofile|update|detail|mobileNotification|tabletNotification|tabletProfile|null

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
