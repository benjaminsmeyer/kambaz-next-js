import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (10)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image
              src="/images/reactjs.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/5678" className="wd-dashboard-course-link">
            <Image
              src="/images/python.jpg"
              width={200}
              height={150}
              alt="python"
            />
            <div>
              <h5> CS5678 Python Programming </h5>
              <p className="wd-dashboard-course-title">
                Learn Python from scratch
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/9101" className="wd-dashboard-course-link">
            <Image
              src="/images/javascript.jpg"
              width={200}
              height={150}
              alt="javascript"
            />
            <div>
              <h5> CS9101 JavaScript Basics </h5>
              <p className="wd-dashboard-course-title">
                Introduction to JavaScript
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1121" className="wd-dashboard-course-link">
            <Image
              src="/images/htmlcss.jpg"
              width={200}
              height={150}
              alt="htmlcss"
            />
            <div>
              <h5> CS1121 HTML & CSS </h5>
              <p className="wd-dashboard-course-title">
                Web Design Fundamentals
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3141" className="wd-dashboard-course-link">
            <Image src="/images/java.jpg" width={200} height={150} alt="java" />
            <div>
              <h5> CS3141 Java Programming </h5>
              <p className="wd-dashboard-course-title">
                Object Oriented Programming with Java
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/5161" className="wd-dashboard-course-link">
            <Image
              src="/images/csharp.jpg"
              width={200}
              height={150}
              alt="csharp"
            />
            <div>
              <h5> CS5161 C# for Beginners </h5>
              <p className="wd-dashboard-course-title">
                Learn C# programming from scratch
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/7181" className="wd-dashboard-course-link">
            <Image src="/images/ruby.jpg" width={200} height={150} alt="ruby" />
            <div>
              <h5> CS7181 Ruby on Rails </h5>
              <p className="wd-dashboard-course-title">
                Web Development with Ruby on Rails
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/9202" className="wd-dashboard-course-link">
            <Image src="/images/php.jpg" width={200} height={150} alt="php" />
            <div>
              <h5> CS9202 PHP & MySQL </h5>
              <p className="wd-dashboard-course-title">
                Dynamic Web Development
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/1222" className="wd-dashboard-course-link">
            <Image
              src="/images/angular.jpg"
              width={200}
              height={150}
              alt="angular"
            />
            <div>
              <h5> CS1222 Angular Fundamentals </h5>
              <p className="wd-dashboard-course-title">
                Building SPAs with Angular
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/3242" className="wd-dashboard-course-link">
            <Image src="/images/vue.jpg" width={200} height={150} alt="vue" />
            <div>
              <h5> CS3242 Vue.js Essentials </h5>
              <p className="wd-dashboard-course-title">
                Frontend Development with Vue.js
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
