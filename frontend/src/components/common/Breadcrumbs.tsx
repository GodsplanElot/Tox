import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();

  const crumbs =
    items ||
    location.pathname
      .split("/")
      .filter((x) => x)
      .map((value, index, array) => {
        const to = `/${array.slice(0, index + 1).join("/")}`;
        const label =
          value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
        return { label, path: to };
      });

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;

          return isLast ? (
            <li
              key={item.path}
              className="breadcrumb-item active"
              aria-current="page"
            >
              {item.label}
            </li>
          ) : (
            <li key={item.path} className="breadcrumb-item">
              <Link to={item.path}>{item.label}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
