/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Form, Nav, Tab } from "react-bootstrap";
import { FaTrash } from "react-icons/fa6";
import { RootState } from "@/app/(kambaz)/store";
import { updateQuiz as updateQuizAction } from "../../reducer";
import {
  findQuizById,
  updateQuiz as updateQuizOnServer,
  findQuestionsForQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  Quiz,
  Question,
} from "../../client";

const DEFAULT_QUESTION: Partial<Question> = {
  title: "New Question",
  type: "Multiple Choice",
  points: 1,
  question: "",
  choices: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
  trueFalseAnswer: true,
  blanks: [""],
  order: 0,
};

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const canEdit = ["FACULTY", "TA", "ADMIN"].includes(currentUser?.role);

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<Partial<Quiz>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftQuestion, setDraftQuestion] = useState<Partial<Question>>({});

  useEffect(() => {
    if (!qid) return;
    findQuizById(qid as string)
      .then(setQuiz)
      .catch((err) => console.error("Failed to load quiz", err));
  }, [qid]);

  useEffect(() => {
    if (activeTab !== "questions" || !qid) return;
    findQuestionsForQuiz(qid as string)
      .then(setQuestions)
      .catch((err) => console.error("Failed to load questions", err));
  }, [activeTab, qid]);

  if (!canEdit) {
    router.push(`/courses/${cid}/quizzes`);
    return null;
  }

  const handleSaveDetails = async (publish?: boolean) => {
    if (!qid) return;
    try {
      const payload = publish ? { ...quiz, published: true } : quiz;
      const updated = await updateQuizOnServer(qid as string, payload);
      dispatch(updateQuizAction(updated));
      router.push(
        publish ? `/courses/${cid}/quizzes` : `/courses/${cid}/quizzes/${qid}`,
      );
    } catch (err) {
      console.error("Failed to save quiz", err);
    }
  };

  const handleEditQuestion = (q: Question) => {
    setEditingId(q._id);
    setDraftQuestion({ ...q });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftQuestion({});
  };

  const handleUpdateQuestion = async () => {
    if (!qid) return;
    try {
      let saved: Question;
      if (editingId && editingId.startsWith("NEW_")) {
        saved = await createQuestion(qid as string, draftQuestion);
        setQuestions((prev) =>
          prev.map((q) => (q._id === editingId ? saved : q)),
        );
      } else if (editingId) {
        saved = await updateQuestion(editingId, draftQuestion);
        setQuestions((prev) =>
          prev.map((q) => (q._id === editingId ? saved : q)),
        );
      }
      setEditingId(null);
      setDraftQuestion({});
      // Refresh quiz to get updated points
      const updatedQuiz = await findQuizById(qid as string);
      setQuiz(updatedQuiz);
    } catch (err) {
      console.error("Failed to save question", err);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      const updatedQuiz = await findQuizById(qid as string);
      setQuiz(updatedQuiz);
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  const handleAddQuestion = () => {
    const tempId = `NEW_${Date.now()}`;
    const newQ: Question = {
      ...DEFAULT_QUESTION,
      _id: tempId,
      quiz: qid as string,
      order: questions.length,
    } as Question;
    setQuestions((prev) => [...prev, newQ]);
    setEditingId(tempId);
    setDraftQuestion({ ...newQ });
  };

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const updateDraftChoice = (index: number, field: string, value: any) => {
    setDraftQuestion((prev) => {
      const choices = [...(prev.choices || [])];
      choices[index] = { ...choices[index], [field]: value };
      // If marking as correct, unmark others
      if (field === "isCorrect" && value === true) {
        return {
          ...prev,
          choices: choices.map((c, i) => ({ ...c, isCorrect: i === index })),
        };
      }
      return { ...prev, choices };
    });
  };

  const addChoice = () => {
    setDraftQuestion((prev) => ({
      ...prev,
      choices: [...(prev.choices || []), { text: "", isCorrect: false }],
    }));
  };

  const removeChoice = (index: number) => {
    setDraftQuestion((prev) => ({
      ...prev,
      choices: (prev.choices || []).filter((_, i) => i !== index),
    }));
  };

  const addBlank = () => {
    setDraftQuestion((prev) => ({
      ...prev,
      blanks: [...(prev.blanks || []), ""],
    }));
  };

  const updateBlank = (index: number, value: string) => {
    setDraftQuestion((prev) => {
      const blanks = [...(prev.blanks || [])];
      blanks[index] = value;
      return { ...prev, blanks };
    });
  };

  const removeBlank = (index: number) => {
    setDraftQuestion((prev) => ({
      ...prev,
      blanks: (prev.blanks || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div id="wd-quiz-editor" className="p-4">
      <Tab.Container
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "details")}
      >
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* ── DETAILS TAB ── */}
          <Tab.Pane eventKey="details">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Title</Form.Label>
                <Form.Control
                  value={quiz.title || ""}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  id="wd-name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={quiz.description || ""}
                  onChange={(e) =>
                    setQuiz({ ...quiz, description: e.target.value })
                  }
                  id="wd-description"
                />
              </Form.Group>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Quiz Type</Form.Label>
                    <Form.Select
                      value={quiz.quizType || "Graded Quiz"}
                      onChange={(e) =>
                        setQuiz({ ...quiz, quizType: e.target.value as any })
                      }
                      id="wd-quiz-type"
                    >
                      <option>Graded Quiz</option>
                      <option>Practice Quiz</option>
                      <option>Graded Survey</option>
                      <option>Ungraded Survey</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Assignment Group
                    </Form.Label>
                    <Form.Select
                      value={quiz.assignmentGroup || "Quizzes"}
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          assignmentGroup: e.target.value as any,
                        })
                      }
                      id="wd-assignment-group"
                    >
                      <option>Quizzes</option>
                      <option>Exams</option>
                      <option>Assignments</option>
                      <option>Project</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Shuffle Answers"
                  checked={quiz.shuffleAnswers ?? true}
                  onChange={(e) =>
                    setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
                  }
                  id="wd-shuffle-answers"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Time Limit"
                  checked={(quiz.timeLimit ?? 0) > 0}
                  onChange={(e) =>
                    setQuiz({ ...quiz, timeLimit: e.target.checked ? 20 : 0 })
                  }
                  id="wd-time-limit-check"
                />
                {(quiz.timeLimit ?? 0) > 0 && (
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <Form.Control
                      type="number"
                      min={1}
                      value={quiz.timeLimit || 20}
                      onChange={(e) =>
                        setQuiz({ ...quiz, timeLimit: Number(e.target.value) })
                      }
                      style={{ width: 100 }}
                      id="wd-time-limit"
                    />
                    <span>Minutes</span>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Multiple Attempts"
                  checked={quiz.multipleAttempts ?? false}
                  onChange={(e) =>
                    setQuiz({ ...quiz, multipleAttempts: e.target.checked })
                  }
                  id="wd-multiple-attempts"
                />
                {quiz.multipleAttempts && (
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <Form.Label className="mb-0">How Many Attempts:</Form.Label>
                    <Form.Control
                      type="number"
                      min={1}
                      value={quiz.howManyAttempts || 2}
                      onChange={(e) =>
                        setQuiz({
                          ...quiz,
                          howManyAttempts: Number(e.target.value),
                        })
                      }
                      style={{ width: 80 }}
                      id="wd-how-many-attempts"
                    />
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Show Correct Answers
                </Form.Label>
                <Form.Control
                  value={quiz.showCorrectAnswers || ""}
                  onChange={(e) =>
                    setQuiz({ ...quiz, showCorrectAnswers: e.target.value })
                  }
                  placeholder="e.g. Immediately, After Due Date"
                  id="wd-show-correct-answers"
                />
              </Form.Group>{" "}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Access Code</Form.Label>
                <Form.Control
                  value={quiz.accessCode || ""}
                  onChange={(e) =>
                    setQuiz({ ...quiz, accessCode: e.target.value })
                  }
                  id="wd-access-code"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="One Question at a Time"
                  checked={quiz.oneQuestionAtATime ?? false}
                  onChange={(e) =>
                    setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })
                  }
                  id="wd-one-question-at-a-time"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Webcam Required"
                  checked={quiz.webcamRequired ?? false}
                  onChange={(e) =>
                    setQuiz({ ...quiz, webcamRequired: e.target.checked })
                  }
                  id="wd-webcam-required"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Lock Questions After Answering"
                  checked={quiz.lockQuestionsAfterAnswering ?? false}
                  onChange={(e) =>
                    setQuiz({
                      ...quiz,
                      lockQuestionsAfterAnswering: e.target.checked,
                    })
                  }
                  id="wd-lock-questions-after-answering"
                />
              </Form.Group>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Due Date</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={quiz.dueDate ? quiz.dueDate.slice(0, 16) : ""}
                      onChange={(e) =>
                        setQuiz({ ...quiz, dueDate: e.target.value })
                      }
                      id="wd-due-date"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Available From</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={
                        quiz.availableDate
                          ? quiz.availableDate.slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setQuiz({ ...quiz, availableDate: e.target.value })
                      }
                      id="wd-available-from"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Until</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      value={quiz.untilDate ? quiz.untilDate.slice(0, 16) : ""}
                      onChange={(e) =>
                        setQuiz({ ...quiz, untilDate: e.target.value })
                      }
                      id="wd-until"
                    />
                  </Form.Group>
                </div>
              </div>
              <hr />
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/courses/${cid}/quizzes`)}
                >
                  Cancel
                </Button>
                <Button variant="secondary" onClick={() => handleSaveDetails()}>
                  Save
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleSaveDetails(true)}
                >
                  Save and Publish
                </Button>
              </div>
            </Form>
          </Tab.Pane>

          {/* ── QUESTIONS TAB ── */}
          <Tab.Pane eventKey="questions">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Total Points: {totalPoints}</h5>
            </div>

            {questions.map((q) =>
              editingId === q._id ? (
                <div key={q._id} className="border rounded p-3 mb-3">
                  <Form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <Form.Group>
                          <Form.Label className="fw-bold">Title</Form.Label>
                          <Form.Control
                            value={draftQuestion.title || ""}
                            onChange={(e) =>
                              setDraftQuestion({
                                ...draftQuestion,
                                title: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">Type</Form.Label>
                          <Form.Select
                            value={draftQuestion.type || "Multiple Choice"}
                            onChange={(e) =>
                              setDraftQuestion({
                                ...draftQuestion,
                                type: e.target.value as any,
                                choices:
                                  e.target.value === "Multiple Choice"
                                    ? [
                                        { text: "", isCorrect: true },
                                        { text: "", isCorrect: false },
                                      ]
                                    : [],
                                trueFalseAnswer:
                                  e.target.value === "True/False"
                                    ? true
                                    : undefined,
                                blanks:
                                  e.target.value === "Fill in the Blank"
                                    ? [""]
                                    : [],
                              })
                            }
                          >
                            <option>Multiple Choice</option>
                            <option>True/False</option>
                            <option>Fill in the Blank</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="col-md-3">
                        <Form.Group>
                          <Form.Label className="fw-bold">Points</Form.Label>
                          <Form.Control
                            type="number"
                            min={0}
                            value={draftQuestion.points ?? 1}
                            onChange={(e) =>
                              setDraftQuestion({
                                ...draftQuestion,
                                points: Number(e.target.value),
                              })
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Question Text</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={draftQuestion.question || ""}
                        onChange={(e) =>
                          setDraftQuestion({
                            ...draftQuestion,
                            question: e.target.value,
                          })
                        }
                      />
                    </Form.Group>

                    {draftQuestion.type === "Multiple Choice" && (
                      <div className="mb-3">
                        <Form.Label className="fw-bold">Answers</Form.Label>
                        {(draftQuestion.choices || []).map((choice, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center gap-2 mb-2"
                          >
                            <Form.Check
                              type="radio"
                              name="correct-choice"
                              checked={choice.isCorrect}
                              onChange={() =>
                                updateDraftChoice(i, "isCorrect", true)
                              }
                              title="Mark as correct"
                            />
                            <Form.Control
                              value={choice.text}
                              onChange={(e) =>
                                updateDraftChoice(i, "text", e.target.value)
                              }
                              placeholder={`Choice ${i + 1}`}
                            />
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => removeChoice(i)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={addChoice}
                        >
                          + Add Another Answer
                        </Button>
                      </div>
                    )}

                    {draftQuestion.type === "True/False" && (
                      <div className="mb-3">
                        <Form.Label className="fw-bold">
                          Correct Answer
                        </Form.Label>
                        <div>
                          <Form.Check
                            type="radio"
                            name="tf-answer"
                            label="True"
                            checked={draftQuestion.trueFalseAnswer === true}
                            onChange={() =>
                              setDraftQuestion({
                                ...draftQuestion,
                                trueFalseAnswer: true,
                              })
                            }
                          />
                          <Form.Check
                            type="radio"
                            name="tf-answer"
                            label="False"
                            checked={draftQuestion.trueFalseAnswer === false}
                            onChange={() =>
                              setDraftQuestion({
                                ...draftQuestion,
                                trueFalseAnswer: false,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {draftQuestion.type === "Fill in the Blank" && (
                      <div className="mb-3">
                        <Form.Label className="fw-bold">
                          Accepted Answers
                        </Form.Label>
                        {(draftQuestion.blanks || []).map((blank, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center gap-2 mb-2"
                          >
                            <Form.Control
                              value={blank}
                              onChange={(e) => updateBlank(i, e.target.value)}
                              placeholder={`Accepted answer ${i + 1}`}
                            />
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => removeBlank(i)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={addBlank}
                        >
                          + Add Another Answer
                        </Button>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <Button variant="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={handleUpdateQuestion}>
                        Update Question
                      </Button>
                    </div>
                  </Form>
                </div>
              ) : (
                <div
                  key={q._id}
                  className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span className="fw-bold">{q.title}</span>
                    <span className="text-muted ms-2">({q.type})</span>
                    <span className="ms-2">{q.points} pts</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditQuestion(q)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ),
            )}

            <Button
              variant="secondary"
              className="mb-4"
              onClick={handleAddQuestion}
            >
              + New Question
            </Button>

            <hr />
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={() => router.push(`/courses/${cid}/quizzes`)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}
              >
                Save
              </Button>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
