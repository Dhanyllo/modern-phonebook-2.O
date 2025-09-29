import { useEffect, useState } from "react";
import Header2 from "../components/Header2";
import DetailedCard from "../components/DetailedCard";
import { useLoaderData, useRevalidator } from "react-router-dom";
import UpdateFormModal from "../components/UpdateFormModal/UpdateFormModal";

export async function loader({ params: { id }, request }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const [contactDataRes, occupationRes] = await Promise.all([
      fetch(`${apiUrl}/detail/${id}`, {
        method: "GET",
        credentials: "include",
      }),
      fetch(`${apiUrl}/detail/occupations/${id}`, {
        method: "GET",
        credentials: "include",
      }),
    ]);

    const [contactDetails, occupations] = await Promise.all([
      contactDataRes.json(),
      occupationRes.json(),
    ]);

    return { contactDetails, occupations, apiUrl };
  } catch (err) {
    throw { error: err };
  }
}

function DetailPage(props) {
  const { contactDetails, occupations, apiUrl } = useLoaderData();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const handleCloseProductModal = () => setIsProductModalOpen(false);
  const revalidator = useRevalidator();

  useEffect(() => {
    const BodyBgStyle = props.darkMode
      ? "body2-style-darkmode"
      : "body2-style-lightmode";
    document.body.classList.add(BodyBgStyle);

    return () => {
      document.body.classList.remove(BodyBgStyle);
    };
  }, [props.darkMode]);

  async function updateFavouriteStatus(id, newStatus) {
    try {
      const response = await fetch(`${apiUrl}/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourite_status: newStatus }),
        credentials: "include", // ensure cookies/session included
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

  return (
    <div>
      <Header2 darkMode={props.darkMode} setDarkMode={props.setDarkMode} />
      <main className="card-container-wrap">
        <DetailedCard
          key={contactDetails.id}
          {...contactDetails}
          occupations={occupations}
          onUpdate={handleUpdate}
          darkMode={props.darkMode}
          setIsProductModalOpen={setIsProductModalOpen}
        />
      </main>
      <UpdateFormModal
        isProductModalOpen={isProductModalOpen}
        handleCloseProductModal={handleCloseProductModal}
        darkMode={props.darkMode}
      />
    </div>
  );
}

export default DetailPage;
