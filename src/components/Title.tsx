import React, { Component } from "react";

const style = {
  color: "#555",
};

export default class Title extends Component {
  render() {
    // eslint-disable-next-line jsx-a11y/heading-has-content
    return <h2 {...this.props} style={style} />;
  }
}
