/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { FormControl } from "react-bootstrap";
import * as client from "../client";
export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const updateProfile = async () => {
    if (!profile?._id) {
      setError("Unable to update profile: missing user id.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      setProfile(updatedProfile);
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Unable to update profile. Please try again.");
    }
  };
  const fetchProfile = async () => {
    if (!currentUser) {
      router.replace("/account/signin");
      return;
    }
    try {
      const serverProfile = await client.profile();
      setProfile(serverProfile);
    } catch {
      setProfile(currentUser);
    }
  };
  const signout = async () => {
    setError("");
    setSuccess("");
    try {
      await client.signout();
      dispatch(setCurrentUser(null));
      router.push("/account/signin");
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Unable to sign out. Please try again.",
      );
    }
  };
  useEffect(() => {
    fetchProfile();
    // fetchProfile depends on currentUser and router and is intentionally run when currentUser changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div id="wd-profile-screen" className="p-4" style={{ maxWidth: 400 }}>
      <h1>Profile</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}
      {profile && (
        <div>
          <FormControl
            id="wd-username"
            className="mb-2"
            value={profile.username || ""}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <FormControl
            id="wd-password"
            className="mb-2"
            type="password"
            value={profile.password || ""}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <FormControl
            id="wd-firstname"
            className="mb-2"
            value={profile.firstName || ""}
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <FormControl
            id="wd-lastname"
            className="mb-2"
            value={profile.lastName || ""}
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />
          <FormControl
            id="wd-dob"
            className="mb-2"
            type="date"
            value={profile.dob || ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />
          <FormControl
            id="wd-email"
            className="mb-2"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <select
            className="form-control mb-2"
            id="wd-role"
            value={profile.role || "USER"}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          <button
            onClick={updateProfile}
            className="btn btn-primary w-100 mb-2"
          >
            Update
          </button>
          <button
            onClick={signout}
            className="wd-signout-btn btn btn-danger w-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
