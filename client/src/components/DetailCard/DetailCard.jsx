import React from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { FaShareAlt, FaFacebookF } from "react-icons/fa";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { LuMessageSquareText } from "react-icons/lu";
import { RiCloseLine } from "react-icons/ri";

import {
  SiX,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
  SiGmail,
} from "react-icons/si";

import styles from "./DetailCard.module.css";

function DetailCard(props) {
  const favouriteStyle = {
    color: props.favourite_status ? "red" : "white",
  };

  const occupationTags = props.occupations.map((item, index, array) => (
    <React.Fragment key={item.id || index}>
      <div className={styles.occupation1}>{`#${item.occupation}`}</div>
      {index !== array.length - 1 && (
        <div className={styles.verticalLine}></div>
      )}
    </React.Fragment>
  ));

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardContent}>
        <div className={styles.detailedCardImageContainer}>
          <img
            className={styles.detailedCardImage}
            src="/images/profile.jpg"
            alt="profile-image"
          />
        </div>

        <div className={styles.detailWrap}>
          <div className={styles.detailBtn}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.handleUpdateFormOpen();
              }}
              className={styles.editBtn}
            >
              <CiEdit className={styles.edit} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onDelete?.(props.id);
              }}
              className={styles.deleteBtn}
            >
              <MdDeleteOutline className={styles.delete} />
            </button>

            <button
              className={styles.favouriteBtn}
              onClick={() =>
                props.onUpdate?.(props.id, !props.favourite_status)
              }
            >
              <FaHeart style={favouriteStyle} className={styles.favIcon} />
            </button>

            <button className={styles.shareBtn}>
              <FaShareAlt className={styles.share} />
            </button>
          </div>

          <div className={styles.desc}>
            <div className={styles.personName}>
              {`${props.first_name} ${props.other_names}`}
            </div>
            <div className={styles.occupations}>{occupationTags}</div>
          </div>

          <div className={styles.credentials}>
            <div className={styles.numberDetail}>
              <div className={styles.personalNumber}>Personal-number</div>
              <div className={styles.phoneActions}>
                <div className={styles.number}>{props.phone_number}</div>
                <div className={styles.ActionBtns}>
                  <a
                    className={styles.callLink}
                    href={`tel:${props.phone_number}`}
                  >
                    <LiaPhoneVolumeSolid size={20} />
                  </a>
                  <a
                    className={styles.messageLink}
                    href={`sms:${props.phone_number}`}
                  >
                    <LuMessageSquareText size={20} />
                  </a>
                </div>
              </div>
            </div>

            <hr />

            <div className={styles.emailDetail}>
              <div className={styles.personalEmail}>Personal-email</div>
              <div className={styles.email}>{props.email}</div>
            </div>

            <hr />

            <div className={styles.homeDetail}>
              <div className={styles.home}>Home</div>
              <div className={styles.homeAddress}>{props.home_address}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <a
          className={styles.emailLink}
          href={`mailto:${props.email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGmail className={styles.emailIcon} />
        </a>
        <a
          className={styles.twitterLink}
          href={props.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiX className={styles.twitterIcon} />
        </a>
        <a
          className={styles.instagramLink}
          href={props.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiInstagram className={styles.instagramIcon} />
        </a>
        <a
          className={styles.facebookLink}
          href={props.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF className={styles.facebookIcon} />
        </a>
        <a
          className={styles.whatsappLink}
          href={props.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiWhatsapp className={styles.whatsappIcon} />
        </a>
        <a
          className={styles.linkedinLink}
          href={props.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiLinkedin className={styles.linkedinIcon} />
        </a>
      </div>

      <button className={styles.modalClose}>
        <RiCloseLine
          size={24}
          onClick={(e) => {
            e.stopPropagation();
            props.handleCloseModal();
          }}
        />
      </button>
    </div>
  );
}

export default DetailCard;
