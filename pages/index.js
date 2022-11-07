import Router from "next/router";
import React from "react";
import apputil from "../helper/apputil";

export default function Index() {
  React.useEffect(() => {
    const userData = apputil.getLocalStorage("_jz");
    if (userData) {
      Router.push("/admin/dashboard");
    }
    Router.push("/login");
  });

  return <div />;
}
