import { SearchX } from "lucide-react";
import styles from "./NoSearchResults.module.css";

function NoSearchResults({ searchQuery, darkMode }) {
  return (
    <div
      className={`${styles.emptyDirectoryContainer} ${
        darkMode ? styles.darkMode : styles.lightMode
      }`}
    >
      <div className={`${styles.emptyStateIcon} ${styles.searchEmptyIcon}`}>
        <SearchX size={44} strokeWidth={1.6} />
      </div>

      <h3>No results found</h3>

      <p>
        We couldn't find any contacts matching <strong>"{searchQuery}"</strong>.
      </p>

      <span className={styles.searchHint}>
        Try checking the spelling or using a different search term.
      </span>
    </div>
  );
}

export default NoSearchResults;
