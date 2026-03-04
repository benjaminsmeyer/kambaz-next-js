import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enrollments as seedEnrollments } from "../database";
import type { RootState } from "../store";

type EnrollmentRecord = {
  _id: string;
  user: string;
  course: string;
};

type EnrollmentPayload = {
  userId: string;
  courseId: string;
};

type EnrollmentState = {
  byUser: Record<string, string[]>;
};

const initialState: EnrollmentState = {
  byUser: (seedEnrollments as EnrollmentRecord[]).reduce<Record<string, string[]>>(
    (acc, enrollment) => {
      const existing = acc[enrollment.user] ?? [];
      if (!existing.includes(enrollment.course)) {
        acc[enrollment.user] = [...existing, enrollment.course];
      }
      return acc;
    },
    {},
  ),
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, action: PayloadAction<EnrollmentPayload>) => {
      const { userId, courseId } = action.payload;
      const courses = state.byUser[userId] ?? [];
      if (!courses.includes(courseId)) {
        state.byUser[userId] = [...courses, courseId];
      }
    },
    unenroll: (state, action: PayloadAction<EnrollmentPayload>) => {
      const { userId, courseId } = action.payload;
      const courses = state.byUser[userId] ?? [];
      state.byUser[userId] = courses.filter((id) => id !== courseId);
    },
  },
});

export const { enroll, unenroll } = enrollmentsSlice.actions;

export const selectUserCourseIds = (state: RootState, userId?: string) =>
  userId ? state.enrollmentsReducer.byUser[userId] ?? [] : [];

export const selectIsEnrolled = (
  state: RootState,
  userId: string | undefined,
  courseId: string,
) => selectUserCourseIds(state, userId).includes(courseId);

export default enrollmentsSlice.reducer;
