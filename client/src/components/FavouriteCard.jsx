import React from 'react';
import { FaHeart } from "react-icons/fa6";
import { useNavigation , Link , useLocation } from 'react-router-dom';

function FavouriteCard(props) {
  const location = useLocation();
  const Navigation = useNavigation();
  const isNavigatingToCard = Navigation.location?.pathname === `/detail/${props.id}`;
  
  const firstLetter = props.firstName.charAt(0);
  const color = {
    color:"red"
  }

  return (
      <div className={props.darkMode ? "card-wrap-darkmode" : "card-wrap-lightmode"}>
        <div className='btn-layer'>
          <button className='fav-btn' onClick={() => props.onUpdate(props.id, !props.favouriteStatus)}>
            <FaHeart style={color} className='heart-icon2' />
          </button>
          <Link aria-disabled={isNavigatingToCard} to={`/detail/${props.id}`} state={location.pathname} className="view-link">
            {isNavigatingToCard ? "...." : "view" }
          </Link>
        </div>
        <div className='card-image-wrap'>
          <div className='card-image'>
            <img src="" alt="" />
            <div className='alpha'>
              {firstLetter}
            </div>
          </div>
        </div>
        <div className='card-desc'> 
          <div>{`${props.firstName} ${props.otherNames}`}</div>
          <div>{props.phoneNumber}</div>
        </div>
      </div>
  )
}

export default FavouriteCard
