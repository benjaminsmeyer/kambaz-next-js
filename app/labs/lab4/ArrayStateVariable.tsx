/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "./store";
export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const [array, setArray] = useState<{ id: number; value: number }[]>([
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
  ]);
  const addElement = () => {
    const newId = array.length > 0 ? Math.max(...array.map((item) => item.id)) + 1 : 1;
    const newValue = Math.floor(Math.random() * 100);
    setArray([...array, { id: newId, value: newValue }]);
  };
  const deleteElement = (id: number) => {
    setArray(array.filter((item) => item.id !== id));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button onClick={addElement}>Add Element</button>
      <ul>
        {array.map((item) => (
          <li key={item.id}>
            {item.value}
            <button onClick={() => deleteElement(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>{todo.title}</ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
