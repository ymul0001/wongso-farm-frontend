import { Modal, Button } from 'react-bootstrap';
import React from 'react';

const PromptModal = (props) => {
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {props.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {props.desc}
            </p>
            <Button className="float-end" variant="danger" onClick={props.onHide}>Close</Button>
          </Modal.Body>
        </Modal>
      );
}


export default PromptModal;