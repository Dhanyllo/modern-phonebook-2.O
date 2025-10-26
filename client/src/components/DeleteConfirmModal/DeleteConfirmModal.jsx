import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import styles from "./DeleteConfirmModal.module.css";
import { useUI } from "../../context/UIContext";

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

const DeleteConfirmModal = () => {
  const { activeModal, setActiveModal } = useUI();

  const closeModal = () => setActiveModal(null);
  const onConfirm = () => setActiveModal(null);
  const backToDetail = () => setActiveModal("detail");

  useEffect(() => {
    if (activeModal === "delete") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

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
        onClick={(e) => e.stopPropagation()} // prevent overlay click bubbling
      >
        <h2 className={styles.modalTitle}>Delete Confirmation</h2>
        <p className={styles.modalMessage}>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>

        <div className={styles.buttonGroup}>
          <button
            className={styles.cancelBtn}
            onClick={(e) => {
              e.stopPropagation();
              backToDetail();
            }}
          >
            Cancel
          </button>
          <button
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>,
    document.getElementById("modal-root") // ensure you have <div id="modal-root"></div> in index.html
  );
};

export default DeleteConfirmModal;
