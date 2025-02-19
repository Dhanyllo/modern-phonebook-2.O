import { useEffect } from 'react';
import Header2 from '../components/Header2';
import DetailedCard from '../components/DetailedCard'; 


export function loader()
{
  return { data: "This is home" };
}

function DetailPage()
{
  
  useEffect(() => {
    document.body.classList.add("body2-style");

    return () => {
      document.body.classList.remove("body2-style"); 
    };
  }, []);


  return(
    <div>
      <Header2/>
      <DetailedCard/>
    </div>
  )
}

export default DetailPage;