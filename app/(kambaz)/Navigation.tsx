import Link from "next/link";
export default function KambazNavigation() {
  return (
    <div id="wd-kambaz-navigation">
      <ul>
        <li>
          <a
            href="https://www.northeastern.edu/"
            id="wd-neu-link"
            target="_blank"
          >
            Northeastern
          </a>
        </li>
        <li>
          <Link href="/Account" id="wd-account-link">
            Account
          </Link>
        </li>
        <li>
          <Link href="/dashboard" id="wd-dashboard-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard" id="wd-course-link">
            Courses
          </Link>
        </li>
        <li>
          <Link href="/Calendar" id="wd-calendar-link">
            Calendar
          </Link>
        </li>
        <li>
          <Link href="/Inbox" id="wd-inbox-link">
            Inbox
          </Link>
        </li>
        <li>
          <Link href="/labs" id="wd-labs-link">
            Labs
          </Link>
        </li>
      </ul>
    </div>
  );
}
