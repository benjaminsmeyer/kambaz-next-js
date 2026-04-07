/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
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

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(new Date());


  useEffect(() => {
    if (!qid) return;
    const load = async () => {
      try {
        const [quiz, questions, attempts] = await Promise.all([
          findQuizById(qid as string),
          findQuestionsForQuiz(qid as string),
          getAttempts(qid as string),
        ]);

        // redirect non-students away
        if (currentUser?.role !== "STUDENT") {
          router.push(`/courses/${cid}/quizzes/${qid}`);
          return;
        }
        // check availability
        setStartedAt(new Date());
        console.log("checking availability with startedAt", startedAt);
        if (quiz.availableDate && startedAt < new Date(quiz.availableDate)) {
          setBlocked("This quiz is not yet available.");
          return;
        }
        if (quiz.untilDate && startedAt > new Date(quiz.untilDate) || quiz.dueDate && startedAt > new Date(quiz.dueDate)) {
          setBlocked("This quiz is no longer available.");
          return;
        }
        // check attempts remaining
        const attemptsAllowed = quiz.multipleAttempts ? (quiz.howManyAttempts ?? 1) : 1;
        if (attempts.length >= attemptsAllowed) {
          setBlocked("You have used all of your attempts for this quiz.");
          return;
        }

        setQuiz(quiz);
        setQuestions(questions);
      } catch (err) {
        console.error("Failed to load quiz", err);
      }
    };
    load();
  }, [qid, cid, currentUser, router]);

  const setAnswer = (qid: string, value: any) =>
    setAnswers((prev) => ({ ...prev, [qid]: value }));

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const payload = questions.map((q) => {
        const a = answers[q._id] ?? {};
        return {
          question: q._id,
          selectedChoice: a.selectedChoice,
          trueFalseAnswer: a.trueFalseAnswer,
          blankAnswer: a.blankAnswer,
        };
      });
      console.log("submitting attempt with payload", payload, "and startedAt", startedAt.toISOString());
      const attempt = await submitAttempt(qid as string, payload, startedAt.toISOString());
      router.push(`/courses/${cid}/quizzes/${qid}/results?attemptId=${attempt._id}`);
    } catch (err) {
      console.error("Failed to submit quiz", err);
      setSubmitting(false);
    }
  };

  if (blocked) return (
    <div className="p-4">
      <div className="alert alert-warning">{blocked}</div>
      <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
        Back to Quizzes
      </Button>
    </div>
  );

  if (!quiz) return <div className="p-4">Loading...</div>;

  return (
    <div id="wd-quiz-take" className="p-4">
      <h2 className="mb-1">{quiz.title}</h2>
      {quiz.description && <p className="text-muted mb-3">{quiz.description}</p>}

      {questions.map((q, idx) => (
        <div key={q._id} className="border rounded p-3 mb-3">
          <div className="d-flex justify-content-between mb-2">
            <strong>Question {idx + 1}: {q.title}</strong>
            <span>{q.points} pts</span>
          </div>
          <p>{q.question}</p>

          {q.type === "Multiple Choice" &&
            q.choices?.map((c: any, i: number) => (
              <Form.Check
                key={i}
                type="radio"
                name={`q-${q._id}`}
                label={c.text}
                checked={answers[q._id]?.selectedChoice === c.text}
                onChange={() => setAnswer(q._id, { selectedChoice: c.text })}
              />
            ))}

          {q.type === "True/False" &&
            ([true, false] as const).map((val) => (
              <Form.Check
                key={String(val)}
                type="radio"
                name={`q-${q._id}`}
                label={val ? "True" : "False"}
                checked={answers[q._id]?.trueFalseAnswer === val}
                onChange={() => setAnswer(q._id, { trueFalseAnswer: val })}
              />
            ))}

          {q.type === "Fill in the Blank" && (
            <Form.Control
              value={answers[q._id]?.blankAnswer ?? ""}
              onChange={(e) => setAnswer(q._id, { blankAnswer: e.target.value })}
              placeholder="Your answer"
            />
          )}
        </div>
      ))}

      <div className="d-flex gap-2 mt-4">
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}