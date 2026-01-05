import { Routes, Route } from "react-router-dom"
import Layout from "../layout/Layout"
import Home from "../pages/Home"
import NotFound from "../pages/NotFound"
import Categories from "../pages/Categories"

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
