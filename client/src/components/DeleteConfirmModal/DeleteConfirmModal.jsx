import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { useUI } from "../../context/UIContext";
import { useDarkMode } from "../../hooks/useDarkmode";
import { deleteContact } from "../../api/deleteContact";
import { useNavigate } from "react-router-dom";
import styles from "./DeleteConfirmModal.module.css";

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

const DeleteConfirmModal = ({ contactId }) => {
  const { activeModal, setActiveModal } = useUI();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const darkMode = useDarkMode();
  const navigate = useNavigate();
  const closeModal = () => setActiveModal(null);
  // const onConfirm = () => setActiveModal(null);

  console.log(contactId);

  const handleDelete = async (contactId) => {
    try {
      const result = await deleteContact(apiUrl, contactId);

      if (result?.success === false) {
        throw new Error("Delete failed");
      }

      // setContacts((prev) => prev.filter((contact) => contact.id !== contactId));

      // reset active modal on successful delete
      setActiveModal(null);
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
        return;
      }

      console.error(error.message);
      // showToast(error.message);
    }
  };

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
        onClick={(e) => e.stopPropagation()}
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
              handleDelete(contactId);
            }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default DeleteConfirmModal;
