import { useEffect } from "react";
import Header2 from "../components/Header2";
import DetailedCard from "../components/DetailedCard";
import { useLoaderData, useNavigate } from "react-router-dom";

export async function loader({ params: { id }, request }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const [contactDataRes, occupationRes] = await Promise.all([
      fetch(`${apiUrl}/detail/${id}`),
      fetch(`${apiUrl}/detail/occupations/${id}`),
    ]);

    const [contactDetails, occupations] = await Promise.all([
      contactDataRes.json(),
      occupationRes.json(),
    ]);
    return { contactDetails, occupations };
  } catch (err) {
    throw {
      error: err,
    };
  }
}

function DetailPage(props) {
  const { contactDetails, occupations } = useLoaderData();
  const navigate = useNavigate();

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
      const response = await fetch(`http://${apiUrl}/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favourite_status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      return await response.json();
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  async function handleUpdate(id, newStatus) {
    await updateFavouriteStatus(id, newStatus);
    navigate(0);
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
        />
      </main>
    </div>
  );
}

export default DetailPage;
