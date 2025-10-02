import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FavouriteCard from "../components/FavouriteCard";
import UpdateFormModal from "../components/UpdateFormModal/UpdateFormModal";
import DetailCardModal from "../components/DetailCardModal/DetailCardModal";
import {
  useLoaderData,
  useSearchParams,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";
import CreateContactModal from "../components/CreateContactModal/CreateContactModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal/DeleteConfirmModal";
import { AnimatePresence, motion } from "framer-motion";

export async function loader({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const url = new URL(request.url);

  const query = url.searchParams.get("searchParams") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "15";

  const encodedSearchTerm = encodeURIComponent(query);
  const encodedPageNumber = encodeURIComponent(page);
  const encodePageLimit = encodeURIComponent(limit);

  try {
    const [favStatusRes, favouritesRes, searchRes] = await Promise.all([
      fetch(`${apiUrl}/favstatus`, {
        method: "GET",
        credentials: "include",
      }),
      fetch(
        `${apiUrl}/favourites?page=${encodedPageNumber}&limit=${encodePageLimit}`,
        {
          method: "GET",
          credentials: "include",
        }
      ),
      fetch(
        `${apiUrl}/search/favourites?searchParams=${encodedSearchTerm}&page=${encodedPageNumber}&limit=${encodePageLimit}`,
        {
          method: "GET",
          credentials: "include",
        }
      ),
    ]);

    const [favStatus, favourites, search] = await Promise.all([
      favStatusRes.json(),
      favouritesRes.json(),
      searchRes.json(),
    ]);

    return { favStatus, favourites, search, apiUrl };
  } catch (err) {
    console.error("Error fetching data:", err);
    throw {
      message: "Failed to fetch contacts",
      statusText: err?.message,
      status: 500,
    };
  }
}

function Favourites() {
  const { favStatus, favourites, search, apiUrl } = useLoaderData();
  const { darkMode, isProductModalOpen, handleCloseProductModal } =
    useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  // Central modal manager
  const [activeModal, setActiveModal] = useState(null); // "detail" | "update" | "delete" |"logout"|null
  const [selectedContact, setSelectedContact] = useState("");
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

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
  const results = hasSearchTerm ? search?.data : favourites?.data;
  const totalPages = hasSearchTerm
    ? search?.totalPages
    : favourites?.totalPages;

  let Cards;
  if (results && results.length > 0) {
    Cards = results.map((item) => (
      <FavouriteCard
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
        No favourites yet.
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

        <AnimatePresence mode="wait">
          {activeModal === "detail" && (
            <motion.div
              key="detailModal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DetailCardModal
                contactId={selectedContact}
                darkMode={darkMode}
                onClose={() => setActiveModal(null)}
                onEdit={() => setActiveModal("update")}
                onDelete={() => setActiveModal("delete")}
              />
            </motion.div>
          )}

          {activeModal === "update" && (
            <motion.div
              key="updateModal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <UpdateFormModal
                contactId={selectedContact}
                closeModal={() => setActiveModal(null)}
                backToDetail={() => setActiveModal("detail")}
              />
            </motion.div>
          )}
          {activeModal === "delete" && (
            <DeleteConfirmModal
              contactId={selectedContact}
              closeModal={() => setActiveModal(null)}
              onConfirm={() => setActiveModal(null)}
              backToDetail={() => setActiveModal("detail")}
              activeModal={activeModal}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default Favourites;
