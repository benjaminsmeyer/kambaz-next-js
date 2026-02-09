"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";

export default function CourseNavigation() {
  const pathname = usePathname();
  const { cid } = useParams();

  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];

  const getLinkPath = (linkName: string) => {
    // People link goes to /courses/[cid]/people/table
    if (linkName === "People") {
      return `/courses/${cid}/people/table`;
    }
    // All other links go to /courses/[cid]/[linkname in lowercase]
    return `/courses/${cid}/${linkName.toLowerCase()}`;
  };

  const getLinkId = (linkName: string) => {
    return `wd-course-${linkName.toLowerCase()}-link`;
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <ListGroup
      id="wd-courses-navigation"
      className="wd rounded-0 fs-5"
      variant="flush"
    >
      {links.map((link) => {
        const href = getLinkPath(link);
        return (
          <Link
            key={link}
            href={href}
            id={getLinkId(link)}
            className={`list-group-item list-group-item-action border-0 ${
              isActive(href) ? "active" : "text-danger"
            }`}
          >
            {link}
          </Link>
        );
      })}
    </ListGroup>
  );
}
