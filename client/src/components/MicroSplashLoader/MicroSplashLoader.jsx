import styles from "./MicroSplashLoader.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";

function MicroSplashLoader() {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? styles.wrapperDark : styles.wrapperLight}>
      <div className={styles.inner}>
        <div className={styles.logo}>MyContacts</div>
        <div className={styles.loader} />
      </div>
    </div>
  );
}

export default MicroSplashLoader;
