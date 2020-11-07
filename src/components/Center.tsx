import React, { Component, CSSProperties } from "react";

const style = {
  textAlign: "center",
  width: "100%",
} as CSSProperties

export default class Center extends Component {
  render() {
    return <div {...this.props} style={style}></div>
  }
}
