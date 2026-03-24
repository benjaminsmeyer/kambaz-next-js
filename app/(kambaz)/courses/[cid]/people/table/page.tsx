"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Form, Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as usersClient from "../../../../users/client";
import * as enrollmentsClient from "../../../../enrollments/client";

type UserRecord = {
  _id: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
};

type EditableUser = {
  _id?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const blankUser: EditableUser = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "STUDENT",
};

export default function PeopleTable() {
  const { cid } = useParams();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as { currentUser: UserRecord | null };

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [editingUser, setEditingUser] = useState<EditableUser>(blankUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canManageUsers = ["FACULTY", "ADMIN"].includes(
    currentUser?.role || "",
  );

  const loadCourseUsers = useCallback(async () => {
    if (!cid) return;
    setLoading(true);
    setError("");
    try {
      const courseUsers = await usersClient.findUsersForCourse(cid as string);
      setUsers(courseUsers);
    } catch {
      setError("Failed to load users for this course.");
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    loadCourseUsers();
  }, [loadCourseUsers]);

  const onSaveUser = async () => {
    if (!canManageUsers || !cid) return;
    const payload = {
      username: editingUser.username,
      password: editingUser.password || "pass123",
      firstName: editingUser.firstName,
      lastName: editingUser.lastName,
      email: editingUser.email,
      role: editingUser.role,
    };

    setError("");
    try {
      if (editingUser._id) {
        await usersClient.updateUser(editingUser._id, payload);
      } else {
        const created = await usersClient.createUser(payload);
        await enrollmentsClient.enrollInCourse(cid as string, created._id);
      }
      setEditingUser(blankUser);
      await loadCourseUsers();
    } catch {
      setError("Unable to save user. Faculty permissions may be required.");
    }
  };

  const onDeleteUser = async (userId: string) => {
    if (!canManageUsers) return;
    setError("");
    try {
      await usersClient.deleteUser(userId);
      await loadCourseUsers();
    } catch {
      setError("Unable to delete user. Faculty permissions may be required.");
    }
  };

  return (
    <div id="wd-people-table">
      {canManageUsers && (
        <div className="border rounded p-3 mb-3">
          <h5 className="mb-3">{editingUser._id ? "Edit User" : "Add User"}</h5>
          <Form className="d-flex flex-column gap-2">
            <Form.Control
              placeholder="Username"
              value={editingUser.username}
              onChange={(e) =>
                setEditingUser({ ...editingUser, username: e.target.value })
              }
            />
            <Form.Control
              placeholder="Password"
              type="password"
              value={editingUser.password}
              onChange={(e) =>
                setEditingUser({ ...editingUser, password: e.target.value })
              }
            />
            <Form.Control
              placeholder="First name"
              value={editingUser.firstName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, firstName: e.target.value })
              }
            />
            <Form.Control
              placeholder="Last name"
              value={editingUser.lastName}
              onChange={(e) =>
                setEditingUser({ ...editingUser, lastName: e.target.value })
              }
            />
            <Form.Control
              placeholder="Email"
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <Form.Select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </Form.Select>
            <div className="d-flex gap-2">
              <Button variant="danger" onClick={onSaveUser}>
                {editingUser._id ? "Update User" : "Create & Enroll User"}
              </Button>
              {editingUser._id && (
                <Button
                  variant="secondary"
                  onClick={() => setEditingUser(blankUser)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </div>
      )}

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
            {canManageUsers && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId || user.username}</td>
              <td className="wd-section">{user.section || "N/A"}</td>
              <td className="wd-role">{user.role || "STUDENT"}</td>
              <td className="wd-last-activity">{user.lastActivity || "N/A"}</td>
              <td className="wd-total-activity">
                {user.totalActivity || "N/A"}
              </td>
              {canManageUsers && (
                <td className="text-nowrap">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      setEditingUser({
                        _id: user._id,
                        username: user.username || "",
                        password: user.password || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        email: user.email || "",
                        role: user.role || "STUDENT",
                      })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
          {!loading && users.length === 0 && (
            <tr>
              <td
                colSpan={canManageUsers ? 7 : 6}
                className="text-center text-muted"
              >
                No enrolled users found for this course.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
