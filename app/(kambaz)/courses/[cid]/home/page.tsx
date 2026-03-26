"use client";
import Modules from "../modules/page";
import CourseStatus from "./Status";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
export default function Home() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
  const canManageCourse = ["FACULTY", "TA", "ADMIN"].includes(
    currentUser?.role,
  );

  return (
    <div id="wd-home">
      <div className="d-flex" id="wd-home">
        <div className="flex-fill me-3">
          <Modules />
        </div>
        <div className="d-none d-lg-block">
          <CourseStatus studentView={!canManageCourse} />
        </div>
      </div>
    </div>
  );
}
