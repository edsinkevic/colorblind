import styles from "./StatusIndicator.module.css";

interface Props {
    current: number,
    className?: string
}

const states = ["Package", "Sender and receiver information", "Overview", "Payment"];
export const StatusIndicator = ({ current, className }: Props) => {
    return (
        <div className={`${className} ${styles.statusIndicator}`}>
            <label>Status</label>
            <div className={styles.list}>
                {states.map((state, index) =>
                    <div key={index} className={`${styles.item} ${index === current - 1 ? styles.active : ""}`}>
                        <span className={styles.itemIndex}>{index + 1}</span>
                        <span className={styles.itemName}>
                            {state}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};