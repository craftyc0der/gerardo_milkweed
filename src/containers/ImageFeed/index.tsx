import React, { Component } from "react";
import Post from "../../components/Post";
import Container from "../../components/Container";
import { ThunkDispatch } from "redux-thunk";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as postDuck from "../../ducks/Posts";
import { IState } from "../../ducks";
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { History } from "history";
import SearchBox from "../../components/SearchBox";

interface IImageFeedProps {
  history: History;
  fetchPosts: () => void;
  fetched: boolean;
  loading: boolean;
  data: postDuck.IDataPosts;
  profileRole?: string;
  like: (a: string) => void;
  deleteImage: (a: string) => void;
  searchPosts: (
    queryPlateId: string,
    queryDay: string,
    queryHostStrain: string,
    queryParasiteStrain: string,
    queryPlateSide: string) => void;
  query: string;
}

const style = {
  mainButtonStyles: {
    backgroundColor: '#27ae60',
  },
  actionButtonStyles: {
    backgroundColor: '#16a085',
  },
  mainStyle: {
    bottom: 20,
    right: 40
  }
};

class ImageFeed extends Component<IImageFeedProps> {
  public queryPlateId: string = "";
  public queryDay: string = "";
  public queryHostStrain: string = "";
  public queryParasiteStrain: string = "";
  public queryPlateSide: string = "";
  constructor(props: IImageFeedProps) {
    super(props);
    const { history, fetchPosts, fetched } = props;
    if (fetched) {
      return;
    }
    fetchPosts();
  }

  private handleLike = (id: string) => () => {
    const { like } = this.props;
    like(id);
  };

  private handleDeleteImage = (id: string) => () => {
    const { deleteImage } = this.props;
    deleteImage(id);
  };

  private handleSearchPlateId = (query: string) => {
    this.queryPlateId = query;
    this.handleSearchPosts();
  }

  private handleSearchDay = (query: string) => {
    this.queryDay = query;
    this.handleSearchPosts();
  }

  private handleSearchHostStrain = (query: string) => {
    this.queryHostStrain = query;
    this.handleSearchPosts();
  }

  private handleSearchParasiteStrain = (query: string) => {
    this.queryParasiteStrain = query;
    this.handleSearchPosts();
  }

  private handleSearchPlateSide = (query: string) => {
    query = query.toUpperCase()
    if (query === "B" || query === "F") {
      this.queryPlateSide = query;
    } else {
      this.queryPlateSide = "";
    }
    this.handleSearchPosts();
  }

  private handleSearchPosts = () => {
    const { fetchPosts, searchPosts } = this.props;
    if (
      this.queryPlateId.trim().length == 0 &&
      this.queryDay.trim().length == 0 &&
      this.queryHostStrain.trim().length == 0 &&
      this.queryParasiteStrain.trim().length == 0 &&
      this.queryPlateSide.trim().length == 0
    ) {
      fetchPosts();
    } else {
      if (
        (
          this.queryHostStrain.trim().length > 0 &&
          this.queryParasiteStrain.trim().length > 0
        ) || (
          this.queryPlateId.trim().length > 0 &&
          (
            this.queryHostStrain.trim().length > 0 ||
            this.queryParasiteStrain.trim().length > 0
          )
        )
      ) {
        alert("You cannot search plateId with strain or host and parasite strain at the same time.");
      } else if (
        this.queryPlateId.trim().length == 0 &&
        this.queryDay.trim().length > 0 &&
        this.queryHostStrain.trim().length == 0 &&
        this.queryParasiteStrain.trim().length == 0 &&
        this.queryPlateSide.trim().length == 0
      ) {
        alert("You cannot search day without plateId or strain.");
      } else if (
        this.queryPlateId.trim().length == 0 &&
        this.queryDay.trim().length == 0 &&
        this.queryHostStrain.trim().length == 0 &&
        this.queryParasiteStrain.trim().length == 0 &&
        this.queryPlateSide.trim().length > 0
      ) {
        alert("You cannot search plate side without plateId or strain.");
      } else {
        searchPosts(
          this.queryPlateId,
          this.queryDay,
          this.queryHostStrain,
          this.queryParasiteStrain,
          this.queryPlateSide);
      }
    }
  };

  render() {
    const { history, data, query, profileRole } = this.props;
    let fab;
    if (profileRole === "admin") {
      fab = (
        <Fab
          mainButtonStyles={style.mainButtonStyles}
          style={style.mainStyle}
          icon="+"
          event="click"
          alwaysShowTitle={true}
        >
          <Action style={style.actionButtonStyles} text="Add Images" onClick={e => history.push("/app/upload")}>
            📷
        </Action>
          <Action style={style.actionButtonStyles} text="Add Metadata" onClick={e => history.push("/app/upload-data")}>
            🗃️
        </Action>
        </Fab>
      );
    }
    return (
      <Container>
        <div>
          <SearchBox query={query} label="Plate Id" changeSearch={this.handleSearchPlateId} />
          <br />
          <SearchBox query={query} label="Host Strain" changeSearch={this.handleSearchHostStrain} />
          <br />
          <SearchBox query={query} label="Parasite Strain" changeSearch={this.handleSearchParasiteStrain} />
          <br />
          <SearchBox query={query} label="Day" changeSearch={this.handleSearchDay} />
          <br />
          <SearchBox query={query} label="Plate Side (F|B)" maxLength={1} changeSearch={this.handleSearchPlateSide} />
        </div>
        {Object.keys(data).map((x) => {
          const post = data[x];
          if (post.imageURL) {
            return (
              <div key={x} style={{ margin: "0 auto" }}>
                <Post
                  like={this.handleLike(x)}
                  deleteImage={this.handleDeleteImage(x)}
                  image={post.imageURL}
                  postData={post}
                />
              </div>
            );
          }
        })}
        {fab}
      </Container>
    );
  }
}

const mapStateToProps = (state: IState) => {
  const { Posts: { data, fetched, fetching }, } = state;
  const {
    Users: { profileRole: profileRole },
  } = state;
  const loading = fetching || !fetched;
  return {
    data,
    fetched,
    loading,
    profileRole,
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) =>
  bindActionCreators(postDuck, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageFeed);
