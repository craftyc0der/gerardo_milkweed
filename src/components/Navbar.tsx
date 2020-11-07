import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const style = {
  navbar: {
    borderBottom: "solid 1px #aaa",
    padding: "10px 15px",
  },
  link: {
    color: "#555",
    textDecoration: "none",
  },
};

export default class Navbar extends Component {
  render() {
    return (
      <div style={style.navbar}>
        <Link style={style.link} to="/app/imagefeed"><FontAwesomeIcon icon={faNewspaper}/> Gerardo Lab Milkweed</Link>
        <div style={{ float: "right"}}><Link style={style.link} to="/app/profile"><FontAwesomeIcon icon={faUser}/> Profile</Link></div>
      </div>
    );
  }
}
