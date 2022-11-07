import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Image } from "react-bootstrap";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css"; // skarang dari _app.js
import apputil from "../../helper/apputil";

// import sideBarData from "./SideBarData";

function SideBar({ sidebarIsOpen, setSidebarOpen, title, setTitle }) {
  const router = useRouter();
  const [sideBarData, setSideBarData] = useState([]);

  const [isWindow, setIsWindow] = useState(true);

  useEffect(() => {
    try {
      const listMenu = JSON.parse(apputil.getLocalStorage("_menu"));
      setSideBarData(listMenu ?? []);
    } catch (error) {}

    if (apputil.getLocalStorage("_opensb") == 1) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    const tmpIsWindow = apputil.isWindow();
    // console.log(tmpIsWindow);
    setIsWindow(tmpIsWindow);
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      setIsWindow(apputil.isWindow());
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function activeRoute(route) {
    try {
      const routeName = window.location.pathname;
      // console.log(routeName);
      return route == routeName;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  function recurSubMenu(menu, key) {
    if (menu.submenu) {
      return (
        <SubMenu
          key={key}
          title={
            !sidebarIsOpen ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* {menu.icon ? menu.icon : ""} */}
                {menu.icon ? (
                  <Image src={menu.icon} height="17px" width="17px"></Image>
                ) : (
                  ""
                )}
                <div style={{ width: ".8rem" }}></div>
                <a>{menu.name}</a>
              </div>
            ) : (
              <Image src={menu.icon}></Image>
              // menu.icon
            )
          }
          className="sb-pm-color sb-pm-text-color"
        >
          {menu.submenu.map((submenu, subkey) => recurSubMenu(submenu, subkey))}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem
          key={key}
          className={
            "sb-pm-color" + (activeRoute(menu.path_url) ? " active" : "")
          }
        >
          {menu.path_url ? (
            !sidebarIsOpen ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* {menu.icon ? menu.icon : ""} */}
                {menu.icon ? (
                  <img src={menu.icon} height="17px" width="17px"></img>
                ) : (
                  ""
                )}

                <div style={{ width: ".8rem" }}></div>
                <Link href={menu.path_url ?? "#"}>
                  <a
                    onClick={() => {
                      setTitle(menu.name);
                    }}
                  >
                    {menu.name}
                  </a>
                </Link>
              </div>
            ) : (
              <Link href={menu.path_url ?? "#"}>
                {/* {menu.icon ? menu.icon : menu.name} */}
                {menu.icon ? (
                  <img
                    src={menu.icon}
                    onClick={() => {
                      setTitle(menu.name);
                      apputil.setLocalStorage("_opensb", 1);
                    }}
                  ></img>
                ) : (
                  menu.name
                )}

                {/* untuk di submenu */}
              </Link>
            )
          ) : (
            <>{menu.name}</>
          )}
        </MenuItem>
      );
    }
  }

  function logout() {
    apputil.removeCookie("_jz");
    window.location = "/login";
  }
  return (
    <ProSidebar collapsed={sidebarIsOpen} className={!isWindow ? "hidden" : ""}>
      <SidebarHeader className="pm-white-color">
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: "18px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          <img src="/sidebar-logo.svg" height={"100px"} width="100%"></img>
        </div>
      </SidebarHeader>

      <SidebarContent
        className="sb-pm-color sb-pm-text-color"
        onMouseOver={(e) => {
          setSidebarOpen(false);
        }}
        onMouseLeave={(e) => {
          if (apputil.getLocalStorage("_opensb") == 1) {
            setSidebarOpen(true);
          }
        }}
      >
        {sideBarData.map((menu, key) => (
          <Menu
            key={key}
            iconShape="square"
            className="sb-pm-color sb-pm-text-color"
          >
            {recurSubMenu(menu)}
          </Menu>
        ))}
      </SidebarContent>
      <SidebarFooter
        className="sb-pm-color sb-pm-text-color"
        onMouseOver={(e) => {
          setSidebarOpen(false);
        }}
        onMouseLeave={(e) => {
          if (apputil.getLocalStorage("_opensb") == 1) {
            setSidebarOpen(true);
          }
        }}
      >
        <div style={{ fontSize: "12px" }}>
          <Menu iconShape="square" className="sb-pm-color sb-pm-text-color">
            <MenuItem className="sb-pm-color sb-pm-text-color">
              {!sidebarIsOpen ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/icons/sb-logout.svg"
                    height="17px"
                    width="17px"
                  ></img>
                  <div style={{ width: ".8rem" }}></div>
                  <Link href="#">
                    <a
                      onClick={() => {
                        logout();
                      }}
                    >
                      Logout
                    </a>
                  </Link>
                </div>
              ) : (
                <Link href="#">
                  <a
                    onClick={() => {
                      logout();
                    }}
                  >
                    <img src="/icons/sb-logout.svg"></img>
                  </a>
                </Link>
              )}
            </MenuItem>
          </Menu>
          {/* {!sidebarIsOpen ? "Copyright Project" : ""} */}
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
}

export default SideBar;
