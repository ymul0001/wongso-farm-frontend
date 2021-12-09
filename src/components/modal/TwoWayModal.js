import { Modal, Button } from 'react-bootstrap';
import React from 'react';

const TwoWayModal = (props) => {
    const actionButtonColor = {
      create: "#BD7100",
      update: "#A49F2E",
      delete: "#AD0909",
      cancel: "rgba(138, 153, 168, .2)"
    }

    const getActionButtonColor = (actionlabel) => {
      let color = "";
      switch(actionlabel) {
        case "Create":
          color = actionButtonColor.create;
          break;
        case "Update":
          color = actionButtonColor.update;
          break;
        case "Delete":
          color = actionButtonColor.delete;
          break;
      }
      return color;
    }

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
            <Button className="float-end" style={{backgroundColor: getActionButtonColor(props.actionlabel), border: "none", borderRadius: "0px", marginLeft: "2%", width: "10%", height: "5vh"}} onClick={props.action}>{props.actionlabel}</Button>
            <Button className="float-end" style={{backgroundColor: actionButtonColor.cancel, border:"none", borderRadius: "0px", color: "#000000", width: "10%", height: "5vh"}} onClick={props.onHide}>Cancel</Button>
          </Modal.Body>
        </Modal>
      );
}


export default TwoWayModal;