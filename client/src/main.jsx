import { StrictMode, useEffect} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import Header from './components/header';
import Sidebar from './components/sidebar';
import ContactCard from './components/ContactCard';
import Header2 from './components/Header2';

function App(){

  useEffect(() => {
    document.body.classList.add("body2-style");

    return () => {
      document.body.classList.remove("body2-style"); 
    };
  }, []);

  return(
    <div>
      <Header/>
      {/* <Sidebar/>
      <ContactCard/> */}
    </div>
  )
} 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
