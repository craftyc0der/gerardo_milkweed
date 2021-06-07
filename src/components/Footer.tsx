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
    flexWrap: "wrap",
    maxWidth: "930px",
  } as CSSProperties,
  rowdiv: {
    "flex-grow": "1",
    width: "33%",
    height: "30px",
  } as CSSProperties,
};

interface IFooterProps {
  postData: postDuck.IPost;
  big: boolean;
  like: () => void;
  deleteImage: () => void;
}

export default class Footer extends Component<IFooterProps> {
  render() {
    const { postData, big, like, deleteImage } = this.props
    if (big) {
      return (
        <div>
          <div style={style.row}>
            <div>{postData.barcode} - {postData.plateSide} - {postData.qrcode}</div>
          </div>
          <div style={style.row}>
            <div style={style.rowdiv}>Host Ant Genus: {postData.hostAntGenus}</div>
            <div style={style.rowdiv}>Host Ant Species: {postData.hostAntSpecies}</div>
            <div style={style.rowdiv}>Host Strain: {postData.hostStrain}</div>
            <div style={style.rowdiv}>Parasite Ant Genus: {postData.parasiteAntGenus}</div>
            <div style={style.rowdiv}>Parasite Ant Species: {postData.parasiteAntSpecies}</div>
            <div style={style.rowdiv}>Parasite Strain: {postData.parasiteStrain}</div>
            <div style={style.rowdiv}>Temperature: {postData.temperature}</div>
            <div style={style.rowdiv}>Location: {postData.location}</div>
            <div style={style.rowdiv}>Media: {postData.media}</div>
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
            <div>{postData.barcode} - {postData.plateSide} - {postData.qrcode}</div>
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