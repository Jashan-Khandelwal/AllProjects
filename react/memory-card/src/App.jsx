import { useState, useEffect } from 'react';
import { fetchPokemon } from './api/pokemon';
import Scoreboard from './components/Scoreboard';
import CardGrid from './components/CardGrid';
import styles from './styles/App.module.css';

// Returns a new array with the same cards in random order (Fisher–Yates shuffle).
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [clickedIds, setClickedIds] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch the Pokémon once, when the component mounts.
  useEffect(() => {
    fetchPokemon(12)
      .then((data) => setCards(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  function handleCardClick(id) {
    if (clickedIds.includes(id)) {
      // Already clicked this one → game over. Reset.
      setScore(0);
      setClickedIds([]);
    } else {
      // New card → score up.
      const newScore = score + 1;
      setScore(newScore);
      setClickedIds([...clickedIds, id]);
      if (newScore > bestScore) setBestScore(newScore);
    }
    // Shuffle after every click, win or lose.
    setCards((prev) => shuffle(prev));
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokémon Memory</h1>
        <p className={styles.subtitle}>
          Click each card once. Click one twice and you lose!
        </p>
        <Scoreboard score={score} bestScore={bestScore} />
      </header>

      {loading ? (
        <p className={styles.status}>Loading Pokémon…</p>
      ) : (
        <CardGrid cards={cards} onCardClick={handleCardClick} />
      )}
    </div>
  );
}
