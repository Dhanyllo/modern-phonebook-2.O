import React , { useState , useEffect }from 'react'
import {Link} from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigation } from 'react-router-dom';



function Header2(props) {
  console.log(props);
  const Navigation = useNavigation()
  const isNavigatingToAllContacts = Navigation.location?.pathname === "/"
  const isNavigatingToFavourites = Navigation.location?.pathname === "/favourites"

  return (
     <header className="header">
        <div className={props.darkMode ? "grel-icon2-darkmode" : "grel-icon2-lightmode"}>
          {
            props.darkMode ? <img className="header-logo" src="/images/GREL2.webp" alt="" /> : 
            <img className="header-logo" src="/images/sifca.png" alt="" />
          } 
        </div>
    
        <div className={props.darkMode ? "header2-middle-darkmode" : "header2-middle-lightmode"}>
          <ul>
            <Link 
              aria-disabled={isNavigatingToAllContacts} 
              to="/">
                All Contacts
            </Link>
            <Link 
              aria-disabled={isNavigatingToFavourites}
              to="/favourites">
                Favourites
            </Link>
          </ul>
        </div>
    
        <div className={props.darkMode ? "tools-wrap2-darkmode" : "tools-wrap2-lightmode"}>
            <div class="notifications-icon-container">
              <MdNotificationsNone className='notifications-icon2'/>
              <div class="notifications-count">
                3
              </div>
            </div>
    
          <div className="wrap">
            <MdLightMode 
              onClick={() => props.setDarkMode((prev) => !prev)}  
              className='darkmode' 
            />
          </div>
        </div>
      </header>
  )
}

export default Header2;
