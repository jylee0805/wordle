import React from "react";
interface Props {
  state: {
    currentRow: number;
    inputs: string[][];
    colors: string[][];
  };
  rowIndex: number;
}

const GuessRow = ({ state, rowIndex }: Props) => {
  return (
    <div className="w-fit h-14 flex gap-2 mb-2 ">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={`w-14 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl ${state.colors[rowIndex][index]}`}>
          {state.inputs[rowIndex][index]}
        </div>
      ))}
    </div>
  );
};

export default GuessRow;
