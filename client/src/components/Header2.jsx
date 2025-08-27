import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigation } from "react-router-dom";

function Header2(props) {
  console.log(props);
  const Navigation = useNavigation();
  const [notificationToggle, setNotificationToggle] = useState(false);
  const isNavigatingToAllContacts = Navigation.location?.pathname === "/";
  const isNavigatingToFavourites =
    Navigation.location?.pathname === "/favourites";

  return (
    <header className="header">
      <div className={props.darkMode ? "icon2-darkmode" : "icon2-lightmode"}>
        <img className="header-logo" src="/images/logo.png" alt="" />
        <div className="logo-title">MPhone 2.O</div>
      </div>

      <div
        className={
          props.darkMode
            ? "header2-middle-darkmode"
            : "header2-middle-lightmode"
        }
      >
        <ul>
          <Link aria-disabled={isNavigatingToAllContacts} to="/">
            All Contacts
          </Link>
          <Link aria-disabled={isNavigatingToFavourites} to="/favourites">
            Favourites
          </Link>
        </ul>
      </div>

      <div
        className={
          props.darkMode ? "tools-wrap2-darkmode" : "tools-wrap2-lightmode"
        }
      >
        <div class="notifications-icon-container">
          <MdNotificationsNone
            onClick={() => setNotificationToggle((prev) => !prev)}
            className="notifications-icon2"
          />
          <div class="notifications-count">3</div>
        </div>

        <div className="wrap">
          <MdLightMode
            onClick={() => props.setDarkMode((prev) => !prev)}
            className="darkmode2"
          />
        </div>
      </div>
      <div
        className={
          notificationToggle
            ? "notification-container"
            : "notification-container-disabled"
        }
      >
        <div className="notification-field">COMING SOON</div>
      </div>
    </header>
  );
}

export default Header2;
