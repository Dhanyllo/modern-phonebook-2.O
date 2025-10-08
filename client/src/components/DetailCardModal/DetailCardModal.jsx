// import { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import { motion } from "framer-motion";
// import DetailCard from "../DetailCard/DetailCard";
// import styles from "./DetailCardModal.module.css";

// function DetailCardModal({ darkMode, contactId, onClose, onEdit, onDelete }) {
//   const [detailData, setDetailData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const apiUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (contactId) {
//       setLoading(true);
//       Promise.all([
//         fetch(`${apiUrl}/detail/${contactId}`, { credentials: "include" }),
//         fetch(`${apiUrl}/detail/occupations/${contactId}`, {
//           credentials: "include",
//         }),
//       ])
//         .then(([detailRes, occRes]) =>
//           Promise.all([detailRes.json(), occRes.json()])
//         )
//         .then(([contactDetails, occupations]) => {
//           setDetailData({ contactDetails, occupations });
//         })
//         .catch((err) => console.error("Error fetching detail data:", err))
//         .finally(() => setLoading(false));
//     }
//   }, [contactId, apiUrl]);

//   if (!contactId) return null;

//   return ReactDOM.createPortal(
//     <motion.div
//       className={styles.modalOverlay}
//       onClick={onClose}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.25 }}
//     >
//       {loading ? (
//         <div className={styles.spinner}></div>
//       ) : detailData ? (
//         <DetailCard
//           key={detailData.contactDetails.id}
//           {...detailData.contactDetails}
//           occupations={detailData.occupations}
//           darkMode={darkMode}
//           handleUpdateFormOpen={onEdit}
//           handleDelete={onDelete}
//           handleCloseModal={onClose}
//         />
//       ) : null}
//     </motion.div>,
//     document.getElementById("modal-root")
//   );
// }

// export default DetailCardModal;

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import DetailCard from "../DetailCard/DetailCard";
import styles from "./DetailCardModal.module.css";
import { useRevalidator } from "react-router-dom";

function DetailCardModal({ darkMode, contactId, onClose, onEdit, onDelete }) {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const revalidator = useRevalidator();

  useEffect(() => {
    if (contactId) {
      setLoading(true);
      Promise.all([
        fetch(`${apiUrl}/detail/${contactId}`, { credentials: "include" }),
        fetch(`${apiUrl}/detail/occupations/${contactId}`, {
          credentials: "include",
        }),
      ])
        .then(([detailRes, occRes]) =>
          Promise.all([detailRes.json(), occRes.json()])
        )
        .then(([contactDetails, occupations]) => {
          setDetailData({ contactDetails, occupations });
        })
        .catch((err) => console.error("Error fetching detail data:", err))
        .finally(() => setLoading(false));
    }
  }, [contactId, apiUrl]);

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
    revalidator.revalidate();
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
