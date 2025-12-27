import React, { useState } from "react";
import { useSolver } from "../App";

type LetterStatus = "correct" | "almost" | "wrong";

const nextStatus: Record<LetterStatus, LetterStatus> = {
  wrong: "almost",
  almost: "correct",
  correct: "wrong",
};

export function SolverBoard() {
  const [word, setWord] = useState("");
  const [status, setStatus] = useState<LetterStatus[]>(["wrong", "wrong", "wrong", "wrong", "wrong"]);
  const { addGuess } = useSolver();

  const toggleStatus = (index: number) => {
    setStatus(prev => {
      const newStatus = [...prev];
      newStatus[index] = nextStatus[newStatus[index]];
      return newStatus;
    });
  };

  const submitGuess = () => {
    if (word.length === 5) {
      addGuess({ word: word.toLowerCase(), status });
      setWord("");
      setStatus(["wrong", "wrong", "wrong", "wrong", "wrong"]);
    }
  };

  return (
    <div className="solver-board">
      <input
        className="guess-input"
        value={word}
        onChange={(e) => setWord(e.target.value.toUpperCase().slice(0, 5))}
        maxLength={5}
        placeholder="Enter guess"
      />
      
      <div className="feedback-row">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`cell ${status[i]}`}
            onClick={() => toggleStatus(i)}
            title={`Click to cycle: ${status[i]} → ${nextStatus[status[i]]}`}
          >
            {word[i] || "_"}
          </div>
        ))}
      </div>
      
      <button 
        className="submit-btn"
        onClick={submitGuess}
        disabled={word.length !== 5}
      >
        Add Guess
      </button>
    </div>
  );
}
