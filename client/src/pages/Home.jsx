import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ContactCard from '../components/ContactCard';
import { useLoaderData,useSearchParams, useLocation } from 'react-router-dom';


export async function loader({request}) {
  
  const url = new URL(request.url);
  const query = url.searchParams.get("searchParams") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "15"; 
  const encodedSearchTerm = encodeURIComponent(query);
  const encodedPageNumber = encodeURIComponent(page);
  const encodePageLimit = encodeURIComponent(limit);
  
  try{ 
      const [favStatusRes, contactsRes, searchRes] = await Promise.all([
      fetch("http://localhost:3000/favstatus"), 
      fetch(`http://localhost:3000?page=${encodedPageNumber}&limit=${encodePageLimit}`),
      fetch(`http://localhost:3000/search/home?searchParams=${encodedSearchTerm}&page=${encodedPageNumber}&limit=${encodePageLimit}`)  
    ]);



    const [favStatus, contacts,search] = await Promise.all([
      favStatusRes.json(),
      contactsRes.json(),
      searchRes.json()
    ]);
   return({favStatus,contacts,search}); 
  }
catch(err) {
    console.error("Error fetching data:", err);
    throw {
      message: "Failed to fetch data",
      statusText: err.message,  
      status: 500          
    };
 }
}


function Home(){
  const {favStatus,contacts,search} = useLoaderData()
  console.log(contacts);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = 15;
  const location = useLocation()
  console.log(location);


  const hasSearchTerm = Boolean(searchParams.get("searchParams"));
  const Cards = hasSearchTerm && search.data?.length > 0 ? search.data.map(item => {
    return(
      <ContactCard
        key = {item.id}
        id = {item.id}
        firstName = {item.first_name}
        otherNames = {item.other_names}
        phoneNumber = {item.phone_number}
        imageURL = {item.image_url}
        favouriteStatus = {item.favourite_status}
      />
    )
  }) :  contacts.data.map(item => {
    return(
      <ContactCard
        key = {item.id}
        id = {item.id}
        firstName = {item.first_name}
        otherNames = {item.other_names}
        phoneNumber = {item.phone_number}
        imageURL = {item.image_url}
        favouriteStatus = {item.favourite_status}
      />
    )
  }) 



  useEffect(() => {
    document.body.classList.add("body1-style");
    
    return () => {
      document.body.classList.remove("body1-style"); 
    };
  }, []);
  


  return(
    <>
      <Sidebar favStatus={favStatus.exists_status}/>
      <main className='main-container'>
        <section className='card-grid'>
          {Cards}
        </section>
        <div className="pageNav">
          <button
            className='previous' 
            aria-disabled={currentPage === 1}
            onClick={() => {
              setSearchParams(prevParams => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set("page", currentPage - 1);
                newParams.set("limit", limit);
                return newParams;
              });
            }}>
            Prev
          </button>
          <span style={{fontWeight:"bold"}}> 
            Page {currentPage} of { search?.totalPages || contacts?.totalPages || 1}
          </span>
          <button 
            className='next'
            aria-disabled={currentPage === search.totalPages} 
            onClick={() => {
              setSearchParams(prevParams => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set("page", currentPage + 1);
                newParams.set("limit", limit);
                return newParams;
              });
            }}>
              Next
          </button>
        </div> 
      </main>
    </>
  )
} 

export default Home;