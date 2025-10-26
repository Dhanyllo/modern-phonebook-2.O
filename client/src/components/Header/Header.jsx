import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import HeaderNormal from "./HeaderNormal";
import HeaderSearch from "./HeaderSearch";
import { useUI } from "../../context/UIContext";
import { useDarkMode } from "../../context/DarkModeContext";
import styles from "./Header.module.css";

function Header() {
  const { isSearchMode, setIsSearchMode } = useUI();
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 789px)");

    function handleChange(e) {
      if (e.matches && isSearchMode) {
        setIsSearchMode(false);
      }
    }

    media.addEventListener("change", handleChange);

    if (media.matches && isSearchMode) {
      setIsSearchMode(false);
    }

    return () => media.removeEventListener("change", handleChange);
  }, [isSearchMode, setIsSearchMode]);

  return (
    <>
      <header
        className={darkMode ? styles.headerDarkmode : styles.headerLightmode}
      >
        {isSearchMode ? <HeaderSearch /> : <HeaderNormal />}
      </header>
      <Outlet />
    </>
  );
}

export default Header;
