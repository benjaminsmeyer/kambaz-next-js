"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { BsSearch, BsGripVertical } from "react-icons/bs";
import { FaEllipsisV, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function Assignments() {
  const { cid } = useParams();

  return (
    <div id="wd-assignments" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white">
            <BsSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for Assignments"
            id="wd-search-assignment"
          />
        </div>
        <div>
          <button
            className="btn btn-secondary me-2"
            id="wd-add-assignment-group"
          >
            <FaPlus className="me-1" /> Group
          </button>
          <button className="btn btn-danger" id="wd-add-assignment">
            <FaPlus className="me-1" /> Assignment
          </button>
        </div>
      </div>

      <div className="border">
        <div
          className="d-flex align-items-center justify-content-between p-3 bg-secondary"
          id="wd-assignments-title"
        >
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <IoMdArrowDropdown className="me-2" />
            <strong>ASSIGNMENTS</strong>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span
              className="border border-dark rounded-pill px-2 py-1 bg-transparent text-dark"
              style={{ fontSize: "0.85rem" }}
            >
              40% of Total
            </span>
            <FaPlus />
            <FaEllipsisV />
          </div>
        </div>

        <ul id="wd-assignment-list" className="list-group list-group-flush">
          <li className="wd-assignment-list-item list-group-item border-0 ps-1 border-start border-success border-5">
            <div className="d-flex align-items-start justify-content-between py-3 pe-3">
              <div className="d-flex align-items-start ps-2">
                <BsGripVertical className="me-2 fs-4 text-muted" />
                <IoDocumentTextOutline className="me-3 fs-4 text-success" />
                <div>
                  <Link
                    href={`/courses/${cid}/assignments/123`}
                    className="wd-assignment-link text-decoration-none text-dark fw-bold fs-5"
                  >
                    A1
                  </Link>
                  <div className="small mt-1">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong> May 6 at 12:00am |{" "}
                    <strong>Due</strong> May 13 at 11:59pm | 100 pts
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle className="text-success" />
                <FaEllipsisV className="text-muted" />
              </div>
            </div>
          </li>

          <li className="wd-assignment-list-item list-group-item border-0 ps-1 border-start border-success border-5">
            <div className="d-flex align-items-start justify-content-between py-3 pe-3">
              <div className="d-flex align-items-start ps-2">
                <BsGripVertical className="me-2 fs-4 text-muted" />
                <IoDocumentTextOutline className="me-3 fs-4 text-success" />
                <div>
                  <Link
                    href={`/courses/${cid}/assignments/234`}
                    className="wd-assignment-link text-decoration-none text-dark fw-bold fs-5"
                  >
                    A2
                  </Link>
                  <div className="small mt-1">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong> May 13 at 12:00am |{" "}
                    <strong>Due</strong> May 20 at 11:59pm | 100 pts
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle className="text-success" />
                <FaEllipsisV className="text-muted" />
              </div>
            </div>
          </li>

          <li className="wd-assignment-list-item list-group-item border-0 ps-1 border-start border-success border-5">
            <div className="d-flex align-items-start justify-content-between py-3 pe-3">
              <div className="d-flex align-items-start ps-2">
                <BsGripVertical className="me-2 fs-4 text-muted" />
                <IoDocumentTextOutline className="me-3 fs-4 text-success" />
                <div>
                  <Link
                    href={`/courses/${cid}/assignments/345`}
                    className="wd-assignment-link text-decoration-none text-dark fw-bold fs-5"
                  >
                    A3
                  </Link>
                  <div className="small mt-1">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong> May 20 at 12:00am |{" "}
                    <strong>Due</strong> May 27 at 11:59pm | 100 pts
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle className="text-success" />
                <FaEllipsisV className="text-muted" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
