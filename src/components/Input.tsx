import * as React from "react";
import { WrappedFieldProps } from "redux-form";

export const style = {
  input: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "10px",
    padding: "10px 15px",
    width: "calc(100% - 30px)",
  },
  span: {
    color: "#777",
    fontSize: "10px",
    fontWeight: 900,
    textTransform: "uppercase",
  } as React.CSSProperties,
};

interface IInputProps {
  placeholder?: string;
  label: string;
}

const Input: React.StatelessComponent<WrappedFieldProps & IInputProps> = (
  props
) => {
  const { input, label } = props;
  return (
    <div>
      <span style={style.span}>{label}</span>
      <input {...props} {...props.input} style={style.input} />
    </div>
  );
};

export default Input;
