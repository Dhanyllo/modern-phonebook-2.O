import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const darkMode = useDarkMode();
  const navigate = useNavigate();
  const closeModal = () => setActiveModal(null);

  const deleteMutation = useMutation({
    mutationFn: ({ apiUrl, id }) => deleteContact(apiUrl, id),

    // Optimistically remove from UI
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["contacts"]);
      await queryClient.cancelQueries(["search"]);

      const previousContacts = queryClient.getQueryData(["contacts"]);
      const previousSearch = queryClient.getQueryData(["search"]);

      queryClient.setQueryData(["contacts"], (old) =>
        old?.filter((contact) => contact.id !== id)
      );

      queryClient.setQueryData(["search"], (old) =>
        old?.filter((contact) => contact.id !== id)
      );

      return { previousContacts, previousSearch };
    },

    // Rollback if delete fails
    onError: (error, _vars, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(["contacts"], context.previousContacts);
      }
      if (context?.previousSearch) {
        queryClient.setQueryData(["search"], context.previousSearch);
      }

      if (error.status === 401) {
        window.location.href = "/login";
      }

      console.error(error.message);
    },

    //  revalidate
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries(["contacts"]);
      queryClient.invalidateQueries(["search"]);
      queryClient.invalidateQueries(["contactDetail", vars.id]);
    },

    // Close modal ONLY on success
    onSuccess: () => {
      setActiveModal(null);
    },
  });

  function handleDelete(apiUrl, id) {
    deleteMutation.mutate({ apiUrl, id });
  }

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
              handleDelete(apiUrl, contactId);
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
