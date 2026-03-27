/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { RootState } from "@/app/(kambaz)/store";
import {
  findQuizById,
  findQuestionsForQuiz,
  getAttempts,
  submitAttempt,
  Quiz,
  Question,
} from "../../client";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const canEdit = ["FACULTY", "TA", "ADMIN"].includes(currentUser?.role);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [attemptsExhausted, setAttemptsExhausted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (canEdit) {
      router.push(`/courses/${cid}/quizzes/${qid}/preview`);
      return;
    }
    if (!qid) return;
    Promise.all([
      findQuizById(qid as string),
      findQuestionsForQuiz(qid as string),
      getAttempts(qid as string),
    ])
      .then(([q, qs, attempts]) => {
        const allowed = q.multipleAttempts ? q.howManyAttempts : 1;
        if (attempts.length >= allowed) {
          setAttemptsExhausted(true);
          return;
        }
        setQuiz(q);
        setQuestions(qs);
        if (!q.accessCode) setAccessGranted(true);
        if (q.timeLimit > 0) {
          setTimeLeft(q.timeLimit * 60);
        }
      })
      .catch((err) => console.error("Failed to load quiz", err));
  }, [qid, canEdit, cid, router]);

  // Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t !== null ? t - 1 : null));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleAccessCode = () => {
    if (quiz && accessCode === quiz.accessCode) {
      setAccessGranted(true);
      setAccessError("");
    } else {
      setAccessError("Incorrect access code. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowConfirm(false);
    const answersArray = questions.map((q) => ({
      question: q._id,
      ...(answers[q._id] || {}),
    }));
    try {
      const attempt = await submitAttempt(
        qid as string,
        answersArray,
        quiz?.accessCode || undefined,
      );
      router.push(
        `/courses/${cid}/quizzes/${qid}/results?attemptId=${attempt._id}`,
      );
    } catch (err) {
      console.error("Failed to submit", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (attemptsExhausted) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">
          You have used all attempts for this quiz.
        </div>
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (!quiz) return <div className="p-4">Loading...</div>;

  if (quiz.accessCode && !accessGranted) {
    return (
      <div className="p-4" style={{ maxWidth: 400 }}>
        <h4>Access Code Required</h4>
        <Form.Group className="mb-3">
          <Form.Label>Enter the quiz access code:</Form.Label>
          <Form.Control
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAccessCode()}
          />
          {accessError && (
            <div className="text-danger small mt-1">{accessError}</div>
          )}
        </Form.Group>
        <Button variant="danger" onClick={handleAccessCode}>
          Submit
        </Button>
      </div>
    );
  }

  const renderQuestion = (q: Question) => (
    <div key={q._id} className="border rounded p-3 mb-3">
      <div className="d-flex justify-content-between mb-2">
        <strong>{q.title}</strong>
        <span>{q.points} pts</span>
      </div>
      <p>{q.question}</p>

      {q.type === "Multiple Choice" &&
        q.choices.map((c, i) => (
          <Form.Check
            key={i}
            type="radio"
            name={`q-${q._id}`}
            label={c.text}
            checked={answers[q._id]?.selectedChoice === c.text}
            onChange={() =>
              setAnswers({ ...answers, [q._id]: { selectedChoice: c.text } })
            }
          />
        ))}

      {q.type === "True/False" && (
        <>
          <Form.Check
            type="radio"
            name={`q-${q._id}`}
            label="True"
            checked={answers[q._id]?.trueFalseAnswer === true}
            onChange={() =>
              setAnswers({ ...answers, [q._id]: { trueFalseAnswer: true } })
            }
          />
          <Form.Check
            type="radio"
            name={`q-${q._id}`}
            label="False"
            checked={answers[q._id]?.trueFalseAnswer === false}
            onChange={() =>
              setAnswers({ ...answers, [q._id]: { trueFalseAnswer: false } })
            }
          />
        </>
      )}

      {q.type === "Fill in the Blank" && (
        <Form.Control
          value={answers[q._id]?.blankAnswer || ""}
          onChange={(e) =>
            setAnswers({
              ...answers,
              [q._id]: { blankAnswer: e.target.value },
            })
          }
          placeholder="Your answer"
        />
      )}
    </div>
  );

  return (
    <div id="wd-take-quiz" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        {timeLeft !== null && (
          <div
            className={`badge fs-5 ${timeLeft < 60 ? "bg-danger" : "bg-secondary"}`}
          >
            Time: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {quiz.oneQuestionAtATime ? (
        <>
          <div className="text-muted mb-3">
            Question {currentIndex + 1} of {questions.length}
          </div>
          {questions[currentIndex] && renderQuestion(questions[currentIndex])}
          <div className="d-flex gap-2 mt-3">
            <Button
              variant="secondary"
              disabled={currentIndex === 0 || quiz.lockQuestionsAfterAnswering}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              Previous
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button
                variant="secondary"
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next
              </Button>
            ) : (
              <Button variant="danger" onClick={() => setShowConfirm(true)}>
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {questions.map(renderQuestion)}
          <Button variant="danger" onClick={() => setShowConfirm(true)}>
            Submit Quiz
          </Button>
        </>
      )}

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to submit? You cannot change your answers after
          submission.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
