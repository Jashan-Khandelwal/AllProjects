import styles from "../styles/Card.module.css";

export default function Card({ pokemon, onClick }) {
  return (
    <button className={styles.card} onClick={() => onClick(pokemon.id)}>
      <img className={styles.image} src={pokemon.image} alt={pokemon.name} />
      <span className={styles.name}>{pokemon.name}</span>
    </button>
  );
}
