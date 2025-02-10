import React from 'react'
import {Link} from "react-router-dom";
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";


function Header2() {
  return (
     <header className="header">
        <div className="grel-icon">
          <img className="header-logo" src="/images/sifca.png" alt="" />
        </div>
    
        <div className="header2-middle">
          <ul>
            <Link to="/">All Contacts</Link>
            <Link to="/favourites">Favourites</Link>
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
