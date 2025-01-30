import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import DisplaySurveys from './components/DisplaySurveys';
import Header from './components/header';
import Sidebar from './components/sidebar';


function App(){
  return(
    <div>
      <Header/>
      <Sidebar/>
      <DisplaySurveys/>
    </div>
  )
} 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
