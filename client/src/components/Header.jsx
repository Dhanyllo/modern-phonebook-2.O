import React from 'react'
import { MdLightMode } from "react-icons/md";

function Header() {
  return (
      <header className="header">
        <div className="grel-icon">
          <img className="header-logo" src="./images/sifca.png" alt="" />
        </div>

        <div className="search-bar">
          <div className="search-input-container">
            <img src="./images/search.png" alt="search-icon" className="search-icon" />
            <input type="text" className="search-bar-input" name="search" placeholder="Search..." />
          </div>
        </div>

        <div className="tools-wrap">
            <div class="notifications-icon-container">
              <img src="images/notifications.svg" class="notifications-icon" />
              <div class="notifications-count">
                3
              </div>
            </div>

          <div className="wrap">
            <MdLightMode className='dark-light-mode' />
          </div>
        </div>
      </header>
  )
}

export default Header
