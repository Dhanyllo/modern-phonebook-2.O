// import { useEffect, useState } from "react";
// import Sidebar from "../../components/Sidebar/Sidebar";
// import ContactCard from "../../components/ContactCard/ContactCard";
// import UpdateFormModal from "../../components/UpdateFormModal/UpdateFormModal";
// import DetailCardModal from "../../components/DetailCardModal/DetailCardModal";
// import LogoutConfirmModal from "../../components/LogoutConfirmModal/LogoutConfirmModal";
// import {
//   useLoaderData,
//   useSearchParams,
//   useOutletContext,
//   useRevalidator,
// } from "react-router-dom";
// import { checkAuth } from "../../utils";
// import { redirect } from "react-router-dom";
// import CreateContactModal from "../../components/CreateContactModal/CreateContactModal";
// import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
// import { AnimatePresence, motion } from "framer-motion";
// import styles from "./Favourites.module.css";

// export async function loader({ request }) {
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const authData = await checkAuth(apiUrl);
//   if (authData.redirectToLogin) {
//     return redirect("/login");
//   }
//   const url = new URL(request.url);

//   const query = url.searchParams.get("searchParams") || "";
//   const page = url.searchParams.get("page") || "1";
//   const limit = url.searchParams.get("limit") || "15";

//   const encodedSearchTerm = encodeURIComponent(query);
//   const encodedPageNumber = encodeURIComponent(page);
//   const encodePageLimit = encodeURIComponent(limit);

//   try {
//     const [favStatusRes, favouritesRes, searchRes] = await Promise.all([
//       fetch(`${apiUrl}/favstatus`, {
//         method: "GET",
//         credentials: "include",
//       }),
//       fetch(
//         `${apiUrl}/favourites?page=${encodedPageNumber}&limit=${encodePageLimit}`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       ),
//       fetch(
//         `${apiUrl}/search/favourites?searchParams=${encodedSearchTerm}&page=${encodedPageNumber}&limit=${encodePageLimit}`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       ),
//     ]);

//     const [favStatus, favourites, search] = await Promise.all([
//       favStatusRes.json(),
//       favouritesRes.json(),
//       searchRes.json(),
//     ]);

//     return { favStatus, favourites, search, apiUrl };
//   } catch (err) {
//     console.error("Error fetching data:", err);
//     throw {
//       message: "Failed to fetch contacts",
//       statusText: err?.message,
//       status: 500,
//     };
//   }
// }

// function Favourites() {
//   const { favStatus, favourites, search, apiUrl } = useLoaderData();
//   const { darkMode, headerActiveModal, setHeaderActiveModal } =
//     useOutletContext();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const revalidator = useRevalidator();

//   // Central modal manager
//   const [activeModal, setActiveModal] = useState(null); // "detail" | "update" | "delete" |"logout"|null
//   const [selectedContact, setSelectedContact] = useState("");
//   const modalVariants = {
//     hidden: { opacity: 0, scale: 0.95, y: 20 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: { duration: 0.3, ease: "easeOut" },
//     },
//     exit: {
//       opacity: 0,
//       scale: 0.95,
//       y: 20,
//       transition: { duration: 0.2, ease: "easeIn" },
//     },
//   };

//   const currentPage = parseInt(searchParams.get("page")) || 1;
//   const limit = 15;

//   async function updateFavouriteStatus(id, newStatus) {
//     try {
//       const response = await fetch(`${apiUrl}/update/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ favourite_status: newStatus }),
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("Failed to update status");
//       return await response.json();
//     } catch (error) {
//       console.error("Update error:", error);
//     }
//   }

//   async function handleUpdate(id, newStatus) {
//     await updateFavouriteStatus(id, newStatus);
//     revalidator.revalidate();
//   }

//   const hasSearchTerm = Boolean(searchParams.get("searchParams"));
//   const results = hasSearchTerm ? search?.data : favourites?.data;
//   const totalPages = hasSearchTerm
//     ? search?.totalPages
//     : favourites?.totalPages;

//   let Cards;
//   if (results && results.length > 0) {
//     Cards = results.map((item) => (
//       <ContactCard
//         key={item.id}
//         id={item.id}
//         firstName={item.first_name}
//         otherNames={item.other_names}
//         phoneNumber={item.phone_number}
//         imageURL={item.image_url}
//         favouriteStatus={item.favourite_status}
//         onUpdate={handleUpdate}
//         darkMode={darkMode}
//         onViewClick={() => {
//           setSelectedContact(item.id);
//           setActiveModal("detail");
//         }}
//       />
//     ));
//   } else if (!hasSearchTerm) {
//     Cards = (
//       <p
//         className={
//           darkMode
//             ? styles.emptyDirectoryContainerDarkmode
//             : styles.emptyDirectoryContainerLightmode
//         }
//       >
//         No favourites yet.
//       </p>
//     );
//   } else {
//     Cards = null;
//   }

