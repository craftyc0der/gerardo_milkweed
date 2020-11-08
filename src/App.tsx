import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import { History } from "history";

import Login from "./containers/Auth/Login";
import Register from "./containers/Auth/Register";
import ImageFeed from "./containers/ImageFeed";
import Navbar from "./components/Navbar";
import Profile from "./containers/Profile";
import services from "./services";
import UploadPost from "./containers/ImageFeed/UploadPost";
import UploadData from "./containers/ImageFeed/UploadData";

interface IAppProps {
  history: History;
  loadInitialData: () => void;
}
class App extends React.Component<IAppProps> {
  public state = {
    loading: true,
  };

  public componentDidMount() {
    const { auth } = services;
    auth.onAuthStateChanged((user) => {
      const { history } = this.props;
      if (user) {
        const { loadInitialData } = this.props;
        loadInitialData();
        if (["/", "/register"].indexOf(window.location.pathname) > -1) {
          history.push("/app/imagefeed");
        }
      } else {
        // eslint-disable-next-line
        if (/\app\/./.test(location.pathname)) {
          history.push("/");
        }
      }

      this.setState({
        loading: false,
      });
    });
  }

  public render() {
    const { loading } = this.state;
    return loading ? (
      "loading"
    ) : (
      <BrowserRouter>
        <Route exact={true} path="/" component={Login} />
        <Route exact={true} path="/register" component={Register} />
        <Route path="/app" component={Navbar} />
        <Route exact={true} path="/app/imagefeed" component={ImageFeed} />
        <Route exact={true} path="/app/profile" component={Profile} />
        <Route exact={true} path="/app/upload" component={UploadPost} />
        <Route exact={true} path="/app/upload-data" component={UploadData} />
      </BrowserRouter>
    );
  }
}

export default App;
