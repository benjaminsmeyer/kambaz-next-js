"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";

export default function CourseNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <ListGroup
      id="wd-courses-navigation"
      className="wd rounded-0 fs-5"
      variant="flush"
    >
      <Link
        href="/courses/1234/home"
        id="wd-course-home-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/home") ? "active" : "text-danger"
        }`}
      >
        Home
      </Link>
      <Link
        href="/courses/1234/modules"
        id="wd-course-modules-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/modules") ? "active" : "text-danger"
        }`}
      >
        Modules
      </Link>
      <Link
        href="/courses/1234/piazza"
        id="wd-course-piazza-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/piazza") ? "active" : "text-danger"
        }`}
      >
        Piazza
      </Link>
      <Link
        href="/courses/1234/zoom"
        id="wd-course-zoom-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/zoom") ? "active" : "text-danger"
        }`}
      >
        Zoom
      </Link>
      <Link
        href="/courses/1234/assignments"
        id="wd-course-assignments-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/assignments") ? "active" : "text-danger"
        }`}
      >
        Assignments
      </Link>
      <Link
        href="/courses/1234/quizzes"
        id="wd-course-quizzes-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/quizzes") ? "active" : "text-danger"
        }`}
      >
        Quizzes
      </Link>
      <Link
        href="/courses/1234/people/Table"
        id="wd-course-people-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/courses/1234/people") ? "active" : "text-danger"
        }`}
      >
        People
      </Link>
    </ListGroup>
  );
}
