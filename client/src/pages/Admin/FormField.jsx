import { Form, Label, Input, TextArea } from 'semantic-ui-react';

const FormField = ({ label, type, name, placeholder, value, onChange, ...props }) => {
  return (
    <Form.Field>
      <Label color='purple' size='small'>
        {label}:
      </Label>
      {type === 'textarea' ? (
        <TextArea
          style={{ marginTop: 10 }}
          name={name}
          placeholder={placeholder}
          value={value || ''}  
          onChange={onChange}
          {...props}
        />
      ) : type === 'file' ? (
        <Input 
          style={{ marginTop: 10, maxWidth: '250px' }} 
          type={type} 
          id={name} 
          name={name} 
          onChange={onChange} 
          {...props} />
      ) : (
        <Input
          style={{ marginTop: 10 }}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value || ''} 
          onChange={onChange}
          {...props}
        />
      )}
    </Form.Field>
  );
};

export default FormField;
