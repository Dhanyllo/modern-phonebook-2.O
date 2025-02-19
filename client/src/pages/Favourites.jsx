import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FavouriteCard from '../components/FavouriteCard';


export function loader()
{
  return { data: "This is home" };
}

function Favourites()
{


    useEffect(() => {
      document.body.classList.add("body1-style");
  
      return () => {
        document.body.classList.remove("body1-style"); 
      };
    }, []);


  return(
    <div>
      <Sidebar/>
      <FavouriteCard/>
    </div>
  )
}

export default Favourites;