//   useEffect(() => {
//     const BodyBgStyle = darkMode
//       ? "body1-style-darkmode"
//       : "body1-style-lightmode";
//     document.body.classList.add(BodyBgStyle);
//     return () => {
//       document.body.classList.remove(BodyBgStyle);
//     };
//   }, [darkMode]);

//   return (
//     <>
//       <Sidebar darkMode={darkMode} favStatus={favStatus.exists_status} />
//       <main className={styles.mainContainer}>
//         <section className={styles.cardGrid}>{Cards}</section>

//         {results && results.length > 0 && (
//           <div className={styles.pageNav}>
//             <button
//               className={styles.previous}
//               aria-disabled={currentPage === 1}
//               onClick={() => {
//                 setSearchParams((prevParams) => {
//                   const newParams = new URLSearchParams(prevParams);
//                   newParams.set("page", currentPage - 1);
//                   newParams.set("limit", limit);
//                   return newParams;
//                 });
//               }}
//             >
//               Prev
//             </button>

//             <span
//               className={
//                 darkMode
//                   ? styles.pageNumberDarkmode
//                   : styles.pageNumberLightmode
//               }
//             >
//               Page {currentPage} of {totalPages || 1}
//             </span>

//             <button
//               className={styles.next}
//               aria-disabled={currentPage === totalPages || totalPages === 0}
//               onClick={() => {
//                 setSearchParams((prevParams) => {
//                   const newParams = new URLSearchParams(prevParams);
//                   newParams.set("page", currentPage + 1);
//                   newParams.set("limit", limit);
//                   return newParams;
//                 });
//               }}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         <AnimatePresence>
//           {activeModal === "detail" && (
//             <DetailCardModal
//               contactId={selectedContact}
//               darkMode={darkMode}
//               onClose={() => setActiveModal(null)}
//               onEdit={() => setActiveModal("update")}
//               onDelete={() => setActiveModal("delete")}
//             />
//           )}

//           {activeModal === "update" && (
//             <UpdateFormModal
//               contactId={selectedContact}
//               closeModal={() => setActiveModal(null)}
//               backToDetail={() => setActiveModal("detail")}
//             />
//           )}

//           {activeModal === "delete" && (
//             <DeleteConfirmModal
//               closeModal={() => setActiveModal(null)}
//               onConfirm={() => setActiveModal(null)}
//               backToDetail={() => setActiveModal("detail")}
//               activeModal={activeModal}
//             />
//           )}

//           {headerActiveModal === "logout" && (
//             <LogoutConfirmModal
//               closeModal={() => setHeaderActiveModal(null)}
//               onConfirm={() => setHeaderActiveModal(null)}
//               onLogout={() => setHeaderActiveModal("logout")}
//               headerActiveModal={headerActiveModal}
//             />
//           )}

//           {headerActiveModal === "create" && (
//             <CreateContactModal
//               setHeaderActiveModal={setHeaderActiveModal}
//               darkMode={darkMode}
//             />
//           )}
//         </AnimatePresence>
//       </main>
//     </>
//   );
// }

// export default Favourites;

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ContactCard from "../../components/ContactCard/ContactCard";
import UpdateFormModal from "../../components/UpdateFormModal/UpdateFormModal";
import DetailCardModal from "../../components/DetailCardModal/DetailCardModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import LogoutConfirmModal from "../../components/LogoutConfirmModal/LogoutConfirmModal";
import CreateContactModal from "../../components/CreateContactModal/CreateContactModal";

import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
  redirect,
} from "react-router-dom";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { checkAuth } from "../../utils";
import styles from "./Favourites.module.css";

