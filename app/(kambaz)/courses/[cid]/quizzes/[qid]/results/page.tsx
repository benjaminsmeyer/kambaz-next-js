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
    (quiz.showCorrectAnswers === "After Due Date" && isPastDue) ||
    (quiz.showCorrectAnswers === "After Last Attempt" && attemptsRemaining === 0);

  // helper to format dates in Canvas style: "Mar 31 at 1:27pm"
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  // duration in minutes between startedAt and submittedAt
  // const durationMin = attempt.startedAt
  //   ? Math.round(
  //       (new Date(attempt.submittedAt).getTime() -
  //         new Date(attempt.startedAt).getTime()) /
  //         60000,
  //     )
  //   : null;

  return (
    <div id="wd-quiz-results" className="p-4" style={{ maxWidth: 800 }}>

      {/* locked notice */}
      {isPastDue && quiz.dueDate && (
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          This quiz was locked {formatDate(quiz.dueDate)}.
        </p>
      )}

      {/* attempt history table */}
      <h3 className="mb-3">Attempt History</h3>
      <table className="w-100 mb-2" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #dee2e6" }}>
            <th style={{ width: 70 }} />
            <th className="pb-1 text-start">Attempt</th>
            <th className="pb-1 text-start">Time</th>
            <th className="pb-1 text-start">Score</th>
          </tr>
        </thead>
        <tbody>
          {allAttempts.map((a, i) => {
            const isLatest = a._id === allAttempts[allAttempts.length - 1]._id;
            const isViewing = a._id === attempt._id;
            // const mins = a.startedAt
            //   ? Math.round(
            //       (new Date(a.submittedAt).getTime() -
            //         new Date(a.startedAt).getTime()) /
            //         60000,
            //     )
            //   : null;
            return (
              <tr
                key={a._id}
                style={{ borderBottom: "1px solid #dee2e6", cursor: "pointer" }}
                onClick={() =>
                  router.push(
                    `/courses/${cid}/quizzes/${qid}/results?attemptId=${a._id}`,
                  )
                }
              >
                <td
                  className="py-2 text-muted"
                  style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: 1 }}
                >
                  {isLatest ? "LATEST" : ""}
                </td>
                <td
                  className="py-2"
                  style={{ color: isViewing ? "#c0392b" : "inherit" }}
                >
                  Attempt {a.attemptNumber ?? i + 1}
                </td>
                <td className="py-2">
                  {"—"}
                  {/* {mins != null ? `${mins} minute${mins !== 1 ? "s" : ""}` : "—"} */}
                </td>
                <td className="py-2">
                  {a.score} out of {a.totalPoints}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr />

      {/* score summary */}
      <div className="mb-4" style={{ fontSize: "0.95rem" }}>
        <div>
          Score for this quiz: <strong>{attempt.score} out of {attempt.totalPoints}</strong>
        </div>
        <div>Submitted {formatDate(attempt.submittedAt)}</div>
        {/* {durationMin != null && (
          <div>This attempt took {durationMin} minute{durationMin !== 1 ? "s" : ""}.</div>
        )} */}
      </div>

      {/* questions */}
      {questions.map((question, idx) => {
        const answer = answerMap.get(String(question._id));
        const isCorrect = answer?.isCorrect ?? false;
        const pointsEarned = answer?.pointsEarned ?? 0;

        return (
          <div
            key={question._id}
            className="mb-4"
            style={{ border: "1px solid #dee2e6", borderRadius: 4, overflow: "hidden" }}
          >
            {/* question header bar */}
            <div
              className="d-flex justify-content-between px-3 py-2"
              style={{ background: "#f5f5f5", borderBottom: "1px solid #dee2e6", fontWeight: 600 }}
            >
              <span>Question {idx + 1}</span>
              <span>
                {isCorrect
                  ? <FaCheckCircle className="text-success me-1" />
                  : <FaTimesCircle className="text-danger me-1" />}
                {pointsEarned} / {question.points} pts
              </span>
            </div>

            {/* question body */}
            <div className="p-3">
              <p>{question.question}</p>

              {/* mark correct answers for Multiple Choice questions */}
              {question.type === "Multiple Choice" &&
                question.choices?.map((choice: Choice, i: number) => (
                  <Form.Check
                    key={i}
                    type="radio"
                    label={
                      <span className={showCorrect && choice.isCorrect ? "text-success fw-bold" : ""}>
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
              {question.type === "True/False" &&
                ([true, false] as const).map((val) => (
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
                ))}

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
          </div>
        );
      })}

      {/* footer buttons */}
      {attemptId && (
        <div className="d-flex gap-2 mt-2">
          <Button
            variant="secondary"
            
            onClick={() => router.push(`/courses/${cid}/quizzes/${quiz._id}`)}
          >
            Back to Quiz
        </Button>
        {isStudent && quiz.multipleAttempts && attemptsRemaining > 0 && !isPastDue && (
          <Button
            variant="danger"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}
          >
            Retake Quiz ({attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining)
          </Button>
        )}
      </div>
    )}
    </div>
  );
}