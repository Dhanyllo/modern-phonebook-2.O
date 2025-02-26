import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FavouriteCard from '../components/FavouriteCard';
import { useLoaderData } from 'react-router-dom';

export async function loader() {
  try{
  const [favStatusRes, favouritesRes] = await Promise.all([
    fetch("http://localhost:3000/favstatus"),   // Fetch favorite status
    fetch("http://localhost:3000/favourites")     // Fetch contacts list
  ]);

  const [favStatus, favourites] = await Promise.all([
    favStatusRes.json(),
    favouritesRes.json()
  ]);
 return({favStatus,favourites}); 
}
catch(err) {
  console.error("Error fetching data:", err);
  throw{
          message: "Failed to fetch contacts",
          statusText: res.statusText,
          status: res.status
  };
}
}


function Favourites()
{
  const {favStatus,favourites} = useLoaderData()
  
  const Cards = favourites.map(item => {
    return(
      <FavouriteCard
        key = {item.id}
        id = {item.id}
        firstName = {item.first_name}
        otherNames = {item.other_names}
        phoneNumber = {item.phone_number}
        imageURL = {item.image_url}
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

export default Favourites;