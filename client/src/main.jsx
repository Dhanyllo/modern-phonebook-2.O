import { StrictMode} from 'react'
import {
    RouterProvider,
    createBrowserRouter, 
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import Home, {loader as homeloader} from './pages/Home';
import Favourites, {loader as favouritesLoader} from './pages/Favourites';
import DetailPage, {loader as detailLoader} from './pages/DetailPage';
import Header from './components/Header';
import Error from './pages/Error';
import NotFound from './pages/NotFound';

function App()
{ 
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route errorElement={<Error/>}>
        <Route element={<Header/>} >
          <Route 
            path='/' 
            element={<Home/>} 
            loader={homeloader} 
          /> 
          <Route 
            path='/favourites' 
            element={<Favourites/>}
            loader={favouritesLoader}  
          /> 
        </Route>

        <Route 
          path='/detail/:id' 
          element={<DetailPage/>}
          loader={detailLoader}
        /> 
        <Route 
          path='*' 
          element={<NotFound/>}
        /> 
      </Route>
    </>
  ))

  return(
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>
  )
}


createRoot(document.getElementById('root')).render(
  <App/>
)

