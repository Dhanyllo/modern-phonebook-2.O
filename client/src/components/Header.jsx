import React, { useRef , useEffect , useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MdLightMode } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";


function Header(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notificationToggle, setNotificationToggle] = useState(false);
  const searchQuery = searchParams.get("searchParams");
  const inputRef = useRef(null)
  
  
  function HandleChange(event){
    setSearchParams({ searchParams: event.target.value });
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault(); 
        inputRef.current.focus();
      }

      else if (event.key === "Escape" && document.activeElement === inputRef.current) {
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
        <div  className={props.darkMode ? "grel-icon-darkmode" : "grel-icon-lightmode"}>
          {
            props.darkMode ? <img className="header-logo" src="/images/GREL2.webp" alt="" /> : 
            <img className="header-logo" src="/images/sifca.png" alt="" />
          } 
        </div>

        <div className="search-bar">
          <div className="search-input-container">
          <IoIosSearch className= {props.darkMode ? "search-icon-darkmode" : "search-icon-lightmode"} />
            <input 
              ref={inputRef} 
              autoComplete='off' 
              onChange={HandleChange} 
              type="text" value={searchQuery} 
              className= {props.darkMode ? "search-bar-input-darkmode" : "search-bar-input-lightmode"} 
              name="search" 
              placeholder="Type '&#65295;'  to search ...."/>
          </div>
        </div>

        <div className= {props.darkMode ? "tools-wrap-darkmode" : "tools-wrap-lightmode"}>
            <div class="notifications-icon-container">
              <MdNotificationsNone onClick={() => setNotificationToggle((prev) => !prev)} 
                className= {props.darkMode ? "notifications-icon1-darkmode" : "notifications-icon1-lightmode"} 
              />
              <div class="notifications-count">
                0
              </div>
            </div>

          <div className="wrap">
            <MdLightMode 
              onClick={() => props.setDarkMode((prev) => !prev)} 
              className={props.darkMode ? "darkmode" : "lightmode"} 
            />
          </div>
        </div>
        <div className={ notificationToggle ? "notification-container":"notification-container-disabled"}>
          <div className='notification-field'>
            COMING SOON
          </div>
        </div>
      </header>
      <Outlet context={props.darkMode}/>
      </>
  )
}

export default Header;
