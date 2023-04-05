import styles from "./FormInput.module.css";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const FormInput = (props: Props) => {
  return (
    <div className={styles.inputContainer}>
      <label>{props.placeholder}</label>
      <input {...props} />
    </div>
  );
};
