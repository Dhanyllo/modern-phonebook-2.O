import React from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { FaShareAlt, FaFacebookF } from "react-icons/fa";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { LuMessageSquareText } from "react-icons/lu";
import { RiCloseLine } from "react-icons/ri";
import { motion } from "framer-motion";
import {
  SiX,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
  SiGmail,
} from "react-icons/si";
import { useDarkMode } from "../../hooks/useDarkmode";
import styles from "./DetailCard.module.css";

function DetailCard(props) {
  const darkMode = useDarkMode();
  const apiUrl = import.meta.env.VITE_API_URL;
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const favouriteStyle = {
    color: props.favourite_status ? "red" : "white",
  };

  const generateVCard = () => {
    const vcardData = `
BEGIN:VCARD
VERSION:3.0
FN:${props.first_name} ${props.other_names}
TEL:${props.phone_number}
EMAIL:${props.email}
${
  props.occupations && props.occupations.length > 0
    ? `TITLE:${props.occupations.map((item) => item).join(", ")}`
    : ""
}
END:VCARD
`.trim();

    return new Blob([vcardData], { type: "text/vcard" });
  };

  const handleDownload = () => {
    const blob = generateVCard();
    if (!blob || blob.size === 0) {
      alert("Failed to generate vCard data!");
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      props.first_name || props.other_names
        ? `${props.first_name || ""} ${props.other_names || ""}`.trim()
        : "contact"
    }.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNativeShare = async () => {
    const blob = generateVCard();
    const file = new File(
      [blob],
      `${
        props.first_name || props.other_names
          ? `${props.first_name || ""} ${props.other_names || ""}`.trim()
          : "contact"
      }.vcf`,
      {
        type: "text/vcard",
      }
    );

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "Share Contact",
          text: `Sharing ${props.first_name} ${props.other_names}'s contact card`,
          files: [file],
        });
      } catch (err) {
        // User canceled OR platform not permitted
        if (err.name === "NotAllowedError" || err.name === "AbortError") {
          console.warn("Native share not permitted or canceled:", err);
          alert(
            "Sharing is not supported on this device or was canceled. Download instead for manual sharing..."
          );
          handleDownload();
        } else {
          console.error("Unexpected share error:", err);
        }
      }
    } else {
      alert(
        "File sharing isn't supported on this device. Downloading instead..."
      );
      handleDownload();
    }
  };

  const occupationTags = props.occupations.map((item, index, array) => (
    <React.Fragment key={item.id || index}>
      <div className={styles.occupation1}>{`#${item}`}</div>
      {index !== array.length - 1 && (
        <div className={styles.verticalLine}></div>
      )}
    </React.Fragment>
  ));

  return (
    <motion.div
      className={styles.cardContainer}
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.cardContent}>
        <div className={styles.detailedCardImageContainer}>
          <img
            className={styles.detailedCardImage}
            src={
              props?.image_url
                ? `${apiUrl}${props.image_url}`
                : "/images/profile.jpg"
            }
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
                props.handleDelete();
              }}
              className={styles.deleteBtn}
            >
              <MdDeleteOutline className={styles.delete} />
            </button>

            <button
              className={styles.favouriteBtn}
              onClick={(e) => {
                e.stopPropagation();
                props.handleUpdateFavourite(
                  apiUrl,
                  props.id,
                  !props.favourite_status
                );
              }}
            >
              <FaHeart style={favouriteStyle} className={styles.favIcon} />
            </button>

            <button onClick={handleNativeShare} className={styles.shareBtn}>
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
              <div className={styles.email}>{props.email || "N/A"}</div>
            </div>

            <hr />

            <div className={styles.homeDetail}>
              <div className={styles.home}>Home</div>
              <div className={styles.homeAddress}>
                {props.home_address || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.socialLinks}>
        <a
          aria-disabled={props.email ? "false" : "true"}
          className={styles.emailLink}
          href={props.email ? `mailto:${props.email}` : undefined}
          onClick={(e) => {
            if (!props.email) e.preventDefault();
          }}
          target={props.email ? "_blank" : undefined}
          rel={props.email ? "noopener noreferrer" : undefined}
        >
          <SiGmail className={styles.emailIcon} />
        </a>

        <a
          aria-disabled={props.twitter ? "false" : "true"}
          className={styles.twitterLink}
          href={props.twitter || undefined}
          onClick={(e) => {
            if (!props.twitter) e.preventDefault();
          }}
          target={props.twitter ? "_blank" : undefined}
          rel={props.twitter ? "noopener noreferrer" : undefined}
        >
          <SiX className={styles.twitterIcon} />
        </a>

        <a
          aria-disabled={props.instagram ? "false" : "true"}
          className={styles.instagramLink}
          href={props.instagram || undefined}
          onClick={(e) => {
            if (!props.instagram) e.preventDefault();
          }}
          target={props.instagram ? "_blank" : undefined}
          rel={props.instagram ? "noopener noreferrer" : undefined}
        >
          <SiInstagram className={styles.instagramIcon} />
        </a>

        <a
          aria-disabled={props.facebook ? "false" : "true"}
          className={styles.facebookLink}
          href={props.facebook || undefined}
          onClick={(e) => {
            if (!props.facebook) e.preventDefault();
          }}
          target={props.facebook ? "_blank" : undefined}
          rel={props.facebook ? "noopener noreferrer" : undefined}
        >
          <FaFacebookF className={styles.facebookIcon} />
        </a>

        <a
          aria-disabled={props.whatsapp ? "false" : "true"}
          className={styles.whatsappLink}
          href={props.whatsapp || undefined}
          onClick={(e) => {
            if (!props.whatsapp) e.preventDefault();
          }}
          target={props.whatsapp ? "_blank" : undefined}
          rel={props.whatsapp ? "noopener noreferrer" : undefined}
        >
          <SiWhatsapp className={styles.whatsappIcon} />
        </a>

        <a
          aria-disabled={props.linkedin ? "false" : "true"}
          className={styles.linkedinLink}
          href={props.linkedin || undefined}
          onClick={(e) => {
            if (!props.linkedin) e.preventDefault();
          }}
          target={props.linkedin ? "_blank" : undefined}
          rel={props.linkedin ? "noopener noreferrer" : undefined}
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
    </motion.div>
  );
}

export default DetailCard;
