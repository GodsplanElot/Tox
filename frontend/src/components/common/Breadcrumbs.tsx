import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // Capitalize and format the name
          const name =
            value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

          return last ? (
            <li key={to} className="breadcrumb-item active" aria-current="page">
              {name}
            </li>
          ) : (
            <li key={to} className="breadcrumb-item">
              <Link to={to}>{name}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
