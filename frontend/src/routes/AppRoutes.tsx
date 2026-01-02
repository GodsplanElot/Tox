import { Routes, Route } from "react-router-dom"
import Layout from "../layout/Layout"
import Home from "../pages/Home"
import NotFound from "../pages/NotFound"

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
