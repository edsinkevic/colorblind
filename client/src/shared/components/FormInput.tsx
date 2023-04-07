import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const FormInput = (props: Props) => {
  return (
    <div>
      <label>{props.placeholder}</label>
      <input {...props} />
    </div>
  );
};
