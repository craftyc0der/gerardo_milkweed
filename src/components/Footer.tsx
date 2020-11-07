import React, { Component, CSSProperties } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTrash } from "@fortawesome/free-solid-svg-icons";

const style = {
  footer: {
    display: "flex",
    backgroundColor: "#eee",
    marginLeft: "-15px",
    marginBottom: "-10px",
    width: "calc(100% + 30px)",
  },
  button: {
    flex: 1,
    textAlign: "center",
    padding: "10px 15px",
    cursor: "pointer",
  } as CSSProperties,
};

interface IFooterProps {
  like: () => void;
  deleteImage: () => void;
}

export default class Footer extends Component<IFooterProps> {
  render() {
    const {like, deleteImage} = this.props

    return (
      <div style={style.footer}>
        <div onClick={like} style={style.button}>
          <FontAwesomeIcon icon={faThumbsUp} /> Like
        </div>
        <div onClick={deleteImage} style={style.button}>
          <FontAwesomeIcon icon={faTrash} /> Delete
        </div>
      </div>
    );
  }
}
