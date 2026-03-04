import { create } from "zustand";

export interface Todo {
  id: number;
  title: string;
}

interface TodoState {
  todos: Todo[];
  addTodo: (title: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [
    { id: 1, title: "Learn React" },
    { id: 2, title: "Learn Node" },
  ],
  addTodo: (title) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) return state;
      const newTodo: Todo = { id: Date.now(), title: trimmed };
      return { todos: [newTodo, ...state.todos] };
    }),
  updateTodo: (todo) =>
    set((state) => {
      const trimmed = todo.title.trim();
      if (!trimmed) return state;
      return {
        todos: state.todos.map((t) =>
          t.id === todo.id ? { ...t, title: trimmed } : t,
        ),
      };
    }),
  deleteTodo: (id) =>
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
}));
