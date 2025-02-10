import { useEffect } from 'react';
import Header2 from '../components/Header2';
import DetailedCard from '../components/DetailedCard'; 
import { useParams } from "react-router-dom";

function DetailPage()
{
  const { id } = useParams();
  console.log(id); 

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