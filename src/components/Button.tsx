import React, { Component } from "react";

const style = (block: boolean, disabled: boolean) => ({
  backgroundColor: disabled ? "#777777" : "#00A8D1",
  border: "0px",
  borderRadius: "4px",
  padding: "10px 15px",
  color: "#fff",
  width: block ? "100%" : undefined,
  marginBottom: "10px",
});

interface IButtonProps {
  block?: boolean;
  disabled?: boolean;
  onClick?: any;
}

export default class Button extends Component<IButtonProps> {
  render() {
    const { block = false, disabled = false, onClick = undefined, ...otherProps } = this.props;
    return (
      <button
        {...otherProps}
        style={style(block, disabled)}
        disabled={disabled}
        onClick={onClick}
      />
    );
  }
}
