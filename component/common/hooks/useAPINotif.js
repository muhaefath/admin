import { useContext } from "react";
import { APINotifContext } from "../providers/APINotifProvider";

function useAPINotif() {
  const stat = {
    success: "success",
    error: "danger",
    info: "info",
    warning: "warning",
  };
  const { error, addError, removeError, isLoading, setIsLoading } =
    useContext(APINotifContext);
  return { error, stat, addError, removeError, isLoading, setIsLoading };
}

export default useAPINotif;