// ==============================
// Data fetching helpers
// ==============================
async function fetchFavStatus(apiUrl) {
  const res = await fetch(`${apiUrl}/favstatus`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch fav status");
  return res.json();
}

async function fetchFavourites(apiUrl, page, limit) {
  const res = await fetch(`${apiUrl}/favourites?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch favourites");
  return res.json();
}

async function fetchSearchResults(apiUrl, searchTerm, page, limit) {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const res = await fetch(
    `${apiUrl}/search/favourites?searchParams=${encodedSearchTerm}&page=${page}&limit=${limit}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}

// ==============================
// Loader with hydration
// ==============================
export async function loader({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const authData = await checkAuth(apiUrl);
  if (authData.redirectToLogin) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchParams") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "15");

  const queryClient = new QueryClient();

  // Prefetch queries before hydration
  await queryClient.prefetchQuery({
    queryKey: ["favStatus"],
    queryFn: () => fetchFavStatus(apiUrl),
  });

  if (searchTerm) {
    await queryClient.prefetchQuery({
      queryKey: ["favouritesSearch", searchTerm, page, limit],
      queryFn: () => fetchSearchResults(apiUrl, searchTerm, page, limit),
    });
  } else {
    await queryClient.prefetchQuery({
      queryKey: ["favourites", page, limit],
      queryFn: () => fetchFavourites(apiUrl, page, limit),
    });
  }

  return {
    dehydratedState: dehydrate(queryClient),
    apiUrl,
  };
}

// ==============================
// Component
// ==============================
function Favourites() {
  const { dehydratedState, apiUrl } = useLoaderData();
  const { darkMode, headerActiveModal, setHeaderActiveModal } =
    useOutletContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedContact, setSelectedContact] = useState("");

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 15;
  const searchTerm = searchParams.get("searchParams") || "";
  const hasSearchTerm = Boolean(searchTerm);

  // ==============================
  // React Query hooks
  // ==============================
  const { data: favStatus } = useQuery({
    queryKey: ["favStatus"],
    queryFn: () => fetchFavStatus(apiUrl),
  });

  const { data: favourites } = useQuery({
    queryKey: ["favourites", currentPage, limit],
    queryFn: () => fetchFavourites(apiUrl, currentPage, limit),
    enabled: !hasSearchTerm,
  });

  const { data: search } = useQuery({
    queryKey: ["favouritesSearch", searchTerm, currentPage, limit],
    queryFn: () => fetchSearchResults(apiUrl, searchTerm, currentPage, limit),
    enabled: hasSearchTerm,
  });

  // ==============================
  // Favourite status update
  // ==============================
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
    queryClient.invalidateQueries(["favourites"]);
    queryClient.invalidateQueries(["favouritesSearch"]);
    queryClient.invalidateQueries(["favStatus"]);
  }

  // ==============================
  // Render contacts
  // ==============================
  const results = hasSearchTerm ? search?.data : favourites?.data;
  const totalPages = hasSearchTerm
    ? search?.totalPages
    : favourites?.totalPages;

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
            ? styles.emptyDirectoryContainerDarkmode
            : styles.emptyDirectoryContainerLightmode
        }
      >
        No favourites yet.
      </p>
    );
  } else {
    Cards = null;
  }

  // ==============================
  // Body background
  // ==============================
  useEffect(() => {
    const BodyBgStyle = darkMode
      ? "body1-style-darkmode"
      : "body1-style-lightmode";
    document.body.classList.add(BodyBgStyle);
    return () => {
      document.body.classList.remove(BodyBgStyle);
    };
  }, [darkMode]);

  // ==============================
  // Render
  // ==============================
  return (
    <HydrationBoundary state={dehydratedState}>
      <>
        <Sidebar darkMode={darkMode} favStatus={favStatus?.exists_status} />

        <main className={styles.mainContainer}>
          <section className={styles.cardGrid}>{Cards}</section>

          {results && results.length > 0 && (
            <div className={styles.pageNav}>
              <button
                className={styles.previous}
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
                  darkMode
                    ? styles.pageNumberDarkmode
                    : styles.pageNumberLightmode
                }
              >
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                className={styles.next}
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

          {/* ==================== Modals ==================== */}
          <AnimatePresence>
            {activeModal === "detail" && (
              <DetailCardModal
                contactId={selectedContact}
                darkMode={darkMode}
                onClose={() => setActiveModal(null)}
                onEdit={() => setActiveModal("update")}
                onDelete={() => setActiveModal("delete")}
              />
            )}

            {activeModal === "update" && (
              <UpdateFormModal
                contactId={selectedContact}
                closeModal={() => setActiveModal(null)}
                backToDetail={() => setActiveModal("detail")}
              />
            )}

            {activeModal === "delete" && (
              <DeleteConfirmModal
                closeModal={() => setActiveModal(null)}
                onConfirm={() => setActiveModal(null)}
                backToDetail={() => setActiveModal("detail")}
                activeModal={activeModal}
              />
            )}

            {headerActiveModal === "logout" && (
              <LogoutConfirmModal
                closeModal={() => setHeaderActiveModal(null)}
                onConfirm={() => setHeaderActiveModal(null)}
                onLogout={() => setHeaderActiveModal("logout")}
                headerActiveModal={headerActiveModal}
              />
            )}

            {headerActiveModal === "create" && (
              <CreateContactModal
                setHeaderActiveModal={setHeaderActiveModal}
                darkMode={darkMode}
              />
            )}
          </AnimatePresence>
        </main>
      </>
    </HydrationBoundary>
  );
}

export default Favourites;
