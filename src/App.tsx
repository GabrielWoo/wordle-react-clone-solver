import React, { useState, useEffect, createContext, useContext } from "react";
import { loadWordList } from "./words/wordList";
import { SolverBoard } from "./components/SolverBoard";
import { PossibleWords } from "./components/PossibleWords";
import "./App.css";

type LetterStatus = "correct" | "almost" | "wrong";
type Guess = { word: string; status: LetterStatus[] };

interface SolverContextType {
  guesses: Guess[];
  addGuess: (guess: Guess) => void;
  resetGuesses: () => void;
}

const SolverContext = createContext<SolverContextType | null>(null);

export function useSolver() {
  const ctx = useContext(SolverContext);
  if (!ctx) throw new Error("useSolver must be used within SolverProvider");
  return ctx!;
}

function SolverProvider({ children }: { children: React.ReactNode }) {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  
  const addGuess = (guess: Guess) => setGuesses(prev => [...prev, guess]);
  const resetGuesses = () => setGuesses([]);

  const value: SolverContextType = { guesses, addGuess, resetGuesses };

  return (
    <SolverContext.Provider value={value}>
      {children}
    </SolverContext.Provider>
  );
}

function candidateMatches(candidate: string, guess: Guess): boolean {
  const { word, status } = guess;

  // Green: exact position match
  for (let i = 0; i < 5; i++) {
    if (status[i] === "correct" && candidate[i] !== word[i]) {
      return false;
    }
  }

  // Yellow: present but wrong position
  for (let i = 0; i < 5; i++) {
    if (status[i] === "almost") {
      if (candidate[i] === word[i]) return false; // wrong position
      if (!candidate.includes(word[i])) return false; // must exist
    }
  }

  // Gray: not present anywhere
  for (let i = 0; i < 5; i++) {
    if (status[i] === "wrong" && candidate.includes(word[i])) {
      return false;
    }
  }

  return true;
}

function filterCandidates(allWords: string[], guesses: Guess[]): string[] {
  if (guesses.length === 0) return allWords;
  return allWords.filter(w => guesses.every(g => candidateMatches(w, g)));
}

function GuessHistory() {
  const { guesses } = useSolver();
  
  if (!guesses.length) {
    return <p className="no-guesses">No guesses entered yet</p>;
  }
  
  return (
    <div className="history">
      <h3>Previous Guesses</h3>
      {guesses.map((g, i) => (
        <div key={i} className="guess-row">
          <span className="guess-word">{g.word.toUpperCase()}</span>
          <div className="status-chips">
            {g.status.map((s, j) => (
              <span key={j} className={`chip ${s}`}>
                {s === "correct" ? "🟩" : s === "almost" ? "🟨" : "⬜"}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppContent() {
  const { guesses, resetGuesses } = useSolver();
  const [wordList, setWordList] = useState<string[]>([]);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    loadWordList().then(words => {
      console.log(`Loaded ${words.length} words`);
      setWordList(words);
      setPossibleWords(words); 
      setLoading(false);
    }).catch(err => {
      console.error('Word list load failed:', err);
      setLoading(false);
    });
  }, []);

  // Filter when guesses change
  useEffect(() => {
    if (wordList.length === 0) return;
    
    const filtered = filterCandidates(wordList, guesses);
    console.log(`Filtered to ${filtered.length} possible words`);
    setPossibleWords(filtered);
  }, [guesses, wordList]);

  if (loading) {
    return (
      <div className="app loading">
        <h1>🧩 Wordle Solver</h1>
        <div className="loading-spinner">Contacting FBI...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🧩 Wordle Solver</h1>
        <p>
          <strong>{wordList.length}</strong> total words | 
          <strong> {possibleWords.length}</strong> possible matches
        </p>
      </header>

      <main>
        <SolverBoard />
        <GuessHistory />
        <PossibleWords words={possibleWords} />
      </main>

      <footer>
        <button className="reset-btn" onClick={resetGuesses}>
          Reset All
        </button>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SolverProvider>
      <AppContent />
    </SolverProvider>
  );
}
