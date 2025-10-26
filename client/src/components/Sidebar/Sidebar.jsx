import { NavLink } from "react-router-dom";
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { useNavigation } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useUI } from "../../context/UIContext";
import styles from "./Sidebar.module.css";

function Sidebar({ favStatus }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { isSidebarOpen, activeModal, setActiveModal } = useUI();
  const { darkMode } = useDarkMode();
  const navigation = useNavigation();

  let sidebarState;

  if (isDesktop) {
    sidebarState = "";
  } else if (isTablet) {
    sidebarState = "halfSidebar";
  }

  const heartIcon = {
    color: favStatus ? "red" : "white",
  };

  const isNavigatingToFavourites =
    navigation.location?.pathname === "/favourites";

  const isNavigatingToHome = navigation.location?.pathname === "/";

  return (
    <nav
      className={darkMode ? styles.sidebarDarkmode : styles.sidebarLightmode}
    >
      <NavLink
        aria-disabled={isNavigatingToHome}
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/"
      >
        <RiContactsBookFill className={styles.contactsIcon} />
        <div className={styles.linkText}>All Contacts</div>
      </NavLink>

      <NavLink
        aria-disabled={isNavigatingToFavourites}
        className={({ isActive }) => (isActive ? styles.active : "")}
        to="/favourites"
      >
        <FaHeart style={heartIcon} className={styles.heartIcon} />
        <div className={styles.linkText}>Favourites</div>
      </NavLink>
    </nav>
  );
}

export default Sidebar;
