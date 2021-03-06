import { History } from "history";
import * as React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import Card from "../../components/Card";
import Container from "../../components/Container";
import Title from "../../components/Title";
import UploadDataForm from "../../components/UploadDataForm";
import { IState } from "../../ducks";
import { IUploadData, uploadData } from "../../ducks/Posts";

interface IUploadDataProps {
  history: History;
  upload: (a: IUploadData) => void;
  uploading: boolean;
  uploaded: boolean;
  failures: [];
}

class UploadData extends React.Component<IUploadDataProps> {

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
          <Title>Upload Data</Title>
          <UploadDataForm onSubmit={upload} disabled={uploading} failures={failures} />
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
  upload: (payload: any) => dispatch(uploadData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadData);
