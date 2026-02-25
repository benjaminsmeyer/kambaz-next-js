"use client";

import React, { useState } from "react";
import { Todo, useTodoStore } from "./useTodoStore";

export default function ZustandTodoList() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const onAdd = () => {
    addTodo(title);
    setTitle("");
    setEditingId(null);
  };

  const onUpdate = () => {
    if (editingId === null) return;
    updateTodo({ id: editingId, title });
    setTitle("");
    setEditingId(null);
  };

  const onEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
  };

  return (
    <div className="border rounded p-3">
      <h3>Todo List</h3>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          value={title}
          placeholder="New todo"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="btn btn-warning"
          onClick={onUpdate}
          disabled={editingId === null}
        >
          Update
        </button>
        <button className="btn btn-success" onClick={onAdd}>
          Add
        </button>
      </div>

      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{todo.title}</span>
            <span className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onEdit(todo)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
