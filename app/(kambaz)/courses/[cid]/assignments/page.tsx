"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaCaretDown, FaPlus, FaTrash } from "react-icons/fa6";
import { BsSearch, BsGripVertical } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import GreenCheckmark from "../modules/GreenCheckmark";
import { MdAssignment } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import { useState } from "react";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(
    null,
  );

  // Filter assignments for the current course
  const courseAssignments = assignments.filter(
    (assignment) => assignment.course === cid,
  );

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

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
          <Link
            href={`/courses/${cid}/assignments/new`}
            className="btn btn-danger"
            id="wd-add-assignment"
          >
            <FaPlus className="me-1" /> Assignment
          </Link>
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
                <Button
                  className="btn btn-link text-danger p-0 border-0"
                  onClick={() => handleDeleteClick(assignment._id)}
                  id={`wd-delete-assignment-${assignment._id}`}
                  style={{ background: "none" }}
                >
                  <FaTrash className="fs-5" />
                </Button>
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>

      {/* Delete Confirmation Dialog */}
      <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
