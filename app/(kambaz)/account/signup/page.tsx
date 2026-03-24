"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );

  useEffect(() => {
    if (currentUser) {
      router.replace("/account/profile");
    }
  }, [currentUser, router]);

  const signup = async () => {
    setError("");
    const username = user.username?.trim() || "";
    const password = user.password?.trim() || "";

    if (!username || !password) {
      setError("Username and password must contain at least one character.");
      return;
    }

    try {
      const currentUser = await client.signup({
        ...user,
        username,
        password,
      });
      dispatch(setCurrentUser(currentUser));
      router.push("/account/profile");
    } catch (e: unknown) {
      const serverMessage =
        typeof e === "object" &&
        e !== null &&
        "response" in e &&
        typeof (e as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (e as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : null;
      setError(
        serverMessage ||
          "Unable to sign up. Please check your input and try again.",
      );
    }
  };

  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <FormControl
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username b-2"
        placeholder="username"
        required
        minLength={1}
      />
      <FormControl
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="wd-password mb-2"
        placeholder="password"
        type="password"
        required
        minLength={1}
      />
      <button
        onClick={signup}
        className="wd-signup-btn btn btn-primary mb-2 w-100"
      >
        Sign up
      </button>
      <br />
      <Link href="/account/signin" className="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}
