"use client";

import BooleanStateVariables from "./BooleanStateVariables";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import ReduxExamples from "./redux/page";
import Link from "next/link";
import store from "./store";
import { Provider } from "react-redux";
import ReactContextExamples from "./react-context/page";

export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }
  return (
    <Provider store={store}>
      <div id="wd-lab4">
        <h3>Lab 4</h3>
        <hr />
        <ClickEvent />
        <PassingDataOnEvent />
        <PassingFunctions theFunction={sayHello} />
        <Counter />
        <BooleanStateVariables />
        <StringStateVariables />
        <DateStateVariable />
        <ObjectStateVariable />
        <ArrayStateVariable />
        <ParentStateComponent />
        <Link href="./lab4/redux">Redux Examples</Link>
        <hr />
        <ReduxExamples />
        <Link href="./lab4/react-context">React Context Examples</Link>
        <hr />
        <ReactContextExamples />
      </div>
    </Provider>
  );
}
