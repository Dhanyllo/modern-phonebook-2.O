import React from 'react';
import {Link} from "react-router-dom";
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";

function Sidebar() {
  return (
      <nav className="sidebar">
        <Link to="/" className="active">
          <div className='link-text'>All Contacts</div>
          <RiContactsBookFill className='contacts-icon'/>
        </Link>
        <Link to="/favourites">
          <div className='link-text'>Favourites</div>
          <FaHeart className='heart-icon' />
        </Link>
      </nav>
  )
}

export default Sidebar
