"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const links = currentUser
    ? currentUser.role === "ADMIN"
      ? [
          { label: "Profile", href: "/account/profile", match: "profile" },
          { label: "Users", href: "/account/users", match: "users" },
        ]
      : [{ label: "Profile", href: "/account/profile", match: "profile" }]
    : [
        { label: "Signin", href: "/account/signin", match: "signin" },
        { label: "Signup", href: "/account/signup", match: "signup" },
      ];
  const pathname = usePathname();

  return (
    <Nav variant="pills">
      {links.map((link) => (
        <NavItem key={link.href}>
          <NavLink
            as={Link}
            href={link.href}
            active={pathname.endsWith(link.match)}
          >
            {link.label}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
}
