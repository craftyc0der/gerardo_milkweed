/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import Footer from "./Footer";

const style = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  padding: "10px 15px",
  marginBottom: "10px",
};

interface IPostProps {
  image: string;
  barcode: string;
  qrcode: string;
  plateSide: string;
  sampleId: string;
  like: () => void;
  deleteImage: () => void;
}

export default class Post extends Component<IPostProps> {
  render() {
    const { image, barcode, qrcode, plateSide, sampleId, like, deleteImage } = this.props;
    return (
      <div style={style}>
        <img style={{ width: "300px" }} src={image} />
        <Footer 
          barcode={barcode}
          qrcode={qrcode}
          plateSide={plateSide}
          sampleId={sampleId}          
          like={like} 
          deleteImage={deleteImage}/>
      </div>
    );
  }
}
