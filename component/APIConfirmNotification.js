import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

function APIConfirmNotification({
  open,
  title,
  message,
  onConfirm,
  onDismiss,
  type = 'confirm',
}) {
  return (
    <>
    <Dialog
      visible={open && type === 'confirm'}
      onHide={onDismiss}
      style={{ width: "450px" }}
      header={title}
      footer={
        <div className="w100" style={{ display: "flex" }}>
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button p-component p-button-outlined p-button-danger w50"
            onClick={onDismiss}
          />
          <div style={{ width: "10px" }}></div>
          <Button
            label="Save"
            icon="pi pi-check"
            className="w50"
            onClick={onConfirm}
          />
        </div>
      }
      modal
    >
      <p>{message}</p>
    </Dialog>

    {/* helper dialog */}
    <Dialog
      visible={open && type === 'help'}
      onHide={onDismiss}
      style={{ width: "450px" }}
      header={title}
      footer={
        <div className="w100" style={{ display: "flex" }}>
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button p-component p-button-outlined p-button-danger w50"
            onClick={onDismiss}
          />
          <div style={{ width: "10px" }}></div>
          <Button
            label="Save"
            icon="pi pi-check"
            className="w50"
            onClick={onConfirm}
          />
        </div>
      }
      modal
    >
      <p>{message}</p>
    </Dialog>
    </>
  );
}

export default APIConfirmNotification;
