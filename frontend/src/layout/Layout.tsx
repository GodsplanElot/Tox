import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer/Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <Header />

      <main className="app-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
