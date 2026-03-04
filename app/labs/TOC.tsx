"use client";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function TOC() {
  const pathname = usePathname();
  return (
    <Nav variant="pills">
      <NavItem>
        <NavLink
          href="/labs"
          as={Link}
          className={`nav-link ${pathname.endsWith("labs") ? "active" : ""}`}
        >
          Labs
        </NavLink>
      </NavItem>
      {[1, 2, 3, 4].map((labNumber) => {
        return (
          <NavItem key={`lab-${labNumber}`}>
            <NavLink
              href={`/labs/lab${labNumber}`}
              as={Link}
              className={`nav-link ${pathname.endsWith(`lab${labNumber}`) ? "active" : ""}`}
            >
              Lab {labNumber}
            </NavLink>
          </NavItem>
        );
      })}
      <NavItem>
        <NavLink href="/" as={Link}>
          Kambaz
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="https://github.com/benjaminsmeyer">GitHub</NavLink>
      </NavItem>
    </Nav>
  );
}
