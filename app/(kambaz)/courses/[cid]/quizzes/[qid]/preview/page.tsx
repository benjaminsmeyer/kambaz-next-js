/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { RootState } from "@/app/(kambaz)/store";
import {
    findQuizById,
    findQuestionsForQuiz,
    Quiz,
    Question,
} from "../../client";

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const router = useRouter();

    const { currentUser } = useSelector(
        (state: RootState) => state.accountReducer,
    ) as any;
    const canEdit = ["FACULTY", "TA", "ADMIN"].includes(currentUser?.role);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!canEdit) {
            router.push(`/courses/${cid}/quizzes/${qid}`);
            return;
        }
        if (!qid) return;
        Promise.all([
            findQuizById(qid as string),
            findQuestionsForQuiz(qid as string),
        ])
            .then(([q, qs]) => {
                setQuiz(q);
                setQuestions(qs);
            })
            .catch((err) => console.error("Failed to load preview", err));
    }, [qid, canEdit, cid, router]);

    const handleSubmit = () => {
        const graded = questions.map((q) => {
            const a = answers[q._id] ?? {};
            let isCorrect = false;
            if (q.type === "Multiple Choice") {
                const correct = q.choices.find((c) => c.isCorrect);
                isCorrect = correct != null && correct.text === a.selectedChoice;
            } else if (q.type === "True/False") {
                isCorrect = a.trueFalseAnswer === q.trueFalseAnswer;
            } else if (q.type === "Fill in the Blank") {
                const submitted = (a.blankAnswer ?? "").toLowerCase().trim();
                isCorrect =
                    submitted.length > 0 &&
                    (q.blanks ?? []).some((b) => b.toLowerCase().trim() === submitted);
            }
            return {
                question: q,
                answer: a,
                isCorrect,
                pointsEarned: isCorrect ? q.points : 0,
            };
        });
        setResults(graded);
        setSubmitted(true);
        setCurrentIndex(0);
    };

    if (!quiz) return <div className="p-4">Loading...</div>;

    const score = results.reduce((sum, r) => sum + r.pointsEarned, 0);
    const total = questions.reduce((sum, q) => sum + q.points, 0);

    return (
        <div id="wd-quiz-preview" className="p-4">
            <div className="alert alert-warning">
                ⚠️ This is a preview of the published version of the quiz
            </div>

            <h2 className="mb-3">{quiz.title}</h2>

            {!submitted && questions.length > 0 && (() => {
                const q = questions[currentIndex];
                return (
                    <>
                        {/* Question jump bar */}
                        <div className="d-flex gap-1 flex-wrap mb-3">
                            {questions.map((question, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={
                                        i === currentIndex
                                            ? "primary"
                                            : answers[question._id] !== undefined
                                                ? "success"
                                                : "outline-secondary"
                                    }
                                    onClick={() => setCurrentIndex(i)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        {/* Current question */}
                        <div className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <strong>
                                    Question {currentIndex + 1}: {q.title}
                                </strong>
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
                                            setAnswers({
                                                ...answers,
                                                [q._id]: { selectedChoice: c.text },
                                            })
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
                                            setAnswers({
                                                ...answers,
                                                [q._id]: { trueFalseAnswer: true },
                                            })
                                        }
                                    />
                                    <Form.Check
                                        type="radio"
                                        name={`q-${q._id}`}
                                        label="False"
                                        checked={answers[q._id]?.trueFalseAnswer === false}
                                        onChange={() =>
                                            setAnswers({
                                                ...answers,
                                                [q._id]: { trueFalseAnswer: false },
                                            })
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

                        {/* Prev / Next / Submit navigation */}
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                variant="outline-secondary"
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((i) => i - 1)}
                            >
                                ← Previous
                            </Button>
                            {currentIndex < questions.length - 1 ? (
                                <Button
                                    variant="outline-primary"
                                    onClick={() => setCurrentIndex((i) => i + 1)}
                                >
                                    Next →
                                </Button>
                            ) : (
                                <Button variant="danger" onClick={handleSubmit}>
                                    Submit Quiz
                                </Button>
                            )}
                        </div>
                    </>
                );
            })()}

            {submitted && results.length > 0 && (() => {
                const r = results[currentIndex];
                return (
                    <>
                        <div className="alert alert-info mb-4">
                            <strong>
                                Score: {score} / {total} pts
                            </strong>
                        </div>

                        {/* Question jump bar for results */}
                        <div className="d-flex gap-1 flex-wrap mb-3">
                            {results.map((_, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={i === currentIndex ? "primary" : "success"}
                                    onClick={() => setCurrentIndex(i)}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        {/* Current result */}
                        <div className="border rounded p-3 mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <strong>
                                    Question {currentIndex + 1}: {r.question.title}
                                </strong>
                                <span>
                                    {r.isCorrect ? (
                                        <FaCheckCircle className="text-success me-1" />
                                    ) : (
                                        <FaTimesCircle className="text-danger me-1" />
                                    )}
                                    {r.pointsEarned} / {r.question.points} pts
                                </span>
                            </div>
                            <p>{r.question.question}</p>

                            {r.question.type === "Multiple Choice" &&
                                r.question.choices.map((c: any, i: number) => (
                                    <Form.Check
                                        key={i}
                                        type="radio"
                                        name={`result-${r.question._id}`}
                                        label={
                                            <span
                                                className={c.isCorrect ? "text-success fw-bold" : ""}
                                            >
                                                {c.text}
                                                {c.isCorrect && " ✓"}
                                            </span>
                                        }
                                        checked={r.answer.selectedChoice === c.text}
                                        disabled
                                    />
                                ))}

                            {r.question.type === "True/False" && (
                                <>
                                    <Form.Check
                                        type="radio"
                                        label={
                                            <span
                                                className={
                                                    r.question.trueFalseAnswer === true
                                                        ? "text-success fw-bold"
                                                        : ""
                                                }
                                            >
                                                True{r.question.trueFalseAnswer === true && " ✓"}
                                            </span>
                                        }
                                        checked={r.answer.trueFalseAnswer === true}
                                        disabled
                                    />
                                    <Form.Check
                                        type="radio"
                                        label={
                                            <span
                                                className={
                                                    r.question.trueFalseAnswer === false
                                                        ? "text-success fw-bold"
                                                        : ""
                                                }
                                            >
                                                False{r.question.trueFalseAnswer === false && " ✓"}
                                            </span>
                                        }
                                        checked={r.answer.trueFalseAnswer === false}
                                        disabled
                                    />
                                </>
                            )}

                            {r.question.type === "Fill in the Blank" && (
                                <Form.Control
                                    value={r.answer.blankAnswer || ""}
                                    disabled
                                    className={r.isCorrect ? "border-success" : "border-danger"}
                                />
                            )}
                        </div>

                        {/* Prev / Next navigation for results */}
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                variant="outline-secondary"
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((i) => i - 1)}
                            >
                                ← Previous
                            </Button>
                            <Button
                                variant="outline-primary"
                                disabled={currentIndex === results.length - 1}
                                onClick={() => setCurrentIndex((i) => i + 1)}
                            >
                                Next →
                            </Button>
                        </div>
                    </>
                );
            })()}

            <div className="d-flex gap-2 mt-4">
                <Button
                    variant="secondary"
                    onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
                >
                    Keep Editing This Quiz
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
                >
                    Edit Quiz
                </Button>
            </div>
        </div>
    );
}
