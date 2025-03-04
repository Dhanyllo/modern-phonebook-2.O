import React from 'react'
import { FaHeart } from "react-icons/fa6";
import { useNavigation,Link,useLocation,useSearchParams } from 'react-router-dom';


function ContactCard(props) {
  const location = useLocation();
  const Navigation = useNavigation();
  const isNavigatingToCard = Navigation.location?.pathname === `/detail/${props.id}`
  
 
  const favouriteStyle = {
    color: props.favouriteStatus === 1 ? "red" : "inherit"
};

  const firstLetter = props.firstName.charAt(0);

  return (
    <>
      <div className='card-wrap'>
        <div className='btn-layer'>
          <div>
            <FaHeart style={favouriteStyle} className='heart-icon2' />
          </div>
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
    </>
  )
}

export default ContactCard;
