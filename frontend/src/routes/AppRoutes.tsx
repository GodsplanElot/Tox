import { Routes, Route } from "react-router-dom"
import Layout from "../layout/Layout"
import Home from "../pages/Home"
import NotFound from "../pages/NotFound"
import Categories from "../pages/Categories"
import CategoryDetail from "../pages/CategoryDetail"
import Search from "../pages/Search"

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
