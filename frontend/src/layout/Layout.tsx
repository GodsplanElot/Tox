import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer/Footer"

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />

      <main className="app-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
