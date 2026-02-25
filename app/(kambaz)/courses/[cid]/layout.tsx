/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";
export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);
  const [showNav, setShowNav] = useState(true);
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
