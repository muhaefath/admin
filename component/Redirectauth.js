import { useEffect } from "react";
import apputil from "../helper/apputil";

function RedirectAuth() {
  useEffect(() => {
    if (apputil.getCookie("session")) {
      window.location = "/login";
    }
  }, []);
  return <></>;
}
export default RedirectAuth;
