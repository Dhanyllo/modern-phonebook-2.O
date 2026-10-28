import { NavLink } from "react-router-dom";
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { useNavigation } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkmode";
import styles from "./Sidebar.module.css";

function Sidebar({ favStatus }) {
  const { darkMode } = useDarkMode();
  const navigation = useNavigation();

  const heartIcon = {
    color: favStatus ? "red" : "white",
  };

  const isNavigatingToFavourites =
    navigation.location?.pathname === "/favourites";

  const handleFavouritesNavigation = (event) => {
    if (isNavigatingToFavourites) {
      event.preventDefault();
      return;
    }
  };

  const isNavigatingToHome = navigation.location?.pathname === "/";

  const handleHomeNavigation = (event) => {
    if (isNavigatingToHome) {
      event.preventDefault();
      return;
    }
  };

  return (
    <nav
      className={darkMode ? styles.sidebarDarkmode : styles.sidebarLightmode}
    >
      <NavLink
        aria-disabled={isNavigatingToHome}
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/"
        onClick={handleHomeNavigation}
      >
        <RiContactsBookFill className={styles.contactsIcon} />
        <div className={styles.linkText}>All Contacts</div>
      </NavLink>

      <NavLink
        aria-disabled={isNavigatingToFavourites}
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/favourites"
        onClick={handleFavouritesNavigation}
      >
        <FaHeart style={heartIcon} className={styles.heartIcon} />
        <div className={styles.linkText}>Favourites</div>
      </NavLink>
    </nav>
  );
}

export default Sidebar;
