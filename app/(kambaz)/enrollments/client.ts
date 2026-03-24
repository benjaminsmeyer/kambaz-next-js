import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const findAllEnrollments = async () => {
  const { data } = await axios.get(ENROLLMENTS_API);
  return data;
};

export const findEnrollmentsForUser = async (userId = "current") => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/${userId}/enrollments`,
  );
  return data;
};

export const findEnrollmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(
    `${HTTP_SERVER}/api/courses/${courseId}/enrollments`,
  );
  return data;
};

export const enrollInCourse = async (courseId: string, userId = "current") => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`,
  );
  return data;
};

export const unenrollFromCourse = async (
  courseId: string,
  userId = "current",
) => {
  const { data } = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`,
  );
  return data;
};
