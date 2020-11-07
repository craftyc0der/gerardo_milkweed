import React, { Component, CSSProperties } from "react";

const style = (center: boolean) => ({
  backgroundColor: "#eee",
  padding: "10px 15px", //margin top - margin left and  rigth
  height: "calc(100vh - 20px)",
  width: "calc(100vw - 30px)",
  //flexbox:
  display: "flex",
  justifyContent: center ? "center" : undefined,
  alignItems: center ? "center" : undefined,
  flexDirection: 'column',//vertical post position
}) as CSSProperties;

interface IContainer {
  center?: boolean
}

export default class Container extends Component<IContainer> {
  render() {
    const { children, center = false } = this.props;
    return <div style={style(center)}>{children}</div>;
  }
}
