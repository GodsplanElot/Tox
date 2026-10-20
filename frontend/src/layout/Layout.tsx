import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer/Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <div className="flex min-h-svh flex-col bg-ink-950">
      <ScrollToTop />
      <Header />

      {/* Pages own their gutters (see the `page-x` utility) so heroes can run full bleed.
          The footer reserves space for the mobile dock. */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
