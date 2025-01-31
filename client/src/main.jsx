import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import Header from './components/header';
import Sidebar from './components/sidebar';
import ContactCard from './components/ContactCard';

function App(){
  return(
    <div>
      <Header/>
      <Sidebar/>
      <ContactCard/>
    </div>
  )
} 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
