import {
  faBars,
  faBed,
  faBell,
  faCalendar,
  faCheckCircle,
  faCreditCard,
  faPlus,
  faRemove,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import useAPINotif from "../../component/common/hooks/useAPINotif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { confirm } from "../../component/Confirmation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Button,
  Col,
  Collapse,
  Container,
  Dropdown,
  Nav,
  Navbar,
  Form,
  NavDropdown,
  Offcanvas,
  Row,
  InputGroup,
  Image,
  Modal,
  Spinner,
} from "react-bootstrap";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
import apputil from "../../helper/apputil";
import settingService from "../../_api/admin/SettingService";
import projectService from "../../_api/admin/ProjectService";
import { Typeahead } from "react-bootstrap-typeahead";
import { FallbackImage } from "../FallbackImage";

const Topbar = ({ setSidebarOpen, sidebarIsOpen, title, setTitle }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);
  const [userData, setUserData] = useState(null);

  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [isWindow, setIsWindow] = useState(true);
  const [sideBarData, setSideBarData] = useState([]);

  const { addError, stat, setIsLoading } = useAPINotif();

  const [dsKlasifikasi, setDSKlasifikasi] = useState([]);
  const [dsItem, setDSItem] = useState([]);
  const [dsPriority, setDSPriority] = useState([]);
  const [dsPenggunaJasa, setDSPenggunaJasa] = useState([]);
  const [documents, setDocuments] = useState([
    {
      no_dokumen: "",
      nama_dokumen: "",
      nama_dokumen2: "",
      file: null,
    },
  ]);
  const dsDoc = ["SPK", "PO"];

  const [profilePicture, setProfilePicture] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [validated, setValidated] = useState(false); //data project
  const [errorMessage, setErrorMessage] = useState("");
  const [notifData, setNotifData] = useState([]);
  const [showModalCU, setShowModalCU] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatedReject, setValidatedReject] = useState(false); //data reject
  const [rejectReason, setRejectReason] = useState("");
  const [errorMessageReject, setErrorMessageReject] = useState("");
  const [errorMessageApprove, setErrorMessageApprove] = useState("");
  const [showModalReject, setShowModalReject] = useState(false);

  const [errorMessagePaymentSchedule, setErrorMessagePaymentSchedule] =
    useState("");
  const [errorMessagePaymentReSchedule, setErrorMessagePaymentReSchedule] =
    useState("");
  const [showModalPaymentSchedule, setShowModalPaymentSchedule] =
    useState(false);
  const [validatedPaymentSchedule, setValidatedPaymentSchedule] =
    useState(false); //data payment schedule
  const [validatedPaymentReSchedule, setValidatedPaymentReSchedule] =
    useState(false); //data payment reschedule
  const [paymentScheduleDate, setPaymentScheduleDate] = useState("");

  const [paymentReScheduleOptionValue, setPaymentReScheduleOptionValue] =
    useState("");

  const [showModalApproveDone, setShowModalApproveDone] = useState(false);
  const [showModalRejectDone, setShowModalRejectDone] = useState(false);
  const [showModalPaymentScheduleDone, setShowModalPaymentScheduleDone] =
    useState(false);
  const [showModalPaymentReSchedule, setShowModalPaymentReSchedule] =
    useState(false);

  const [configModalCU, setConfigModalCU] = useState({
    title: "View Project",
    closeLabel: "Keluar",
    cancelLabel: "Batal",
    saveLabel: "Simpan",
  });

  const [editItem, setEditItem] = useState({});

  useEffect(() => {
    try {
      setInterval(() => {
        if (apputil.getLocalStorage("_pp")) {
          let pp = apputil.getLocalStorage("_pp");
          setProfilePicture(pp);
        }
      }, 1000);
    } catch (error) {}
    try {
      const listMenu = JSON.parse(apputil.getLocalStorage("_menu"));
      setSideBarData(listMenu ?? []);
    } catch (error) {}

    try {
      let tmpUserData = apputil.getLocalStorage("_jz");
      setUserData(JSON.parse(tmpUserData));

      const tmpTitle = apputil.getMenuItemByPath().name;
      setTitle(tmpTitle);
    } catch (error) {
      // console.log(error);
    }
    setIsWindow(apputil.isWindow());
  }, []);

  useEffect(() => {
    getNotification();
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      setIsWindow(apputil.isWindow());
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  async function getNotification() {
    try {
      var res = await settingService.getNotification();
      if (res.status == "ok") {
        setNotifData(res.data ?? []);
      }
    } catch (error) {}
  }

  async function getProjectItem(id, onSuccess) {
    try {
      var res = await projectService.getProjectDetail({
        id,
      });
      if (res.status == "ok") {
        // console.log(res.data[0]);
        onSuccess(res.data[0]);
      }
    } catch (error) {}
  }

  async function approveProject(project) {
    if (isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      var res = await projectService.approveProject({
        project_id: project.id,
      });
      if (res.status == "ok") {
        setShowModalApproveDone(true);
        // addError("Informasi", res.pesan, stat.success);
        getNotification();
        setShowModalCU(false);
        setErrorMessage("");
        setErrorMessageApprove("");
        // window.location.reload();
        apputil.setLocalStorage("refresh_dashboard", 1);
      } else {
        setErrorMessageApprove(res.pesan);
      }
    } catch (error) {}
    setIsSubmitting(false);
  }

  async function rejectProject(project, rejectMessage) {
    if (isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      var res = await projectService.rejectProject({
        project_id: project.id,
        alasan: rejectMessage,
      });
      if (res.status == "ok") {
        setShowModalRejectDone(true);
        // addError("Informasi", res.pesan, stat.success);
        getNotification();
        setShowModalReject(false);
        setErrorMessageReject("");
        // window.location.reload();
        apputil.setLocalStorage("refresh_dashboard", 1);
      } else {
        setErrorMessageReject(res.pesan);
      }
    } catch (error) {}
    setIsSubmitting(false);
  }

  async function paymentSchedulingProject(project, inputDate) {
    if (isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      var res = await projectService.paymentScheduleProject({
        project_id: project.id,
        payment_date: inputDate,
      });
      if (res.status == "ok") {
        setShowModalPaymentScheduleDone(true);
        // addError("Informasi", res.pesan, stat.success);
        getNotification();
        setShowModalPaymentSchedule(false);
        setErrorMessagePaymentSchedule("");
        // window.location.reload();
        apputil.setLocalStorage("refresh_dashboard", 1);
      } else {
        setErrorMessagePaymentSchedule(res.pesan);
      }
    } catch (error) {}
    setIsSubmitting(false);
  }

  async function paymentTransferredProject(project) {
    if (isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      var res = await projectService.paymentTransferredProject({
        project_id: project.id,
      });
      if (res.status == "ok") {
        getProject();
        getDashboard(filterDashboard);
        setShowModalPaymentReSchedule(false);
        setErrorMessagePaymentReSchedule("");
        apputil.setLocalStorage("refresh_dashboard", 1);
      } else {
        console.log(res.pesan);
        setErrorMessagePaymentReSchedule(res.pesan ?? "");
      }
    } catch (error) {}
    setIsSubmitting(false);
  }

  function recurSubMenu(menu, key) {
    if (menu.submenu) {
      return (
        <SubMenu
          id="topheadersidebar"
          key={key}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              {menu.icon ? (
                <Image
                  src={menu.icon}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(18%) sepia(7%) saturate(451%) hue-rotate(104deg) brightness(97%) contrast(93%)",
                  }}
                  height="17px"
                  width="17px"
                ></Image>
              ) : (
                ""
              )}
              <div style={{ width: ".8rem" }}></div>
              <a>{menu.name}</a>
            </div>
          }
          className=" "
        >
          {menu.submenu.map((submenu, subkey) => recurSubMenu(submenu, subkey))}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem
          key={key}
          className={" " + (activeRoute(menu.path_url) ? " active" : "")}
        >
          {menu.path_url ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {menu.icon ? (
                <Image
                  src={menu.icon}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(18%) sepia(7%) saturate(451%) hue-rotate(104deg) brightness(97%) contrast(93%)",
                  }}
                  height="17px"
                  width="17px"
                ></Image>
              ) : (
                <></>
              )}

              <div style={{ width: ".8rem" }}></div>
              <Link href={menu.path_url ?? "#"}>
                <a
                  onClick={() => {
                    setTitle(menu.name);
                    setShowOffCanvas(!showOffCanvas);
                  }}
                >
                  {menu.name}
                </a>
              </Link>
            </div>
          ) : (
            <>{menu.name}</>
          )}
        </MenuItem>
      );
    }
  }

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

  function logout() {
    apputil.removeCookie("_jz");
    window.location = "/login";
  }

  let expand = "lg";
  return (
    <>
      <Navbar
        key={expand}
        expand={expand}
        className="header-pm-color header-pm-textcolor"
      >
        <Container fluid>
          <Button
            onClick={() => {
              setSidebarOpen(!sidebarIsOpen);
              if (!sidebarIsOpen) {
                apputil.setLocalStorage("_opensb", 0);
              }
            }}
            className="btn-sidebar header-pm-color mr-2"
            style={{
              borderRadius: "50%",
              border: "1px solid white",
              marginLeft: "10px",
              display: isWindow ? "block" : "none",
            }}
          >
            <FontAwesomeIcon icon={sidebarIsOpen ? faBars : faTimes} />
          </Button>
          <Navbar.Brand href="#" style={{ color: "white" }}>
            {title}
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() => {
              setShowOffCanvas(!showOffCanvas);
            }}
            className="nav-toogler-icon"
            aria-controls={`offcanvasNavbar-expand-${expand}`}
          />

          <Navbar.Offcanvas
            show={showOffCanvas}
            onHide={setShowOffCanvas}
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
            style={{ width: isWindow ? "auto" : "80%" }}
          >
            <Offcanvas.Header style={{}} closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            {isWindow ? (
              <Offcanvas.Body
                style={{
                  background: isWindow ? "transparent" : "lightgrey",
                }}
              >
                <Nav
                  className="justify-content-end flex-grow-1 pe-3"
                  style={{
                    gap: "10px",
                    height: "50px",
                    alignItems: "center",
                    display: !isWindow ? "grid" : "inherit",
                  }}
                >
                  <Nav.Link
                    style={{
                      marginRight: "10px",
                      marginLeft: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {isWindow ? "" : title}
                  </Nav.Link>
                  <Form
                    className="d-flex"
                    style={{ justifyContent: "end", height: "40px" }}
                  >
                    <InputGroup
                      style={{
                        width: isWindow ? "70%" : "100%",
                        background: "white",
                        borderRadius: "50px",
                        border: "1px solid lightgrey",
                      }}
                      className="border-circle"
                    >
                      <Form.Control
                        type="search"
                        placeholder="Search"
                        className="shadow-none"
                        aria-label="Search"
                        style={{
                          border: "0px solid white",
                          borderRight: "0px solid",
                          borderRadius: "50px",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                      <InputGroup.Text
                        id="basic-addon2"
                        style={{
                          background: "white",
                          border: "0px solid white",
                          borderRadius: "50px",
                          paddingLeft: "0",
                        }}
                        className="btn  border-rounded-circle"
                        onClick={() => {}}
                      >
                        {
                          <img
                            src="/icons/search.svg"
                            className="icon-2"
                            height="20px"
                            width="20px"
                          />
                        }
                      </InputGroup.Text>
                    </InputGroup>
                  </Form>

                  <NavDropdown
                    className="noddlicon"
                    drop="start"
                    title={
                      <div
                        style={{
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                          lineHeight: "40px",
                          textAlign: "center",
                          border: "1px solid white",
                          marginLeft: "5px",
                          marginRight: "5px",
                          color: "white",
                        }}
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </div>
                    }
                  >
                    <Dropdown.Header>Notification</Dropdown.Header>
                    <Dropdown.Divider />
                    <div style={{ height: "300px", overflow: "auto" }}>
                      {notifData.map((x, key) => {
                        return (
                          <Dropdown.Item
                            key={key}
                            style={{ width: "280px" }}
                            onClick={() => {
                              setTitle("Notification");
                              getProjectItem(
                                x.project_id,
                                function (objProject) {
                                  objProject.user_view = 1;
                                  try {
                                    objProject.klasifikasi = dsKlasifikasi.find(
                                      (x) => x.name == objProject.klasifikasi
                                    ).id;
                                  } catch (error) {
                                    console.log(error);
                                  }
                                  try {
                                    objProject.item = dsItem.find(
                                      (x) => x.name == objProject.item
                                    ).id;
                                  } catch (error) {
                                    console.log(error);
                                  }
                                  try {
                                    objProject.priority = dsPriority.find(
                                      (x) => x.name == objProject.priority
                                    ).id;
                                  } catch (error) {
                                    console.log(error);
                                  }
                                  objProject.start_project = apputil.formatDate(
                                    objProject.start_project,
                                    "YYYY-MM-DD"
                                  );
                                  objProject.end_project = apputil.formatDate(
                                    objProject.end_project,
                                    "YYYY-MM-DD"
                                  );
                                  objProject.project_value =
                                    apputil.formatCurrency(
                                      objProject.project_value
                                    );
                                  setEditItem(objProject);

                                  for (
                                    let index = 0;
                                    index < objProject.documents.length;
                                    index++
                                  ) {
                                    const element = objProject.documents[index];
                                    if (!dsDoc.includes(element.nama_dokumen)) {
                                      objProject.documents[index].nama_dokumen =
                                        "lainnya";
                                      objProject.documents[
                                        index
                                      ].nama_dokumen2 = element.nama_dokumen;
                                    } else {
                                      objProject.documents[
                                        index
                                      ].nama_dokumen2 = element.nama_dokumen;
                                    }
                                  }
                                  setDocuments(objProject.documents);
                                  let tmpConf = { ...configModalCU };
                                  tmpConf.title = `Detail Project`;
                                  setConfigModalCU(tmpConf);
                                  setShowModalCU(true);
                                  setErrorMessage("");
                                  setErrorMessageApprove("");
                                  setValidated(false);
                                }
                              );
                            }}
                          >
                            <Row>
                              <Col lg={2} sm={2}>
                                <img
                                  src="/images/background1.jpeg"
                                  style={{
                                    height: "50px",
                                    width: "50px",
                                    borderRadius: "50%",
                                  }}
                                ></img>
                              </Col>
                              <Col lg={1} sm={1}></Col>
                              <Col lg={8} sm={8}>
                                <div style={{ fontSize: "12px" }}>
                                  {x.title}
                                </div>
                                <p style={{ fontSize: "12px" }}>{x.contents}</p>
                              </Col>
                            </Row>
                          </Dropdown.Item>
                        );
                      })}
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      href="/admin/notification"
                      onClick={() => {
                        setTitle("Notification");
                      }}
                    >
                      See all notifications
                    </Dropdown.Item>
                  </NavDropdown>
                  <div
                    style={{
                      lineHeight: "normal",
                    }}
                  >
                    <div
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      {userData ? userData.full_name : ""}
                    </div>
                    <div style={{ color: "white", fontSize: "16px" }}>
                      {userData ? userData.role_name : ""}
                    </div>
                  </div>
                  <NavDropdown
                    className="noddlicon"
                    style={{ padding: "0" }}
                    drop="start"
                    title={
                      <FallbackImage
                        src={profilePicture}
                        onErrorImage={"/images/default_account.jpeg"}
                        height="40px"
                        width="40px"
                        style={{
                          borderRadius: "50px",
                        }}
                      ></FallbackImage>
                    }
                  >
                    <Dropdown.Item
                      eventKey="1"
                      href="/admin/profile"
                      onClick={() => {
                        setTitle("Profile");
                      }}
                    >
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() => {
                        logout();
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                  </NavDropdown>
                </Nav>
              </Offcanvas.Body>
            ) : (
              <div className="offcanvas-body h-100">
                <ProSidebar collapsed={false} id="offcanvassidebar">
                  <SidebarContent style={{ background: "white" }}>
                    {sideBarData.map((menu, key) => (
                      <Menu key={key} iconShape="square">
                        {recurSubMenu(menu)}
                      </Menu>
                    ))}
                  </SidebarContent>
                  <SidebarFooter style={{ background: "white" }}>
                    <div style={{ fontSize: "12px" }}>
                      <Menu iconShape="square" className=" ">
                        <MenuItem className=" ">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src="/icons/bell.svg"
                              style={{
                                filter:
                                  "brightness(0) saturate(100%) invert(18%) sepia(7%) saturate(451%) hue-rotate(104deg) brightness(97%) contrast(93%)",
                              }}
                              height="17px"
                              width="17px"
                            ></img>
                            <div style={{ width: ".8rem" }}></div>
                            <Link href="/admin/notification">
                              <a
                                onClick={() => {
                                  setTitle("Notification");
                                  setShowOffCanvas(!showOffCanvas);
                                }}
                              >
                                Notification
                              </a>
                            </Link>
                          </div>
                        </MenuItem>
                        <MenuItem className=" ">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src="/icons/sb-logout.svg"
                              style={{
                                filter:
                                  "brightness(0) saturate(100%) invert(18%) sepia(7%) saturate(451%) hue-rotate(104deg) brightness(97%) contrast(93%)",
                              }}
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
                        </MenuItem>
                        <MenuItem className=" ">
                          <Link href="/admin/profile">
                            <a
                              className="menu-link"
                              onClick={() => {
                                setTitle("Profile");
                                setShowOffCanvas(!showOffCanvas);
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ width: "100%" }}>
                                  <div
                                    className="d-flex fz-14 fw-bold lh-sm"
                                    style={{ color: "#6c757d!important" }}
                                  >
                                    {userData ? userData.full_name : ""}
                                  </div>
                                  <div
                                    className="d-flex fz-14 lh-sm"
                                    style={{ color: "#6c757d!important" }}
                                  >
                                    {userData ? userData.role_name : ""}
                                  </div>
                                </div>
                                <FallbackImage
                                  src={profilePicture}
                                  onErrorImage={"/images/default_account.jpeg"}
                                  className="headerimage"
                                  height="40px"
                                  width="40px"
                                  style={{
                                    borderRadius: "50px",
                                    filter: "none !important",
                                  }}
                                ></FallbackImage>
                              </div>
                            </a>
                          </Link>
                        </MenuItem>
                      </Menu>
                    </div>
                  </SidebarFooter>
                </ProSidebar>
              </div>
            )}
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <Modal
        centered
        show={showModalCU}
        onShow={() => {}}
        dialogClassName={isWindow ? "modal-80w" : ""}
      >
        <Modal.Header>
          <Modal.Title>
            {configModalCU.title}{" "}
            {editItem.id ? (
              <span
                className={
                  "ml-2 project-status " +
                  projectService.funcGetProjectStatusClass(editItem.label)
                }
                style={{ fontSize: "16px" }}
              >
                {editItem.label}
              </span>
            ) : (
              ""
            )}
          </Modal.Title>
        </Modal.Header>

        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => {
            const form = e.currentTarget;
            setValidated(true);
            e.preventDefault();
            e.stopPropagation();
            if (!form.checkValidity()) {
              return;
            }
            // onCreateProject(editItem);
          }}
        >
          <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
            <Row>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image src="/icons/project/tag.svg" className="icon-2 mr-2" />
                  <Form.Label>Klasifikasi Project</Form.Label>
                  <Form.Select
                    disabled={editItem.user_view == 1 ? true : false}
                    value={editItem.klasifikasi}
                    required
                    onChange={(e) => {
                      try {
                        let tmpSelectedItem = {
                          ...editItem,
                        };
                        tmpSelectedItem.klasifikasi = e.target.value;
                        setEditItem(tmpSelectedItem);
                      } catch (error) {}
                    }}
                  >
                    <option value="">Select Klasifikasi</option>
                    {dsKlasifikasi.map((x, key) => {
                      return (
                        <option key={key} value={x.id}>
                          {x.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Pilih klasifikasi
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/tag2.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Item Project</Form.Label>
                  <Form.Select
                    disabled={editItem.user_view == 1 ? true : false}
                    value={editItem.item}
                    required
                    onChange={(e) => {
                      try {
                        let tmpSelectedItem = {
                          ...editItem,
                        };
                        tmpSelectedItem.item = e.target.value;
                        setEditItem(tmpSelectedItem);
                      } catch (error) {}
                    }}
                  >
                    <option value="">Select Item</option>
                    {dsItem.map((x, key) => {
                      return (
                        <option key={key} value={x.id}>
                          {x.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Pilih item
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/paper.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Nama Project</Form.Label>
                  <Form.Control
                    disabled={editItem.user_view == 1 ? true : false}
                    value={editItem.project_name}
                    required
                    placeholder={"Silahkan isi nama project"}
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.project_name = e.target.value;
                      setEditItem(tmpSelectedItem);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Masukkan nama project
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/profile.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Pengguna Jasa</Form.Label>
                  <Typeahead
                    disabled={editItem.user_view == 1 ? true : false}
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.pengguna_jasa = e[0].company_name;
                      tmpSelectedItem.id_pengguna_jasa = e[0].id;
                      setEditItem(tmpSelectedItem);
                    }}
                    labelKey={"company_name"}
                    options={dsPenggunaJasa}
                    placeholder="Pilih pengguna jasa"
                    defaultInputValue={
                      editItem.pengguna_jasa ? editItem.pengguna_jasa : ""
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Pilih pengguna jasa
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/layer.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    disabled={editItem.user_view == 1 ? true : false}
                    value={editItem.priority}
                    required
                    onChange={(e) => {
                      try {
                        let tmpSelectedItem = {
                          ...editItem,
                        };
                        tmpSelectedItem.priority = e.target.value;
                        setEditItem(tmpSelectedItem);
                      } catch (error) {}
                    }}
                  >
                    <option value="">Select Priority</option>
                    {dsPriority.map((x, key) => {
                      return (
                        <option key={key} value={x.id}>
                          {x.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Pilih priority
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/coin.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Project Value</Form.Label>

                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">Rp</InputGroup.Text>
                    <Form.Control
                      disabled={editItem.user_view == 1 ? true : false}
                      value={editItem.project_value}
                      required
                      maxLength={15}
                      onChange={(e) => {
                        try {
                          e.target.value = apputil.removeDgtGroup(
                            e.target.value
                          );
                          parseInt(e.target.value);
                          if (apputil.onlyNumberKey(e.target.value)) {
                            let tmpSelectedItem = {
                              ...editItem,
                            };
                            tmpSelectedItem.project_value =
                              apputil.formatCurrency(
                                e.target.value.replace(/\D/g, "")
                              );
                            setEditItem(tmpSelectedItem);
                          }
                        } catch (error) {}
                      }}
                    />
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    Masukkan nilai project
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/play-circle.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    disabled={editItem.user_view == 1 ? true : false}
                    type="date"
                    value={editItem.start_project}
                    required
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.start_project = e.target.value;
                      tmpSelectedItem.end_project = apputil.formatDate(
                        apputil.addDays(new Date(e.target.value), 10),
                        "YYYY-MM-DD"
                      );
                      setEditItem(tmpSelectedItem);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Pilih tanggal mulai
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={isWindow ? 6 : 12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/stop-circle.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    disabled={editItem.user_view == 1 ? true : false}
                    type="date"
                    value={editItem.end_project}
                    required
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.end_project = e.target.value;
                      setEditItem(tmpSelectedItem);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Pilih tanggal selesai
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <h5>Dokumen Referensi</h5>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {documents.map((objFile, key) => {
                return (
                  <Row
                    key={key}
                    style={{ alignItems: "center" }}
                    className="mb-3"
                  >
                    <Col lg={isWindow ? 11 : 12}>
                      <div
                        style={{
                          border: "1px solid #CED4DA",
                          borderRadius: "5px",
                          padding: "1rem",
                        }}
                        className=" position-relative"
                      >
                        <Row>
                          <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlInput1"
                            hidden={editItem.user_view == 1}
                          >
                            <Form.Label>Nama Dokumen</Form.Label>
                            <Form.Select
                              value={objFile.nama_dokumen}
                              required
                              disabled={editItem.user_view == 1 ? true : false}
                              onChange={(e) => {
                                try {
                                  let tmpArr = [...documents];
                                  for (
                                    let index = 0;
                                    index < tmpArr.length;
                                    index++
                                  ) {
                                    if (index == key) {
                                      tmpArr[index].nama_dokumen =
                                        e.target.value;
                                      setDocuments(tmpArr);
                                      break;
                                    }
                                  }
                                } catch (error) {}
                              }}
                            >
                              <option value="">Pilih nama dokumen</option>
                              <option value={"SPK"}>SPK</option>
                              <option value={"PO"}>PO</option>
                              <option value={"lainnya"}>Lainnya</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Pilih nama dokumen
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Row>
                        <Row>
                          <Col lg={isWindow ? 6 : 12}>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Nomor Referensi Dokumen</Form.Label>
                              <Form.Control
                                disabled={
                                  editItem.user_view == 1 ? true : false
                                }
                                required
                                value={objFile.no_dokumen}
                                placeholder={
                                  "Silahkan isi nomor referensi dokumen"
                                }
                                onChange={(e) => {
                                  try {
                                    let tmpArr = [...documents];
                                    for (
                                      let index = 0;
                                      index < tmpArr.length;
                                      index++
                                    ) {
                                      if (index == key) {
                                        tmpArr[index].no_dokumen =
                                          e.target.value;
                                        setDocuments(tmpArr);
                                        break;
                                      }
                                    }
                                  } catch (error) {
                                    console.log(error);
                                  }
                                }}
                              />
                              <Form.Control.Feedback type="invalid">
                                Masukkan nomor referensi
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          {objFile.nama_dokumen == "lainnya" ||
                          editItem.user_view == 1 ? (
                            <Col lg={isWindow ? 6 : 12}>
                              <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlInput1"
                              >
                                <Form.Label>Nama Dokumen</Form.Label>
                                <Form.Control
                                  disabled={
                                    editItem.user_view == 1 ? true : false
                                  }
                                  required
                                  value={objFile.nama_dokumen2}
                                  placeholder={"Silahkan isi nama dokumen"}
                                  onChange={(e) => {
                                    try {
                                      let tmpArr = [...documents];
                                      for (
                                        let index = 0;
                                        index < tmpArr.length;
                                        index++
                                      ) {
                                        if (index == key) {
                                          tmpArr[index].nama_dokumen2 =
                                            e.target.value;
                                          setDocuments(tmpArr);
                                          break;
                                        }
                                      }
                                    } catch (error) {
                                      console.log(error);
                                    }
                                  }}
                                />
                                <Form.Control.Feedback type="invalid">
                                  Masukkan nama dokumen
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          ) : (
                            ""
                          )}
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Dokumen Referensi</Form.Label>
                              {objFile.url_dokumen ? (
                                <a href={objFile.url_dokumen} target="_blank">
                                  <Image
                                    src={objFile.url_dokumen}
                                    onError={(e) => {
                                      e.target.src =
                                        "/images/no_image_lanscape.png";
                                    }}
                                    // src="https://image.shutterstock.com/shutterstock/photos/1883859943/display_1500/stock-photo-the-word-example-is-written-on-a-magnifying-glass-on-a-yellow-background-1883859943.jpg"
                                    className="img-cover"
                                    width="100%"
                                    height="150px"
                                  ></Image>
                                </a>
                              ) : (
                                ""
                              )}
                              <Form.Control
                                disabled={
                                  editItem.user_view == 1 ? true : false
                                }
                                hidden={editItem.user_view == 1}
                                required
                                type={"file"}
                                onChange={(e) => {
                                  try {
                                    let tmpArr = [...documents];
                                    for (
                                      let index = 0;
                                      index < tmpArr.length;
                                      index++
                                    ) {
                                      if (index == key) {
                                        // console.log(e.target.files);
                                        const file = e.target.files[0];
                                        apputil.base64Convert(
                                          file,
                                          (fileRes) => {
                                            tmpArr[index].file = fileRes;

                                            setDocuments(tmpArr);
                                          }
                                        );
                                        break;
                                      }
                                    }
                                  } catch (error) {
                                    console.log(error);
                                  }
                                }}
                              />
                            </Form.Group>
                            <Form.Control.Feedback type="invalid">
                              Pilih file
                            </Form.Control.Feedback>
                          </Col>
                        </Row>
                        {key > 0 && editItem.user_view != 1 ? (
                          <Button
                            className={"rounded-btn btn-minus-project"}
                            onClick={() => {
                              let projectDocFiles = [...documents];
                              projectDocFiles = apputil.removeArrItem(
                                projectDocFiles,
                                key
                              );
                              setDocuments(projectDocFiles);
                            }}
                          >
                            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                    {key == documents.length - 1 && editItem.user_view != 1 ? (
                      <Col lg={isWindow ? 1 : 12}>
                        <Button
                          className={
                            "btn-light-blue" +
                            (isWindow ? " rounded-btn " : " mt-2 w100")
                          }
                          onClick={() => {
                            let projectDocFiles = [...documents];
                            projectDocFiles.push({
                              no_dokumen: "",
                              nama_dokumen: "",
                              file: null,
                            });
                            setDocuments(projectDocFiles);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="mr-3"
                          ></FontAwesomeIcon>
                          {isWindow ? "" : "Tambah Dokumen Referensi"}
                        </Button>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                );
              })}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {errorMessage != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessage}
              </div>
            ) : (
              ""
            )}
            {errorMessageApprove != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessageApprove}
              </div>
            ) : (
              ""
            )}
            {userData?.role_name == "Approver" &&
            editItem.label == "Waiting for Approval" ? (
              <Button
                className="btn-save"
                onClick={() => {
                  approveProject(editItem);
                }}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-1"
                ></FontAwesomeIcon>
                {"Approve"}
              </Button>
            ) : (
              ""
            )}
            {userData?.role_name == "Approver" &&
            editItem.label == "Waiting for Approval" ? (
              <Button
                className="btn-reject"
                onClick={() => {
                  setShowModalCU(false);
                  setShowModalReject(true);
                  setValidatedReject(false);
                  setRejectReason("");
                }}
              >
                <FontAwesomeIcon
                  icon={faRemove}
                  className="mr-1"
                  color="red"
                ></FontAwesomeIcon>
                {"Reject"}
              </Button>
            ) : (
              ""
            )}
            {userData?.role_name == "Finance" &&
            editItem.label == "Approved" ? (
              <Button
                className="btn-save"
                onClick={() => {
                  setShowModalCU(false);
                  setShowModalPaymentSchedule(true);
                  setValidatedPaymentSchedule(false);
                  setPaymentScheduleDate("");
                }}
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="mr-1"
                ></FontAwesomeIcon>
                {"On Payment Schedule"}
              </Button>
            ) : (
              ""
            )}
            {userData?.role_name == "Finance" &&
            editItem.label == "On Payment Schedule" ? (
              <Button
                className="btn-save"
                onClick={async () => {
                  setShowModalPaymentReSchedule(true);
                  setErrorMessagePaymentReSchedule("");
                  setPaymentReScheduleOptionValue("");
                  setValidatedPaymentReSchedule(false);
                  setShowModalCU(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="mr-1"
                ></FontAwesomeIcon>
                {"Set Payment Status"}
              </Button>
            ) : (
              ""
            )}
            <Button
              className="btn-cancel"
              onClick={async () => {
                setShowModalCU(false);
              }}
            >
              {editItem.user_view == 1
                ? configModalCU.closeLabel
                : configModalCU.cancelLabel}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Reject */}
      <Modal
        centered
        show={showModalReject}
        onShow={() => {}}
        dialogClassName={isWindow ? "modal-80w" : ""}
      >
        <Modal.Header>
          <Modal.Title>{"Reject Project"}</Modal.Title>
        </Modal.Header>
        <Form
          noValidate
          validated={validatedReject}
          onSubmit={(e) => {
            const form = e.currentTarget;
            setValidatedReject(true);
            e.preventDefault();
            e.stopPropagation();
            if (!form.checkValidity()) {
              return;
            }
            rejectProject(editItem, rejectReason);
          }}
        >
          <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/project/paper.svg" className="icon-2 mr-2" />
              <Form.Label>Alasan Reject</Form.Label>
              <Form.Control
                value={rejectReason}
                required
                placeholder={"Silahkan isi alasan reject"}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan alasan reject
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            {errorMessageReject != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessageReject}
              </div>
            ) : (
              ""
            )}
            <Button className="btn-reject" type="submit">
              {isSubmitting ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faRemove}
                    className="mr-1"
                    color="red"
                  ></FontAwesomeIcon>
                  {"Reject"}
                </>
              )}
            </Button>
            <Button
              className="btn-cancel"
              onClick={async () => {
                setShowModalReject(false);
              }}
            >
              {editItem.user_view == 1
                ? configModalCU.closeLabel
                : configModalCU.cancelLabel}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* approved done modal */}
      <Modal
        centered
        show={showModalApproveDone}
        onShow={() => {}}
        dialogClassName={isWindow ? " " : ""}
      >
        <Modal.Body style={{ textAlign: "center" }}>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="mb-3"
            style={{ height: "100px", color: "#0047AB" }}
          ></FontAwesomeIcon>
          <h5>Approval Berhasil Terkirim!</h5>
        </Modal.Body>

        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button
            className="btn-cancel"
            onClick={async () => {
              setShowModalApproveDone(false);
            }}
          >
            Selesai
          </Button>
        </Modal.Footer>
      </Modal>

      {/* reject done modal */}
      <Modal
        centered
        show={showModalRejectDone}
        onShow={() => {}}
        dialogClassName={isWindow ? " " : ""}
      >
        <Modal.Body style={{ textAlign: "center" }}>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="mb-3"
            style={{ height: "100px", color: "#0047AB" }}
          ></FontAwesomeIcon>
          <h5>Reject Berhasil Terkirim!</h5>
        </Modal.Body>

        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button
            className="btn-cancel"
            onClick={async () => {
              setShowModalRejectDone(false);
            }}
          >
            Selesai
          </Button>
        </Modal.Footer>
      </Modal>

      {/* payment schedule */}
      <Modal
        centered
        show={showModalPaymentSchedule}
        onShow={() => {}}
        dialogClassName={isWindow ? "modal-80w" : ""}
      >
        <Modal.Header>
          <Modal.Title>{"Input Payment Schedule"}</Modal.Title>
        </Modal.Header>
        <Form
          noValidate
          validated={validatedPaymentSchedule}
          onSubmit={(e) => {
            const form = e.currentTarget;
            setValidatedPaymentSchedule(true);
            e.preventDefault();
            e.stopPropagation();
            if (!form.checkValidity()) {
              return;
            }
            paymentSchedulingProject(editItem, paymentScheduleDate);
          }}
        >
          <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image
                src="/icons/project/calendar.svg"
                className="icon-2 mr-2"
              />
              <Form.Label>Payment Schedule</Form.Label>
              <Form.Control
                type="date"
                value={paymentScheduleDate}
                required
                onChange={(e) => {
                  var val = e.target.value;
                  setPaymentScheduleDate(val);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Pilih payment schedule
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            {errorMessagePaymentSchedule != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessagePaymentSchedule}
              </div>
            ) : (
              ""
            )}
            <Button className="btn-save" type="submit">
              {isSubmitting ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="mr-1"
                  ></FontAwesomeIcon>
                  {"Submit"}
                </>
              )}
            </Button>
            <Button
              className="btn-cancel"
              onClick={async () => {
                setShowModalPaymentSchedule(false);
              }}
            >
              {editItem.user_view == 1
                ? configModalCU.closeLabel
                : configModalCU.cancelLabel}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* payment schedule done modal */}
      <Modal
        centered
        show={showModalPaymentScheduleDone}
        onShow={() => {}}
        dialogClassName={isWindow ? " " : ""}
      >
        <Modal.Body style={{ textAlign: "center" }}>
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="mb-3"
            style={{ height: "100px", color: "#0047AB" }}
          ></FontAwesomeIcon>
          <h5>Payment schedule berhasil ditetapkan!</h5>
        </Modal.Body>

        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button
            className="btn-cancel"
            onClick={async () => {
              setShowModalPaymentScheduleDone(false);
            }}
          >
            Selesai
          </Button>
        </Modal.Footer>
      </Modal>

      {/* payment reschedule */}
      <Modal
        centered
        show={showModalPaymentReSchedule}
        onShow={() => {}}
        dialogClassName={isWindow ? " " : ""}
      >
        <Modal.Header>
          <Modal.Title>{"Set Payment Status"}</Modal.Title>
        </Modal.Header>
        <Form
          noValidate
          validated={validatedPaymentReSchedule}
          onSubmit={(e) => {
            const form = e.currentTarget;
            setValidatedPaymentReSchedule(true);
            e.preventDefault();
            e.stopPropagation();
            if (!form.checkValidity()) {
              return;
            }
            if (paymentReScheduleOptionValue === "reschedule") {
              setShowModalPaymentReSchedule(false);
              setShowModalPaymentSchedule(true);
              setValidatedPaymentSchedule(false);
              setErrorMessagePaymentSchedule("");
              setPaymentScheduleDate("");
            } else if (paymentReScheduleOptionValue === "transferred") {
              paymentTransferredProject(editItem);
            }
          }}
        >
          <Modal.Body style={{ textAlign: "center" }}>
            <Form.Select
              required
              value={paymentReScheduleOptionValue}
              onChange={(e) => {
                setPaymentReScheduleOptionValue(e.target.value);
              }}
            >
              <option value={""}>Select Option</option>
              <option value={"reschedule"}>Reschedule</option>
              <option value={"transferred"}>Transferred</option>
            </Form.Select>
          </Modal.Body>

          <Modal.Footer>
            {errorMessagePaymentReSchedule != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessagePaymentReSchedule}
              </div>
            ) : (
              ""
            )}
            <Button className="btn-save" type="submit">
              {isSubmitting ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="mr-1"
                  ></FontAwesomeIcon>
                  {"Submit"}
                </>
              )}
            </Button>
            <Button
              className="btn-cancel"
              onClick={async () => {
                setShowModalPaymentReSchedule(false);
              }}
            >
              {editItem.user_view == 1
                ? configModalCU.closeLabel
                : configModalCU.cancelLabel}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Topbar;
