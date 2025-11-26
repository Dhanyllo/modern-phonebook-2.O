import { useEffect } from "react";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import { IoNotifications } from "react-icons/io5";
import { useDarkMode } from "../../hooks/useDarkmode";
import { useUI } from "../../context/UIContext";
import styles from "./TabletNotificationModal.module.css";

function TabletNotificationModal() {
  const { darkMode } = useDarkMode();
  const { activeModal, setActiveModal } = useUI();

  useEffect(() => {
    if (activeModal === "tabletNotification") {
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
        className={styles.notificationContainer}
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={styles.notificationField}>
          <IoNotifications size={40} />
          <div>NO NOTIFICATIONS YET</div>
          <div>COMING SOON</div>
        </div>
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root")
  );
}

export default TabletNotificationModal;
