"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import assignments from "@/app/(kambaz)/database/assignments.json";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();

  // Find the assignment by ID
  const assignment = assignments.find((a) => a._id === aid);

  if (!assignment) {
    return (
      <div id="wd-assignments-editor" className="p-4">
        <div className="alert alert-danger">Assignment not found</div>
      </div>
    );
  }

  // Parse "May 8 at 11:59pm" format to "2024-05-08T23:59"
  const parseToDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return "";
    const [datePart, timePart] = dateTimeStr.split(" at ");
    const monthDay = datePart.trim();
    const time = timePart.trim();

    // Convert "May 8" to month-day, then format as ISO
    const date = new Date(`${monthDay} 2024`);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Convert "11:59pm" to 24-hour format
    const timeMatch = time.match(/(\d{1,2}):(\d{2})(am|pm)/i);
    if (!timeMatch) return "";

    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const isPm = timeMatch[3].toLowerCase() === "pm";

    if (isPm && hours !== 12) hours += 12;
    if (!isPm && hours === 12) hours = 0;

    const hoursFormatted = String(hours).padStart(2, "0");

    return `2024-${month}-${day}T${hoursFormatted}:${minutes}`;
  };
  return (
    <div id="wd-assignments-editor" className="p-4">
      <div style={{ maxWidth: 720 }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Assignment Name</Form.Label>
            <Form.Control id="wd-name" defaultValue={assignment.title} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              id="wd-description"
              as="textarea"
              rows={8}
              defaultValue={assignment.description}
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
                defaultValue={assignment.points}
              />
            </Col>
          </Row>

          <Row className="mb-3 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Assignment Group</Form.Label>
            </Col>
            <Col md={9}>
              <Form.Select id="wd-group" defaultValue="ASSIGNMENTS">
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
              <Form.Select id="wd-display-grade-as" defaultValue="Percentage">
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
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-website-url"
                    label="Website URL"
                    defaultChecked
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-media-recordings"
                    label="Media Recordings"
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-student-annotation"
                    label="Student Annotation"
                  />
                  <Form.Check
                    type="checkbox"
                    id="wd-file-upload"
                    label="File Uploads"
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
                  <Form.Control defaultValue="Everyone" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due</Form.Label>
                  <InputGroup>
                    <Form.Control
                      id="wd-due-date-time"
                      type="datetime-local"
                      defaultValue={parseToDateTime(assignment.due)}
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
                          defaultValue={parseToDateTime(assignment.available)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Until</Form.Label>
                      <InputGroup>
                        <Form.Control
                          id="wd-available-from"
                          type="datetime-local"
                          defaultValue={parseToDateTime(assignment.until)}
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
            <Link href={`/courses/${cid}/assignments`}>
              <Button
                variant="secondary"
                id="wd-cancel-button"
                className="text-decoration-none"
              >
                Cancel
              </Button>
            </Link>
            <Link href={`/courses/${cid}/assignments`}>
              <Button
                variant="danger"
                id="wd-save-button"
                className="text-decoration-none"
              >
                Save
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
