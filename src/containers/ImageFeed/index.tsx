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
  like: (a: string) => void;
  deleteImage: (a: string) => void;
  searchPosts: (
    querySampleId: string, 
    queryPlateId: string, 
    queryPlateSide: string, 
    queryGenus: string,
    querySpecies: string) => void;
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
  public querySampleId: string = "";
  public queryPlateId: string = "";
  public queryPlateSide: string = "";
  public queryGenus: string = "";
  public querySpecies: string = "";
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

  private handleSearchSampleId = (query: string) => {
    this.querySampleId = query;
    this.handleSearchPosts();
  }

  private handleSearchPlateId = (query: string) => {
    this.queryPlateId = query;
    this.handleSearchPosts();
  }

  private handleSearchPlateSide = (query: string) => {
    this.queryPlateSide = query;
    this.handleSearchPosts();
  }

  private handleSearchGenus = (query: string) => {
    this.queryGenus = query;
    this.handleSearchPosts();
  }

  private handleSearchSpecies = (query: string) => {
    this.querySpecies = query;
    this.handleSearchPosts();
  }

  private handleSearchPosts = () => {
    const { fetchPosts, searchPosts } = this.props;
    if (
      this.querySampleId.trim().length == 0 && 
      this.queryPlateId.trim().length == 0 && 
      this.queryPlateSide.trim().length == 0 && 
      this.queryGenus.trim().length == 0 && 
      this.querySpecies.trim().length == 0
      ) {
      fetchPosts();
    } else {
      searchPosts(
        this.querySampleId,
        this.queryPlateId,
        this.queryPlateSide,
        this.queryGenus,
        this.querySpecies);
    }
  };

  render() {
    const { history, data, query } = this.props;
    return (
      <Container>
        <div>
          <SearchBox query={query} label="Search Sample Id" changeSearch={this.handleSearchSampleId} />
          <br />
          <SearchBox query={query} label="Search Plate Id" changeSearch={this.handleSearchPlateId} />
          <br />
          <SearchBox query={query} label="Front of Back (F|B)" changeSearch={this.handleSearchPlateSide} />
          <br />
          <SearchBox query={query} label="Search Genus" changeSearch={this.handleSearchGenus} />
          <br />
          <SearchBox query={query} label="Search Species" changeSearch={this.handleSearchSpecies} />
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
                  sampleId={post.sampleId}
                  postData={post}
                />
              </div>
            );
          }
        })}
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
      </Container>
    );
  }
}

const mapStateToProps = (state: IState) => {
  const { Posts: { data, fetched, fetching }, } = state;
  const loading = fetching || !fetched;
  console.log(data);
  return {
    data,
    fetched,
    loading,
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) =>
  bindActionCreators(postDuck, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageFeed);
