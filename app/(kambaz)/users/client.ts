/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

export const findUserById = async (userId: string) => {
  const { data } = await axios.get(`${USERS_API}/${userId}`);
  return data;
};

export const createUser = async (user: any) => {
  const { data } = await axiosWithCredentials.post(USERS_API, user);
  return data;
};

export const updateUser = async (userId: string, user: any) => {
  const { data } = await axiosWithCredentials.put(
    `${USERS_API}/${userId}`,
    user,
  );
  return data;
};

export const deleteUser = async (userId: string) => {
  const { data } = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return data;
};
