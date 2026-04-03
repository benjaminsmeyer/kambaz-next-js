/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
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

  const signin = async () => {
    setError("");
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100">
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/account/signup">
        Sign up
      </Link>
      <div className="mt-4 pt-3 border-top small" id="wd-landing-info">
        <h2 className="h6 mb-2">Team Information</h2>
        <p className="mb-1">Section: Web Development Online Spring 2026</p>
        <p className="mb-1">
          Quizzes Project Team: Benjamin Meyer, Aaryan Jain, Laith Taher, Althea
          Masetti Zannini
        </p>
        <p className="mb-1">
          Front-end project repository:{" "}
          <a
            href="https://github.com/benjaminsmeyer/kambaz-next-js"
            target="_blank"
            rel="noreferrer"
          >
            github.com/benjaminsmeyer/kambaz-next-js
          </a>
        </p>
        <p className="mb-0">
          Server project repository:{" "}
          <a
            href="https://github.com/benjaminsmeyer/kambaz-node-server-app"
            target="_blank"
            rel="noreferrer"
          >
            github.com/benjaminsmeyer/kambaz-node-server-app
          </a>
        </p>
      </div>
    </div>
  );
}
