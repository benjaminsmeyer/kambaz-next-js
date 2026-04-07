/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { RootState } from "@/app/(kambaz)/store";
import {
  findQuizById,
  getAttempts,
  getLatestAttempt,
  Quiz,
  QuizAttempt,
} from "../client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const canEdit = ["FACULTY", "TA", "ADMIN"].includes(currentUser?.role);
  const isStudent = currentUser?.role === "STUDENT";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!qid) return;
      try {
        const q = await findQuizById(qid as string);
        setQuiz(q);
        if (isStudent) {
          try {
            const allAttempts = await getAttempts(qid as string);
            setAttempts(allAttempts);
          } catch {
            setAttempts([]);
          }
          try {
            const latest = await getLatestAttempt(qid as string);
            setLatestAttempt(latest);
          } catch {
            // no latest attempt found - sends a 404 which is expected if the student hasn't taken the quiz yet
            setLatestAttempt(null);
          }
        }
      } catch (err) {
        console.error("Failed to load quiz", err);
      }
    };
    load();
  }, [qid, isStudent]);

  if (!quiz) return <div className="p-4">Loading...</div>;

  const attemptsAllowed = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const attemptsRemaining = attemptsAllowed - attempts.length;
  const isQuizClosed = (
    (quiz.availableDate && new Date() < new Date(quiz.availableDate)) 
    ||(quiz.dueDate && new Date() > new Date(quiz.dueDate)) 
    || (quiz.untilDate && new Date() > new Date(quiz.untilDate))
  );
  const canStart = attemptsRemaining > 0 && !isQuizClosed;

  const formatDate = (d?: string) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div id="wd-quiz-details" className="p-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <h2 className="mb-0">{quiz.title}</h2>
        {canEdit && (
          <>
            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}/preview`)
              }
            >
              Preview
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
            >
              Edit
            </Button>
          </>
        )}
      </div>

      {canEdit && (
        <>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: quiz.description || "" }}
          />
          <table className="table table-bordered w-75">
            <tbody>
              <tr>
                <td className="fw-bold">Quiz Type</td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td className="fw-bold">Points</td>
                <td>{quiz.points}</td>
              </tr>
              <tr>
                <td className="fw-bold">Assignment Group</td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td className="fw-bold">Shuffle Answers</td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Time Limit</td>
                <td>
                  {quiz.timeLimit > 0
                    ? `${quiz.timeLimit} Minutes`
                    : "No Limit"}
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Multiple Attempts</td>
                <td>
                  {quiz.multipleAttempts
                    ? `Yes — ${quiz.howManyAttempts} attempts`
                    : "No"}
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Show Correct Answers</td>
                <td>{quiz.showCorrectAnswers || "—"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Access Code</td>
                <td>{quiz.accessCode || "None"}</td>
              </tr>
              <tr>
                <td className="fw-bold">One Question at a Time</td>
                <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Webcam Required</td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Lock Questions After Answering</td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Due</td>
                <td>{formatDate(quiz.dueDate)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Available From</td>
                <td>{formatDate(quiz.availableDate)}</td>
              </tr>
              <tr>
                <td className="fw-bold">Until</td>
                <td>{formatDate(quiz.untilDate)}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {isStudent && (
        <div>
          <p>{quiz.description}</p>
          <ul className="list-unstyled mb-4">
            <li>
              <strong>Points:</strong> {quiz.points}
            </li>
            <li>
              <strong>Questions:</strong> {quiz.numberOfQuestions}
            </li>
            <li>
              <strong>Time Limit:</strong>{" "}
              {quiz.timeLimit > 0 ? `${quiz.timeLimit} Minutes` : "No Limit"}
            </li>
            <li>
              <strong>Attempts Allowed:</strong> {attemptsAllowed}
            </li>
            <li>
              <strong>Attempts Used:</strong> {attempts.length}
            </li>
          </ul>

          {latestAttempt && (
            <div className="alert alert-info mb-3">
              Latest score: {latestAttempt.score} / {latestAttempt.totalPoints}{" "}
              pts (Attempt {latestAttempt.attemptNumber})
            </div>
          )}

          {canStart ? (
            <Button
              variant="danger"
              onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}
            >
              {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
            </Button>
          ) : (
            <div className="alert alert-warning">
              {isQuizClosed && "This quiz is not available."}
              {attemptsAllowed > 1 && !isQuizClosed && `You have used all ${attemptsAllowed} attempt(s) for this quiz.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
