import { RiContactsBookFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHeart } from "react-icons/fa6";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { useUI } from "../../context/UIContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { NavLink, useNavigation } from "react-router-dom";
import styles from "./MobileSidebarModal.module.css";

function MobileSidebarModal({ favStatus }) {
  const { darkMode } = useDarkMode();
  const { setActiveModal } = useUI();
  const closeModal = () => setActiveModal(null);

  const navigation = useNavigation();

  const heartIcon = {
    color: favStatus ? "red" : "white",
  };

  const isNavigatingToFavourites =
    navigation.location?.pathname === "/favourites";

  const isNavigatingToHome = navigation.location?.pathname === "/";

  const modalVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return ReactDOM.createPortal(
    <motion.div
      className={styles.modalOverlay}
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={darkMode ? styles.sidebarDarkmode : styles.sidebarLightmode}
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={
            darkMode
              ? styles.leftSideHeaderDarkmode
              : styles.leftSideHeaderLightmode
          }
        >
          <button
            onClick={(e) => {
              e.stopPropagation;
              closeModal();
            }}
            className={
              darkMode
                ? styles.hamburgerMenuDarkmode
                : styles.hamburgerMenuLightmode
            }
          >
            <RxHamburgerMenu size={20} />
          </button>
          <div className={styles.icons}>
            <img
              className={styles.headerLogo}
              src="/images/logo.png"
              alt="Logo"
            />
            <div className={styles.logoTitle}>MPhone 2.O</div>
          </div>
        </div>

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
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root")
  );
}

export default MobileSidebarModal;
