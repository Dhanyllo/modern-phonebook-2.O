import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import DetailCard from "../DetailCard/DetailCard";
import styles from "./DetailCardModal.module.css";

function DetailCardModal({ darkMode, contactId, onClose, onEdit, onDelete }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const queryClient = useQueryClient();

  // 🧩 Fetch contact details + occupations with React Query
  const {
    data: detailData,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["contactDetail", contactId],
    queryFn: async () => {
      const [detailRes, occRes] = await Promise.all([
        fetch(`${apiUrl}/detail/${contactId}`, { credentials: "include" }),
        fetch(`${apiUrl}/detail/occupations/${contactId}`, {
          credentials: "include",
        }),
      ]);

      if (!detailRes.ok || !occRes.ok)
        throw new Error("Failed to fetch contact details");

      const [contactDetails, occupations] = await Promise.all([
        detailRes.json(),
        occRes.json(),
      ]);

      return { contactDetails, occupations };
    },
    enabled: !!contactId, // only run if contactId exists
  });

  // 🧠 Update favourite status with mutation
  async function updateFavouriteStatus(id, newStatus) {
    try {
      const response = await fetch(`${apiUrl}/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourite_status: newStatus }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to update status");
      return await response.json();
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  async function handleUpdate(id, newStatus) {
    await updateFavouriteStatus(id, newStatus);

    // 🔄 Invalidate relevant queries to refresh UI across app
    queryClient.invalidateQueries(["contacts"]);
    queryClient.invalidateQueries(["search"]);
    queryClient.invalidateQueries(["favStatus"]);
    queryClient.invalidateQueries(["contactDetail", contactId]);
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
        <div className={styles.error}>Failed to load details.</div>
      ) : detailData ? (
        <DetailCard
          key={detailData.contactDetails.id}
          {...detailData.contactDetails}
          occupations={detailData.occupations}
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
