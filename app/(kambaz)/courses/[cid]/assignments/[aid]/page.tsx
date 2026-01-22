"use client";

import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { BsCalendar, BsClock } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <div className="p-4" style={{ width: 720 }}>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Assignment Name</Form.Label>
            <Form.Control id="wd-name" defaultValue="A1 - ENV + HTML" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              id="wd-description"
              as="textarea"
              rows={8}
              defaultValue="The assignment is available online
Submit a link to the landing page of your Web application running on Netlify.
The landing page should include the following:
• Your full name and section
• Links to each of the lab assignments
• Link the Kambas application
• Links to all relevant source code repositories
The Kambas application should include a link to navigate back to the landing page."
            />
          </Form.Group>

          <Row className="mb-3 align-items-start">
            <Col md={3} className="text-muted pt-2">
              <Form.Label>Points</Form.Label>
            </Col>
            <Col md={9}>
              <Form.Control id="wd-points" type="number" defaultValue={100} />
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
                      defaultValue="2024-05-13T23:59"
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
                          type="date"
                          defaultValue="2024-05-06"
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
                          type="date"
                          defaultValue="2024-05-20"
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
            <Button variant="secondary">Cancel</Button>
            <Button variant="danger">Save</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
