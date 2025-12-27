import React from "react";

interface Props {
  words: string[];
}

export function PossibleWords({ words }: Props) {
  if (words.length === 0) {
    return (
      <section className="possible-words empty">
        <h3>Possible Words</h3>
        <p>No words match your criteria!</p>
      </section>
    );
  }

  return (
    <section className="possible-words">
      <h3>Possible Words ({words.length})</h3>
      <div className="words-grid">
        {words.slice(0, 20).map(word => (
          <div key={word} className="word-item">{word.toUpperCase()}</div>
        ))}
        {words.length > 20 && (
          <div className="more-indicator">
            +{words.length - 20} more...
          </div>
        )}
      </div>
    </section>
  );
}
