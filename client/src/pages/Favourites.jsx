import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import FavouriteCard from "../components/FavouriteCard";
import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

export async function loader({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL || "/api";
  const url = new URL(request.url);
  const query = url.searchParams.get("searchParams") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "15";
  const encodedSearchTerm = encodeURIComponent(query);
  const encodedPageNumber = encodeURIComponent(page);
  const encodePageLimit = encodeURIComponent(limit);

  try {
    const [favStatusRes, favouritesRes, searchRes] = await Promise.all([
      fetch(`${apiUrl}/favstatus`),
      fetch(
        `${apiUrl}/favourites?page=${encodedPageNumber}&limit=${encodePageLimit}`
      ),
      fetch(
        `${apiUrl}/search/favourites?searchParams=${encodedSearchTerm}&page=${encodedPageNumber}&limit=${encodePageLimit}`
      ),
    ]);

    const [favStatus, favourites, search] = await Promise.all([
      favStatusRes.json(),
      favouritesRes.json(),
      searchRes.json(),
    ]);
    return { favStatus, favourites, search };
  } catch (err) {
    console.error("Error fetching data:", err);
    throw {
      message: "Failed to fetch contacts",
      statusText: res.statusText,
      status: res.status,
    };
  }
}

function Favourites() {
  const { favStatus, favourites, search } = useLoaderData();
  const darkMode = useOutletContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 15;

  async function updateFavouriteStatus(id, newStatus) {
    try {
      const response = await fetch(`http://localhost:3000/update/${id}`, {
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

  const hasSearchTerm = Boolean(searchParams.get("searchParams"));
  const Cards =
    hasSearchTerm && search.data?.length > 0
      ? search.data.map((item) => (
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
          />
        ))
      : favourites.data.map((item) => (
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
          />
        ));

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
            Page {currentPage} of{" "}
            {search?.totalPages || favourites?.totalPages || 1}
          </span>
          <button
            className="next"
            aria-disabled={
              currentPage ===
              (search?.totalPages || 1 || favourites?.totalPages)
            }
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
      </main>
    </>
  );
}

export default Favourites;
