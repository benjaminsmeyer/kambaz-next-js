"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaCaretDown, FaPlus } from "react-icons/fa6";
import { BsSearch, BsGripVertical } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import GreenCheckmark from "../modules/GreenCheckmark";
import { MdAssignment } from "react-icons/md";
import assignments from "@/app/(kambaz)/database/assignments.json";

export default function Assignments() {
  const { cid } = useParams();

  // Filter assignments for the current course
  const courseAssignments = assignments.filter(
    (assignment) => assignment.course === cid,
  );

  return (
    <div id="wd-assignments" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <InputGroup className="w-50">
          <InputGroup.Text className="bg-white">
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search assignments..."
            id="wd-search-assignment"
          />
        </InputGroup>
        <div className="d-flex gap-2">
          <Button variant="secondary" id="wd-add-assignment-group">
            <FaPlus className="me-1" /> Group
          </Button>
          <Button variant="danger" id="wd-add-assignment">
            <FaPlus className="me-1" /> Assignment
          </Button>
        </div>
      </div>

      <ListGroup className="rounded-0 border">
        <ListGroupItem className="p-0">
          <div className="p-3 bg-secondary d-flex align-items-center justify-content-between">
            <div
              className="d-flex align-items-center gap-2"
              id="wd-assignments-title"
            >
              <BsGripVertical className="fs-3" />
              <FaCaretDown />
              ASSIGNMENTS
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge rounded-pill border border-dark text-dark bg-transparent px-3 py-2">
                40% of Total
              </span>
              <FaPlus />
              <FaEllipsisV />
            </div>
          </div>
        </ListGroupItem>

        {courseAssignments.map((assignment) => (
          <ListGroupItem key={assignment._id} className="p-3 wd-assignment">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3 flex-shrink-0" />
                <MdAssignment className="me-4 fs-3 text-success flex-shrink-0" />
                <div>
                  <Link
                    href={`/courses/${cid}/assignments/${assignment._id}`}
                    className="text-decoration-none text-dark fw-bold fs-5"
                    id={`wd-assignment-${assignment._id}`}
                  >
                    {assignment.title}
                  </Link>
                  <div className="small mt-1">
                    <span className="text-danger">Multiple Modules</span> |{" "}
                    <strong>Not available until</strong> {assignment.available}{" "}
                    | <strong>Due</strong> {assignment.due} |{" "}
                    {assignment.points} pts
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
