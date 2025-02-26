import React from 'react'
import {Link} from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigation } from 'react-router-dom';


function Header2() {
  const Navigation = useNavigation()
  const isNavigatingToAllContacts = Navigation.location?.pathname === "/"
  const isNavigatingToFavourites = Navigation.location?.pathname === "/favourites"

  return (
     <header className="header">
        <div className="grel-icon">
          <img className="header-logo" src="/images/sifca.png" alt="" />
        </div>
    
        <div className="header2-middle">
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
    
        <div className="tools-wrap2">
            <div class="notifications-icon-container">
              <MdNotificationsNone className='notifications-icon2'/>
              <div class="notifications-count">
                3
              </div>
            </div>
    
          <div className="wrap">
            <MdLightMode className='dark-light-mode2' />
          </div>
        </div>
      </header>
  )
}

export default Header2;
