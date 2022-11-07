import { Toast, ToastContainer } from "react-bootstrap";
import useAPINotif from "./common/hooks/useAPINotif";

function APINotification() {
  const { error, removeError } = useAPINotif();

  const handleClose = () => {
    removeError();
  };
  return (
    <ToastContainer
      position="bottom-end"
      className="p-3"
      style={{ height: "auto" }}
    >
      <Toast show={!!error} onClose={handleClose} autohide bg={error?.stat}>
        <Toast.Header>
          <strong className="me-auto">
            {error ? error.title : "Informasi"}
          </strong>
        </Toast.Header>
        <Toast.Body style={{ color: !error?.stat ? "black" : "white" }}>
          {error ? error.message : ""}
        </Toast.Body>
      </Toast>
    </ToastContainer>
    // <Toast ref={error} />
    // <Snackbar open={!!error} autoHideDuration={2000} onClose={handleClose}>
    //   <Alert onClose={handleClose} severity={severity}>
    //     {error ? error.message : ""}
    //   </Alert>
    // </Snackbar>
  );
}

export default APINotification;
