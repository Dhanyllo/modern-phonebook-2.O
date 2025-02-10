import React from 'react';
import {NavLink} from "react-router-dom";
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";

function Sidebar() {
  return (
      <nav className="sidebar">
        <NavLink 
          className= {({isActive}) => isActive ? "active" : "link-text"} 
          to="/" 
        >
          <div className='link-text'>All Contacts</div>
          <RiContactsBookFill className='contacts-icon'/>
        </NavLink>
        <NavLink 
          className= {({isActive}) => isActive ? "active" : "link-text"}
          to="/favourites"
        >
          <div className='link-text'>Favourites</div>
          <FaHeart className='heart-icon' />
        </NavLink>
      </nav>
  )
}

export default Sidebar
