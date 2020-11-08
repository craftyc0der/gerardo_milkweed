import * as React from 'react'
import { Field, InjectedFormProps, reduxForm, WrappedFieldInputProps, WrappedFieldProps, } from 'redux-form';
import Button from './Button';
import Input, { style as inputStyle} from './Input';

interface IUploadInputField {
  label: string,
  errorMessage: string
}

interface IUploadDataFormProps {
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
        await onChange(files[0])
    }
}

const RenderFileField: React.StatelessComponent<WrappedFieldProps & IUploadInputField> = ({input, label, errorMessage}) => 
    <div>
        <span style={ inputStyle.span }>{ label }</span>
        <input onChange={handleChange(input)} type='file' accept='.csv' style={ inputStyle.input } />
        <span style={ style.error }>
            { errorMessage }
        </span>
    </div>

class UploadDataForm extends React.Component<InjectedFormProps<{}, IUploadDataFormProps> & IUploadDataFormProps> {
    
    public render() {
        const { handleSubmit, disabled, failures } = this.props
        let rf: string = "";
        if (failures && failures.length > 0) {
            rf = failures.join(", ")
            rf = rf + " failed to upload."
        }
        return (
            <form onSubmit={ handleSubmit }>
                <Field name='file' label='CSV File' errorMessage={rf} component={ RenderFileField } />
                <Button disabled={disabled}>Upload</Button>
            </form>
        )
    }
}

export default reduxForm<any, IUploadDataFormProps>({
    form: 'upload-new-data'
})(UploadDataForm)