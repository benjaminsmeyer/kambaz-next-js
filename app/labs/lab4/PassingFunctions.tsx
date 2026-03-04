"use client";
// function passed in as a parameter
// invoking function with no arguments

export default function PassingFunctions({
  theFunction,
}: {
  theFunction: () => void;
}) {
  return (
    <div>
      <h2>Passing Functions</h2>
      <button onClick={theFunction} className="btn btn-primary">
        Invoke the Function
      </button>
      <hr />
    </div>
  );
}
