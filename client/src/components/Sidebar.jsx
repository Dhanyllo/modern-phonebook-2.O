import React , { useState , useEffect }from 'react';
import {NavLink} from "react-router-dom";
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { useNavigation } from 'react-router-dom';


function Sidebar(props) {

  const Navigation = useNavigation();
  const hearticon ={
    color : props.favStatus ? "red" : "white"
  }

  const isNavigatingToFavourites = Navigation.location?.pathname === "/favourites"

  return (
      <nav className={props.darkMode ? "sidebar-darkmode" : "sidebar-lightmode"}>
        <NavLink
          className= {({isActive}) => isActive ? "active" : "link-text"} 
          to="/" 
          >
          <div className='link-text'>All Contacts</div>
          <RiContactsBookFill className='contacts-icon'/>
        </NavLink>
        <NavLink 
          aria-disabled={isNavigatingToFavourites}
          className= {({isActive}) => isActive ? "active" : "link-text"}
          to="/favourites"
        >
          <div className='link-text'>
            Favourites
          </div>
          <FaHeart style={hearticon} className='heart-icon' />
        </NavLink>
      </nav>
  )
}

export default Sidebar
