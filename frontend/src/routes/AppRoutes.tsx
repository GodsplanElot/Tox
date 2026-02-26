import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Categories from "../pages/Categories";
import CategoryDetail from "../pages/CategoryDetail";
import Search from "../pages/Search";
import MovieDetail from "../pages/MovieDetail/MovieDetail";
import SeriesList from "../pages/Series/SeriesList";
import SeriesDetail from "../pages/Series/SeriesDetail";
import EpisodeDetail from "../pages/Series/EpisodeDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="/series" element={<SeriesList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movies/:slug" element={<MovieDetail />} />
        <Route path="/series/:slug" element={<SeriesDetail />} />
        <Route
          path="/series/:seriesSlug/episode/:episodeSlug"
          element={<EpisodeDetail />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
