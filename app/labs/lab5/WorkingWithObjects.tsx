"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [module, setModule] = useState({
    id: 2,
    name: "Introduction to Web Development",
    description:
      "Learn the basics of web development with HTML, CSS, and JavaScript",
    course: "CS101",
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;
  return (
    <div>
      <h3 id="wd-working-with-objects">Working With Objects</h3>

      <h4>Assignment Operations</h4>

      <h5>Modifying Properties</h5>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>
      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <hr />

      <h5>Update Score</h5>
      <a
        id="wd-update-assignment-score"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
      >
        Update Score
      </a>
      <FormControl
        className="w-75 mb-2"
        id="wd-assignment-score"
        type="number"
        defaultValue={assignment.score}
        onChange={(e) =>
          setAssignment({
            ...assignment,
            score: parseInt(e.target.value) || 0,
          })
        }
      />
      <hr />

      <h5>Update Completed</h5>
      <a
        id="wd-update-assignment-completed"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>
      <div className="d-block mb-2">
        <input
          id="wd-assignment-completed"
          type="checkbox"
          checked={assignment.completed}
          onChange={(e) =>
            setAssignment({
              ...assignment,
              completed: e.target.checked,
            })
          }
        />
      </div>
      <hr />

      <h4>Retrieving Assignment</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />

      <h4>Retrieving Assignment Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <hr />

      <h4>Module Operations</h4>

      <h5>Retrieving Module</h5>
      <a
        id="wd-retrieve-module"
        className="btn btn-success"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <hr />

      <h5>Retrieving Module Properties</h5>
      <a
        id="wd-retrieve-module-name"
        className="btn btn-success"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>
      <hr />

      <h5>Update Module Name</h5>
      <a
        id="wd-update-module-name"
        className="btn btn-success float-end"
        href={`${MODULE_API_URL}/name/${module.name}`}
      >
        Update Name
      </a>
      <FormControl
        className="w-75"
        id="wd-module-name"
        defaultValue={module.name}
        onChange={(e) => setModule({ ...module, name: e.target.value })}
      />
      <hr />

      <h5>Update Module Description</h5>
      <div className="d-flex gap-2 mb-2">
        <FormControl
          className="flex-grow-1"
          id="wd-module-description"
          as="textarea"
          rows={3}
          defaultValue={module.description}
          onChange={(e) =>
            setModule({ ...module, description: e.target.value })
          }
        />
        <a
          id="wd-update-module-description"
          className="btn btn-success align-self-start"
          href={`${MODULE_API_URL}/description/${module.description}`}
        >
          Update Description
        </a>
      </div>
      <hr />
    </div>
  );
}
