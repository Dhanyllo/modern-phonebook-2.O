import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { useDarkMode } from "../../hooks/useDarkmode";
import { useUI } from "../../context/UIContext";
import styles from "./HeaderSearch.module.css";

function HeaderSearch() {
  const { darkMode } = useDarkMode();
  const { setIsSearchMode } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchParams") || "";
  const inputRef = useRef(null);

  const handleChange = (event) => {
    setSearchParams({ searchParams: event.target.value });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      const isTypingInInput =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      if (event.key === "/" && !isTypingInInput) {
        event.preventDefault();
        inputRef.current?.focus();
      } else if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div
      className={
        darkMode ? styles.headerSearchDarkmode : styles.headerSearchLightmode
      }
    >
      <div className={styles.backArrowWrap}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSearchMode(false);
          }}
          className={styles.backArrow}
        >
          <IoArrowBack className={styles.backArrowIcon} />
        </button>
      </div>
      <div className={styles.searchBar}>
        <div className={styles.searchInputContainer}>
          <IoIosSearch
            className={
              darkMode ? styles.searchIconDarkmode : styles.searchIconLightmode
            }
          />
          <input
            ref={inputRef}
            autoComplete="off"
            onChange={handleChange}
            type="text"
            value={searchQuery}
            name="search"
            className={
              darkMode
                ? styles.searchBarInputDarkmode
                : styles.searchBarInputLightmode
            }
            placeholder="Type ' / ' to search..."
          />
        </div>
      </div>
    </div>
  );
}

export default HeaderSearch;
