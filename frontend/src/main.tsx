import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

//Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

//  custom CSS 
/* import './styles/custom.css' */
import { BrowserRouter } from "react-router-dom";





createRoot(document.getElementById('root')!).render(
  <StrictMode>

     <BrowserRouter>
      <App /> 
     </BrowserRouter>
  </StrictMode>,
)
