import React from "react";
import { Action } from "./App";

interface KeyboardProps {
  dispatch: React.Dispatch<Action>;
}

const Keyboard = ({ dispatch }: KeyboardProps) => {
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Delete", "Z", "X", "C", "V", "B", "N", "M", "Enter"];

  const handleButtonClick = (input: string) => {
    console.log(typeof input);

    if (input == "Delete") {
      dispatch({ type: "deleteInput" });
    } else if (input == "Enter") {
      dispatch({ type: "checkAnswer" });
    } else {
      dispatch({ type: "updateInput", payload: { input } });
    }
  };

  return (
    <div className="w-1/2 h-36 font-sans font-black mx-auto mt-8 grid grid-cols-10 grid-rows-3 text-center gap-1">
      {row1.map((item, index) => (
        <button key={index} onClick={() => handleButtonClick(item)} className="bg-slate-300 flex items-center justify-center rounded-md">
          {item}
        </button>
      ))}

      <div className="grid grid-cols-9 col-span-10 gap-1 ">
        {row2.map((item, index) => (
          <div key={index} onClick={() => handleButtonClick(item)} className="bg-slate-300 flex items-center justify-center rounded-md">
            {item}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1.5fr_repeat(7,_1fr)_1.5fr] col-span-10 gap-1">
        {row3.map((item, index) => (
          <div key={index} onClick={() => handleButtonClick(item)} className="bg-slate-300 flex items-center justify-center rounded-md">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
