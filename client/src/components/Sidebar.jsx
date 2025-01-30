import React from 'react';
import { RiContactsBookFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";

function Sidebar() {
  return (
      <nav className="sidebar">
        <a className="active" href="">
          <div className='link-text'>All Contacts</div>
          <RiContactsBookFill className='contacts-icon'/>
        </a>
        <a href="">
          <div className='link-text'>Favourites</div>
          <FaHeart className='heart-icon' />
        </a>
      </nav>
  )
}

export default Sidebar
