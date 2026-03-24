import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enrollments as seedEnrollments } from "../database";
import type { RootState } from "../store";

type EnrollmentRecord = {
  _id: string;
  user: string;
  course: string;
};

type EnrollmentState = {
  records: EnrollmentRecord[];
  byUser: Record<string, string[]>;
};

const buildByUser = (records: EnrollmentRecord[]) =>
  records.reduce<Record<string, string[]>>((acc, enrollment) => {
    const existing = acc[enrollment.user] ?? [];
    if (!existing.includes(enrollment.course)) {
      acc[enrollment.user] = [...existing, enrollment.course];
    }
    return acc;
  }, {});

const initialRecords = seedEnrollments as EnrollmentRecord[];

const initialState: EnrollmentState = {
  records: initialRecords,
  byUser: buildByUser(initialRecords),
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, action: PayloadAction<EnrollmentRecord>) => {
      const enrollment = action.payload;
      const exists = state.records.some((e) => e._id === enrollment._id);
      if (!exists) {
        state.records = [...state.records, enrollment];
      }
      state.byUser = buildByUser(state.records);
    },
    unenroll: (
      state,
      action: PayloadAction<{ userId: string; courseId: string }>,
    ) => {
      const { userId, courseId } = action.payload;
      state.records = state.records.filter(
        (record) => !(record.user === userId && record.course === courseId),
      );
      const courses = state.byUser[userId] ?? [];
      state.byUser[userId] = courses.filter((id) => id !== courseId);
    },
    setEnrollments: (state, action: PayloadAction<EnrollmentRecord[]>) => {
      state.records = action.payload;
      state.byUser = buildByUser(action.payload);
    },
    mergeEnrollments: (state, action: PayloadAction<EnrollmentRecord[]>) => {
      const byId = new Map(state.records.map((record) => [record._id, record]));
      action.payload.forEach((record) => {
        byId.set(record._id, record);
      });
      const merged = Array.from(byId.values());
      state.records = merged;
      state.byUser = buildByUser(merged);
    },
  },
});

export const { enroll, unenroll, setEnrollments, mergeEnrollments } =
  enrollmentsSlice.actions;

export const selectUserCourseIds = (state: RootState, userId?: string) =>
  userId ? (state.enrollmentsReducer.byUser[userId] ?? []) : [];

export const selectIsEnrolled = (
  state: RootState,
  userId: string | undefined,
  courseId: string,
) => selectUserCourseIds(state, userId).includes(courseId);

export default enrollmentsSlice.reducer;
