import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ContactCard from '../components/ContactCard';
import { useLoaderData } from 'react-router-dom';


export async function loader({request}) {
  
  const url = new URL(request.url);
  const query = url.searchParams.get("searchParams");  
  const encodedSearchTerm = encodeURIComponent(query);
  
  try{ 
      const [favStatusRes, contactsRes, searchRes] = await Promise.all([
      fetch("http://localhost:3000/favstatus"),   // Fetch favorite status
      fetch("http://localhost:3000"),
      fetch(`http://localhost:3000/search?searchParams=${encodedSearchTerm}`)    // Fetch contacts list
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
  
  const Cards = search.length != 0 ? search.map(item => {

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
  }) :  contacts.map(item => {
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
    <div>
      <Sidebar favStatus={favStatus.exists_status}/>
      <section className='card-grid'>
        {Cards}
      </section>
    </div>
  )
} 

export default Home;