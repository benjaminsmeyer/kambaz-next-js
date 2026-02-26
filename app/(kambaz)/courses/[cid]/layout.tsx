/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { selectIsEnrolled } from "../../enrollments/reducer";
import { useEffect } from "react";
export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const enrolled = useSelector((state: RootState) =>
    selectIsEnrolled(state, currentUser?._id, cid as string),
  );
  const course = courses.find((course: any) => course._id === cid);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
      return;
    }
    if (!enrolled) {
      router.replace("/dashboard");
    }
  }, [currentUser, enrolled, router]);

  if (!currentUser || !enrolled) return null;

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <button
          type="button"
          className="btn btn-link p-0 me-4 fs-4 mb-1 text-danger"
          aria-label="Toggle course navigation"
          onClick={() => setShowNav((prev) => !prev)}
        >
          <FaAlignJustify />
        </button>
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className={`${showNav ? "d-none d-md-block" : "d-none"}`}>
          <CourseNavigation />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
