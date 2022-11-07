import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Image,
  Row,
  Col,
  Card,
  ProgressBar,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import useAPINotif from "../../../component/common/hooks/useAPINotif";
import { confirm } from "../../../component/Confirmation";
import Admin from "../../../layouts/Admin";
import projectService from "../../../_api/admin/ProjectService";
import generalService from "../../../_api/admin/GeneralService";
import apputil from "../../../helper/apputil";
import apphelper from "../../../helper/apphelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPlus,
  faCheckCircle,
  faRefresh,
  faTimes,
  faRemove,
  faMoneyBill,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { Paginator } from "primereact/paginator";
import { Typeahead } from "react-bootstrap-typeahead";

const page = "Project";

function ListProjectHighPage() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addError, stat, setIsLoading } = useAPINotif();
  const [userData, setUserData] = useState(null);
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
    title: "Tambah Project",
    closeLabel: "Keluar",
    cancelLabel: "Batal",
    saveLabel: "Simpan",
  });

  const [errorMessageReport, setErrorMessageReport] = useState("");
  const [showModalReport, setShowModalReport] = useState(false);

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

  const [editItem, setEditItem] = useState({});
  const [searchProject, setSearchProject] = useState("");

  const [viewMode, setViewMode] = useState("table");

  const [dsKlasifikasi, setDSKlasifikasi] = useState([]);
  const [dsItem, setDSItem] = useState([]);
  const [dsPriority, setDSPriority] = useState([]);
  const [dsJabatan, setDSJabatan] = useState([]);
  const [dsPenggunaJasa, setDSPenggunaJasa] = useState([]);

  const [dsProject, setDSProject] = useState([]);
  const [editItemReport, setEditItemReport] = useState({});
  const [validatedReport, setValidatedReport] = useState(false);

  const [isWindow, setIsWindow] = useState(true);

  const dsDoc = ["SPK", "PO"];

  const [documents, setDocuments] = useState([
    {
      no_dokumen: "",
      nama_dokumen: "",
      nama_dokumen2: "",
      file: null,
    },
  ]);
  const [documentsReport, setDocumentsReport] = useState([
    {
      no_dokumen: "",
      nama_dokumen: "",
      file: null,
    },
  ]);

  useEffect(() => {
    try {
      let tmpUserData = apputil.getLocalStorage("_jz");
      setUserData(JSON.parse(tmpUserData));

      const tmpTitle = apputil.getMenuItemByPath().name;
      setTitle(tmpTitle);
    } catch (error) {
      // console.log(error);
    }
    setRoleConfig(apputil.getMenuItemByPath());
    getData();

    getDataSource();

    setIsWindow(apputil.isWindow());
  }, []);

  async function getData(query) {
    try {
      setIsLoadingData(true);
      if (!query) {
        query = { ...tableConfig };
      }
      query.priority = 1;
      query.search = searchProject;
      var res = await projectService.getProject(query);
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
      let res;
      res = await generalService.getProjectItemList();
      if (res.status == "ok") {
        setDSItem(res.data ?? []);
      }
      res = await generalService.getProjectKlasifikasiList();
      if (res.status == "ok") {
        setDSKlasifikasi(res.data ?? []);
      }
      res = await generalService.getProjectPriorityList();
      if (res.status == "ok") {
        setDSPriority(res.data ?? []);
      }
      res = await generalService.getPenggunaJasaList();
      if (res.status == "ok") {
        setDSPenggunaJasa(res.data ?? []);
      }
      res = await generalService.getProjectList();
      if (res.status == "ok") {
        setDSProject(res.data ?? []);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getProjectItem(id, onSuccess) {
    try {
      var res = await projectService.getProjectDetail({
        id,
      });
      if (res.status == "ok") {
        // console.log(res.data[0]);
        if (res.data[0].documents.length == 0) {
          res.data[0].documents.push({
            no_dokumen: "",
            nama_dokumen: "",
            file: null,
          });
        }
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
        setShowModalCU(false);
        setErrorMessage("");
        setErrorMessageApprove("");
        getData();
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
        setShowModalReject(false);
        setErrorMessageReject("");
        getData();
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
        setShowModalPaymentSchedule(false);
        setErrorMessagePaymentSchedule("");
        getData();
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
      } else {
        console.log(res.pesan);
        setErrorMessagePaymentReSchedule(res.pesan ?? "");
      }
    } catch (error) {}
    setIsSubmitting(false);
  }

  async function onCreate(data) {
    try {
      setIsLoading(true);

      data.documents = documents;
      for (let index = 0; index < data.documents.length; index++) {
        let element = data.documents[index];
        if (element.nama_dokumen == "lainnya") {
          element.nama_dokumen = element.nama_dokumen2;
        }
      }
      data.project_value = apputil.removeDgtGroup(data.project_value);
      var res = await projectService.postProjectCreate(data);
      setIsLoading(false);
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
      setIsLoading(true);
      data.documents = documents;
      for (let index = 0; index < data.documents.length; index++) {
        let element = data.documents[index];
        if (element.nama_dokumen == "lainnya") {
          element.nama_dokumen = element.nama_dokumen2;
        }
      }
      data.project_value = apputil.removeDgtGroup(data.project_value);
      var res = await projectService.postProjectUpdate(data);
      setIsLoading(false);
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
      var res = await projectService.deleteProject(data);
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
  async function onCreateProjectReport(data) {
    try {
      setIsLoading(true);

      data.documents_report = documentsReport;
      data.real_value = apputil.removeDgtGroup(data.real_value);
      var res = await projectService.postProjectCreateReport(data);
      setIsLoading(false);
      if (res.status == "ok") {
        addError("Informasi", res.pesan, stat.success);
        getData();
        setShowModalReport(false);
      } else {
        setErrorMessageReport(res.pesan ?? "");
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
        style={{ gap: "10px" }}
        left={
          <>
            {userData?.role_name == "PIC" ? (
              <Button
                title={"Input Report"}
                className="gap-sm-2 btn-cancel"
                onClick={() => {
                  setShowModalReport(true);
                  setEditItemReport({});
                  setErrorMessageReport("");
                  setValidatedReport(false);
                }}
              >
                Input Report
              </Button>
            ) : (
              ""
            )}

            {roleConfig.is_add == 1 ? (
              <Button
                title={"Tambah"}
                className="add-btn gap-sm-2"
                onClick={() => {
                  setEditItem({
                    start_project: apputil.formatDate(new Date(), "YYYY-MM-DD"),
                    end_project: apputil.formatDate(
                      apputil.addDays(new Date(), 10),
                      "YYYY-MM-DD"
                    ),
                  });
                  setDocuments([
                    {
                      no_dokumen: "",
                      nama_dokumen: "",
                      file: null,
                    },
                  ]);
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
        right={
          <>
            <Form className="d-flex">
              <InputGroup>
                <Form.Control
                  type="search"
                  className="shadow-none"
                  placeholder="Search"
                  style={{ borderRight: "0px" }}
                  onChange={(e) => {
                    setSearchProject(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getData();
                      e.preventDefault();
                    }
                  }}
                />
                <InputGroup.Text
                  id="basic-addon2"
                  style={{ background: "white" }}
                >
                  <img height={"16px"} src="/icons/search.svg"></img>
                </InputGroup.Text>
              </InputGroup>
            </Form>
            <Button
              className="gap-sm-2 ml-1"
              style={{
                background: "transparent",
                border:
                  viewMode == "grid"
                    ? "3px solid lightgrey"
                    : "1px solid lightgrey",
              }}
              onClick={() => {
                setViewMode("grid");
              }}
            >
              <Image src="/icons/category.svg"></Image>
            </Button>
            <Button
              className="gap-sm-2 ml-1"
              style={{
                background: "transparent",
                border:
                  viewMode == "table"
                    ? "3px solid lightgrey"
                    : "1px solid lightgrey",
              }}
              onClick={() => {
                setViewMode("table");
              }}
            >
              <Image src="/icons/menu.svg"></Image>
            </Button>
          </>
        }
      ></Toolbar>
      {viewMode == "grid" ? (
        <>
          <Row style={{ margin: "0" }}>
            {data.map((rowData, key) => {
              return (
                <Col key={key} lg={apputil.isWindow() ? 4 : 12}>
                  <Card className="mb-2 mt-2">
                    <Card.Body>
                      <Row className="mb-2">
                        <Col lg={8}>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              color: "#717986",
                            }}
                          >
                            <a
                              style={{ textDecoration: "none" }}
                              href="#"
                              onClick={() => {
                                getProjectItem(
                                  rowData.id,
                                  function (objProject) {
                                    objProject.user_view = 1;
                                    try {
                                      objProject.klasifikasi =
                                        dsKlasifikasi.find(
                                          (x) =>
                                            x.name == objProject.klasifikasi
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
                                    objProject.start_project =
                                      apputil.formatDate(
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
                                      const element =
                                        objProject.documents[index];
                                      if (
                                        !dsDoc.includes(element.nama_dokumen)
                                      ) {
                                        objProject.documents[
                                          index
                                        ].nama_dokumen = "lainnya";
                                        objProject.documents[
                                          index
                                        ].nama_dokumen2 = element.nama_dokumen;
                                      }
                                    }
                                    setDocuments(objProject.documents);
                                    let tmpConf = { ...configModalCU };
                                    tmpConf.title = `Detail ${page}`;
                                    setConfigModalCU(tmpConf);
                                    setShowModalCU(true);
                                    setErrorMessage("");
                                    setErrorMessageApprove("");
                                    setValidated(false);
                                  }
                                );
                              }}
                            >
                              {rowData.project_name}
                            </a>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "800",
                              color: "#717986",
                            }}
                          >
                            {rowData.no_project}
                          </div>
                        </Col>
                        <Col className="taright" lg={4}>
                          {roleConfig.is_edit == 1 ? (
                            <span
                              title="Edit"
                              className="action-custom-btn"
                              onClick={() => {
                                console.log(rowData);
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
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ display: "flex" }}>
                          <div
                            style={{ fontSize: "12px" }}
                            className={
                              "project-status " +
                              projectService.funcGetProjectStatusClass(
                                rowData.label
                              )
                            }
                          >
                            {rowData.label}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div style={{ height: "10px" }}></div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            Tanggal Mulai
                          </div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            {apputil.formatDate(
                              new Date(rowData.start_project),
                              "DD MMM YYYY"
                            )}
                          </div>
                        </Col>
                        <Col>
                          <div style={{ height: "10px" }}></div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            Target Selesai
                          </div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            {apputil.formatDate(
                              new Date(rowData.end_project),
                              "DD MMM YYYY"
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <div style={{ height: "10px" }}></div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            Tanggal Input
                          </div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            {apputil.formatDate(
                              new Date(rowData.start_project),
                              "DD MMM YYYY"
                            )}
                          </div>
                        </Col>
                        <Col>
                          <div style={{ height: "10px" }}></div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            PIC
                          </div>
                          <div style={{ fontSize: "12px", color: "#717986" }}>
                            {rowData.full_name}
                          </div>
                        </Col>
                      </Row>
                      <div style={{ height: "10px" }}></div>

                      <Row>
                        <Col>
                          <div style={{ color: "#717986" }}>Progress</div>
                        </Col>
                        <Col className="taright">
                          {rowData.bar_percentage + " %"}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <ProgressBar
                            style={{ width: "100%" }}
                            now={rowData.bar_percentage}
                            variant={
                              rowData.bar_percentage >= 80
                                ? "high"
                                : rowData.bar_percentage > 70
                                ? "medium-high"
                                : rowData.bar_percentage > 40
                                ? "medium"
                                : "low"
                            }
                            // label={row.bar_percentage + "%"}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <Paginator
            onPageChange={(event) => {
              let tmpConfig = { ...tableConfig };
              apputil.onPagination(tmpConfig, event);
              setTableConfig(tmpConfig);
              getData(tmpConfig);
            }}
            first={tableConfig.offset}
            rows={tableConfig.limit}
            totalRecords={tableConfig.totalRecord}
            rowsPerPageOptions={[25, 50]}
          ></Paginator>
        </>
      ) : (
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
            let tmpConfig = { ...tableConfig };
            apputil.onPagination(tmpConfig, event);
            setTableConfig(tmpConfig);
            getData(tmpConfig);
          }}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          first={tableConfig.offset}
          rows={tableConfig.limit}
          totalRecords={tableConfig.totalRecord}
          lazy={true}
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
          <Column sortable field="id" header="id" hidden={true}></Column>
          <Column field="no_project" header="Nomor Project"></Column>
          <Column
            filterMatchMode="contains"
            filterMatchModeOptions={["contains"]}
            sortable
            field="project_name"
            header="Nama Project"
            body={(rowData) => {
              return (
                <a
                  href="#"
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    getProjectItem(rowData.id, function (objProject) {
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
                      objProject.project_value = apputil.formatCurrency(
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
                          objProject.documents[index].nama_dokumen = "lainnya";
                          objProject.documents[index].nama_dokumen2 =
                            element.nama_dokumen;
                        } else {
                          objProject.documents[index].nama_dokumen2 =
                            element.nama_dokumen;
                        }
                      }
                      setDocuments(objProject.documents);
                      let tmpConf = { ...configModalCU };
                      tmpConf.title = `Detail ${page}`;
                      setConfigModalCU(tmpConf);
                      setShowModalCU(true);
                      setErrorMessage("");
                      setErrorMessageApprove("");
                      setValidated(false);
                    });
                  }}
                >
                  {rowData.project_name}
                </a>
              );
            }}
          ></Column>
          <Column
            filterMatchMode="contains"
            filterMatchModeOptions={["contains"]}
            sortable
            field="bar_percentage"
            header="Persentase"
            style={{ width: "30%" }}
            body={(row) => {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ProgressBar
                    style={{ width: "100%" }}
                    now={row.bar_percentage}
                    variant={
                      row.bar_percentage >= 80
                        ? "high"
                        : row.bar_percentage > 70
                        ? "medium-high"
                        : row.bar_percentage > 40
                        ? "medium"
                        : "low"
                    }
                    // label={row.bar_percentage + "%"}
                  />
                  <span className="ml-2" style={{ width: "50px" }}>
                    {row.bar_percentage + "%"}
                  </span>
                </div>
              );
            }}
          ></Column>
          <Column
            filterMatchMode="contains"
            filterMatchModeOptions={["contains"]}
            sortable
            field="project_value"
            header="Nilai"
            body={(row) => {
              return "Rp " + apputil.formatCurrency(row.project_value);
            }}
          ></Column>
          <Column
            filterMatchMode="contains"
            filterMatchModeOptions={["contains"]}
            sortable
            field="full_name"
            header="PIC"
            body={(row) => {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="ml-1">{row.full_name}</span>
                </div>
              );
            }}
          ></Column>
          <Column
            filterMatchMode="contains"
            filterMatchModeOptions={["contains"]}
            sortable
            field="created_at"
            header="Tanggal Input"
          ></Column>
          <Column
            sortable
            field="start_project"
            header="Tanggal Mulai"
          ></Column>
          <Column sortable field="end_project" header="Target Selesai"></Column>
          <Column
            filterMatchMode="contains"
            filterMatchModeOptions={["contains"]}
            sortable
            field="label"
            header="Status"
            body={(row) => {
              return (
                <div
                  className={
                    "project-status " +
                    projectService.funcGetProjectStatusClass(row.label)
                  }
                >
                  {row.label}
                </div>
              );
            }}
          ></Column>

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
                      getProjectItem(rowData.id, function (objProject) {
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
                        objProject.project_value = apputil.formatCurrency(
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
                            objProject.documents[index].nama_dokumen2 =
                              element.nama_dokumen;
                          } else {
                            objProject.documents[index].nama_dokumen2 =
                              element.nama_dokumen;
                          }
                        }
                        setDocuments(objProject.documents);
                        let tmpConf = { ...configModalCU };
                        tmpConf.title = `Detail ${page}`;
                        setConfigModalCU(tmpConf);
                        setShowModalCU(true);
                        setErrorMessage("");
                        setErrorMessageApprove("");
                        setValidated(false);
                      });
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
                      getProjectItem(rowData.id, function (objProject) {
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
                        objProject.project_value = apputil.formatCurrency(
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
                            objProject.documents[index].nama_dokumen2 =
                              element.nama_dokumen;
                          } else {
                            objProject.documents[index].nama_dokumen2 =
                              element.nama_dokumen;
                          }
                        }
                        setDocuments(objProject.documents);
                        let tmpConf = { ...configModalCU };
                        tmpConf.title = `Edit ${page}`;
                        setConfigModalCU(tmpConf);
                        setShowModalCU(true);
                        setErrorMessage("");
                        setValidated(false);
                      });
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
      )}
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
            if (editItem?.id) {
              onUpdate(editItem);
            } else {
              onCreate(editItem);
            }
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
              {generalService
                .getItemNameById(dsItem, editItem.item)
                .toLowerCase()
                .includes("barang") ? (
                <Col lg={12}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Image
                      src="/icons/project/paper.svg"
                      className="icon-2 mr-2"
                    />
                    <Form.Label>Deskripsi Barang</Form.Label>
                    <Form.Control
                      disabled={editItem.user_view == 1 ? true : false}
                      value={editItem.deskripsi_barang}
                      required
                      placeholder={"Silahkan isi deskripsi barang"}
                      onChange={(e) => {
                        let tmpSelectedItem = {
                          ...editItem,
                        };
                        tmpSelectedItem.deskripsi_barang = e.target.value;
                        setEditItem(tmpSelectedItem);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Masukkan deskripsi barang
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}

              {generalService
                .getItemNameById(dsItem, editItem.item)
                .toLowerCase()
                .includes("jasa") ? (
                <Col lg={12}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Image
                      src="/icons/project/paper.svg"
                      className="icon-2 mr-2"
                    />
                    <Form.Label>Deskripsi Jasa</Form.Label>
                    <Form.Control
                      disabled={editItem.user_view == 1 ? true : false}
                      value={editItem.deskripsi_jasa}
                      required
                      placeholder={"Silahkan isi deskripsi jasa"}
                      onChange={(e) => {
                        let tmpSelectedItem = {
                          ...editItem,
                        };
                        tmpSelectedItem.deskripsi_jasa = e.target.value;
                        setEditItem(tmpSelectedItem);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Masukkan deskripsi jasa
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              ) : (
                ""
              )}
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
                    id="id_pengguna_jasa"
                    disabled={editItem.user_view == 1 ? true : false}
                    onInputChange={(text, e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      let tmpSelectedItem = {
                        ...editItem,
                      };

                      try {
                        const e = dsPenggunaJasa.find(
                          (x) => x.company_name == text
                        );
                        tmpSelectedItem.pengguna_jasa = e.company_name;
                        tmpSelectedItem.id_pengguna_jasa = e.id;
                      } catch (error) {
                        tmpSelectedItem.pengguna_jasa = null;
                        tmpSelectedItem.id_pengguna_jasa = null;
                      }
                      setEditItem(tmpSelectedItem);
                      return;
                    }}
                    className={
                      !editItem.id_pengguna_jasa && validated
                        ? "is-invalid"
                        : "is-valid"
                    }
                    inputProps={{
                      required: !editItem.id_pengguna_jasa && validated,
                    }}
                    isInvalid={!editItem.id_pengguna_jasa && validated}
                    onChange={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      try {
                        tmpSelectedItem.pengguna_jasa = e[0].company_name;
                        tmpSelectedItem.id_pengguna_jasa = e[0].id;
                        console.log(tmpSelectedItem);
                      } catch (error) {
                        tmpSelectedItem.pengguna_jasa = null;
                        tmpSelectedItem.id_pengguna_jasa = null;
                      }
                      setEditItem(tmpSelectedItem);
                    }}
                    onKeyDown={(e) => {
                      let tmpSelectedItem = {
                        ...editItem,
                      };

                      tmpSelectedItem.pengguna_jasa = null;
                      tmpSelectedItem.id_pengguna_jasa = null;
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
                            <Col>
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
                                hidden={editItem.user_view == 1 ? true : false}
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
                                        console.log(e.target.files);
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
            {!(editItem.user_view == 1) ? (
              <Button className="btn-save" type="submit">
                {isSubmitting ? (
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

      {/* Input Report */}
      <Modal
        centered
        show={showModalReport}
        onShow={() => {}}
        dialogClassName={isWindow ? "modal-80w" : ""}
      >
        <Form
          noValidate
          validated={validatedReport}
          onSubmit={(e) => {
            const form = e.currentTarget;
            setValidatedReport(true);
            e.preventDefault();
            e.stopPropagation();
            if (!form.checkValidity()) {
              return;
            }
            if (
              editItemReport.real_value == null ||
              editItemReport.real_value == undefined ||
              editItemReport.real_value == ""
            ) {
              setErrorMessageReport("Realisasi Value perlu diisi");
              return;
            }
            onCreateProjectReport(editItemReport);
          }}
        >
          <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
            <Row>
              <Col lg={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/paper.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Nama Project</Form.Label>
                  <Form.Select
                    value={editItemReport.project_id}
                    required
                    onChange={(e) => {
                      try {
                        let tmpSelectedItem = {
                          ...editItemReport,
                        };
                        tmpSelectedItem.project_id = e.target.value;
                        var project = dsProject.find(
                          (x) => x.id == e.target.value
                        );
                        tmpSelectedItem.project_value = apputil.formatCurrency(
                          project.project_value
                        );
                        tmpSelectedItem.real_value = 0;
                        tmpSelectedItem.selisih = 0;
                        setEditItemReport(tmpSelectedItem);
                      } catch (error) {
                        console.log("Error");
                      }
                    }}
                  >
                    <option value="">Pilih project</option>
                    {dsProject.map((x, key) => {
                      return (
                        <option key={key} value={x.id}>
                          {x.project_name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Masukkan nama project
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/coin.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Nilai Project</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">Rp</InputGroup.Text>
                    <Form.Control
                      disabled={true}
                      value={editItemReport.project_value}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/coin.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Realisasi Value</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">Rp</InputGroup.Text>
                    <Form.Control
                      disabled={
                        editItemReport.user_view == 1 ||
                        !editItemReport.project_id
                          ? true
                          : false
                      }
                      value={editItemReport.real_value}
                      required
                      placeholder={"Silahkan isi realisasi value"}
                      onChange={(e) => {
                        let tmpSelectedItem = {
                          ...editItemReport,
                        };
                        let real_value = e.target.value;
                        real_value = apputil.removeDgtGroup(real_value);
                        let project_value = apputil.removeDgtGroup(
                          tmpSelectedItem.project_value
                        );
                        // console.log(tmpSelectedItem.project_value);
                        try {
                          // console.log(project_value, real_value);
                          let selisih =
                            parseInt(project_value) - parseInt(real_value);
                          if (isNaN(selisih)) {
                            selisih = project_value;
                          }
                          tmpSelectedItem.selisih = apputil.formatCurrency(
                            selisih.toString()
                          );
                          tmpSelectedItem.real_value =
                            apputil.formatCurrency(real_value);
                          console.log(tmpSelectedItem);
                          setEditItemReport(tmpSelectedItem);
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Masukkan realisasi value
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Image
                    src="/icons/project/coin.svg"
                    className="icon-2 mr-2"
                  />
                  <Form.Label>Nilai Selisih</Form.Label>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">Rp</InputGroup.Text>
                    <Form.Control
                      disabled={true}
                      value={editItemReport.selisih}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <h5>Dokumen Referensi</h5>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  {documentsReport.map((objFile, key) => {
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
                              <Col lg={isWindow ? 6 : 12}>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>
                                    Nomor Referensi Dokumen
                                  </Form.Label>
                                  <Form.Control
                                    disabled={
                                      editItemReport.user_view == 1
                                        ? true
                                        : false
                                    }
                                    required
                                    value={objFile.no_dokumen}
                                    placeholder={
                                      "Silahkan isi nomor referensi dokumen"
                                    }
                                    onChange={(e) => {
                                      try {
                                        let tmpArr = [...documentsReport];
                                        for (
                                          let index = 0;
                                          index < tmpArr.length;
                                          index++
                                        ) {
                                          if (index == key) {
                                            tmpArr[index].no_dokumen =
                                              e.target.value;
                                            setDocumentsReport(tmpArr);
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
                              <Col lg={isWindow ? 6 : 12}>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>Nama Dokumen</Form.Label>
                                  <Form.Control
                                    disabled={
                                      editItemReport.user_view == 1
                                        ? true
                                        : false
                                    }
                                    required
                                    value={objFile.nama_dokumen}
                                    placeholder={"Silahkan isi nama dokumen"}
                                    onChange={(e) => {
                                      try {
                                        let tmpArr = [...documentsReport];
                                        for (
                                          let index = 0;
                                          index < tmpArr.length;
                                          index++
                                        ) {
                                          if (index == key) {
                                            tmpArr[index].nama_dokumen =
                                              e.target.value;
                                            setDocumentsReport(tmpArr);
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
                            </Row>
                            <Row>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>Dokumen Referensi</Form.Label>
                                  {objFile.url_dokumen ? (
                                    <a
                                      href={objFile.url_dokumen}
                                      target="_blank"
                                    >
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
                                      editItemReport.user_view == 1
                                        ? true
                                        : false
                                    }
                                    hidden={
                                      editItemReport.user_view == 1
                                        ? true
                                        : false
                                    }
                                    required
                                    type={"file"}
                                    onChange={(e) => {
                                      try {
                                        let tmpArr = [...documentsReport];
                                        for (
                                          let index = 0;
                                          index < tmpArr.length;
                                          index++
                                        ) {
                                          if (index == key) {
                                            console.log(e.target.files);
                                            const file = e.target.files[0];
                                            apputil.base64Convert(
                                              file,
                                              (fileRes) => {
                                                tmpArr[index].file = fileRes;

                                                setDocumentsReport(tmpArr);
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
                            {key > 0 && editItemReport.user_view != 1 ? (
                              <Button
                                className={"rounded-btn btn-minus-project"}
                                onClick={() => {
                                  let projectDocFiles = [...documentsReport];
                                  projectDocFiles = apputil.removeArrItem(
                                    projectDocFiles,
                                    key
                                  );
                                  setDocumentsReport(projectDocFiles);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                ></FontAwesomeIcon>
                              </Button>
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>
                        {key == documentsReport.length - 1 &&
                        editItemReport.user_view != 1 ? (
                          <Col lg={isWindow ? 1 : 12}>
                            <Button
                              className={
                                "btn-light-blue" +
                                (isWindow ? " rounded-btn " : " mt-2 w100")
                              }
                              onClick={() => {
                                let projectDocFiles = [...documentsReport];
                                projectDocFiles.push({
                                  no_dokumen: "",
                                  nama_dokumen: "",
                                  file: null,
                                });
                                setDocumentsReport(projectDocFiles);
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
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            {errorMessageReport != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessageReport}
              </div>
            ) : (
              ""
            )}
            {!(editItemReport.user_view == 1) ? (
              <Button className="btn-save" type="submit">
                {isSubmitting ? (
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
                setShowModalReport(false);
              }}
            >
              {editItem.user_view == 1
                ? configModalCU.closeLabel
                : configModalCU.cancelLabel}
            </Button>
          </Modal.Footer>
        </Form>
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
    </div>
  );
}

ListProjectHighPage.layout = Admin;

export default ListProjectHighPage;
