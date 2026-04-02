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
} from "../../client";

export default function QuizResults() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (!qid) return;
    Promise.all([
      findQuizById(qid as string),
      findQuestionsForQuiz(qid as string),
      getAttempts(qid as string),
    ])
      .then(([q, qs, attempts]) => {
        setQuiz(q);
        setQuestions(qs);
        setAllAttempts(attempts);
        if (attemptId) {
          const found = attempts.find((a) => a._id === attemptId);
          setAttempt(found || attempts[attempts.length - 1] || null);
        } else {
          setAttempt(attempts[attempts.length - 1] || null);
        }
      })
      .catch((err) => console.error("Failed to load results", err));
  }, [qid, attemptId]);

  if (!quiz || !attempt) return <div className="p-4">Loading...</div>;

  const attemptsUsed = allAttempts.length;
  const attemptsAllowed = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const attemptsRemaining = attemptsAllowed - attemptsUsed;
  const isStudent = currentUser?.role === "STUDENT";

  const answerMap = new Map(
    attempt.answers.map((a) => [String(a.question), a]),
  );
  const showCorrect =
    quiz.showCorrectAnswers === "Immediately" ||
    quiz.showCorrectAnswers === "After Due Date";

  return (
    <div id="wd-quiz-results" className="p-4">
      <h2 className="mb-1">{quiz.title}</h2>
      <div className="mb-3 text-muted">
        Attempt {attempt.attemptNumber} submitted{" "}
        {new Date(attempt.submittedAt).toLocaleString()}
      </div>

      <div className="alert alert-info mb-4">
        <strong>
          Score: {attempt.score} / {attempt.totalPoints} pts
        </strong>
      </div>

      {questions.map((q, idx) => {
        const a = answerMap.get(String(q._id));
        const isCorrect = a?.isCorrect ?? false;
        const pointsEarned = a?.pointsEarned ?? 0;

        return (
          <div key={q._id} className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between mb-2">
              <strong>
                Question {idx + 1}: {q.title}
              </strong>
              <span>
                {isCorrect ? (
                  <FaCheckCircle className="text-success me-1" />
                ) : (
                  <FaTimesCircle className="text-danger me-1" />
                )}
                {pointsEarned} / {q.points} pts
              </span>
            </div>
            <p>{q.question}</p>

            {q.type === "Multiple Choice" &&
              q.choices.map((c: any, i: number) => (
                <Form.Check
                  key={i}
                  type="radio"
                  label={
                    <span
                      className={
                        showCorrect && c.isCorrect ? "text-success fw-bold" : ""
                      }
                    >
                      {c.text}
                      {showCorrect && c.isCorrect && " ✓"}
                    </span>
                  }
                  checked={a?.selectedChoice === c.text}
                  disabled
                  readOnly
                />
              ))}

            {q.type === "True/False" && (
              <>
                <Form.Check
                  type="radio"
                  label={
                    <span
                      className={
                        showCorrect && q.trueFalseAnswer === true
                          ? "text-success fw-bold"
                          : ""
                      }
                    >
                      True{showCorrect && q.trueFalseAnswer === true && " ✓"}
                    </span>
                  }
                  checked={a?.trueFalseAnswer === true}
                  disabled
                  readOnly
                />
                <Form.Check
                  type="radio"
                  label={
                    <span
                      className={
                        showCorrect && q.trueFalseAnswer === false
                          ? "text-success fw-bold"
                          : ""
                      }
                    >
                      False{showCorrect && q.trueFalseAnswer === false && " ✓"}
                    </span>
                  }
                  checked={a?.trueFalseAnswer === false}
                  disabled
                  readOnly
                />
              </>
            )}

            {q.type === "Fill in the Blank" && (
              <div>
                <Form.Control
                  value={a?.blankAnswer || ""}
                  disabled
                  className={isCorrect ? "border-success" : "border-danger"}
                />
                {showCorrect && !isCorrect && q.blanks && (
                  <div className="text-success small mt-1">
                    Correct answer(s): {q.blanks.join(", ")}
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
        {isStudent && quiz.multipleAttempts && attemptsRemaining > 0 && (
          <Button
            variant="danger"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}
          >
            Retake Quiz ({attemptsRemaining} attempt
            {attemptsRemaining !== 1 ? "s" : ""} remaining)
          </Button>
        )}
      </div>
    </div>
  );
}
