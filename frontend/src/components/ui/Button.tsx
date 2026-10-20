import type { ButtonHTMLAttributes } from "react";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./buttonClass";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button = ({ variant, size, className, type = "button", ...props }: ButtonProps) => (
  <button type={type} className={buttonClass(variant, size, className)} {...props} />
);

export default Button;
