export default function Modules() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button className="border px-3 py-1 rounded">Collapse All</button>
        <button className="border px-3 py-1 rounded">View Progress</button>
        <select className="border px-3 py-1 rounded">
          <option>Publish All</option>
        </select>
        <button className="border px-3 py-1 rounded">+ Module</button>
      </div>

      <ul id="wd-modules" className="list-disc pl-5 space-y-3">
        <li className="wd-module">
          <div className="wd-title">
            Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
          </div>
          <ul className="wd-lessons list-[circle] pl-5 space-y-1">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content list-[square] pl-5">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">
                  Learn what is Web Development
                </li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content list-[square] pl-5">
                <li className="wd-content-item">
                  Full Stack Developer - Chapter 1 - Introduction
                </li>
                <li className="wd-content-item">
                  Full Stack Developer - Chapter 2 - Creating Us
                </li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content list-[square] pl-5">
                <li className="wd-content-item">
                  Introduction to Web Development
                </li>
                <li className="wd-content-item">
                  Creating an HTTP server with Node.js
                </li>
                <li className="wd-content-item">
                  Creating a React Application
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li className="wd-module">
          <div className="wd-title">
            Week 1, Lecture 2 - Formatting User Interfaces with HTML
          </div>
          <ul className="wd-lessons list-[circle] pl-5 space-y-1">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content list-[square] pl-5">
                <li className="wd-content-item">
                  Learn how to create user interfaces with HTML
                </li>
                <li className="wd-content-item">
                  Deploy the assignment to Netlify
                </li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content list-[square] pl-5">
                <li className="wd-content-item">
                  Introduction to HTML and the DOM
                </li>
                <li className="wd-content-item">
                  Formatting Web content with Headings and
                </li>
                <li className="wd-content-item">
                  Formatting content with Lists and Tables
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
