import Link from "next/link";
export default function CourseNavigation() {
  return (
    <div id="wd-courses-navigation">
      <ul>
        <li className="wd-home-item">
          <Link href="/courses/1234/home" id="wd-course-home-link">
            Home
          </Link>
        </li>
        <li id="wd-modules-navigation">
          <Link href="/courses/1234/modules" id="wd-course-modules-link">
            Modules
          </Link>
        </li>
        <li id="wd-piazza-navigation">
          <Link href="/courses/1234/piazza" id="wd-course-piazza-link">
            Piazza
          </Link>
        </li>
        <li id="wd-zoom-navigation">
          <Link href="/courses/1234/zoom" id="wd-course-zoom-link">
            Zoom
          </Link>
        </li>
        <li id="wd-assignments-navigation">
          <Link
            href="/courses/1234/assignments"
            id="wd-course-assignments-link"
          >
            Assignments
          </Link>
        </li>
        <li id="wd-quizzes-navigation">
          <Link href="/courses/1234/quizzes" id="wd-course-quizzes-link">
            Quizzes
          </Link>
        </li>
        <li id="wd-grades-navigation">
          <Link href="/courses/1234/grades" id="wd-course-grades-link">
            Grades
          </Link>
        </li>
        <li id="wd-people-navigation">
          <Link href="/courses/1234/people/table" id="wd-course-people-link">
            People
          </Link>
        </li>
      </ul>
    </div>
  );
}
