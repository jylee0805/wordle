import Guess from "./Guess.jsx";
import Keyboard from "./Keyboard.jsx";
import { useReducer, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "wordle-25992.firebaseapp.com",
  projectId: "wordle-25992",
  storageBucket: "wordle-25992.appspot.com",
  messagingSenderId: "312087304950",
  appId: "1:312087304950:web:2902c3215f33452ae96ad7",
  measurementId: "G-4QJ6P2SY2X",
};

const initial = {
  inputs: Array(6).fill([]),
  colors: Array(6).fill(Array(5).fill("bg-white")),
  answer: ["D", "E", "L", "A", "Y"],
  status: "play",
  currentRow: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setAnswer": {
      let setAnswer = [...state.answer];
      setAnswer = Array.from(action.payload.answer);
      console.log(setAnswer);

      return { ...state, answer: setAnswer };
    }
    case "updateInput": {
      let updatedinputs = JSON.parse(JSON.stringify(state.inputs));

      if (updatedinputs[state.currentRow].length >= 5) {
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
      let updatedcolors = JSON.parse(JSON.stringify(state.colors));

      if (state.inputs[state.currentRow].length < 5) {
        console.log("uncomplete");
        return state;
      }
      updatedcolors[state.currentRow] = updatedcolors[state.currentRow].map((item, index) => {
        if (state.inputs[state.currentRow][index] == state.answer[index]) {
          return "bg-emerald-500";
        } else if (state.answer.includes(state.inputs[state.currentRow][index])) {
          return "bg-yellow-500";
        } else {
          return "bg-gray-300";
        }
      });

      let nextRow = state.currentRow + 1;
      let correct = updatedcolors[state.currentRow].filter((correct) => correct === "bg-emerald-500");

      if (correct.length == 5) return { ...state, colors: updatedcolors, currentRow: 0, status: "success" };
      if (nextRow >= 6) return { ...state, colors: updatedcolors, currentRow: 0, status: "failed" };

      return { ...state, colors: updatedcolors, currentRow: nextRow };
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
  let didFetch = false;

  const fetchAnswers = async () => {
    const app = initializeApp(firebaseConfig);
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
    if (!didFetch) {
      fetchAnswers();
      didFetch = true;
    }
  }, [state.status]);

  const handleKeyDown = (event) => {
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
