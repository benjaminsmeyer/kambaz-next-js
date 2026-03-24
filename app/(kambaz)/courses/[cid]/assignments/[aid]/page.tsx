/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAssignment,
  setAssignments,
  updateAssignment as updateAssignmentAction,
} from "../reducer";
import { RootState } from "@/app/(kambaz)/store";
import {
  createAssignmentForCourse,
  findAssignmentById,
  findAssignmentsForCourse,
  updateAssignment as updateAssignmentOnServer,
} from "../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get assignments from Redux store
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const canEditAssignments = ["FACULTY", "TA"].includes(currentUser?.role);
  const isReadOnly = !canEditAssignments;
  const existingAssignment =
    aid !== "new" ? assignments.find((a: any) => a._id === aid) : null;

  const [assignment, setAssignment] = useState({
    title: "New Assignment",
    description: "New Assignment Description",
    points: 100,
    due: "",
    available: "",
    until: "",
  });

  // Parse "May 8 at 11:59pm" format to "2024-05-08T23:59"
  const parseToDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "";
    const [datePart, timePart] = dateTimeStr.split(" at ");
    if (!datePart || !timePart) return "";

    const monthDay = datePart.trim();
    const time = timePart.trim();

    const currentYear = new Date().getFullYear();
    const date = new Date(`${monthDay} ${currentYear}`);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const timeMatch = time.match(/(\d{1,2}):(\d{2})(am|pm)/i);
    if (!timeMatch) return "";

    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const isPm = timeMatch[3].toLowerCase() === "pm";

    if (isPm && hours !== 12) hours += 12;
    if (!isPm && hours === 12) hours = 0;

    const hoursFormatted = String(hours).padStart(2, "0");

    return `${currentYear}-${month}-${day}T${hoursFormatted}:${minutes}`;
  };

  // Convert "2024-05-08T23:59" to "May 8 at 11:59pm"
  const formatToDisplayDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "";

    const date = new Date(dateTimeStr);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    return `${month} ${day} at ${hours}:${minutes}${ampm}`;
  };

  // Load existing assignment data when editing
  useEffect(() => {
    const loadAssignment = async () => {
      if (!currentUser) {
        router.replace("/account/signin");
        return;
      }
      if (aid === "new" && isReadOnly) {
        router.replace(`/courses/${cid}/assignments`);
        return;
      }

      if (!cid) return;
      try {
        const assignmentsForCourse = await findAssignmentsForCourse(
          cid as string,
        );
        dispatch(setAssignments(assignmentsForCourse));

        if (aid !== "new") {
          const assignmentFromServer =
            assignmentsForCourse.find((a: any) => a._id === aid) ||
            (await findAssignmentById(aid as string));

          if (assignmentFromServer) {
            setAssignment({
              title: assignmentFromServer.title || "",
              description: assignmentFromServer.description || "",
              points: assignmentFromServer.points || 100,
              due: parseToDateTime(assignmentFromServer.due) || "",
              available: parseToDateTime(assignmentFromServer.available) || "",
              until: parseToDateTime(assignmentFromServer.until) || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to load assignment", error);
        if (existingAssignment) {
          setAssignment({
            title: existingAssignment.title || "",
            description: existingAssignment.description || "",
            points: existingAssignment.points || 100,
            due: parseToDateTime(existingAssignment.due) || "",
            available: parseToDateTime(existingAssignment.available) || "",
            until: parseToDateTime(existingAssignment.until) || "",
          });
        }
      }
    };

    loadAssignment();
  }, [aid, cid, currentUser, dispatch, existingAssignment, isReadOnly, router]);

  if (!currentUser) return null;

  const handleSave = async () => {
    if (isReadOnly) return;
    // Convert datetime-local format back to display format before saving
    const formattedAssignment = {
      title: assignment.title,
      description: assignment.description,
      points: assignment.points,
      due: formatToDisplayDateTime(assignment.due),
      available: formatToDisplayDateTime(assignment.available),
      until: formatToDisplayDateTime(assignment.until),
      course: cid,
    };

    try {
      if (aid === "new") {
        const created = await createAssignmentForCourse(
          cid as string,
          formattedAssignment,
        );
        dispatch(addAssignment(created));
      } else {
        const updated = await updateAssignmentOnServer(aid as string, {
          ...formattedAssignment,
          _id: aid,
        });
        dispatch(updateAssignmentAction(updated));
      }
      router.push(`/courses/${cid}/assignments`);
    } catch (error) {
      console.error("Failed to save assignment", error);
    }
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <div style={{ maxWidth: 720 }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Assignment Name</Form.Label>
            <Form.Control
              id="wd-name"
              value={assignment.title}
              readOnly={isReadOnly}
              onChange={(e) =>
                setAssignment({ ...assignment, title: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              id="wd-description"
              as="textarea"
              rows={8}
              value={assignment.description}
              readOnly={isReadOnly}
              onChange={(e) =>
                setAssignment({ ...assignment, description: e.target.value })
              }
            />
          </Form.Group>

          <Row className="mb-3 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Points</Form.Label>
            </Col>
            <Col md={9}>
              <Form.Control
                id="wd-points"
                type="number"
                value={assignment.points}
                readOnly={isReadOnly}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    points: Number(e.target.value),
                  })
                }
              />
            </Col>
          </Row>

          <Row className="mb-3 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Assignment Group</Form.Label>
            </Col>
            <Col md={9}>
              <Form.Select
                id="wd-group"
                defaultValue="ASSIGNMENTS"
                disabled={isReadOnly}
              >
                <option>ASSIGNMENTS</option>
                <option>QUIZZES</option>
                <option>EXAMS</option>
                <option>PROJECT</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Display Grade as</Form.Label>
            </Col>
            <Col md={9}>
              <Form.Select
                id="wd-display-grade-as"
                defaultValue="Percentage"
                disabled={isReadOnly}
              >
                <option>Percentage</option>
                <option>Points</option>
                <option>Letter Grade</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-4 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Submission Type</Form.Label>
            </Col>
            <Col md={9}>
              <div className="border rounded p-3">
                <Form.Select
                  id="wd-submission-type"
                  defaultValue="Online"
                  className="mb-3"
                  disabled={isReadOnly}
                >
                  <option>Online</option>
                  <option>In Person</option>
                  <option>None</option>
                </Form.Select>

                <Form.Label className="mb-2 d-block">
                  Online Entry Options
                </Form.Label>
                <div className="ms-2">
                  <Form.Check
                    type="checkbox"
                    id="wd-text-entry"
                    label="Text Entry"
                    disabled={isReadOnly}
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-website-url"
                    label="Website URL"
                    defaultChecked
                    disabled={isReadOnly}
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-media-recordings"
                    label="Media Recordings"
                    disabled={isReadOnly}
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-student-annotation"
                    label="Student Annotation"
                    disabled={isReadOnly}
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-file-upload"
                    label="File Uploads"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Assign</Form.Label>
            </Col>
            <Col md={9}>
              <div className="border rounded p-3">
                <Form.Group className="mb-3">
                  <Form.Label>Assign to</Form.Label>
                  <Form.Control defaultValue="Everyone" readOnly={isReadOnly} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id="wd-due-date-time"
                      type="datetime-local"
                      value={assignment.due}
                      readOnly={isReadOnly}
                      onChange={(e) =>
                        setAssignment({ ...assignment, due: e.target.value })
                      }
                    />
                  </InputGroup>
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3 mb-md-0">
                    <Form.Group>
                      <Form.Label>Available from</Form.Label>
                      <InputGroup>
                        <Form.Control
                          id="wd-available-from"
                          type="datetime-local"
                          value={assignment.available}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setAssignment({
                              ...assignment,
                              available: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Until</Form.Label>
                      <InputGroup>
                        <Form.Control
                          id="wd-available-until"
                          type="datetime-local"
                          value={assignment.until}
                          readOnly={isReadOnly}
                          onChange={(e) =>
                            setAssignment({
                              ...assignment,
                              until: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <hr />

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              id="wd-cancel-button"
              onClick={handleCancel}
            >
              {isReadOnly ? "Back" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <Button variant="danger" id="wd-save-button" onClick={handleSave}>
                Save
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
