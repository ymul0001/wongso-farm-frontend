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
            <Button className="float-end" variant="danger" style={{border: "none", borderRadius: "0px", marginLeft: "2%", width: "10%", height: "4vh"}} onClick={props.onHide}>Close</Button>
          </Modal.Body>
        </Modal>
      );
}


export default PromptModal;