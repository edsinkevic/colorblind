import styles from "./StatusIndicator.module.css";

interface Props {
    current: number
}

const states = ["Package", "Sender and receiver information", "Overview", "Payment"];
export const StatusIndicator = ({ current }: Props) => {
    return (
        <div className={styles.statusIndicator}>
            <label>Status</label>
            <ol>
                {states.map((state, index) =>
                    <li key={index} className={index === current - 1 ? styles.active : ""}>{state}</li>
                )}
            </ol>
        </div>
    );
};