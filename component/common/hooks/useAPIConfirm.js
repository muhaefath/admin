import { useContext } from "react";
import { APIConfirmContext } from "../providers/APIConfirmProvider";

const useAPIConfirm = () => {
  const { openDialog } = useContext(APIConfirmContext);

  const getConfirmation = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { getConfirmation };
};
export default useAPIConfirm;
