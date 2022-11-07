import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Image, Spinner } from "react-bootstrap";
import useAPINotif from "../../../component/common/hooks/useAPINotif";
import { confirm } from "../../../component/Confirmation";
import Admin from "../../../layouts/Admin";
import userService from "../../../_api/admin/UserService";
import menuService from "../../../_api/admin/MenuService";
import apputil from "../../../helper/apputil";
import apphelper from "../../../helper/apphelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPlus,
  faCheckCircle,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

const page = "Role";

function RolePage() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addError, stat, setIsLoading } = useAPINotif();
  const [data, setData] = useState([]);
  const [roleConfig, setRoleConfig] = useState({});
  const [tableConfig, setTableConfig] = useState({
    offset: 0,
    limit: 25,
    currentPage: 0,
    totalPage: 0,
    totalRecord: 0,
    sortField: "id",
    sortOrder: "1",
    filters: null,
    multiSortMeta: [],
  });
  const [showModalCU, setShowModalCU] = useState(false);
  const [configModalCU, setConfigModalCU] = useState({
    title: "Tambah Role",
    closeLabel: "Keluar",
    cancelLabel: "Batal",
    saveLabel: "Simpan",
  });
  const [editItem, setEditItem] = useState({});

  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  useEffect(() => {
    setRoleConfig(apputil.getMenuItemByPath());
    getData();
  }, []);

  async function getData() {
    try {
      setIsLoadingData(true);
      var query = { ...tableConfig };
      var res = await userService.getRole(query);
      setIsLoadingData(false);
      if (res.status == "ok") {
        setData(res.data);
        res.meta.currentPage = query.currentPage;
        res.meta.sortField = query.sortField;
        res.meta.sortOrder = query.sortOrder;
        res.meta.filters = query.filters;
        res.meta.multiSortMeta = query.multiSortMeta;
        setTableConfig(res.meta);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getMenuList() {
    try {
      setIsLoadingMenu(true);
      var res = await menuService.getMenu();
      setIsLoadingMenu(false);
      if (res.status == "ok") {
        editItem.list_menu = res.data ?? [];
        setEditItem(editItem);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function onCreate(data) {
    try {
      setIsSubmittingData(true);
      var res = await userService.postRoleCreate(data);
      setIsSubmittingData(false);
      if (res.status == "ok") {
        addError("Informasi", res.pesan, stat.success);
        getData();
        setShowModalCU(false);
      } else {
        setErrorMessage(res.pesan ?? "");
      }
    } catch (error) {
      addError("Informasi", "Error Request", stat.error);
      console.log(error);
    }
  }

  async function onUpdate(data) {
    try {
      setIsSubmittingData(true);
      data.role_id = data.id;
      data.menu = data.list_menu;
      delete data.id;
      delete data.list_menu;
      var res = await userService.postRoleUpdate(data);
      setIsSubmittingData(false);
      if (res.status == "ok") {
        addError("Informasi", res.pesan, stat.success);
        getData();
        setShowModalCU(false);
      } else {
        setErrorMessage(res.pesan ?? "");
      }
    } catch (error) {
      addError("Informasi", "Error Request", stat.error);
      console.log(error);
    }
  }

  async function onDelete(data) {
    try {
      setIsSubmittingData(true);
      var res = await userService.deleteRole(data);
      setIsSubmittingData(false);
      if (res.status == "ok") {
        addError("Informasi", res.pesan, stat.success);
        getData();
      } else {
        console.log(res.pesan);
        setErrorMessage(res.pesan ?? "");
      }
    } catch (error) {
      addError("Informasi", "Error Request", stat.error);
      console.log(error);
    }
  }

  return (
    <div>
      <Toolbar
        id={"toolbar"}
        className={"toolbarpadding"}
        left={
          <>
            {roleConfig.is_add == 1 ? (
              <Button
                title={"Tambah"}
                className="add-btn gap-sm-2"
                onClick={() => {
                  getMenuList();
                  setEditItem({});
                  let tmpConf = { ...configModalCU };
                  tmpConf.title = `Tambah ${page}`;
                  setConfigModalCU(tmpConf);
                  setShowModalCU(true);
                  setErrorMessage("");
                  setValidated(false);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Tambah
              </Button>
            ) : (
              ""
            )}
          </>
        }
        // right={this.rightToolbarTemplate()}
      ></Toolbar>
      <DataTable
        value={data}
        size="small"
        resizableColumns
        // className={"p-datatable-gridlines p-datatable-responsive"}
        // style={{ height: this.state._grid11Height }}
        // selection={this.state._selectedItemGrid11}
        // onSelectionChange={(e) => this.setSelectedGrid11(e.value)}
        // selectionMode="single"
        dataKey="id"
        paginator
        onPage={(event) => {
          let tmp = { ...tableConfig };
          setTableConfig(apputil.onPagination(tmp, event));
          getData();
        }}
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        first={tableConfig.offset}
        rows={tableConfig.limit}
        rowsPerPageOptions={[25, 50]}
        sortField={tableConfig.sortField}
        sortOrder={tableConfig.sortOrder}
        onSort={(event) => {
          console.log(event);
          let tmpConfig = { ...tableConfig };
          apputil.onSort(tmpConfig, event);
          setTableConfig(tmpConfig);
          getData(tmpConfig);
        }}
        filters={tableConfig.filters ? tableConfig.filters : null}
        onFilter={(event) => {
          console.log(event);
          let tmpConfig = { ...tableConfig };
          apputil.onFilter(tmpConfig, event);
          setTableConfig(tmpConfig);
          getData(tmpConfig);
        }}
        paginatorLeft={<></>}
        loading={isLoadingData}
      >
        <Column sortable field="role_name" header="Role"></Column>
        <Column sortable field="description" header="Description"></Column>
        <Column
          header=""
          style={{ width: "150px" }}
          // className={
          //   col.className !== undefined
          //     ? col.className
          //     : "actionswidth overflowtext"
          // }
          body={(rowData) => (
            <>
              {roleConfig.is_view == 1 ? (
                <span
                  title="View"
                  className="action-custom-btn"
                  onClick={async () => {
                    let tmpRowData = { ...rowData };
                    tmpRowData.user_view = 1;
                    setEditItem(tmpRowData);
                    let tmpConf = { ...configModalCU };
                    tmpConf.title = `View ${page}`;
                    setConfigModalCU(tmpConf);
                    setShowModalCU(true);
                    setErrorMessage("");
                    setValidated(false);
                  }}
                >
                  <Image src={"/icons/eye-blue.svg"}></Image>
                </span>
              ) : (
                ""
              )}
              {roleConfig.is_edit == 1 ? (
                <span
                  title="Edit"
                  className="action-custom-btn"
                  onClick={() => {
                    setEditItem(rowData);
                    let tmpConf = { ...configModalCU };
                    tmpConf.title = `Edit ${page}`;
                    setConfigModalCU(tmpConf);
                    setShowModalCU(true);
                    setErrorMessage("");
                    setValidated(false);
                  }}
                >
                  <Image src={"/icons/edit.svg"}></Image>
                </span>
              ) : (
                ""
              )}
              {roleConfig.is_delete == 1 ? (
                <span
                  title="Hapus"
                  className="action-custom-btn"
                  onClick={async () => {
                    if (
                      await confirm(
                        apphelper.msg.title.delete,
                        apphelper.msg.content.delete
                      )
                    ) {
                      onDelete(rowData);
                    }
                  }}
                >
                  <Image src={"/icons/delete.svg"}></Image>
                </span>
              ) : (
                ""
              )}
            </>
          )}
        />
      </DataTable>

      <Modal centered show={showModalCU} onShow={() => {}}>
        <Modal.Header>
          <Modal.Title>{configModalCU.title}</Modal.Title>
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
            if (editItem?.id) {
              onUpdate(editItem);
            } else {
              onCreate(editItem);
            }
          }}
        >
          <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/project/paper.svg" className="icon-2 mr-2" />
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                autoFocus
                value={editItem.role_name}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.role_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan nama role
              </Form.Control.Feedback>
            </Form.Group>
            <Row style={{}}>
              <Col> </Col>
              <Col sm={2}>Add</Col>
              <Col sm={2}>Delete</Col>
              <Col sm={2}>Edit</Col>
              <Col sm={2}>View</Col>
            </Row>
            <div style={{ height: "300px", overflow: "auto" }}>
              {(editItem.list_menu ?? []).map((x, key) => {
                return (
                  <div key={key}>
                    <Row style={{ color: "green", fontWeight: "bold" }}>
                      <Col>{x.name}</Col>
                      <Col sm={2}>
                        <Form.Check
                          defaultChecked={x.is_add == 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              x.is_add = "1";
                            } else {
                              x.is_add = "0";
                            }

                            setEditItem(editItem);
                          }}
                          style={{ marginTop: "10px" }}
                        ></Form.Check>
                      </Col>
                      <Col sm={2}>
                        <Form.Check
                          defaultChecked={x.is_delete == 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              x.is_delete = "1";
                            } else {
                              x.is_delete = "0";
                            }

                            setEditItem(editItem);
                          }}
                          style={{ marginTop: "10px" }}
                        ></Form.Check>
                      </Col>
                      <Col sm={2}>
                        <Form.Check
                          defaultChecked={x.is_edit == 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              x.is_edit = "1";
                            } else {
                              x.is_edit = "0";
                            }

                            setEditItem(editItem);
                          }}
                          style={{ marginTop: "10px" }}
                        ></Form.Check>
                      </Col>
                      <Col sm={2}>
                        <Form.Check
                          defaultChecked={x.is_view == 1}
                          onChange={(e) => {
                            if (e.target.checked) {
                              x.is_view = "1";
                            } else {
                              x.is_view = "0";
                            }

                            setEditItem(editItem);
                          }}
                          style={{ marginTop: "10px" }}
                        ></Form.Check>
                      </Col>
                    </Row>
                    {x.submenu
                      ? x.submenu.map((s, skey) => (
                          <div key={skey}>
                            <Row style={{ color: "blue" }}>
                              <Col>{s.name}</Col>
                              <Col sm={2}>
                                <Form.Check
                                  defaultChecked={s.is_add == 1}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      x.is_add = "1";
                                    } else {
                                      x.is_add = "0";
                                    }

                                    setEditItem(editItem);
                                  }}
                                  style={{ marginTop: "10px" }}
                                ></Form.Check>
                              </Col>
                              <Col sm={2}>
                                <Form.Check
                                  defaultChecked={s.is_delete == 1}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      x.is_delete = "1";
                                    } else {
                                      x.is_delete = "0";
                                    }

                                    setEditItem(editItem);
                                  }}
                                  style={{ marginTop: "10px" }}
                                ></Form.Check>
                              </Col>
                              <Col sm={2}>
                                <Form.Check
                                  defaultChecked={s.is_edit == 1}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      x.is_edit = "1";
                                    } else {
                                      x.is_edit = "0";
                                    }

                                    setEditItem(editItem);
                                  }}
                                  style={{ marginTop: "10px" }}
                                ></Form.Check>
                              </Col>
                              <Col sm={2}>
                                <Form.Check
                                  defaultChecked={s.is_view == 1}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      x.is_view = "1";
                                    } else {
                                      x.is_view = "0";
                                    }

                                    setEditItem(editItem);
                                  }}
                                  style={{ marginTop: "10px" }}
                                ></Form.Check>
                              </Col>
                            </Row>
                          </div>
                        ))
                      : ""}
                  </div>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {errorMessage != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessage}
              </div>
            ) : (
              ""
            )}
            {!(editItem.user_view == 1) ? (
              <Button className="btn-save" type="submit">
                {isSubmittingData ? (
                  <Spinner animation="border" />
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="mr-1"
                    ></FontAwesomeIcon>
                    {configModalCU.saveLabel}
                  </>
                )}
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
    </div>
  );
}

RolePage.layout = Admin;

export default RolePage;
