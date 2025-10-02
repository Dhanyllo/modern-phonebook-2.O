import { FaHeart } from "react-icons/fa6";

function FavouriteCard(props) {
  const firstLetter = props.firstName.charAt(0);

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
        <button
          className="fav-btn"
          onClick={() => props.onUpdate(props.id, !props.favouriteStatus)}
        >
          <FaHeart style={favouriteStyle} className="heart-icon2" />
        </button>

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

export default FavouriteCard;
