import Link from "next/link";
import { Button, Form, FormControl } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen" className="p-4" style={{ maxWidth: 400 }}>
      <h1>Profile</h1>
      <FormControl
        id="wd-username"
        placeholder="username"
        defaultValue="alice"
        className="mb-2"
      />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        defaultValue="123"
        className="mb-2"
      />
      <FormControl
        id="wd-firstname"
        placeholder="First Name"
        defaultValue="Alice"
        className="mb-2"
      />
      <FormControl
        id="wd-lastname"
        placeholder="Last Name"
        defaultValue="Wonderland"
        className="mb-2"
      />
      <FormControl
        id="wd-dob"
        type="date"
        defaultValue="2000-01-01"
        className="mb-2"
      />
      <FormControl
        id="wd-email"
        type="email"
        defaultValue="alice@wonderland"
        className="mb-2"
      />
      <Form.Select id="wd-role" defaultValue="USER" className="mb-3">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </Form.Select>
      <Link
        id="wd-signout-btn"
        href="/account/signin"
        className="btn btn-danger w-100 mb-2"
      >
        Sign out
      </Link>
    </div>
  );
}
