import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ContactCard from "../../components/ContactCard/ContactCard";
import UpdateFormModal from "../../components/UpdateFormModal/UpdateFormModal";
import DetailCardModal from "../../components/DetailCardModal/DetailCardModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import LogoutConfirmModal from "../../components/LogoutConfirmModal/LogoutConfirmModal";
import CreateContactModal from "../../components/CreateContactModal/CreateContactModal";
import MobileSidebarModal from "../../components/MobileSidebarModal/MobileSidebarModal";
import { useSearchParams, useLoaderData, redirect } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { checkAuth } from "../../utils";
import styles from "./Home.module.css";
import { useDarkMode } from "../../context/DarkModeContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useUI } from "../../context/UIContext";

// ==============================
// Data fetching helpers
// ==============================
async function fetchFavStatus(apiUrl) {
  const res = await fetch(`${apiUrl}/favstatus`, { credentials: "include" });
  return res.json();
}

async function fetchContacts(apiUrl, page, limit) {
  const res = await fetch(`${apiUrl}?page=${page}&limit=${limit}`, {
    credentials: "include",
  });
  return res.json();
}

async function fetchSearchResults(apiUrl, searchTerm, page, limit) {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const res = await fetch(
    `${apiUrl}/search/home?searchParams=${encodedSearchTerm}&page=${page}&limit=${limit}`,
    { credentials: "include" }
  );
  return res.json();
}

// ==============================
// Loader with React Query hydration
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

  // Prefetch all data before hydration
  await queryClient.prefetchQuery({
    queryKey: ["favStatus"],
    queryFn: () => fetchFavStatus(apiUrl),
  });

  if (searchTerm) {
    await queryClient.prefetchQuery({
      queryKey: ["search", searchTerm, page, limit],
      queryFn: () => fetchSearchResults(apiUrl, searchTerm, page, limit),
    });
  } else {
    await queryClient.prefetchQuery({
      queryKey: ["contacts", page, limit],
      queryFn: () => fetchContacts(apiUrl, page, limit),
    });
  }

  return {
    dehydratedState: dehydrate(queryClient),
    apiUrl,
  };
}

// ==============================
// Home component (hydrated + unified)
// ==============================
function Home() {
  const { dehydratedState, apiUrl } = useLoaderData();
  const { darkMode } = useDarkMode();
  const { isSidebarOpen, activeModal, setActiveModal } = useUI();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [selectedContact, setSelectedContact] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 15;
  const searchTerm = searchParams.get("searchParams") || "";
  const hasSearchTerm = Boolean(searchTerm);

  // ==============================
  // Data fetching with hydration
  // ==============================
  const { data: favStatus } = useQuery({
    queryKey: ["favStatus"],
    queryFn: () => fetchFavStatus(apiUrl),
  });

  const { data: contacts } = useQuery({
    queryKey: ["contacts", currentPage, limit],
    queryFn: () => fetchContacts(apiUrl, currentPage, limit),
    enabled: !hasSearchTerm,
  });

  const { data: search } = useQuery({
    queryKey: ["search", searchTerm, currentPage, limit],
    queryFn: () => fetchSearchResults(apiUrl, searchTerm, currentPage, limit),
    enabled: hasSearchTerm,
  });

  // ==============================
  // Update favourite logic
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
    queryClient.invalidateQueries(["contacts"]);
    queryClient.invalidateQueries(["search"]);
    queryClient.invalidateQueries(["favStatus"]);
  }

  // ==============================
  // Contacts rendering
  // ==============================
  const results = hasSearchTerm ? search?.data : contacts?.data;
  const totalPages = hasSearchTerm ? search?.totalPages : contacts?.totalPages;

  let sidebarState;

  if (isDesktop) {
    sidebarState = "";
  } else if (isTablet) {
    sidebarState = "halfSidebar";
  }

  let Cards;
  if (results && results.length > 0) {
    Cards = results.map((item, index, array) => (
      <React.Fragment key={item.id || index}>
        <ContactCard
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
        {index !== array.length - 1 && <hr className={styles.Hr1} />}
      </React.Fragment>
    ));
  } else if (!hasSearchTerm && results < 0) {
    Cards = (
      <p
        className={
          darkMode
            ? styles.emptyDirectoryContainerDarkmode
            : styles.emptyDirectoryContainerLightmode
        }
      >
        No contacts added.
      </p>
    );
  } else {
    Cards = null;
  }

  // ==============================
  // Body background effect
  // ==============================
  useEffect(() => {
    const BodyBgStyle = darkMode
      ? "body1-style-darkmode"
      : "body1-style-lightmode";

    document.body.classList.remove(
      "body1-style-darkmode",
      "body1-style-lightmode"
    );

    document.body.classList.add(BodyBgStyle);

    // cleanup function (runs when component unmounts)
    return () => {
      document.body.classList.remove(
        "body1-style-darkmode",
        "body1-style-lightmode"
      );
    };
  }, [darkMode, isTablet]);

  // ==============================
  // Render (hydrated)
  // ==============================
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={styles.layout}>
        <Sidebar favStatus={favStatus?.exists_status} />
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
              <DetailCardModal contactId={selectedContact} />
            )}

            {activeModal === "update" && (
              <UpdateFormModal contactId={selectedContact} />
            )}

            {activeModal === "mobilesidebar" && (
              <MobileSidebarModal favStatus={favStatus?.exists_status} />
            )}

            {activeModal === "delete" && <DeleteConfirmModal />}

            {activeModal === "logout" && <LogoutConfirmModal />}

            {activeModal === "create" && <CreateContactModal />}
          </AnimatePresence>
        </main>
      </div>
    </HydrationBoundary>
  );
}

export default Home;
