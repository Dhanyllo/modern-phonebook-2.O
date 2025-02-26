import { useEffect } from 'react';
import Header2 from '../components/Header2';
import DetailedCard from '../components/DetailedCard'; 
import { useLoaderData } from 'react-router-dom';

export async function loader({params:{id},request})
{
  // const url = new URL(request.url)
  // const pathname = url.pathname;

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
  
  useEffect(() => {
    document.body.classList.add("body2-style");

    return () => {
      document.body.classList.remove("body2-style"); 
    };
  }, []);




  return(
    <div>
      <Header2/>
      <main className='card-container-wrap'>
        <DetailedCard
        key={contactDetails.id}
        {...contactDetails}
        occupations = {occupations}/>
      </main>
    </div>
  )
}

export default DetailPage;