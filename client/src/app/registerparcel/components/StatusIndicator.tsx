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
            <ol>
                {states.map((state, index) =>
                    <li key={index} className={index === current - 1 ? styles.active : ""}>{state}</li>
                )}
            </ol>
        </div>
    );
};