/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { RootState } from "@/app/(kambaz)/store";
import {
  findQuizById,
  findQuestionsForQuiz,
  getAttempts,
  Quiz,
  Question,
  QuizAttempt,
  Choice,
} from "../../client";

export default function QuizResults() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const attemptId = useSearchParams().get("attemptId");

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (!qid) return;
    const load = async () => {
      try {
        // fetch quiz metadata, questions, and all attempts in parallel
        const [quiz, questions, attempts] = await Promise.all([
          findQuizById(qid as string),
          findQuestionsForQuiz(qid as string),
          getAttempts(qid as string),
        ]);
        setQuiz(quiz);
        setQuestions(questions);
        setAllAttempts(attempts);

        // use the specified attempt if provided
        if (attemptId) {
          const currentAttempt = attempts.find((answer) => answer._id === attemptId);
          setAttempt(currentAttempt || attempts[attempts.length - 1] || null);
        } else {
          // fall back to the most recent one
          setAttempt(attempts[attempts.length - 1] || null);
        }
      } catch (err) {
        console.error("Failed to load results", err);
      }
    };
    load();
  }, [qid, attemptId]);

  // if quiz or attempt is not loaded, show loading message
  if (!quiz || !attempt) return <div className="p-4">Loading...</div>;

  // how many attempts the student is allowed total, and how many are left
  const attemptsAllowed = quiz.multipleAttempts ? (quiz.howManyAttempts || 1) : 1;
  const attemptsRemaining = attemptsAllowed - allAttempts.length;

  // only students see the retake button
  const isStudent = currentUser?.role === "STUDENT";
  const isPastDue = quiz.dueDate ? new Date() > new Date(quiz.dueDate) : false;
  
  // map question IDs to the student's answer for quick lookup during render
  const answerMap = new Map(
    (attempt.answers ?? []).map((answer) => [String(answer.question), answer]),
  );
  const showCorrect =
    quiz.showCorrectAnswers === "Immediately" ||
    quiz.showCorrectAnswers === "After Due Date";
  
  // helper to format dates nicely, or show "—" if no date provided
  const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : "—");

  return (
    <div id="wd-quiz-results" className="p-4">
      <h2 className="mb-1">{quiz.title}</h2>
      <div className="mb-3 text-muted">
        Attempt {attempt.attemptNumber} submitted {formatDate(attempt.submittedAt)}
      </div>

      <div className="alert alert-info mb-4">
        <strong>
          Score: {attempt.score} / {attempt.totalPoints} pts
        </strong>
      </div>

      {questions.map((question, idx) => {
        const answer = answerMap.get(String(question._id));
        const isCorrect = answer?.isCorrect ?? false;
        const pointsEarned = answer?.pointsEarned ?? 0;

        return (
          <div key={question._id} className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between mb-2">
              <strong>
                Question {idx + 1}: {question.title}
              </strong>
              <span>
                {isCorrect 
                  ? <FaCheckCircle className="text-success me-1" />
                  : <FaTimesCircle className="text-danger me-1" />}
                {pointsEarned} / {question.points} pts
              </span>
            </div>
            <p>{question.question}</p>

            {/* mark correct answers for Multiple Choice questions */}
            {question.type === "Multiple Choice" &&
              question.choices?.map((choice: Choice, i: number) => (
                <Form.Check
                  key={i}
                  type="radio"
                  label={
                    <span
                      className={
                        showCorrect && choice.isCorrect ? "text-success fw-bold" : ""
                      }
                    >
                      {choice.text}
                      {showCorrect && choice.isCorrect && " ✓"}
                    </span>
                  }
                  checked={answer?.selectedChoice === choice.text}
                  disabled
                  readOnly
                />
              ))}
            {/* mark correct answers for True/False questions */}
            {question.type === "True/False" && (
              [true, false].map((val) => (
                <Form.Check
                  key={String(val)}
                  type="radio"
                  label={
                    <span className={showCorrect && question.trueFalseAnswer === val ? "text-success fw-bold" : ""}>
                      {val ? "True" : "False"}
                      {showCorrect && question.trueFalseAnswer === val && " ✓"}
                    </span>
                  }
                  checked={answer?.trueFalseAnswer === val}
                  disabled
                  readOnly
                />
              ))
            )}
            {/* mark correct answers for Fill in the Blank questions */}
            {question.type === "Fill in the Blank" && (
              <div>
                <Form.Control
                  value={answer?.blankAnswer || ""}
                  disabled
                  className={isCorrect ? "border-success" : "border-danger"}
                />
                {showCorrect && !isCorrect && question.blanks && (
                  <div className="text-success small mt-1">
                    Correct answer(s): {question.blanks.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="d-flex gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes`)}
        >
          Back to Quizzes
        </Button>
        {isStudent && quiz.multipleAttempts && attemptsRemaining > 0 && !isPastDue && (
          <Button
            variant="danger"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}
          >
            Retake Quiz ({attemptsRemaining} attempt {attemptsRemaining !== 1 ? "s" : ""} remaining)
          </Button>
        )}
      </div>
    </div>
  );
}
