import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer/Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <div className="flex min-h-svh flex-col bg-ink-950">
      <ScrollToTop />
      <Header />

      {/* Pages own their gutters (see the `page-x` utility) so heroes can run full bleed. */}
      <main className="flex-1 pb-[calc(104px+env(safe-area-inset-bottom))] lg:pb-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
