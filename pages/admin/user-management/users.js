import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Image,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import useAPINotif from "../../../component/common/hooks/useAPINotif";
import { confirm } from "../../../component/Confirmation";
import Admin from "../../../layouts/Admin";
import userService from "../../../_api/admin/UserService";
import generalService from "../../../_api/admin/GeneralService";
import apputil from "../../../helper/apputil";
import apphelper from "../../../helper/apphelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPlus,
  faCheckCircle,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

const page = "User";

function UsersPage() {
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
    title: "Tambah User",
    closeLabel: "Keluar",
    cancelLabel: "Batal",
    saveLabel: "Simpan",
  });
  const [editItem, setEditItem] = useState({});
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscurePassword2, setObscurePassword2] = useState(true);

  const [dsPegawai, setDSPegawai] = useState([]);
  const [dsRole, setDSRole] = useState([]);

  useEffect(() => {
    setRoleConfig(apputil.getMenuItemByPath());
    getData();

    getDataSource();
  }, []);

  async function getData() {
    try {
      setIsLoadingData(true);
      var query = { ...tableConfig };
      var res = await userService.getUsers(query);
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
  async function getDataSource() {
    let res;
    try {
      res = await generalService.getUserPegawaiList();
      if (res.status == "ok") {
        setDSPegawai(res.data ?? []);
      }
      res = await userService.getRole({
        offset: 0,
        limit: 100,
        sortField: "id",
        sortOrder: "1",
      });
      if (res.status == "ok") {
        setDSRole(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onCreate(data) {
    try {
      setIsSubmittingData(true);

      var res = await userService.postUserCreate(data);
      setIsSubmittingData(false);
      if (res.status == "ok") {
        addError("Informasi", res.pesan, stat.success);
        getData();
        getDataSource();
        setShowModalCU(false);
      } else {
        setErrorMessage(res.pesan ?? "");
      }
    } catch (error) {
      addError("Informasi", "Error Request", stat.error);
      console.log(error);
    }
  }

  // async function onUpdate(data) {
  //   try {
  //     setIsLoading(true);
  //     var res = await userService.postRoleUpdate(data);
  //     setIsLoading(false);
  //     if (res.status == "ok") {
  // addError("Informasi", res.pesan, stat.success);
  // getData();
  // setShowModalCU(false);
  //     } else {
  //       setErrorMessage(res.pesan ?? "")
  //     }
  //   } catch (error) {
  //     addError("Informasi", "Error Request", stat.error);
  //     console.log(error);
  //   }
  // }

  async function onDelete(data) {
    try {
      setIsSubmittingData(true);
      var res = await userService.deleteUser(data);
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
        <Column sortable field="email" header="Email"></Column>
        <Column sortable field="full_name" header="Full Name"></Column>
        <Column sortable field="role_name" header="Role"></Column>
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
                    try {
                      rowData.role_id = dsRole.find(
                        (x) => x.role_name == rowData.role_name
                      ).id;
                    } catch (error) {
                      console.log(error);
                    }
                    let tmpRowData = { ...rowData };
                    tmpRowData.user_view = 1;
                    setEditItem(tmpRowData);
                    let tmpConf = { ...configModalCU };
                    tmpConf.title = `View ${page}`;
                    setConfigModalCU(tmpConf);
                    setShowModalCU(true);
                    setErrorMessage("");
                    setValidated(false);

                    setObscurePassword(true);
                    setObscurePassword2(true);
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
                    try {
                      rowData.role_id = dsRole.find(
                        (x) => x.role_name == rowData.role_name
                      ).id;
                    } catch (error) {
                      console.log(error);
                    }

                    setEditItem(rowData);
                    let tmpConf = { ...configModalCU };
                    tmpConf.title = `Edit ${page}`;
                    setConfigModalCU(tmpConf);
                    setShowModalCU(true);
                    setErrorMessage("");
                    setValidated(false);

                    setObscurePassword(true);
                    setObscurePassword2(true);
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
            {!editItem.id ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Image
                  src="/icons/personalcard.svg"
                  style={{ height: "18px" }}
                  className="icon-2 mr-2"
                />
                <Form.Label>Pegawai</Form.Label>
                <Form.Select
                  disabled={editItem.user_view == 1 ? true : false}
                  value={editItem.id_pegawai}
                  required
                  onChange={(e) => {
                    try {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.id_pegawai = e.target.value;
                      setEditItem(tmpSelectedItem);
                    } catch (error) {}
                  }}
                >
                  <option value="">Select Pegawai</option>
                  {dsPegawai.map((x, key) => {
                    return (
                      <option key={key} value={x.id}>
                        {x.full_name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Pilih pegawai
                </Form.Control.Feedback>
              </Form.Group>
            ) : (
              ""
            )}

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/project/profile.svg" className="icon-2 mr-2" />
              <Form.Label>Username</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.username}
                placeholder={"Silahkan isi username"}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.username = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan username
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/project/paper.svg" className="icon-2 mr-2" />
              <Form.Label>Role Name</Form.Label>
              <Form.Select
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.role_id}
                required
                onChange={(e) => {
                  try {
                    let tmpSelectedItem = {
                      ...editItem,
                    };
                    tmpSelectedItem.role_id = e.target.value;
                    setEditItem(tmpSelectedItem);
                  } catch (error) {}
                }}
              >
                <option value="">Select Role</option>
                {dsRole.map((x, key) => {
                  return (
                    <option key={key} value={x.id}>
                      {x.role_name}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Pilih role
              </Form.Control.Feedback>
            </Form.Group>
            {!editItem.id ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Image
                  src="/icons/key.svg"
                  style={{ height: "18px" }}
                  className="icon-2 mr-2"
                />
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    disabled={editItem.user_view == 1 ? true : false}
                    value={editItem.password}
                    type={obscurePassword ? "password" : "text"}
                    className="shadow-none"
                    placeholder={"Silahkan isi password"}
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.password = e.target.value;
                      setEditItem(tmpSelectedItem);
                    }}
                  />
                  <InputGroup.Text
                    id="basic-addon2"
                    style={{ background: "white" }}
                    onClick={() => {
                      setObscurePassword(!obscurePassword);
                    }}
                  >
                    {
                      <img
                        height={"16px"}
                        width={"16px"}
                        src={
                          obscurePassword
                            ? "/icons/eye-show.svg"
                            : "/icons/eye-hide.svg"
                        }
                      ></img>
                    }
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Password tidak sesuai
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            ) : (
              ""
            )}
            {!editItem.id ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Image
                  src="/icons/key.svg"
                  style={{ height: "18px" }}
                  className="icon-2 mr-2"
                />
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    disabled={editItem.user_view == 1 ? true : false}
                    value={editItem.confirm_password}
                    type={obscurePassword2 ? "password" : "text"}
                    className="shadow-none"
                    placeholder={"Silahkan isi confirm password"}
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.confirm_password = e.target.value;
                      setEditItem(tmpSelectedItem);
                    }}
                  />
                  <InputGroup.Text
                    id="basic-addon2"
                    style={{ background: "white" }}
                    onClick={() => {
                      setObscurePassword2(!obscurePassword2);
                    }}
                  >
                    {
                      <img
                        height={"16px"}
                        width={"16px"}
                        src={
                          obscurePassword2
                            ? "/icons/eye-show.svg"
                            : "/icons/eye-hide.svg"
                        }
                      ></img>
                    }
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Confirm password tidak sesuai
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            ) : (
              ""
            )}
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

UsersPage.layout = Admin;

export default UsersPage;
