/* eslint-disable jsx-a11y/alt-text */
import { stubFalse } from "lodash";
import React, { Component, CSSProperties } from "react";
import Footer from "./Footer";
import * as postDuck from "../ducks/Posts";

const style = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "10px 15px",
    marginBottom: "10px",
  },
  dialog: {
    boxShadow: "0 8px 6px -6px black",
    position: "fixed",
    top: "10%"
  } as CSSProperties,
  image: {
    width: "930px"
  }
};

interface IPostProps {
  image: string;
  postData: postDuck.IPost;
  like: () => void;
  deleteImage: () => void;
}

export default class Post extends Component<IPostProps> {
  state = { isOpen: false };

  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { image, postData, like, deleteImage } = this.props;
    return (
      <div style={style.card}>
        <img style={{ width: "300px" }} src={image} onClick={this.handleShowDialog} />
        {this.state.isOpen && (
          <dialog
            className="dialog"
            style={style.dialog}
            open
          >
            <img
              style={style.image}
              src={image}
              onClick={this.handleShowDialog}
              alt="no image"
            />
            <Footer
              postData={postData}
              big={true}
              like={like}
              deleteImage={deleteImage} />
          </dialog>
        )}
        <Footer
          postData={postData}
          big={false}
          like={like}
          deleteImage={deleteImage} />
      </div>
    );
  }
}
