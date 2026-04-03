/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { quizzes } from "../../../database";

const initialState = {
  quizzes: quizzes as any[],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: newQuizzes }) => {
      state.quizzes = newQuizzes;
    },
    addQuiz: (state, { payload: quiz }) => {
      state.quizzes = [...state.quizzes, quiz] as any;
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q,
      ) as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
