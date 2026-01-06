import { FaHeart } from "react-icons/fa6";
import styles from "./ContactCard.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { RiArrowRightSLine } from "react-icons/ri";

function ContactCard({
  firstName,
  otherNames,
  phoneNumber,
  favouriteStatus,
  id,
  imageURL,
  onUpdate,
  onViewClick,
}) {
  const { darkMode } = useDarkMode();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { isMobile } = useBreakpoint();

  const firstLetter = firstName.charAt(0);

  let color;
  if (!favouriteStatus && darkMode) {
    color = "white";
  } else if (!favouriteStatus && !darkMode) {
    color = "inherit";
  } else {
    color = "red";
  }

  const favouriteStyle = { color };

  return (
    <div
      onClick={isMobile && onViewClick}
      onKeyDown={(e) => e.key === "Enter" && onViewClick()}
      role="button"
      tabIndex={0}
      className={darkMode ? styles.cardWrapDarkmode : styles.cardWrapLightmode}
    >
      <div className={styles.btnLayer}>
        <button
          className={styles.favBtn}
          onClick={() => onUpdate(apiUrl, id, !favouriteStatus)}
        >
          <FaHeart style={favouriteStyle} className={styles.heartIcon} />
        </button>

        <button onClick={onViewClick} className={styles.viewLink}>
          View
        </button>
      </div>

      <div className={styles.cardImageWrap}>
        <div className={styles.cardImage}>
          {imageURL ? (
            <img
              className={styles.contactImage}
              src={`${apiUrl}${imageURL}`}
              alt="image"
            />
          ) : (
            <div className={styles.alpha}>{firstLetter}</div>
          )}
        </div>
      </div>

      <div className={styles.cardDesc}>
        <div className={styles.contactName}>{`${firstName} ${otherNames}`}</div>
        <div>{phoneNumber}</div>
      </div>

      <RiArrowRightSLine className={styles.arrowRight} />
    </div>
  );
}

export default ContactCard;
