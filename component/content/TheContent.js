import classNames from "classnames";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { BreadCrumb } from "primereact/breadcrumb";
import Topbar from "./TheHeader";

var menuDataRaw = [];
const getMenuBreadCrumb = (item) => {
  if (item.id && item.parent) {
    var parentitem = menuDataRaw.find((x) => x.id === parseInt(item.parent));
    if (parentitem) {
      breadcrumbitems.unshift({ label: item.idname, url: item.route });
      getMenuBreadCrumb(parentitem);
    } else {
      breadcrumbitems.unshift({ label: item.idname, url: item.route });
      // console.log(breadcrumbitems)
      return;
    }
  }
};
var breadcrumbitems = [];
const home = { icon: "pi pi-home", url: "/home" };
const TheBreadCrumb = () => {
  breadcrumbitems = [];
  return (
    <BreadCrumb
      id="scmainbreadcrumb"
      model={[]}
      home={home}
      style={{
        float: "right",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
    />
  );
};
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function TheContent({ sidebarIsOpen, setSidebarOpen, title, setTitle }) {
  return (
    <div className={classNames("content", { "is-open": sidebarIsOpen })}>
      <Topbar
        setSidebarOpen={setSidebarOpen}
        sidebarIsOpen={sidebarIsOpen}
        title={title}
        setTitle={setTitle}
      />
      <Row id="scmainnav" style={{ display: "none" }}>
        <Col lg={6} sm={6} xs={6} className="isflex"></Col>
        <Col lg={6} sm={6} xs={6}>
          {/* <TheBreadCrumb /> */}
        </Col>
      </Row>
    </div>
  );
}

export default TheContent;
