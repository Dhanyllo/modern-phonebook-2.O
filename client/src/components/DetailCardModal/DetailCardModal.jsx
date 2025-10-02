import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DetailCard from "../DetailCard/DetailCard";
import styles from "./DetailCardModal.module.css";

function DetailCardModal({ darkMode, contactId, onClose, onEdit }) {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

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
        .catch((err) => {
          console.error("Error fetching detail data:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [contactId, apiUrl]);

  if (!contactId) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : detailData ? (
        <DetailCard
          key={detailData.contactDetails.id}
          {...detailData.contactDetails}
          occupations={detailData.occupations}
          darkMode={darkMode}
          handleUpdateFormOpen={onEdit}
          handleCloseModal={onClose}
        />
      ) : null}
    </div>,
    document.getElementById("modal-root")
  );
}

export default DetailCardModal;
