import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import DetailCard from "../DetailCard/DetailCard";
import styles from "./DetailCardModal.module.css";
import { useUI } from "../../context/UIContext";
import { useDarkMode } from "../../hooks/useDarkmode";
import { updateFavouriteStatus } from "../../api/updateFavouriteStatus";
import { fetchContactById } from "../../api/fetchContactById";

function DetailCardModal({ contactId, onContactLoad }) {
  const darkMode = useDarkMode();
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();
  const { setActiveModal } = useUI();

  const onClose = () => setActiveModal(null);
  const onEdit = () => setActiveModal("update");
  const onDelete = () => setActiveModal("delete");

  const {
    data: detailData,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["contactDetail", contactId],
    queryFn: async () => {
      const result = await fetchContactById(apiUrl, contactId);
      onContactLoad(result);
      return result;
    },
    retry: false,
    enabled: !!contactId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const mutation = useMutation({
    mutationFn: ({ apiUrl, id, newStatus }) =>
      updateFavouriteStatus(apiUrl, id, newStatus),

    // 1. Immediately update the UI
    onMutate: async ({ apiUrl, id, newStatus }) => {
      // Cancel outgoing refetches for the related queries
      await queryClient.cancelQueries(["contacts"]);
      await queryClient.cancelQueries(["search"]);

      // Snapshot previous data to roll back if needed
      const previousContacts = queryClient.getQueryData(["contacts"]);
      const previousSearch = queryClient.getQueryData(["search"]);

      // Optimistically update contacts
      queryClient.setQueryData(["contacts"], (old) =>
        old?.map((contact) =>
          contact.id === id ? { ...contact, favourite: newStatus } : contact
        )
      );

      // Optimistically update search results, if needed
      queryClient.setQueryData(["search"], (old) =>
        old?.map((contact) =>
          contact.id === id ? { ...contact, favourite: newStatus } : contact
        )
      );

      return { previousContacts, previousSearch };
    },

    // 2. Roll back if request fails
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
    },

    // 3. Re-sync in background
    onSettled: () => {
      queryClient.invalidateQueries(["contacts"]);
      queryClient.invalidateQueries(["search"]);
      queryClient.invalidateQueries(["favStatus"]);
      queryClient.invalidateQueries(["contactDetail", contactId]);
    },
  });

  function handleUpdate(apiUrl, id, newStatus) {
    mutation.mutate({ apiUrl, id, newStatus });
  }

  if (!contactId) return null;

  return ReactDOM.createPortal(
    <motion.div
      className={styles.modalOverlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {loading ? (
        <div className={styles.spinner}></div>
      ) : isError ? (
        <div className={styles.errorMessage}>Failed to load details.</div>
      ) : detailData ? (
        <DetailCard
          key={detailData.id}
          {...detailData}
          darkMode={darkMode}
          handleUpdateFormOpen={onEdit}
          handleDelete={onDelete}
          handleCloseModal={onClose}
          handleUpdateFavourite={handleUpdate}
        />
      ) : null}
    </motion.div>,
    document.getElementById("modal-root")
  );
}

export default DetailCardModal;
