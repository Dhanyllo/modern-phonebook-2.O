import React from "react";
import { NavLink } from "react-router-dom";
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { useNavigation } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ favStatus, darkMode }) {
  const navigation = useNavigation();

  const heartIcon = {
    color: favStatus ? "red" : "white",
  };

  const isNavigatingToFavourites =
    navigation.location?.pathname === "/favourites";

  return (
    <nav
      className={darkMode ? styles.sidebarDarkmode : styles.sidebarLightmode}
    >
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.active : styles.linkText
        }
        to="/"
      >
        <div className={styles.linkText}>All Contacts</div>
        <RiContactsBookFill className={styles.contactsIcon} />
      </NavLink>

      <NavLink
        aria-disabled={isNavigatingToFavourites}
        className={({ isActive }) =>
          isActive ? styles.active : styles.linkText
        }
        to="/favourites"
      >
        <div className={styles.linkText}>Favourites</div>
        <FaHeart style={heartIcon} className={styles.heartIcon} />
      </NavLink>
    </nav>
  );
}

export default Sidebar;
