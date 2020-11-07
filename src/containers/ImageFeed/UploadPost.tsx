import { History } from "history";
import * as React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import Card from "../../components/Card";
import Container from "../../components/Container";
import Title from "../../components/Title";
import UploadPostForm from "../../components/UploadPostForm";
import { IState } from "../../ducks";
import { IUploadPost, uploadPost } from "../../ducks/Posts";

interface IUploadPostProps {
  history: History;
  upload: (a: IUploadPost) => void;
  uploading: boolean;
  uploaded: boolean;
  failures: [];
}

class UploadPost extends React.Component<IUploadPostProps> {
  
  public componentDidUpdate() {
    const { history, uploaded } = this.props;
    if (uploaded) {
      this.setState({
        uploaded: false,
      });
      history.push("/app/imagefeed");
    }
  }

  public render() {
    const { failures, upload, uploading } = this.props;
    return (
      <Container>
        <Card>
          <Title>Upload Image</Title>
          <UploadPostForm onSubmit={upload} disabled={uploading} failures={failures} />
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (state: IState) => {
  const {
    Posts: { failures, uploading, uploaded },
  } = state;
  return {
    failures,
    uploaded,
    uploading,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) => ({
  upload: (payload: any) => dispatch(uploadPost(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadPost);
