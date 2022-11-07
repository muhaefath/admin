import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import useAPINotif from "../../../component/common/hooks/useAPINotif";
import { confirm } from "../../../component/Confirmation";
import Admin from "../../../layouts/Admin";
import apputil from "../../../helper/apputil";
import apphelper from "../../../helper/apphelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPlus,
  faCheckCircle,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import pegawaiService from "../../../_api/admin/PegawaiService";
import generalService from "../../../_api/admin/GeneralService";

const page = "Pegawai";

function KepegawaianPage() {
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
    title: "Tambah",
    closeLabel: "Keluar",
    cancelLabel: "Batal",
    saveLabel: "Simpan",
  });
  const [editItem, setEditItem] = useState({});

  const [dsJabatan, setDSJabatan] = useState([]);

  useEffect(() => {
    setRoleConfig(apputil.getMenuItemByPath());
    getData();

    getDataSource();
  }, []);

  async function getData() {
    try {
      setIsLoadingData(true);
      var query = { ...tableConfig };
      var res = await pegawaiService.getPegawai(query);
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
    try {
      let res = await generalService.getProjectJabatanList();
      if (res.status == "ok") {
        setDSJabatan(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function onCreate(data) {
    try {
      setIsSubmittingData(true);

      var res = await pegawaiService.postPegawaiCreate(data);
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
      var res = await pegawaiService.postPegawaiUpdate(data);
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
      setIsLoading(true);
      var res = await pegawaiService.deletePegawai(data);
      setIsLoading(false);
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
        <Column
          filter
          sortable
          field="full_name"
          header="Nama Pegawai"
        ></Column>
        <Column sortable field="nama_jabatan" header="Nama Jabatan"></Column>
        <Column sortable field="email" header="Email"></Column>
        <Column sortable field="phone" header="Phone"></Column>
        <Column sortable field="address" header="Address"></Column>
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
                      rowData.jabatan = dsJabatan.find(
                        (x) => x.name == rowData.nama_jabatan
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
                      rowData.jabatan = dsJabatan.find(
                        (x) => x.name == rowData.nama_jabatan
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
              <Image src="/icons/project/profile.svg" className="icon-2 mr-2" />
              <Form.Label>Nama Pegawai</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                autoFocus
                required
                value={editItem.full_name}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.full_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan nama pegawai
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image
                src="/icons/briefcase.svg"
                style={{ height: "18px" }}
                className="icon-2 mr-2"
              />
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                required
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.jabatan}
                placeholder="Select Jabatan"
                onChange={(e) => {
                  try {
                    let tmpSelectedItem = {
                      ...editItem,
                    };
                    tmpSelectedItem.jabatan = e.target.value;
                    setEditItem(tmpSelectedItem);
                  } catch (error) {}
                }}
              >
                <option value="">Select Jabatan</option>
                {dsJabatan.map((x, key) => {
                  return (
                    <option key={key} value={x.id}>
                      {x.name}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Pilih jabatan
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image
                src="/icons/sms.svg"
                style={{ height: "18px" }}
                className="icon-2 mr-2"
              />
              <Form.Label>Email</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.email}
                required
                type="email"
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.email = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan email
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image
                src="/icons/call.svg"
                style={{ height: "18px" }}
                className="icon-2 mr-2"
              />
              <Form.Label>Phone</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.phone}
                required
                onChange={(e) => {
                  try {
                    if (apputil.onlyNumberKey(e.target.value)) {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.phone = e.target.value.replace(/\D/g, "");
                      setEditItem(tmpSelectedItem);
                    }
                  } catch (error) {}
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan nomor handphone
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image
                src="/icons/location.svg"
                style={{ height: "18px" }}
                className="icon-2 mr-2"
              />
              <Form.Label>Address</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                as="textarea"
                rows={3}
                value={editItem.address}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.address = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan alamat
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/project/paper.svg" className="icon-2 mr-2" />
              <Form.Label>Nama Bank</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                required
                value={editItem.nama_bank}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.nama_bank = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan nama bank
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image
                height={"18px"}
                width="18px"
                src="/icons/task-square.svg"
                className="icon-2 mr-2"
              />
              <Form.Label>Nomor Rekening</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                required
                value={editItem.no_rekening}
                onChange={(e) => {
                  try {
                    if (apputil.onlyNumberKey(e.target.value)) {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.no_rekening = e.target.value.replace(
                        /\D/g,
                        ""
                      );
                      setEditItem(tmpSelectedItem);
                    }
                  } catch (error) {}
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan nomor rekening
              </Form.Control.Feedback>
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

KepegawaianPage.layout = Admin;

export default KepegawaianPage;
