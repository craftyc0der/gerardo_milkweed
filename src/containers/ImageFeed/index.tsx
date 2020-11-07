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

interface IImageFeedProps {
  history: History;
  fetchPosts: () => void;
  fetched: boolean;
  loading: boolean;
  data: postDuck.IDataPosts;
  like: (a: string) => void;
  deleteImage: (a: string) => void;
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

  render() {
    const { history, data } = this.props;
    return (
      <Container>
        {Object.keys(data).map((x) => {
          const post = data[x];
          if (post.imageURL) {
            return (
              <div key={x} style={{ margin: "0 auto" }}>
                <Post 
                  like={this.handleLike(x)}
                  deleteImage={this.handleDeleteImage(x)}
                  image={post.imageURL}
                  barcode={post.barcode}
                  qrcode={post.qrcode}
                  plateSide={post.plateSide}
                  sampleId={post.sampleId}
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
            <Action style={style.actionButtonStyles} text="Add Metadata" onClick={e => console.log(e)}>
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

  return {
    data,
    fetched,
    loading,
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) =>
  bindActionCreators(postDuck, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageFeed);
