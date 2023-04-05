import styles from './Header.module.css';

export const Header = () => {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.titleContainer}>
                <h1>FastMail</h1>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.headerButton}>Send Package</button>
                <button className={styles.headerButton}>Track parcel</button>
                <button className={styles.headerButton}>F.A.Q.</button>
            </div>
        </div>
    );
}