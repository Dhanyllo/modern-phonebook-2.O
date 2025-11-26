import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ContactCard from "../../components/ContactCard/ContactCard";
import UpdateFormModal from "../../components/UpdateFormModal/UpdateFormModal";
import DetailCardModal from "../../components/DetailCardModal/DetailCardModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import LogoutConfirmModal from "../../components/LogoutConfirmModal/LogoutConfirmModal";
import CreateContactModal from "../../components/CreateContactModal/CreateContactModal";
import MobileSidebarModal from "../../components/MobileSidebarModal/MobileSidebarModal";
import MobileProfileModal from "../../components/MobileProfileModal/MobileProfileModal";
import MobileNotificationModal from "../../components/MobileNotificationModal/MobileNotificationModal";
import TabletNotificationModal from "../../components/TabletNotificationModal/TabletNotificationModal";
import TabletProfileModal from "../../components/TabletProfileModal/TabletProfileModal";
import { useSearchParams, useLoaderData, redirect } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  useQuery,
  useQueryClient,
  useMutation,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { queryClient as globalQueryClient } from "../../queryClient";
import { checkAuthStatus } from "../../api/checkAuthStatus";
import styles from "./Home.module.css";
import { useDarkMode } from "../../hooks/useDarkmode";
import { useUI } from "../../context/UIContext";
import SkeletonContactCard from "../../components/SkeletonContactCard/SkeletonContactCard";
import { fetchContacts } from "../../api/fetchContacts";
import { fetchFavStatus } from "../../api/fetchFavStatus";
import { fetchSearchResults } from "../../api/fetchHomeSearchResults";
import { updateFavouriteStatus } from "../../api/updateFavouriteStatus";

// ==============================
// Loader with React Query hydration
// ==============================
export async function loader({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const authData = await checkAuthStatus(apiUrl);

  if (authData.redirectToLogin) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchParams") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "15");

  await globalQueryClient.prefetchQuery({
    queryKey: ["favStatus"],
    queryFn: () => fetchFavStatus(apiUrl),
  });

  if (searchTerm) {
    await globalQueryClient.prefetchQuery({
      queryKey: ["search", searchTerm, page, limit],
      queryFn: () => fetchSearchResults(apiUrl, searchTerm, page, limit),
    });
  } else {
    await globalQueryClient.prefetchQuery({
      queryKey: ["contacts", page, limit],
      queryFn: () => fetchContacts(apiUrl, page, limit),
    });
  }

  return {
    dehydratedState: dehydrate(globalQueryClient),
    apiUrl,
  };
}

// ==============================
// Home Component
// ==============================
function Home() {
  const { dehydratedState, apiUrl } = useLoaderData();
  const { darkMode } = useDarkMode();
  const { activeModal, setActiveModal } = useUI();
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [selectedContact, setSelectedContact] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 15;
  const searchTerm = searchParams.get("searchParams") || "";
  const hasSearchTerm = Boolean(searchTerm);

  // ==============================
  // Data Fetching
  // ==============================
  const { data: favStatus } = useQuery({
    queryKey: ["favStatus"],
    queryFn: () => fetchFavStatus(apiUrl),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: contacts,
    isLoading: contactsLoading,
    isFetching: contactsFetching,
  } = useQuery({
    queryKey: ["contacts", currentPage, limit],
    queryFn: () => fetchContacts(apiUrl, currentPage, limit),
    enabled: !hasSearchTerm,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: search,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useQuery({
    queryKey: ["search", searchTerm, currentPage, limit],
    queryFn: () => fetchSearchResults(apiUrl, searchTerm, currentPage, limit),
    enabled: hasSearchTerm,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (!contactsLoading) {
      const timer = setTimeout(() => setShowSkeleton(false), 500); // minimum display time
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
    }
  }, [contactsLoading]);

  // ==============================
  // Favourite Update
  // ==============================

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

    // 3. Re-sync in background (but non-invasive!)
    onSettled: () => {
      queryClient.invalidateQueries(["contacts"]);
      queryClient.invalidateQueries(["search"]);
    },
  });

  function handleUpdate(apiUrl, id, newStatus) {
    mutation.mutate({ apiUrl, id, newStatus });
  }

  // ==============================
  // Contacts Rendering
  // ==============================
  const results = hasSearchTerm ? search?.data : contacts?.data;
  const totalPages = hasSearchTerm ? search?.totalPages : contacts?.totalPages;

  let Cards = null;

  if (!contactsLoading) {
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
    }
  }

  // ==============================
  // Background Mode
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

    return () => {
      document.body.classList.remove(
        "body1-style-darkmode",
        "body1-style-lightmode"
      );
    };
  }, [darkMode]);

  // ==============================
  // Render w/ Skeleton
  // ==============================
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={styles.layout}>
        <Sidebar favStatus={favStatus?.exists_status} />

        <main className={styles.mainContainer}>
          <section className={styles.cardGrid}>
            {showSkeleton
              ? Array.from({ length: 15 }).map((_, i) => (
                  <SkeletonContactCard key={i} />
                ))
              : Cards}
          </section>

          {!contactsLoading && results && results.length > 0 && (
            <div className={styles.pageNav}>
              <button
                className={styles.previous}
                aria-disabled={currentPage === 1}
                onClick={() => {
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("page", currentPage - 1);
                    params.set("limit", limit);
                    return params;
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
                aria-disabled={currentPage === totalPages}
                onClick={() => {
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("page", currentPage + 1);
                    params.set("limit", limit);
                    return params;
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
            {activeModal === "mobileprofile" && <MobileProfileModal />}
            {activeModal === "mobileNotification" && (
              <MobileNotificationModal />
            )}
            {activeModal === "tabletNotification" && (
              <TabletNotificationModal />
            )}
            {activeModal === "tabletProfile" && <TabletProfileModal />}
          </AnimatePresence>
        </main>
      </div>
    </HydrationBoundary>
  );
}

export default Home;
