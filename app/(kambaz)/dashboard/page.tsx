import Link from "next/link";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "react-bootstrap";

export default function Dashboard() {
  const courses = [
    {
      id: "1234",
      title: "CS1234 React JS",
      description: "Full Stack software developer",
      image: "/images/reactjs.jpg",
    },
    {
      id: "5678",
      title: "CS5678 Python",
      description: "Learn Python from scratch",
      image: "/images/python.jpg",
    },
    {
      id: "9101",
      title: "CS9101 JavaScript",
      description: "Introduction to JavaScript",
      image: "/images/javascript.jpg",
    },
    {
      id: "1121",
      title: "CS1121 HTML & CSS",
      description: "Web Design Fundamentals",
      image: "/images/htmlcss.jpg",
    },
    {
      id: "3141",
      title: "CS3141 Java",
      description: "Object Oriented Programming with Java",
      image: "/images/java.jpg",
    },
    {
      id: "5161",
      title: "CS5161 C#",
      description: "Learn C# programming from scratch",
      image: "/images/csharp.jpg",
    },
    {
      id: "7181",
      title: "CS7181 Ruby on Rails",
      description: "Web Development with Ruby on Rails",
      image: "/images/ruby.jpg",
    },
    {
      id: "9202",
      title: "CS9202 PHP & MySQL",
      description: "Dynamic Web Development",
      image: "/images/php.jpg",
    },
  ];

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} sm={2} md={3} lg={4} className="g-5">
          {courses.map((course) => (
            <Col
              key={course.id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card className="h-100">
                <Link
                  href={`/courses/${course.id}/home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src={course.image}
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.title}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
