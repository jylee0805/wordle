import Guess from "./Guess";
import Keyboard from "./Keyboard";
import { useReducer, useEffect } from "react";
import React from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5Kar1Gj6u2IO1T8GEcd7c9EXyumo6-SY",
  authDomain: "wordle-25992.firebaseapp.com",
  projectId: "wordle-25992",
  storageBucket: "wordle-25992.appspot.com",
  messagingSenderId: "312087304950",
  appId: "1:312087304950:web:2902c3215f33452ae96ad7",
  measurementId: "G-4QJ6P2SY2X",
};

interface State {
  inputs: string[][];
  colors: string[][];
  answer: string[];
  status: string;
  currentRow: number;
}

const initial: State = {
  inputs: Array(6).fill([]),
  colors: Array(6).fill(Array(5).fill("bg-white")),
  answer: ["D", "E", "L", "A", "Y"],
  status: "play",
  currentRow: 0,
};

export type Action = { type: "updateInput"; payload: { input: string } } | { type: "deleteInput" } | { type: "checkAnswer" } | { type: "setAnswer"; payload: { answer: string[] } } | { type: "restart" };

const word_length = 5;
const guess_times = 5;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setAnswer": {
      let setAnswer = Array.from(action.payload.answer);
      console.log(setAnswer);
      if (state.status != "play") return state;
      return { ...state, answer: setAnswer };
    }
    case "updateInput": {
      let updatedinputs = JSON.parse(JSON.stringify(state.inputs));

      if (updatedinputs[state.currentRow].length >= word_length) {
        return state;
      }
      updatedinputs[state.currentRow].push(action.payload.input);
      return { ...state, inputs: updatedinputs };
    }
    case "deleteInput": {
      let updatedinputs = JSON.parse(JSON.stringify(state.inputs));
      updatedinputs[state.currentRow].pop();
      return { ...state, inputs: updatedinputs };
    }
    case "checkAnswer": {
      const updatedColors = JSON.parse(JSON.stringify(state.colors)) as string[][];

      if (state.inputs[state.currentRow].length < word_length) {
        console.log("uncomplete");
        return state;
      }
      updatedColors[state.currentRow] = updatedColors[state.currentRow].map((_, index) => {
        if (state.inputs[state.currentRow][index] == state.answer[index]) {
          return "bg-emerald-500";
        } else if (state.answer.includes(state.inputs[state.currentRow][index])) {
          return "bg-yellow-500";
        } else {
          return "bg-gray-300";
        }
      });

      let nextRow = state.currentRow + 1;
      let correct = updatedColors[state.currentRow].filter((correct) => correct === "bg-emerald-500");

      if (correct.length == word_length) return { ...state, colors: updatedColors, currentRow: 0, status: "success" };
      if (nextRow >= guess_times) return { ...state, colors: updatedColors, currentRow: 0, status: "failed" };

      return { ...state, colors: updatedColors, currentRow: nextRow };
    }
    case "restart": {
      return initial;
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initial);

  const app = initializeApp(firebaseConfig);
  const fetchAnswers = async () => {
    const db = getFirestore(app);
    try {
      const querySnapshot = await getDocs(collection(db, "answers"));
      const documents = querySnapshot.docs;

      if (documents.length === 0) {
        throw new Error("No documents found in the collection.");
      }

      const randomDoc = documents[Math.floor(Math.random() * documents.length)];
      let answer = randomDoc.data().answer;
      dispatch({ type: "setAnswer", payload: { answer } });
    } catch (error) {
      console.error("Error getting random document:", error);
    }
  };
  useEffect(() => {
    let didFetch = false;
    if (!didFetch) {
      fetchAnswers();
    }
    return () => {
      didFetch = true;
    };
  }, [state.status]);

  const handleKeyDown = (event: KeyboardEvent) => {
    const input = event.key.toUpperCase();
    if (input.match(/^[A-Z]$/)) {
      dispatch({ type: "updateInput", payload: { input } });
    } else if (input == "BACKSPACE") {
      dispatch({ type: "deleteInput" });
    } else if (input == "ENTER") {
      dispatch({ type: "checkAnswer" });
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="font-sans font-black">
      <h1 className="text-gray-700 text-6xl text-center leading-normal font-permanent">Wordle</h1>
      <Guess state={state} />
      <Keyboard dispatch={dispatch} />
      <div className={`w-dvw h-full bg-neutral-300/95 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col gap-8 ${state.status === "play" ? "hidden" : "block"} `}>
        <p className="text-zinc-500 tracking-widest font-permanent text-8xl text-center leading-normal">{state.status}</p>
        <button className="w-1/3 h-10  bg-gray-950 text-white" onClick={() => dispatch({ type: "restart" })}>
          RESTART
        </button>
      </div>
    </div>
  );
}

export default App;
