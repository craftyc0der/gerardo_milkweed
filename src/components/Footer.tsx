import React, { Component, CSSProperties } from "react";
import * as postDuck from "../ducks/Posts";
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
  row: {
    display: "flex",
    justifyContent: "space-between", //add 100% spaces beetween all element contend (profile and button), good for work with columns
    marginBottom: "10px",
  },
};

interface IFooterProps {
  sampleId: string;
  postData: postDuck.IPost;
  big: boolean;
  like: () => void;
  deleteImage: () => void;
}

export default class Footer extends Component<IFooterProps> {
  render() {
    const {sampleId, postData, big, like, deleteImage} = this.props
    if (big) {
      return (
        <div>
          <div style={style.row}>
            <div>{sampleId}</div>
          </div>
          <div style={style.row}>
            <div>Genus: {postData.genus}</div>
            <div>Species: {postData.species}</div>
            <div>Side: {postData.plateSide}</div>
            <div>Plate: {postData.barcode}</div>
            <div>Day: {postData.qrcode}</div>
          </div>  
          <div style={style.footer}>      
            <div onClick={like} style={style.button}>
              <FontAwesomeIcon icon={faThumbsUp} /> Like
            </div>
            <div onClick={deleteImage} style={style.button}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={style.row}>
            <div>{sampleId}</div>
          </div>
          <div style={style.footer}>      
            <div onClick={like} style={style.button}>
              <FontAwesomeIcon icon={faThumbsUp} /> Like
            </div>
            <div onClick={deleteImage} style={style.button}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </div>
          </div>
        </div>
      );
    }
  }
  // getData(postData: object, column: string): string {
  //   return postData[column];
  // }
}