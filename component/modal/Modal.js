import { Button, Modal Spinner } from "react-bootstrap";

function ModalCRUD(show, title, body, onClickSave, onClickClose, modalProps) {
  return (
    <Modal
      //   show={true}
      show={show}
      {...modalProps}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClickSave}>Simpan</Button>
        <Button onClick={onClickClose}>Batal</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCRUD;
