import {
  faCheckCircle,
  faSquareFull,
  faPlus,
  faTimes,
  faRefresh,
  faTableColumns,
  faRemove,
  faCalendar,
  faMoneyBill,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Highcharts from "highcharts";
import { confirm } from "../../component/Confirmation";
import HighchartsReact from "highcharts-react-official";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  ProgressBar,
  Row,
  Image,
  InputGroup,
  Card,
  Spinner,
} from "react-bootstrap";
import useAPINotif from "../../component/common/hooks/useAPINotif";
import apputil from "../../helper/apputil";
import Admin from "../../layouts/Admin";
import generalService from "../../_api/admin/GeneralService";
import projectService from "../../_api/admin/ProjectService";
import dashboardService from "../../_api/admin/DashboardService";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Typeahead } from "react-bootstrap-typeahead";

const page = "Dashboard";
const monthMap = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "Mei",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};
// const start_date = new Date();
// const end_date = new Date(
//   start_date.getFullYear(),
//   start_date.getMonth() - 1,
//   start_date.getDate()
// );

function Dashboard() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addError, stat, setIsLoading } = useAPINotif();
  const [filterDashboard, setFilterDashboard] = useState({
    // _start_date: start_date,
    // _end_date: end_date,
    // start_date: apputil.formatDate(start_date, "DD/MM/YYYY"),
    // end_date: apputil.formatDate(end_date, "DD/MM/YYYY"),
    // item: "all",
  });
  const [userData, setUserData] = useState(null);
  const [projectData, setProjectData] = useState([]);
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

  const [isRefreshData, setIsRefreshData] = useState(false);
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

  const [roleConfigProject, setRoleConfigProject] = useState({});
  const [editItem, setEditItem] = useState({});
  const [searchProject, setSearchProject] = useState("");

  const [dsKlasifikasi, setDSKlasifikasi] = useState([]);
  const [dsItem, setDSItem] = useState([]);
  const [dsPriority, setDSPriority] = useState([]);
  const [dsPenggunaJasa, setDSPenggunaJasa] = useState([]);
  const [dsLine1, setDSLine1] = useState([]);
  const [dsPie2, setDSPie2] = useState([]);
  const [summaryFinance, setSummaryFinance] = useState(null);

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

  useEffect(() => {
    getDataSource();
    getProject();
    try {
      var data = { ...filterDashboard };
      const now = new Date();
      var firstDateMonth = new Date(now.getFullYear(), 0, 1);
      data._start_date = firstDateMonth;
      data._end_date = now;
      data.start_date = apputil.formatDate(firstDateMonth, "DD/MM/YYYY");
      data.end_date = apputil.formatDate(now, "DD/MM/YYYY");
      data.item = "all";
      setFilterDashboard(data);

      getDashboard(data);
      apputil.removeLocalStorage("refresh_dashboard");

      setInterval(() => {
        if (
          apputil.getLocalStorage("refresh_dashboard") == 1 &&
          !isRefreshData
        ) {
          setIsRefreshData(true);
          getProject();
          getDashboard(filterDashboard); //harus trakhir set isRefreshData =  false
          apputil.removeLocalStorage("refresh_dashboard");
        }
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    try {
      let tmpUserData = apputil.getLocalStorage("_jz");
      setUserData(JSON.parse(tmpUserData));
    } catch (error) {}
    setIsWindow(apputil.isWindow());

    setRoleConfigProject(
      apputil.getMenuItemByPath("/admin/list-project/normal")
    );
  }, []);

  useEffect(() => {
    function updateSize() {
      setIsWindow(apputil.isWindow());
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  async function getDashboard(data) {
    try {
      setIsLoading(true);
      let fdata = { ...data };
      try {
        fdata.start_date = apputil.formatDate(data._start_date, "YYYY-MM-DD");
        fdata.end_date = apputil.formatDate(data._end_date, "YYYY-MM-DD");
      } catch (ex) {}
      delete fdata._start_date;
      delete fdata._end_date;
      var res = await dashboardService.getDashboard(fdata);
      setIsLoading(false);
      if (res.status == "ok") {
        var ds = getRenderedLineSource(res.data.chart_project_bar);
        var ds2 = getRenderedPieSource(res.data.chart_project_pie);
        setDSLine1(ds);
        setDSPie2(ds2);
        setSummaryFinance(res.data.summary_finance);
      }
    } catch (error) {
      console.log(error);
    }

    setIsRefreshData(false); //
  }
  async function getProject(query) {
    try {
      setIsLoadingData(true);
      if (!query) {
        query = { ...tableConfig };
      }
      query.search = searchProject;
      var res = await projectService.getProject(query);
      setIsLoadingData(false);
      if (res.status == "ok") {
        setProjectData(res.data);

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

  async function onCreateProject(data) {
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
        setShowModalCU(false);
        getDashboard(filterDashboard);
      } else {
        setErrorMessage(res.pesan ?? "");
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
        onSuccess(res.data[0]);
      }
    } catch (error) {}
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getRenderedLineSource(data) {
    try {
      var ds = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        ds.push({
          name: monthMap[element.month],
          y: parseInt(element.total),
          drilldown: monthMap[element.month],
          color: element.color,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return ds;
  }

  function getRenderedPieSource(data) {
    try {
      var ds = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        ds.push({
          name: element.status,
          y: parseInt(element.total),
          drilldown: element.status,
          color: element.color,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return ds;
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
        getProject();
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
        getProject();
        getDashboard(filterDashboard);
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
        setValidatedPaymentSchedule(false);
        getProject();
        getDashboard(filterDashboard);
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

  return (
    <>
      <Row style={{}}>
        <div
          className="mt-1 col-lg-3 col-md-12 col-xs-12 col-sm-12"
          style={
            {
              // padding: !isWindow ? "0" : "",
            }
          }
        >
          {roleConfigProject.is_add == 1 ? (
            <Button
              className="btn btn-light-blue gap-sm-2"
              style={{
                fontWeight: "500",
                width: isWindow ? "auto" : "100%",
              }}
              onClick={() => {
                setDocuments([
                  {
                    no_dokumen: "",
                    nama_dokumen: "",
                    file: null,
                  },
                ]);
                setEditItem({
                  start_project: apputil.formatDate(new Date(), "YYYY-MM-DD"),
                  end_project: apputil.formatDate(
                    apputil.addDays(new Date(), 10),
                    "YYYY-MM-DD"
                  ),
                });
                // console.log(editItem);
                setShowModalCU(true);
                setErrorMessage("");
                setValidated(false);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Project
            </Button>
          ) : (
            ""
          )}
        </div>
        <div
          className="col-lg-9 col-md-12 col-xs-12 col-sm-12 taright"
          // style={{
          //   padding: "0",
          // }}
        >
          <Row
            style={{ gap: !isWindow ? "10px" : "0px", justifyContent: "end" }}
          >
            <div
              className="mt-1 col-lg-3 col-md-12 col-xs-12 col-sm-12"
              style={{ padding: "0" }}
            ></div>
            <div
              className="mt-1 col-lg-2 col-md-12 col-xs-12 col-sm-12"
              style={{ padding: !isWindow ? "0" : "" }}
            >
              <Form.Select
                value={filterDashboard.item}
                onChange={(e) => {
                  try {
                    let tmpSelectedItem = {
                      ...filterDashboard,
                    };
                    tmpSelectedItem.item = e.target.value;
                    setFilterDashboard(tmpSelectedItem);
                    getDashboard(tmpSelectedItem);
                  } catch (error) {}
                }}
              >
                <option value={"all"}>All Item</option>
                {dsItem.map((x, key) => {
                  return (
                    <option key={key} value={x.id}>
                      {x.name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            <div
              className="mt-1 col-lg-4 col-md-12 col-xs-12 col-sm-12"
              style={{
                padding: !isWindow ? "0" : "",
                paddingRight: !isWindow ? "0" : "0",
              }}
            >
              <DateRangePicker
                alwaysShowCalendars={true}
                initialSettings={{
                  startDate: filterDashboard._start_date,
                  endDate: filterDashboard._end_date,
                }}
                onApply={(e, picker) => {
                  const startDate = picker.startDate._d;
                  const endDate = picker.endDate._d;
                  // console.log(startDate);
                  // console.log(endDate);

                  let tmpSelectedItem = {
                    ...filterDashboard,
                  };
                  tmpSelectedItem._start_date = startDate;
                  tmpSelectedItem._end_date = endDate;
                  tmpSelectedItem.start_date = apputil.formatDate(
                    startDate,
                    "DD/MM/YYYY"
                  );
                  tmpSelectedItem.end_date = apputil.formatDate(
                    endDate,
                    "DD/MM/YYYY"
                  );
                  setFilterDashboard(tmpSelectedItem);
                  getDashboard(tmpSelectedItem);
                }}
              >
                <InputGroup
                  className="mb-3"
                  style={{ flexWrap: "inherit", justifyContent: "end" }}
                >
                  <Button
                    style={{
                      background: "white",
                      color: "black",
                      border: "1px solid #ced4da",
                      borderRight: "0px",
                      textShadow: "none",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {filterDashboard.start_date +
                      " - " +
                      filterDashboard.end_date}
                  </Button>
                  <InputGroup.Text
                    id="basic-addon2"
                    style={{ background: "transparent" }}
                  >
                    <img src="/icons/calendar.svg"></img>
                  </InputGroup.Text>
                </InputGroup>
              </DateRangePicker>
            </div>
          </Row>
        </div>
      </Row>

      <Row style={{}}>
        {userData?.role_name == "Finance" ? (
          <div className="col-lg-2 col-md-2 col-xs-2 col-sm-12">
            <Card>
              <Card.Body style={{ height: "322px" }}>
                <h6>Total Value</h6>
                <h5 style={{ margin: "0" }}>
                  {summaryFinance ? summaryFinance.total_value : ""}
                </h5>
                <div style={{ fontSize: "14px", color: "#9E9F9E" }}>Total</div>
                <hr style={{ marginTop: "2px", marginBottom: "8px" }}></hr>
                {/* <Row>
                  <Col lg={3} xs={3} sm={3} md={3} style={{ padding: "0" }}>
                    <div
                      style={{
                        padding: "10px",
                        background: "rgba(255, 199, 0, 0.15);",
                        borderRadius: "10px",
                      }}
                    >
                      <Image
                        src="/icons/wallet.svg"
                        style={{
                          width: "100%",
                          maxWidth: "30px",
                          margin: "auto",
                        }}
                      ></Image>
                    </div>
                  </Col>
                  <Col lg={9} xs={9} sm={9} md={9}>
                    <div>Rp. 200.000</div>

                    <div style={{ fontSize: "14px", color: "#9E9F9E" }}>
                      Total Sisa
                    </div>
                  </Col>
                </Row>
                <div style={{ height: "5px" }}></div> */}
                {/* <Row>
                  <Col lg={3} xs={3} sm={3} md={3} style={{ padding: "0" }}>
                    <div
                      style={{
                        padding: "10px",
                        background: "rgba(222, 0, 0, 0.05);",
                        borderRadius: "10px",
                      }}
                    >
                      <Image
                        src="/icons/receipt.svg"
                        style={{
                          width: "100%",
                          maxWidth: "30px",
                          margin: "auto",
                        }}
                      ></Image>
                    </div>
                  </Col>
                  <Col lg={9} xs={9} sm={9} md={9}>
                    <div>Rp. 200.000</div>

                    <div style={{ fontSize: "14px", color: "#9E9F9E" }}>
                      Total Unpaid
                    </div>
                  </Col>
                </Row>
                <div style={{ height: "5px" }}></div> */}
                <Row>
                  <Col lg={3} xs={3} sm={3} md={3} style={{ padding: "0" }}>
                    <div
                      style={{
                        padding: "10px",
                        background: "rgba(0, 128, 0, 0.05);",
                        borderRadius: "10px",
                      }}
                    >
                      <Image
                        src="/icons/checklist.svg"
                        style={{
                          width: "100%",
                          maxWidth: "30px",
                          margin: "auto",
                        }}
                      ></Image>
                    </div>
                  </Col>
                  <Col lg={9} xs={9} sm={9} md={9}>
                    <div>
                      {summaryFinance ? summaryFinance.total_transferred : ""}
                    </div>
                    <div style={{ fontSize: "14px", color: "#9E9F9E" }}>
                      Total Transferred
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        ) : (
          ""
        )}
        <div
          className={
            userData?.role_name == "Finance"
              ? "col-lg-5 col-md-5 col-xs-5 col-sm-12"
              : "col-lg-6 col-md-6 col-xs-6 col-sm-12"
          }
        >
          <Card>
            <Card.Body>
              <HighchartsReact
                containerProps={{ style: { height: "290px" } }}
                highcharts={Highcharts}
                options={{
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: "column",
                  },

                  title: {
                    text: "",
                  },
                  credits: {
                    enabled: false,
                  },

                  yAxis: {
                    title: {
                      enabled: false,
                    },
                  },
                  xAxis: {
                    type: "category",
                  },
                  legend: {
                    enabled: false,
                  },
                  series: [
                    {
                      name: "Jumlah Project",
                      colorByPoint: true,
                      data: dsLine1,
                    },
                  ],
                }}
              />
            </Card.Body>
          </Card>
        </div>
        <div
          className={
            userData?.role_name == "Finance"
              ? "col-lg-5 col-md-5 col-xs-5 col-sm-12"
              : "col-lg-6 col-md-6 col-xs-6 col-sm-12"
          }
        >
          <Card>
            <Card.Body>
              <HighchartsReact
                containerProps={{ style: { height: "290px" } }}
                highcharts={Highcharts}
                callback={(e) => {
                  // console.log(e);
                }}
                options={{
                  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: "pie",
                  },
                  title: {
                    text: "",
                  },
                  credits: {
                    enabled: false,
                  },
                  tooltip: {
                    pointFormat:
                      "{series.name}: <b>{point.percentage:.1f}%</b>",
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: "pointer",
                      dataLabels: {
                        enabled: true,
                        distance: -30,
                      },
                      showInLegend: true,
                      borderWidth: 0, // < set this option
                    },
                  },
                  legend: {
                    align: "right",
                    layout: "vertical",
                    verticalAlign: "middle",
                    x: 0,
                    y: 0,
                    labelFormatter: function () {
                      // if (!this.series.total) this.series.calcTotal();
                      if (this.series.total) {
                        return (
                          this.name +
                          " (" +
                          ((this.y / this.series.total) * 100).toFixed(2) +
                          "%)"
                        );
                      }
                      return this.name;
                    },
                    padding: 3,
                    itemMarginTop: 3,
                    itemMarginBottom: 3,
                    itemStyle: {
                      lineHeight: "14px",
                      fontWeight: "normal",
                    },
                  },
                  series: [
                    {
                      name: "Status Project",
                      colorByPoint: true,
                      data: dsPie2,
                    },
                  ],
                }}
              />
            </Card.Body>
          </Card>
        </div>
      </Row>
      <div style={{ height: "10px" }}></div>
      <Row style={{}}>
        <Col>
          <Form
            style={{
              display: "flex",
              width: "20%",
              minWidth: "300px",
              paddingLeft: "0",
            }}
            className="mb-2"
          >
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search"
                className="shadow-none"
                style={{ borderRight: "0px" }}
                onChange={(e) => {
                  setSearchProject(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getProject();
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
          <DataTable
            value={projectData}
            size="small"
            resizableColumns
            // className={"p-datatable-gridlines p-datatable-responsive"}
            style={{ paddingLeft: "0" }}
            // selection={this.state._selectedItemGrid11}
            // onSelectionChange={(e) => this.setSelectedGrid11(e.value)}
            // selectionMode="single"
            dataKey="id"
            paginator
            onPage={(event) => {
              let tmpConfig = { ...tableConfig };
              apputil.onPagination(tmpConfig, event);
              setTableConfig(tmpConfig);
              getProject(tmpConfig);
            }}
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            first={tableConfig.offset}
            rows={tableConfig.limit}
            totalRecords={tableConfig.totalRecord}
            lazy={true}
            // rowsPerPageOptions={[5, 10, 20, 50]}
            rowsPerPageOptions={[25, 50]}
            // multiSortMeta={tableConfig.multiSortMeta}
            // sortMode="multiple"
            sortField={tableConfig.sortField}
            sortOrder={tableConfig.sortOrder}
            onSort={(event) => {
              // console.log(event);
              let tmpConfig = { ...tableConfig };
              apputil.onSort(tmpConfig, event);
              setTableConfig(tmpConfig);
              getProject(tmpConfig);
            }}
            filters={tableConfig.filters ? tableConfig.filters : null}
            onFilter={(event) => {
              // console.log(event);
              let tmpConfig = { ...tableConfig };
              apputil.onFilter(tmpConfig, event);
              setTableConfig(tmpConfig);
              getProject(tmpConfig);
            }}
            paginatorLeft={
              <>
                {/* <Button
              className="add-btn"
              title={"Refresh"}
              onClick={() => getProject()}
            >
              <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
            </Button> */}
              </>
            }
            loading={isLoadingData}
          >
            <Column field="id" header="id" hidden={true}></Column>
            <Column field="no_project" header="Nomor Project"></Column>
            <Column
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
                        tmpConf.title = `Detail Project`;
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
              sortable
              field="project_value"
              header="Nilai"
              body={(row) => {
                return "Rp " + apputil.formatCurrency(row.project_value);
              }}
            ></Column>
            <Column
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
            <Column sortable field="created_at" header="Tanggal Input"></Column>
            <Column
              sortable
              field="start_project"
              header="Tanggal Mulai"
            ></Column>
            <Column
              sortable
              field="end_project"
              header="Target Selesai"
            ></Column>
            <Column
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
            {/* <Column
          header=""
          style={{ width: "150px" }}
          // className={
          //   col.className !== undefined
          //     ? col.className
          //     : "actionswidth overflowtext"
          // }
          body={
            <>
              {apputil.getMenuItemByPath("/list-project/normal").is_view ==
              1 ? (
                <span
                  title="View"
                  className="action-custom-btn"
                  onClick={async () => {
                    let tmpRowData = { ...rowData };
                    tmpRowData.user_view = 1;
                    setEditItem(tmpRowData);
                    let tmpConf = { ...configModalCU };
                    tmpConf.title = `View Project`;
                    setConfigModalCU(tmpConf);
                    setShowModalCU(true);
setErrorMessage('');
setValidated(false);
                  }}
                >
                  <Image src={"/icons/eye-blue.svg"}></Image>
                </span>
              ) : (
                ""
              )}
            </>
          }
        /> */}
          </DataTable>
        </Col>
      </Row>
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
            onCreateProject(editItem);
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
                        // console.log(tmpSelectedItem);
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
                          <Col>
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
}

Dashboard.layout = Admin;

export default Dashboard;
