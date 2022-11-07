import React from "react";
import APIConfirmNotification from "../../../APIConfirmNotification";

export const APIConfirmContext = React.createContext({});

export default function APIConfirmProvider({ children }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState({});

  const openDialog = ({ title, message, actionCallback, type }) => {
    setDialogOpen(true);
    setDialogConfig({ title, message, actionCallback, type });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.actionCallback(true);
  };

  const onDismiss = () => {
    resetDialog();
    dialogConfig.actionCallback(false);
  };

  return (
    <APIConfirmContext.Provider value={{ openDialog }}>
      <APIConfirmNotification
        open={dialogOpen}
        title={dialogConfig ? dialogConfig.title : ""}
        message={dialogConfig ? dialogConfig.message : ""}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
        type={dialogConfig ? dialogConfig.type : "confirm"}
      />
      {children}
    </APIConfirmContext.Provider>
  );
}
