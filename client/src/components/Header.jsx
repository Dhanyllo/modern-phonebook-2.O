import React from 'react'
import { Outlet } from 'react-router-dom';
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { useSearchParams } from "react-router-dom";


function Header() {
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchParams");

  function HandleChange(event){
    setSearchParams({ searchParams: event.target.value });
  }

  return (
    <>
      <header className="header">
        <div className="grel-icon">
          <img className="header-logo" src="/images/sifca.png" alt="" />
        </div>

        <div className="search-bar">
          <div className="search-input-container">
            <img src="/images/search.png" alt="search-icon" className="search-icon" />
            <input autoComplete='off' onChange={HandleChange} type="text" value={searchQuery} className="search-bar-input" name="search" placeholder="Search..." />
          </div>
        </div>

        <div className="tools-wrap">
            <div class="notifications-icon-container">
              <MdNotificationsNone className='notifications-icon1'/>
              <div class="notifications-count">
                3
              </div>
            </div>

          <div className="wrap">
            <MdLightMode className='dark-light-mode' />
          </div>
        </div>
      </header>
      <Outlet/>
      </>
  )
}

export default Header
