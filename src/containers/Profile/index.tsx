import React, { Component } from "react";
import ProfileImg from "../../components/ProfileImg";
import Button from "../../components/Button";
import Card from "../../components/Card";
import * as postsDuck from "../../ducks/Posts";
import * as usersDuck from "../../ducks/Users";
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import services from "../../services";
import { chunk } from "lodash";
import { submit } from "redux-form";
import { IState } from "../../ducks";
import { Link } from "react-router-dom";

const { auth } = services;

const style = {
  container: {
    padding: "15px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between", //add 100% spaces beetween all element contend (profile and button), good for work with columns
    marginBottom: "10px",
  },
  img: {
    width: "100px",
  },
};

interface IProfileProps {
  fetchPosts: () => void;
  submitProfileImage: () => void;
  handleProfileImageSubmit: (a: { file: File }) => void;
  handleLogout: () => void;
  fetched: boolean;
  loading: boolean;
  data: postsDuck.IPost[][];
  profileImage: string;
}

class Profile extends Component<IProfileProps> {
  constructor(props: IProfileProps) {
    super(props);
    const { fetchPosts, fetched } = props;
    if (fetched) {
      return;
    }
    fetchPosts();
  }

  render() {
    const {
      data,
      submitProfileImage,
      handleProfileImageSubmit,
      handleLogout,
      profileImage,
    } = this.props;
    return (
      <div style={style.container}>
        <div style={style.row}>
          <ProfileImg
            profileImage={profileImage}
            onSubmit={handleProfileImageSubmit}
            submitProfileImage={submitProfileImage}
          />
          <span>
            <Button onClick={handleLogout}> Logout </Button>
          </span>
        </div>
        {data.map((x, i) => (
          <div key={i} style={style.row}>
            {x.map((y) => (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Card key={y.imageURL}>
                <img style={style.img} src={y.imageURL} alt="" />
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  const {
    Posts: { data, fetched, fetching },
  } = state;
  const {
    Users: { profileImage: temPI },
  } = state;
  const loading = fetching || !fetched;
  const profileImage = temPI || "https://placekitten.com/100/100";

  const filtered = Object.keys(data).reduce((acc, el) => {
    if (data[el].userId !== (auth.currentUser && auth.currentUser.uid)) {
      return acc;
    }
    return acc.concat(data[el]);
  }, [] as postsDuck.IPost[]);

  const ordered = filtered.sort((a, b) => {
    if (a.createdAt.toDate() < b.createdAt.toDate()) {
      return 1;
    }
    if (a.createdAt.toDate() > b.createdAt.toDate()) {
      return -1;
    }
    return 0;
  });

  return {
    data: chunk(ordered, 3),
    fetched,
    loading,
    profileImage,
  };
};
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, any>) =>
  bindActionCreators(
    {
      ...postsDuck,
      ...usersDuck,
      submitProfileImage: () => submit("profileImg"),
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
