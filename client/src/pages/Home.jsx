import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ContactCard from '../components/ContactCard';
// import { useLoaderData, defer } from 'react-router-dom';




export function loader()
{
  // const dataPromise = Controller function
  // return defer({data:dataPromise})
  return ({data:"sda"})
}


function Home(){

  // const LoaderData = useLoaderData() 
  
  useEffect(() => {
    document.body.classList.add("body1-style");
    
    return () => {
      document.body.classList.remove("body1-style"); 
    };
  }, []);
  
  return(
    <div>
      <Sidebar/>
      <ContactCard/>
    </div>
  )
} 

export default Home;