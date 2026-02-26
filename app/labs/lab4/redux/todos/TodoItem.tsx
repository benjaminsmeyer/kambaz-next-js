import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroupItem } from "react-bootstrap";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TodoItem({ todo }: { todo: any }) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem key={todo.id}>
      <Button
        onClick={() => dispatch(deleteTodo(todo.id))}
        id={`wd-delete-todo-click-${todo.id}`}
      >
        Delete
      </Button>
      <Button onClick={() => dispatch(setTodo(todo))} id={`wd-set-todo-click-${todo.id}`}>
        Edit
      </Button>
      {todo.title}
    </ListGroupItem>
  );
}
