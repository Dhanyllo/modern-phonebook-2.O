import { useRef, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MdLightMode, MdNotificationsNone, MdAddCircle } from "react-icons/md";
import { BsBrightnessHigh } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { TfiHelpAlt } from "react-icons/tfi";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiFlag, FiLogOut } from "react-icons/fi";
import { GrUpdate, GrDocumentVerified } from "react-icons/gr";
import { isTablet } from "react-device-detect";
import { useDarkMode } from "../../context/DarkModeContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useUI } from "../../context/UIContext";
import styles from "./HeaderNormal.module.css";

function HeaderNormal() {
  const { darkMode, setDarkMode } = useDarkMode();
  const { setActiveModal, activeModal, setIsSearchMode } = useUI();
  const { isMobile, isTablet } = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchParams") || "";
  const inputRef = useRef(null);
  const [profileToggle, setProfileToggle] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const profileTimer = useRef();
  const notificationTimer = useRef();

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
    const invalidMobileModals = ["mobileprofile", "mobileNotification"];

    const invalidTabletModals = ["tabletprofile", "tabletNotification"];

    if (invalidMobileModals.includes(activeModal) && !isMobile) {
      setActiveModal(null);
    }

    if (invalidTabletModals.includes(activeModal) && !isTablet) {
      setActiveModal(null);
    }
  }, [isMobile, isTablet, activeModal]);

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
    <>
      <header
        className={
          darkMode ? styles.headerNormalDarkmode : styles.headerNormalLightmode
        }
      >
        <div
          className={
            darkMode
              ? styles.leftSideHeaderDarkmode
              : styles.leftSideHeaderLightmode
          }
        >
          <div className={styles.hamburgerButtonWrap}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal("mobilesidebar");
              }}
              className={
                darkMode
                  ? styles.hamburgerMenuDarkmode
                  : styles.hamburgerMenuLightmode
              }
            >
              <RxHamburgerMenu className={styles.hamburgerMenuButton} />
            </button>
          </div>
          <div className={styles.icons}>
            <img
              className={styles.headerLogo}
              src="/images/logo.png"
              alt="Logo"
            />
            <div className={styles.logoTitle}>MPhone 2.O</div>
          </div>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchMode(true);
            }}
            className={
              darkMode
                ? styles.searchButtonDarkmode
                : styles.searchButtonLightmode
            }
          >
            <IoSearch className={styles.searchButtonIcon} />
          </button>

          <div className={styles.profile}>
            <FaRegUserCircle
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              className={
                darkMode
                  ? styles.profileIconDarkmode
                  : styles.profileIconLightmode
              }
              onClick={(e) => {
                e.stopPropagation();
                isTablet && setActiveModal("tabletProfile");
              }}
            />
          </div>

          <div className={styles.wrap}>
            {isMobile ? (
              <FaRegUserCircle
                onMouseEnter={!isMobile ? handleProfileMouseEnter : undefined}
                onMouseLeave={!isMobile ? handleProfileMouseLeave : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal("mobileprofile");
                }}
                className={
                  darkMode
                    ? styles.profileIconDarkmode
                    : styles.profileIconLightmode
                }
              />
            ) : (
              <MdLightMode
                onClick={() => setDarkMode((prev) => !prev)}
                className={darkMode ? styles.darkmode : styles.lightmode}
              />
            )}
          </div>

          <div
            className={styles.notificationsIconContainer}
            onMouseEnter={!isMobile ? handleNotificationMouseEnter : undefined}
            onMouseLeave={!isMobile ? handleNotificationMouseLeave : undefined}
            onClick={(e) => {
              e.stopPropagation();
              isMobile && setActiveModal("mobileNotification");
              isTablet && setActiveModal("tabletNotification");
            }}
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
              setActiveModal("create");
            }}
            className={styles.addContactBtn}
          >
            <MdAddCircle
              className={
                darkMode
                  ? styles.addBtnIconDarkmode
                  : styles.addBtnIconLightmode
              }
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
              onClick={() => setDarkMode((prev) => !prev)}
              className={styles.profileLayer2Link2}
            >
              <BsBrightnessHigh size={18} />
              <div>{darkMode ? "Lightmode" : "Darkmode"}</div>
            </button>

            <button
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal("logout");
              }}
            >
              <FiLogOut />
              <div>Logout</div>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default HeaderNormal;
