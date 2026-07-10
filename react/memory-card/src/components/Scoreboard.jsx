import styles from "../styles/Scoreboard.module.css";

export default function Scoreboard({score,bestScore}){
    return(
        <div className={styles.board}>
            <p className={styles.item}>
                Score: <span className={styles.value}>{score}</span>
            </p>
            <p className={styles.item}>
                Best: <span className = {styles.value}>{bestScore}</span>
            </p>
        </div>
    )
}
