import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface Props extends PhoneInputProps {
  inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}

export const ColorblindPhoneInput = (props: Props) => {
  return (
    <div>
      <label>{props.inputProps.placeholder}</label>
      <PhoneInput {...props} />
    </div>
  );
};
