import Router from "next/router";
import { useEffect, useState } from "react";
import TheContent from "../component/content/TheContent";
import SideBar from "../component/sidebar/Sidebar";
import apputil from "../helper/apputil";

function Admin({ children, ...rest }) {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    try {
      let tmpUserData = apputil.getLocalStorage("_jz");
      const userData = JSON.parse(tmpUserData);
    } catch (error) {
      // console.log(error);
      Router.push("/login");
    }
  }, []);

  useEffect(() => {
    var tmpTitle = apputil.getMenuItemByPath().name;
    if (window.location.pathname == "/admin/profile") {
      tmpTitle = "Profile";
    }
    if (window.location.pathname == "/admin/notification") {
      tmpTitle = "Notification";
    }
    setTitle(tmpTitle);
  }, []);

  return (
    <div className="appwrapper">
      <SideBar
        sidebarIsOpen={sidebarIsOpen}
        setSidebarOpen={setSidebarOpen}
        title={title}
        setTitle={setTitle}
      />
      <div
        className="admin-view w100"
        style={{
          position: "inherit",
          overflow: "auto",
        }}
      >
        <TheContent
          sidebarIsOpen={sidebarIsOpen}
          setSidebarOpen={setSidebarOpen}
          title={title}
          setTitle={setTitle}
        />
        <div
          style={{
            padding: !sidebarIsOpen ? "0.5rem" : "0.5rem",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Admin;
