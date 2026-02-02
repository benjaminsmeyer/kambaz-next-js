"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";

export default function AccountNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <ListGroup
      id="wd-account-navigation"
      className="wd rounded-0 fs-5"
      variant="flush"
    >
      <Link
        href="/account/signin"
        id="wd-account-signin-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/account/signin") ? "active" : "text-danger"
        }`}
      >
        Signin
      </Link>
      <Link
        href="/account/signup"
        id="wd-account-signup-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/account/signup") ? "active" : "text-danger"
        }`}
      >
        Signup
      </Link>
      <Link
        href="/account/profile"
        id="wd-account-profile-link"
        className={`list-group-item list-group-item-action border-0 ${
          isActive("/account/profile") ? "active" : "text-danger"
        }`}
      >
        Profile
      </Link>
    </ListGroup>
  );
}
