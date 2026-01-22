"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";

export default function CourseNavigation() {
  const pathname = usePathname();
  const { cid } = useParams();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <ListGroup
      id="wd-courses-navigation"
      className="wd rounded-0 fs-5"
      variant="flush"
    >
      <Link
        href={`/courses/${cid}/home`}
        id="wd-course-home-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/home`) ? "active" : "text-danger"
        }`}
      >
        Home
      </Link>
      <Link
        href={`/courses/${cid}/modules`}
        id="wd-course-modules-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/modules`) ? "active" : "text-danger"
        }`}
      >
        Modules
      </Link>
      <Link
        href={`/courses/${cid}/piazza`}
        id="wd-course-piazza-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/piazza`) ? "active" : "text-danger"
        }`}
      >
        Piazza
      </Link>
      <Link
        href={`/courses/${cid}/zoom`}
        id="wd-course-zoom-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/zoom`) ? "active" : "text-danger"
        }`}
      >
        Zoom
      </Link>
      <Link
        href={`/courses/${cid}/assignments`}
        id="wd-course-assignments-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/assignments`) ? "active" : "text-danger"
        }`}
      >
        Assignments
      </Link>
      <Link
        href={`/courses/${cid}/quizzes`}
        id="wd-course-quizzes-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/quizzes`) ? "active" : "text-danger"
        }`}
      >
        Quizzes
      </Link>
      <Link
        href={`/courses/${cid}/people/table`}
        id="wd-course-people-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive(`/courses/${cid}/people/table`) ? "active" : "text-danger"
        }`}
      >
        People
      </Link>
    </ListGroup>
  );
}
