// import { useState } from "react";
// import { FaHeart } from "react-icons/fa6";
// import { useNavigation, useLocation } from "react-router-dom";

// function ContactCard(props) {
//   const location = useLocation();
//   const Navigation = useNavigation();
//   const isNavigatingToCard =
//     Navigation.location?.pathname === `/detail/${props.id}`;
//   const handleOpenDetailModal = () => props.setIsDetailModalOpen(true);

//   let color;

//   if (!props.favouriteStatus && props.darkMode) {
//     color = "white";
//   } else if (!props.favouriteStatus && !props.darkMode) {
//     color = "inherit";
//   } else {
//     color = "red";
//   }

//   const favouriteStyle = {
//     color: color,
//   };

//   const firstLetter = props.firstName.charAt(0);

//   return (
//     <>
//       <div
//         className={
//           props.darkMode ? "card-wrap-darkmode" : "card-wrap-lightmode"
//         }
//       >
//         <div className="btn-layer">
//           <button
//             className="fav-btn"
//             onClick={() => props.onUpdate(props.id, !props.favouriteStatus)}
//           >
//             <FaHeart style={favouriteStyle} className="heart-icon2" />
//           </button>
//           {/* <Link
//             aria-disabled={isNavigatingToCard}
//             to={`/detail/${props.id}`}
//             state={location.pathname}
//             className="view-link"
//           >
//             {isNavigatingToCard ? "...." : "view"}
//           </Link> */}

//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               handleOpenDetailModal();
//               props.onViewClick();
//             }}
//             className="view-link"
//           >
//             View
//           </button>
//         </div>
//         <div className="card-image-wrap">
//           <div className="card-image">
//             <img src="" alt="" />
//             <div className="alpha">{firstLetter}</div>
//           </div>
//         </div>
//         <div className={props.darkMode ? "card-desc" : "card-desc"}>
//           <div>{`${props.firstName} ${props.otherNames}`}</div>
//           <div>{props.phoneNumber}</div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ContactCard;

import { FaHeart } from "react-icons/fa6";

function ContactCard(props) {
  const firstLetter = props.firstName.charAt(0);

  // Handle favorite button color logic
  let color;
  if (!props.favouriteStatus && props.darkMode) {
    color = "white";
  } else if (!props.favouriteStatus && !props.darkMode) {
    color = "inherit";
  } else {
    color = "red";
  }

  const favouriteStyle = { color };

  return (
    <div
      className={props.darkMode ? "card-wrap-darkmode" : "card-wrap-lightmode"}
    >
      <div className="btn-layer">
        {/* Favorite button */}
        <button
          className="fav-btn"
          onClick={() => props.onUpdate(props.id, !props.favouriteStatus)}
        >
          <FaHeart style={favouriteStyle} className="heart-icon2" />
        </button>

        {/* View button opens modal via modal manager */}
        <button onClick={props.onViewClick} className="view-link">
          View
        </button>
      </div>

      <div className="card-image-wrap">
        <div className="card-image">
          <img src="" alt="" />
          <div className="alpha">{firstLetter}</div>
        </div>
      </div>

      <div className="card-desc">
        <div>{`${props.firstName} ${props.otherNames}`}</div>
        <div>{props.phoneNumber}</div>
      </div>
    </div>
  );
}

export default ContactCard;
