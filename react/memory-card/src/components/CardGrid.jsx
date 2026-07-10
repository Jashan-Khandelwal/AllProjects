import Card from "./Card";
import styles from '../styles/CardGrid.module.css';

export default function CardGrid({cards, onCardClick}){
    return(
        <div className={styles.grid}>
            {cards.map((pokemon)=>(
                <Card key={pokemon.id} pokemon={pokemon} onClick={onCardClick}/>
            ))}
        </div>
    );
}