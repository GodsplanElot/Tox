import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

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
      .map((value, index, array) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " "),
        path: `/${array.slice(0, index + 1).join("/")}`,
      }));

  const all = [{ label: "Home", path: "/" }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-xs font-medium text-fg-subtle">
        {all.map((item, index) => {
          const isLast = index === all.length - 1;
          return (
            <li
              key={`${item.path}-${index}`}
              className={isLast ? "flex min-w-0 items-center gap-1 text-fg-muted" : "flex shrink-0 items-center gap-1"}
              aria-current={isLast ? "page" : undefined}
            >
              {index > 0 && <FiChevronRight aria-hidden="true" className="size-3 shrink-0 opacity-60" />}
              {isLast ? (
                <span className="truncate">{item.label}</span>
              ) : (
                <Link to={item.path} className="transition hover:text-white">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
