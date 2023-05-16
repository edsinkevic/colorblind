import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styles from "./page.module.css";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const FormInput = (props: Props) => {
  return (
    <div className={styles.inputs}>
      <label>{props.placeholder}</label>
      <input {...props} className={styles.input}/>
    </div>
  );
};
