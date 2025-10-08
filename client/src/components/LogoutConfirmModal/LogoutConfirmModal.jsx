import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import styles from "./LogoutConfirmModal.module.css";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const LogoutConfirmModal = ({ headerActiveModal, closeModal, onConfirm }) => {
  useEffect(() => {
    if (headerActiveModal === "logout") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [headerActiveModal]);

  return ReactDOM.createPortal(
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
      }}
    >
      <motion.div
        className={styles.modalContainer}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.modalTitle}>Logout Confirmation</h2>
        <p className={styles.modalMessage}>
          Are you sure you want to log out? You’ll need to sign back in to
          access your account.
        </p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.logoutBtn}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Logout
          </button>
          <button
            className={styles.cancelBtn}
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default LogoutConfirmModal;
