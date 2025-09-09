import { useRef, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { MdAddCircle } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";

function Header(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileToggle, setProfileToggle] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const searchQuery = searchParams.get("searchParams");
  const inputRef = useRef(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const handleCloseProductModal = () => setIsProductModalOpen(false);
  const handleProductOpenModal = () => {
    setIsProductModalOpen(true);
  };

  function HandleChange(event) {
    setSearchParams({ searchParams: event.target.value });
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current.focus();
      } else if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current.blur();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className={props.darkMode ? "icon-darkmode" : "icon-lightmode"}>
          <img className="header-logo" src="/images/logo.png" alt="" />
          <div className="logo-title">MPhone 2.O</div>
        </div>

        <div className="search-bar">
          <div className="search-input-container">
            <IoIosSearch
              className={
                props.darkMode
                  ? "search-icon-darkmode"
                  : "search-icon-lightmode"
              }
            />
            <input
              ref={inputRef}
              autoComplete="off"
              onChange={HandleChange}
              type="text"
              value={searchQuery}
              className={
                props.darkMode
                  ? "search-bar-input-darkmode"
                  : "search-bar-input-lightmode"
              }
              name="search"
              placeholder="Type '&#65295;'  to search ...."
            />
          </div>
        </div>

        <div
          className={
            props.darkMode ? "tools-wrap-darkmode" : "tools-wrap-lightmode"
          }
        >
          <div className="profile">
            <FaRegUserCircle
              onMouseEnter={() => setProfileToggle(true)}
              onMouseLeave={() => setProfileToggle(false)}
              className={
                props.darkMode
                  ? "profile-icon-darkmode"
                  : "profile-icon-lightmode"
              }
            />
          </div>

          <div class="notifications-icon-container">
            <MdNotificationsNone
              onMouseEnter={() => setNotificationToggle(true)}
              onMouseLeave={() => setNotificationToggle(false)}
              className={
                props.darkMode
                  ? "notifications-icon1-darkmode"
                  : "notifications-icon1-lightmode"
              }
            />
            <div class="notifications-count">0</div>
          </div>

          <div className="wrap">
            <MdLightMode
              onClick={() => props.setDarkMode((prev) => !prev)}
              className={props.darkMode ? "darkmode" : "lightmode"}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleProductOpenModal();
            }}
            className="add-contact-btn"
          >
            <MdAddCircle
              className={
                props.darkMode
                  ? "add-btn-icon-darkmode"
                  : "add-btn-icon-lightmode"
              }
              size={32}
            />
          </button>
        </div>
        <div
          className={
            notificationToggle
              ? "notification-container"
              : "notification-container-disabled"
          }
          onMouseEnter={() => setNotificationToggle(true)}
          onMouseLeave={() => setNotificationToggle(false)}
        >
          <div className="notification-field">NOTIFICATIONS COMING SOON</div>
        </div>
        <div
          className={
            profileToggle ? "profile-container" : "profile-container-disabled"
          }
          onMouseEnter={() => setProfileToggle(true)}
          onMouseLeave={() => setProfileToggle(false)}
        >
          <div className="profile-field-layer1">COMING SOON</div>
        </div>
      </header>

      <Outlet
        context={{
          darkMode: props.darkMode,
          isProductModalOpen,
          handleCloseProductModal,
        }}
      />
    </>
  );
}

export default Header;
