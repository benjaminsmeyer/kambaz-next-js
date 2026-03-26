import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../account/client";
import { FaPencil } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { FormControl } from "react-bootstrap";

type EditableUser = {
  _id?: string;
  [key: string]: unknown;
};

export default function PeopleDetails({
  uid,
  onClose,
  onUserUpdated,
}: {
  uid: string | null;
  onClose: () => void;
  onUserUpdated?: (user: EditableUser) => void;
}) {
  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    onClose();
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>({});

  const startEditing = () => {
    setName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
    setEmail(user.email ?? "");
    setRole(user.role ?? "");
    setEditing(true);
  };

  const saveUser = async () => {
    const trimmed = name.trim();
    const [firstName, ...rest] = trimmed
      ? trimmed.split(/\s+/)
      : [user.firstName];
    const lastName = rest.length ? rest.join(" ") : user.lastName;
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      email,
      role,
    };
    const savedUser = await client.updateUser(updatedUser);
    const finalUser = savedUser ?? updatedUser;
    setUser(finalUser);
    onUserUpdated?.(finalUser);
    setEditing(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!uid) return;
      const fetchedUser = await client.findUserById(uid);
      setUser(fetchedUser);
      setName(
        `${fetchedUser.firstName ?? ""} ${fetchedUser.lastName ?? ""}`.trim(),
      );
      setEmail(fetchedUser.email ?? "");
      setRole(fetchedUser.role ?? "");
    };
    loadUser();
  }, [uid]);

  if (!uid) return null;
  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button
        onClick={onClose}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing && (
          <FaPencil
            onClick={startEditing}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            onClick={() => saveUser()}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}
        {!editing && (
          <div className="wd-name" onClick={startEditing}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <FormControl
            className="w-50 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>
      <b>Roles:</b>
      {!editing && <span className="wd-roles"> {user.role} </span>}
      {editing && (
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-select w-50 d-inline ms-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveUser();
            }
          }}
        >
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      )}
      <br />
      <b>Login ID:</b> <span className="wd-login-id"> {user.loginId} </span>
      <br />
      <b>Email:</b>
      {!editing && <span className="wd-email"> {user.email} </span>}
      {editing && (
        <FormControl
          type="email"
          className="w-75 d-inline ms-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveUser();
            }
          }}
        />
      )}
      <br />
      <b>Section:</b> <span className="wd-section"> {user.section} </span>
      <br />
      <b>Total Activity:</b>
      <span className="wd-total-activity">{user.totalActivity}</span>
      <hr />
      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        onClick={onClose}
        className="btn btn-secondary float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}
