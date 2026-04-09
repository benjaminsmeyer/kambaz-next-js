/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Dropdown,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
} from "react-bootstrap";
import { BsGripVertical, BsSearch } from "react-icons/bs";
import { FaCaretDown, FaCheckCircle, FaPlus } from "react-icons/fa";
import { FaBan } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { RootState } from "../../../store";
import { setQuizzes, addQuiz, updateQuiz, deleteQuiz } from "./reducer";
import {
  findQuizzesForCourse,
  createQuiz,
  deleteQuiz as deleteQuizFromServer,
  togglePublishQuiz,
} from "./client";

function getAvailabilityStatus(quiz: any): string {
  const now = new Date();
  const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const until = quiz.untilDate ? new Date(quiz.untilDate) : null;
  if (until && now > until) return "Closed";
  if (available && now < available)
    return `Not available until ${available.toLocaleDateString()}`;
  return "Available";
}

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const canEdit = ["FACULTY", "TA", "ADMIN"].includes(currentUser?.role);
  const isStudent = currentUser?.role === "STUDENT";

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const courseQuizzes = quizzes.filter(
    (q) =>
      q.course === cid &&
      (canEdit || q.published) &&
      q.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  courseQuizzes.sort((a, b) => {
    const aTime = a.availableDate
      ? new Date(a.availableDate).getTime()
      : Infinity;
    const bTime = b.availableDate
      ? new Date(b.availableDate).getTime()
      : Infinity;
    return aTime - bTime;
  });

  useEffect(() => {
    const load = async () => {
      if (!cid) return;
      try {
        const data = await findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(data));
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    };
    load();
  }, [cid, dispatch]);

  const handleAddQuiz = async () => {
    try {
      const newQuiz = await createQuiz(cid as string);
      dispatch(addQuiz(newQuiz));
      router.push(`/courses/${cid}/quizzes/${newQuiz._id}/edit`);
    } catch (err) {
      console.error("Failed to create quiz", err);
    }
  };

  const handleTogglePublish = async (quiz: any) => {
    try {
      const updated = await togglePublishQuiz(quiz._id, !quiz.published);
      dispatch(updateQuiz(updated));
    } catch (err) {
      console.error("Failed to toggle publish", err);
    }
  };

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (quizToDelete) {
      try {
        await deleteQuizFromServer(quizToDelete);
        dispatch(deleteQuiz(quizToDelete));
      } catch (err) {
        console.error("Failed to delete quiz", err);
      }
    }
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  return (
    <div id="wd-quizzes" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <InputGroup className="w-50">
          <InputGroup.Text className="bg-white">
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search for Quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="wd-search-quiz"
          />
        </InputGroup>
        {canEdit && (
          <Button variant="danger" id="wd-add-quiz" onClick={handleAddQuiz}>
            <FaPlus className="me-1" /> Quiz
          </Button>
        )}
      </div>

      <ListGroup className="rounded-0 border">
        <ListGroupItem className="p-0">
          <div className="p-3 bg-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <BsGripVertical className="fs-3" />
              <FaCaretDown />
              ASSIGNMENT QUIZZES
            </div>
            {canEdit && (
              <div className="d-flex align-items-center gap-2">
                <FaPlus />
                <IoEllipsisVertical />
              </div>
            )}
          </div>
        </ListGroupItem>
        {courseQuizzes.length === 0 ? (
          <div className="p-3 text-muted">
            No quizzes yet, click the add button to create a new one.
          </div>
        ) : (
          courseQuizzes.map((quiz: any) => {
            const availabilityStatus = getAvailabilityStatus(quiz);
            const dueDate = quiz.dueDate
              ? new Date(quiz.dueDate).toLocaleDateString()
              : "No due date";
            return (
              <ListGroupItem key={quiz._id} className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3 flex-shrink-0" />
                    <FaClipboardList className="me-4 fs-3 text-success flex-shrink-0" />
                    <div>
                      <Link
                        href={`/courses/${cid}/quizzes/${quiz._id}`}
                        className="text-decoration-none text-dark fw-bold fs-5"
                      >
                        {quiz.title}
                      </Link>
                      <div className="small mt-1">
                        <span className="text-danger">Multiple Modules</span> |{" "}
                        <strong>{availabilityStatus}</strong> |{" "}
                        <strong>Due</strong> {dueDate} | {quiz.points} pts |{" "}
                        {quiz.numberOfQuestions} Questions
                      </div>
                      {isStudent && quiz.score !== undefined && (
                        <div className="small text-muted">
                          Score: {quiz.score} / {quiz.points}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    {canEdit && (
                      <>
                        <Button
                          variant="link"
                          className="p-0 border-0"
                          onClick={() => handleTogglePublish(quiz)}
                          title={quiz.published ? "Unpublish" : "Publish"}
                        >
                          {quiz.published ? (
                            <FaCheckCircle className="text-success fs-5" />
                          ) : (
                            <FaBan className="text-secondary fs-5" />
                          )}
                        </Button>
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            as="span"
                            style={{ cursor: "pointer" }}
                            id={`wd-quiz-menu-${quiz._id}`}
                          >
                            <IoEllipsisVertical className="fs-4" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              href={`/courses/${cid}/quizzes/${quiz._id}/edit`}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDeleteClick(quiz._id)}
                            >
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleTogglePublish(quiz)}
                            >
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    )}
                  </div>
                </div>
              </ListGroupItem>
            );
          })
        )}
      </ListGroup>

      <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this quiz?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
