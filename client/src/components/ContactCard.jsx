import React from 'react'
import { FaHeart } from "react-icons/fa6";
import { useNavigation , Link , useLocation } from 'react-router-dom';


function ContactCard(props) {
  const location = useLocation();
  const Navigation = useNavigation();
  const isNavigatingToCard = Navigation.location?.pathname === `/detail/${props.id}`
  console.log(props);
  
let color;

if (props.favouriteStatus === 0 && props.darkMode) {
  color = "white";
} else if (props.favouriteStatus === 0 && props.darkMode === false) {
  color = "inherit";
} else {
  color = "red";
}

const favouriteStyle = {
  color: color,
};


  // const favouriteStyle = {
  //   color:
  //     props.favourite_status === 0
  //       ? props.darkMode
  //         ? "white"
  //         : "inherit"
  //       : "red",
  // };
  
  const firstLetter = props.firstName.charAt(0);

  return (
    <>
      <div className={props.darkMode ? "card-wrap-darkmode" : "card-wrap-lightmode"}>
        <div className='btn-layer'>
          <button className='fav-btn' onClick={() => props.onUpdate(props.id, !props.favouriteStatus)}>
            <FaHeart style={favouriteStyle} className='heart-icon2' />
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
        <div className={props.darkMode ? "card-desc" : "card-desc"}> 
          <div>{`${props.firstName} ${props.otherNames}`}</div>
          <div>{props.phoneNumber}</div>
        </div>
      </div>
    </>
  )
}

export default ContactCard;
