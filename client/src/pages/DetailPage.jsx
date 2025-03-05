import { useEffect } from 'react';
import Header2 from '../components/Header2';
import DetailedCard from '../components/DetailedCard'; 
import { useLoaderData , useNavigate } from 'react-router-dom';

export async function loader({params:{id},request})
{
  try{
    const [contactDataRes,occupationRes] = await Promise.all([
      fetch(`http://localhost:3000/detail/${id}`),
      fetch(`http://localhost:3000/detail/occupations/${id}`)])
  
    const [contactDetails,occupations] = await Promise.all([contactDataRes.json(),occupationRes.json()]);
    return ({contactDetails,occupations});
  }
    catch(err)
  {
    throw {
      error: err
    };
    
  }
};







function DetailPage()
{
  const {contactDetails,occupations}= useLoaderData();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.body.classList.add("body2-style");

    return () => {
      document.body.classList.remove("body2-style"); 
    };
  }, []);


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
  


  return(
    <div>
      <Header2/>
      <main className='card-container-wrap'>
        <DetailedCard
        key={contactDetails.id}
        {...contactDetails}
        occupations = {occupations}
        onUpdate = {handleUpdate}/>
      </main>
    </div>
  )
}

export default DetailPage;