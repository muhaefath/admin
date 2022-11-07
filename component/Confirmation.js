import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { confirmable, createConfirmation } from "react-confirm";

class Confirmation extends React.Component {
  render() {
    const {
      proceedLabel,
      cancelLabel,
      title,
      confirmation,
      show,
      proceed,
      enableEscape = true,
    } = this.props;
    return (
      <div className="static-modal">
        <Modal
          centered
          show={show}
          onHide={() => proceed(false)}
          backdrop={enableEscape ? true : "static"}
          keyboard={enableEscape}
        >
          <Modal.Header>
            <Modal.Title className="">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
            {confirmation}
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-danger" onClick={() => proceed(true)}>
              {proceedLabel}
            </Button>
            <Button className="btn-cancel" onClick={() => proceed(false)}>
              {cancelLabel}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

Confirmation.propTypes = {
  okLabbel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
  enableEscape: PropTypes.bool,
};

export function confirm(
  title,
  confirmation,
  proceedLabel = "Ya",
  cancelLabel = "Keluar",
  options = {}
) {
  return createConfirmation(confirmable(Confirmation))({
    title,
    confirmation,
    proceedLabel,
    cancelLabel,
    ...options,
  });
}
