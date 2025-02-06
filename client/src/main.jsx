import { StrictMode, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import Header from './components/header';
import Sidebar from './components/sidebar';
import ContactCard from './components/ContactCard';
import Header2 from './components/Header2';
import DetailedCard from './components/DetailedCard';
import FavouriteCard from './components/FavouriteCard';


function App()
{

  return(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/> 
          <Route path='/favourites' element={<Favourites/>}/> 
          <Route path='/detail' element={<DetailPage/>}/> 
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}



function Home(){

  return(
    <div>
      <Header/>
      <Sidebar/>
      <ContactCard/>
    </div>
  )
} 

function Favourites()
{

  return(
    <div>
      <Header/>
      <Sidebar/>
      <FavouriteCard/>
    </div>
  )
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


createRoot(document.getElementById('root')).render(
  <App/>
)
