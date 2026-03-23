/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import * as client from "../courses/client";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse, updateCourse, setCourses } from "../courses/reducer";
import { RootState } from "../store";
import { enroll, selectUserCourseIds, unenroll } from "../enrollments/reducer";

export default function Dashboard() {
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const enrolledCourseIds = useSelector((state: RootState) =>
    selectUserCourseIds(state, currentUser?._id),
  );
  const dispatch = useDispatch();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        }),
      ),
    );
  };

  const canManageCourses =
    currentUser &&
    (currentUser.role === "FACULTY" || currentUser.role === "ADMIN");
  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);
  const visibleCourses = showAllCourses
    ? courses
    : courses.filter((course: any) => isEnrolled(course._id));

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title" className="mb-0">
          Dashboard
        </h1>
        <Button
          variant={showAllCourses ? "primary" : "outline-primary"}
          aria-pressed={showAllCourses}
          onClick={() => setShowAllCourses((prev) => !prev)}
        >
          Enrollments
        </Button>
      </div>
      <hr />
      {canManageCourses && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => onAddNewCourse()}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => onUpdateCourse()}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Published Courses" : "Your Courses"} (
        {visibleCourses.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((course: any) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "350px" }}
            >
              <Card>
                <Link
                  href={`/courses/${course._id}/home`}
                  onClick={(event) => {
                    if (!isEnrolled(course._id)) {
                      event.preventDefault();
                      onDeleteCourse(course._id);
                    }
                  }}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    src={course.image || "/images/reactjs.jpg"}
                    alt={course.name}
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body pb-0">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                  </CardBody>
                </Link>
                <CardBody className="pt-0 d-flex gap-2 align-items-center">
                  <Button
                    variant="primary"
                    onClick={(event) => {
                      if (!isEnrolled(course._id)) {
                        event.preventDefault();
                        return;
                      }
                      router.push(`/courses/${course._id}/home`);
                    }}
                  >
                    Go
                  </Button>
                  {currentUser && (
                    <Button
                      variant={isEnrolled(course._id) ? "danger" : "success"}
                      onClick={() =>
                        dispatch(
                          isEnrolled(course._id)
                            ? unenroll({
                                userId: currentUser._id,
                                courseId: course._id,
                              })
                            : enroll({
                                userId: currentUser._id,
                                courseId: course._id,
                              }),
                        )
                      }
                    >
                      {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                    </Button>
                  )}
                  {canManageCourses && (
                    <>
                      <button
                        id="wd-edit-course-click"
                        onClick={() => setCourse(course)}
                        className="btn btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => dispatch(deleteCourse(course._id))}
                        className="btn btn-danger"
                        id="wd-delete-course-click"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
