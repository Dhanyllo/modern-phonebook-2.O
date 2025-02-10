import { StrictMode} from 'react'
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import Home from './pages/Home';
import Favourites from './pages/Favourites';
import DetailPage from './pages/DetailPage';
import Header from './components/Header';

function App()
{

  return(
    <StrictMode>
      <BrowserRouter>
        <Routes>
        <Route element={<Header/>}>
          <Route path='/' element={<Home/>}/> 
          <Route path='/favourites' element={<Favourites/>}/> 
        </Route>
          <Route path='/detail/:id' element={<DetailPage/>}/> 
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}










createRoot(document.getElementById('root')).render(
  <App/>
)
