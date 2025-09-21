import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

//Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

//  custom CSS 
import './css/bootstrap.min.css' 
import './css/default-skin.css' 
import './css/main.css' 
import './css/photoswipe.css' 
import './css/plyr.css' 
import './css/slimselect.css' 
import './css/splide.min.css'
import { BrowserRouter } from "react-router-dom";





createRoot(document.getElementById('root')!).render(
  <StrictMode>

     <BrowserRouter>
      <App /> 
     </BrowserRouter>
  </StrictMode>,
)
