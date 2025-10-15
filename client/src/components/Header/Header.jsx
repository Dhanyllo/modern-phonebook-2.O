import { useRef, useEffect, useState } from "react";
import { Outlet, Link, useSearchParams } from "react-router-dom";
import { MdLightMode, MdNotificationsNone, MdAddCircle } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { TfiHelpAlt } from "react-icons/tfi";
import { FiFlag, FiLogOut } from "react-icons/fi";
import { GrUpdate, GrDocumentVerified } from "react-icons/gr";
import { useDarkMode } from "../../context/DarkModeContext";
import styles from "./Header.module.css";

function Header() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchParams") || "";
  const inputRef = useRef(null);

  const [profileToggle, setProfileToggle] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const profileTimer = useRef();
  const notificationTimer = useRef();
  const [headerActiveModal, setHeaderActiveModal] = useState(null); // "logout" | "create" |null

  const handleChange = (event) => {
    setSearchParams({ searchParams: event.target.value });
  };

  const handleProfileMouseEnter = () => {
    clearTimeout(profileTimer.current);
    setProfileToggle(true);
  };
  const handleProfileMouseLeave = () => {
    profileTimer.current = setTimeout(() => setProfileToggle(false), 100);
  };

  const handleNotificationMouseEnter = () => {
    clearTimeout(notificationTimer.current);
    setNotificationToggle(true);
  };
  const handleNotificationMouseLeave = () => {
    notificationTimer.current = setTimeout(
      () => setNotificationToggle(false),
      100
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current.focus();
      } else if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={darkMode ? styles.iconDarkmode : styles.iconLightmode}>
          <img
            className={styles.headerLogo}
            src="/images/logo.png"
            alt="Logo"
          />
          <div className={styles.logoTitle}>MPhone 2.O</div>
        </div>

        <div className={styles.searchBar}>
          <div className={styles.searchInputContainer}>
            <IoIosSearch
              className={
                darkMode
                  ? styles.searchIconDarkmode
                  : styles.searchIconLightmode
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

        <div
          className={
            darkMode ? styles.toolsWrapDarkmode : styles.toolsWrapLightmode
          }
        >
          <div className={styles.profile}>
            <FaRegUserCircle
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              className={
                darkMode
                  ? styles.profileIconDarkmode
                  : styles.profileIconLightmode
              }
            />
          </div>

          <div className={styles.wrap}>
            <MdLightMode
              onClick={() => setDarkMode((prev) => !prev)}
              className={darkMode ? styles.darkmode : styles.lightmode}
            />
          </div>

          <div
            className={styles.notificationsIconContainer}
            onMouseEnter={handleNotificationMouseEnter}
            onMouseLeave={handleNotificationMouseLeave}
          >
            <MdNotificationsNone
              className={
                darkMode
                  ? styles.notificationsIconDarkmode
                  : styles.notificationsIconLightmode
              }
            />
            <div className={styles.notificationsCount}>0</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setHeaderActiveModal("create");
            }}
            className={styles.addContactBtn}
          >
            <MdAddCircle
              className={
                darkMode
                  ? styles.addBtnIconDarkmode
                  : styles.addBtnIconLightmode
              }
              size={32}
            />
          </button>
        </div>

        <div
          className={
            notificationToggle
              ? styles.notificationContainer
              : styles.notificationContainerDisabled
          }
          onMouseEnter={handleNotificationMouseEnter}
          onMouseLeave={handleNotificationMouseLeave}
        >
          <div className={styles.notificationField}>
            <IoNotifications size={40} />
            <div>NO NOTIFICATIONS YET</div>
            <div>COMING SOON</div>
          </div>
        </div>

        <div
          className={
            profileToggle
              ? styles.profileContainer
              : styles.profileContainerDisabled
          }
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
        >
          <div className={styles.profileFieldLayer1}>
            <div className={styles.profileImageContainer}>
              <img
                className={styles.picture}
                src="/images/profile.jpg"
                alt="profile-icon"
              />
            </div>
            <div className={styles.profileName}>Daniel Otchere</div>
          </div>

          <hr className={styles.profileHr1} />

          <div className={styles.profileFieldLayer2}>
            <Link to="" className={styles.profileLayer2Link}>
              <GrUpdate size={15} />
              <div>Profile Update</div>
            </Link>
            <Link to="" className={styles.profileLayer2Link}>
              <TfiHelpAlt size={18} />
              <div>Help Center</div>
            </Link>
            <Link to="" className={styles.profileLayer2Link}>
              <FiFlag />
              <div>Report Bug</div>
            </Link>
            <Link to="" className={styles.profileLayer2Link}>
              <GrDocumentVerified />
              <div>Terms & Policies</div>
            </Link>
            <button
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.stopPropagation();
                setHeaderActiveModal("logout");
              }}
            >
              <FiLogOut />
              <div>Logout</div>
            </button>
          </div>
        </div>
      </header>

      <Outlet
        context={{
          headerActiveModal,
          setHeaderActiveModal,
        }}
      />
    </>
  );
}

export default Header;
