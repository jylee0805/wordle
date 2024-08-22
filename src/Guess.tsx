import GuessRow from "./GuessRow";
import React from "react";

interface Props {
  state: {
    currentRow: number;
    inputs: string[][];
    colors: string[][];
    status: string;
  };
}

const Guess = ({ state }: Props) => {
  return (
    <>
      <div className="w-fit mx-auto mt-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <GuessRow key={index} state={state} rowIndex={index} />
        ))}
      </div>
    </>
  );
};

export default Guess;
