import React from "react";
import {
  reduxForm,
  InjectedFormProps,
  Field,
  WrappedFieldProps,
  WrappedFieldInputProps,
} from "redux-form";

interface IProfileImg {
  submitProfileImage: () => void;
  profileImage: string;
}

const style = {
  img: {
    borderRadius: "100%",
    height: '100px',
    width: '100px',
  },
  file: {
    display: "none",
  },
};

const handleChange = (
  submitProfileImage: () => void,
  input: WrappedFieldInputProps
) => async (e: React.ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  const { onChange } = input;
  const { files } = e.target;
  if (files) {
    await onChange(files[0]);
    submitProfileImage();
  }
};

const RenderField: React.StatelessComponent<
  WrappedFieldProps & IProfileImg
> = ({ input, submitProfileImage, profileImage }) => (
  <div>
    <input
      onChange={handleChange(submitProfileImage, input)}
      style={style.file}
      type="file"
      id="profileImage"
    />
    <label htmlFor="profileImage">
      <img
        style={style.img}
        src={profileImage}
        alt="profile"
      />
    </label>
  </div>
);

class ProfileImg extends React.Component<
  InjectedFormProps<{}, IProfileImg> & IProfileImg
> {
  render() {
    const { handleSubmit, submitProfileImage, profileImage} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="file"
          component={RenderField}
          submitProfileImage={submitProfileImage}
          profileImage={profileImage}
        />
      </form>
    );
  }
}

export default reduxForm<any, IProfileImg>({
  form: "profileImg",
})(ProfileImg);
