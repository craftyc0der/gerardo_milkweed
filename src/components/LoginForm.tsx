import React, { Component } from "react";
import { Link } from "react-router-dom";
import { reduxForm, InjectedFormProps, Field } from "redux-form";

import Input from "./Input";
import Button from "./Button";
import Center from "./Center";

import { ILogin } from '../ducks/Users'

class LoginForm extends Component<InjectedFormProps<ILogin>> {
  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Field label='Email Address' placeholder='Email Address' name='email' type='email' component={Input}  />
        <Field label='Password' placeholder='Password' name='password' type='password' autoComplete="on" component={Input}  />
        <Button block={true}>Submit</Button>
        <Center>
          <Link to="/register">Register</Link>
        </Center>
      </form>
    );
  }
}

export default reduxForm<ILogin>({
  form: 'login',
})(LoginForm)
