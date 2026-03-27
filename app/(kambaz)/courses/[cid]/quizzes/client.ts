/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const QUESTIONS_API = `${HTTP_SERVER}/api/questions`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export type QuizType =
  | "Graded Quiz"
  | "Practice Quiz"
  | "Graded Survey"
  | "Ungraded Survey";
export type AssignmentGroup = "Quizzes" | "Exams" | "Assignments" | "Project";

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  createdBy: string;
  quizType: QuizType;
  assignmentGroup: AssignmentGroup;
  points: number;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
  numberOfQuestions: number;
}

export interface Choice {
  _id?: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  _id: string;
  quiz: string;
  title: string;
  type: "Multiple Choice" | "True/False" | "Fill in the Blank";
  points: number;
  question: string;
  choices: Choice[];
  trueFalseAnswer?: boolean;
  blanks?: string[];
  order: number;
}

export interface AttemptAnswer {
  question: string;
  selectedChoice?: string | null;
  trueFalseAnswer?: boolean | null;
  blankAnswer?: string | null;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  user: string;
  course: string;
  attemptNumber: number;
  score: number;
  totalPoints: number;
  answers: AttemptAnswer[];
  submittedAt: string;
}

// ---------- Quizzes ----------

export const findQuizzesForCourse = async (courseId: string): Promise<Quiz[]> => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return data;
};

export const findQuizById = async (quizId: string): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const createQuiz = async (courseId: string, quiz: Partial<Quiz> = {}): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz,
  );
  return data;
};

export const updateQuiz = async (quizId: string, quiz: Partial<Quiz>): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}`, quiz);
  return data;
};

export const deleteQuiz = async (quizId: string): Promise<any> => {
  const { data } = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const togglePublishQuiz = async (
  quizId: string,
  published: boolean,
): Promise<Quiz> => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/publish`,
    { published },
  );
  return data;
};

// ---------- Questions ----------

export const findQuestionsForQuiz = async (quizId: string): Promise<Question[]> => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/questions`);
  return data;
};

export const createQuestion = async (
  quizId: string,
  question: Partial<Question> = {},
): Promise<Question> => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question,
  );
  return data;
};

export const updateQuestion = async (
  questionId: string,
  question: Partial<Question>,
): Promise<Question> => {
  const { data } = await axiosWithCredentials.put(
    `${QUESTIONS_API}/${questionId}`,
    question,
  );
  return data;
};

export const deleteQuestion = async (questionId: string): Promise<any> => {
  const { data } = await axiosWithCredentials.delete(
    `${QUESTIONS_API}/${questionId}`,
  );
  return data;
};

// ---------- Attempts ----------

export const submitAttempt = async (
  quizId: string,
  answers: Partial<AttemptAnswer>[],
  accessCode?: string,
): Promise<QuizAttempt> => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    { answers, accessCode },
  );
  return data;
};

export const getAttempts = async (quizId: string): Promise<QuizAttempt[]> => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts`,
  );
  return data;
};

export const getLatestAttempt = async (quizId: string): Promise<QuizAttempt> => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts/latest`,
  );
  return data;
};
