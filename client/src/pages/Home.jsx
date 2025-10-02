import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ContactCard from "../components/ContactCard";
import UpdateFormModal from "../components/UpdateFormModal/UpdateFormModal";
import DetailCardModal from "../components/DetailCardModal/DetailCardModal";
import {
  useLoaderData,
  useSearchParams,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";
import { redirect } from "react-router-dom";
import CreateContactModal from "../components/CreateContactModal/CreateContactModal";

export async function loader({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. 🔑 Check authentication
  const authRes = await fetch(`${apiUrl}/auth/check`, {
    method: "GET",
    credentials: "include",
  });

  if (!authRes.ok) {
    return redirect("/login");
  }

  const authData = await authRes.json();
  if (!authData.authenticated) {
    return redirect("/login");
  }

  // 2. Extract query params
  const url = new URL(request.url);
  const query = url.searchParams.get("searchParams") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "15";

  const encodedSearchTerm = encodeURIComponent(query);
  const encodedPageNumber = encodeURIComponent(page);
  const encodePageLimit = encodeURIComponent(limit);

  try {
    const [favStatusRes, contactsRes, searchRes] = await Promise.all([
      fetch(`${apiUrl}/favstatus`, { credentials: "include" }),
      fetch(`${apiUrl}?page=${encodedPageNumber}&limit=${encodePageLimit}`, {
        credentials: "include",
      }),
      fetch(
        `${apiUrl}/search/home?searchParams=${encodedSearchTerm}&page=${encodedPageNumber}&limit=${encodePageLimit}`,
        { credentials: "include" }
      ),
    ]);

    const [favStatus, contacts, search] = await Promise.all([
      favStatusRes.json(),
      contactsRes.json(),
      searchRes.json(),
    ]);

    return { favStatus, contacts, search, apiUrl };
  } catch (err) {
    console.error("Error fetching data:", err);
    throw {
      message: "Failed to fetch data",
      statusText: err.message,
      status: 500,
    };
  }
}

function Home() {
  const { favStatus, contacts, search, apiUrl } = useLoaderData();
  const { darkMode, isProductModalOpen, handleCloseProductModal } =
    useOutletContext();

  // 🔹 Central modal manager
  const [activeModal, setActiveModal] = useState(null); // "detail" | "update" | null
  const [selectedContact, setSelectedContact] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 15;

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

  const hasSearchTerm = Boolean(searchParams.get("searchParams"));
  const results = hasSearchTerm ? search?.data : contacts?.data;
  const totalPages = hasSearchTerm ? search?.totalPages : contacts?.totalPages;

  let Cards;
  if (results && results.length > 0) {
    Cards = results.map((item) => (
      <ContactCard
        key={item.id}
        id={item.id}
        firstName={item.first_name}
        otherNames={item.other_names}
        phoneNumber={item.phone_number}
        imageURL={item.image_url}
        favouriteStatus={item.favourite_status}
        onUpdate={handleUpdate}
        darkMode={darkMode}
        onViewClick={() => {
          setSelectedContact(item.id);
          setActiveModal("detail");
        }}
      />
    ));
  } else if (!hasSearchTerm) {
    Cards = (
      <p
        className={
          darkMode
            ? "empty-directory-container-darkmode"
            : "empty-directory-container-lightmode"
        }
      >
        No contacts added.
      </p>
    );
  } else {
    Cards = null;
  }

  useEffect(() => {
    const BodyBgStyle = darkMode
      ? "body1-style-darkmode"
      : "body1-style-lightmode";
    document.body.classList.add(BodyBgStyle);

    return () => {
      document.body.classList.remove(BodyBgStyle);
    };
  }, [darkMode]);

  return (
    <>
      <Sidebar darkMode={darkMode} favStatus={favStatus.exists_status} />
      <main className="main-container">
        <section className="card-grid">{Cards}</section>

        {results && results.length > 0 && (
          <div className="pageNav">
            <button
              className="previous"
              aria-disabled={currentPage === 1}
              onClick={() => {
                setSearchParams((prevParams) => {
                  const newParams = new URLSearchParams(prevParams);
                  newParams.set("page", currentPage - 1);
                  newParams.set("limit", limit);
                  return newParams;
                });
              }}
            >
              Prev
            </button>

            <span
              className={
                darkMode ? "pageNumber-darkmode" : "pageNumber-lightmode"
              }
            >
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              className="next"
              aria-disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => {
                setSearchParams((prevParams) => {
                  const newParams = new URLSearchParams(prevParams);
                  newParams.set("page", currentPage + 1);
                  newParams.set("limit", limit);
                  return newParams;
                });
              }}
            >
              Next
            </button>
          </div>
        )}

        <CreateContactModal
          isProductModalOpen={isProductModalOpen}
          handleCloseProductModal={handleCloseProductModal}
          darkMode={darkMode}
        />

        {activeModal === "detail" && (
          <DetailCardModal
            contactId={selectedContact}
            darkMode={darkMode}
            onClose={() => setActiveModal(null)}
            onEdit={() => setActiveModal("update")}
            // onDelete={() => setActiveModal("delete")}
          />
        )}

        {activeModal === "update" && (
          <UpdateFormModal
            contactId={selectedContact}
            closeModal={() => setActiveModal(null)}
            backToDetail={() => setActiveModal("detail")}
          />
        )}
      </main>
    </>
  );
}

export default Home;
