import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { RiCloseLine } from "react-icons/ri";
import { useUI } from "../../context/UIContext";
import { Link } from "react-router-dom";
import { BsBrightnessHigh } from "react-icons/bs";
import { TfiHelpAlt } from "react-icons/tfi";
import { FiFlag, FiLogOut } from "react-icons/fi";
import { GrUpdate, GrDocumentVerified } from "react-icons/gr";
import { useDarkMode } from "../../hooks/useDarkmode";
import { fetchMyProfile } from "../../api/fetchMyProfile";
import { useQuery } from "@tanstack/react-query";
import styles from "./MobileProfileModal.module.css";

function MobileProfileModal() {
  const { darkMode, setDarkMode } = useDarkMode();
  const { activeModal, setActiveModal } = useUI();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (activeModal === "mobileprofile") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const { data: profile } = useQuery({
    queryKey: ["myProfile"], // unique query key
    queryFn: () => fetchMyProfile(apiUrl),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  console.log(profile);

  return ReactDOM.createPortal(
    <motion.div
      className={styles.modalOverlay}
      onClick={(e) => {
        e.stopPropagation();
        setActiveModal("null");
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={styles.mainContainer}
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button
          className={styles.modalClose}
          onClick={(e) => {
            e.stopPropagation();
            setActiveModal("null");
          }}
        >
          <RiCloseLine size={24} />
        </button>
        <div className={styles.profileContainer}>
          <div className={styles.profileFieldLayer1}>
            <div className={styles.profileImageContainer}>
              <img
                className={styles.picture}
                src="/images/profile.jpg"
                alt="profile-icon"
              />
            </div>
            <div className={styles.profileName}>
              {profile?.first_name}&nbsp;{profile?.other_names}
            </div>
          </div>

          <hr className={styles.profileHr1} />

          <div className={styles.profileFieldLayer2}>
            <Link
              to=""
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.preventDefault();
                alert("Coming soon!");
              }}
            >
              <GrUpdate size={15} />
              <div>Profile Update</div>
            </Link>

            <Link
              to=""
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.preventDefault();
                alert("Coming soon!");
              }}
            >
              <TfiHelpAlt size={18} />
              <div>Help Center</div>
            </Link>

            <Link
              to=""
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.preventDefault();
                alert("Coming soon!");
              }}
            >
              <FiFlag />
              <div>Report Bug</div>
            </Link>

            <Link
              to=""
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.preventDefault();
                alert("Coming soon!");
              }}
            >
              <GrDocumentVerified />
              <div>Terms & Policies</div>
            </Link>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={styles.profileLayer2Link}
            >
              <BsBrightnessHigh size={18} />
              <div>{darkMode ? "Lightmode" : "Darkmode"}</div>
            </button>

            <button
              className={styles.profileLayer2Link}
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal("logout");
              }}
            >
              <FiLogOut />
              <div>Logout</div>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root")
  );
}

export default MobileProfileModal;
