import React, { Component } from "react";
import Card from "../../components/Card";
import Container from "../../components/Container";
import Title from "../../components/Title";
import RegisterForm from "../../components/RegisterForm";

import { ThunkDispatch } from "redux-thunk";
import { connect } from "react-redux";
import { register as registerThunk, ILogin } from "../../ducks/Users";
import { IState } from "../../ducks";

interface  IRegisterProps {
  register: (a: ILogin) => void
}

class Register extends Component<IRegisterProps> {
  render() {
    const { register } = this.props
    return (
      <Container center={true}>
        <Card>
          <Title>Register</Title>
          <RegisterForm onSubmit={register}/>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (state: IState) => state

const mapDispatchToProps = (dispatch: ThunkDispatch <any, any, any>)=>({
  register: (payload: any) => dispatch(registerThunk(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)