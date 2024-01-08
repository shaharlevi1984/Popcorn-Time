import React, { useState } from 'react';
import { Message, Icon } from 'semantic-ui-react';

const AlertMessage = ({ movieExists, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Message negative hidden={!visible}>
      <Icon name="exclamation circle" />
      <Message.Content>
        <Message.Header>Movie Already Exists</Message.Header>
        <p>This movie is already in the database.</p>
      </Message.Content>
      <Icon name="close" onClick={handleDismiss} />
    </Message>
  );
};

export default AlertMessage;
