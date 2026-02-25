"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export interface Todo {
  id: number;
  title: string;
}

interface TodosContextValue {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
}

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "Learn React" },
    { id: 2, title: "Learn Node" },
  ]);

  const addTodo = (title: string) => {
    if (!title.trim()) return;
    const newTodo: Todo = { id: Date.now(), title: title.trim() };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (todo: Todo) => {
    if (!todo.title.trim()) return;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todo.id ? { ...t, title: todo.title.trim() } : t,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const value = useMemo(
    () => ({ todos, addTodo, updateTodo, deleteTodo }),
    [todos],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used within TodosProvider");
  return ctx;
}
