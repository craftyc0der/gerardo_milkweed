import * as React from 'react'
import { Field, InjectedFormProps, reduxForm, WrappedFieldInputProps, WrappedFieldProps, } from 'redux-form';
import Button from './Button';
import Input, { style as inputStyle} from './Input';

interface IUploadInputField {
  label: string,
  errorMessage: string
}

interface IUploadPostFormProps {
  disabled: boolean,
  failures: [],
}

const style = {
    error: {
        color: "red"
    }
  };

const handleChange = (input: WrappedFieldInputProps) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { onChange } = input
    const { files } = e.target
    if(files) {
        await onChange(files)
    }
}

const RenderFileField: React.StatelessComponent<WrappedFieldProps & IUploadInputField> = ({input, label, errorMessage}) => 
    <div>
        <span style={ inputStyle.span }>{ label }</span>
        <input onChange={handleChange(input)} type='file' accept='.jpg' multiple style={ inputStyle.input } />
        <span style={ style.error }>
            { errorMessage }
        </span>
    </div>

class UploadPostForm extends React.Component<InjectedFormProps<{}, IUploadPostFormProps> & IUploadPostFormProps> {
    
    public render() {
        const { handleSubmit, disabled, failures } = this.props
        let rf: string = "";
        if (failures) {
            rf = failures.join(", ")
            rf = rf + " failed to upload."
        }
        return (
            <form onSubmit={ handleSubmit }>
                <Field name='files' label='Images' errorMessage={rf} component={ RenderFileField } />
                <Button disabled={disabled}>Upload</Button>
            </form>
        )
    }
}

export default reduxForm<any, IUploadPostFormProps>({
    form: 'upload-new-post'
})(UploadPostForm)