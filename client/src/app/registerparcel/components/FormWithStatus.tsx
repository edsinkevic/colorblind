import styles from "./FormWithStatus.module.css";
import { StatusIndicator } from "./StatusIndicator";

interface Props {
    children: React.ReactNode;
    current: number;
}

export const FormWithStatus = ({ children, current }: Props) => {
    return (
        <div className={styles.formWithStatus}>
            <StatusIndicator className={styles.status} current={current} />
            <div className={styles.form}>
                {children}
            </div>
        </div>
    );
};