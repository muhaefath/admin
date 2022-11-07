import apputil from "../../helper/apputil.js";
import config from "../config.js";

const ProjectService = {
  getProject(data) {
    const url = config.baseUrl + "/admin/project/list";
    return apputil.getRequest(url, data);
  },
  getProjectDetail(data) {
    const url = config.baseUrl + "/admin/project/detail"; //id
    return apputil.getRequest(url, data);
  },
  postProjectCreate(data) {
    const url = config.baseUrl + "/admin/project/add";
    return apputil.postRequest(url, data);
  },
  postProjectUpdate(data) {
    const url = config.baseUrl + "/admin/project/edit";
    return apputil.postRequest(url, data);
  },
  deleteProject(data) {
    const url = config.baseUrl + "/admin/project/delete";
    return apputil.deleteRequest(url, data);
  },
  approveProject(data) {
    const url = config.baseUrl + "/admin/project/approve";
    // "project_id": 1,
    // "status": 2,
    return apputil.postRequest(url, data);
  },
  rejectProject(data) {
    const url = config.baseUrl + "/admin/project/reject";
    // "project_id": 1,
    // "status": 7,
    // "alasan" : "dokumen kurang lengkap"
    return apputil.postRequest(url, data);
  },
  paymentScheduleProject(data) {
    const url = config.baseUrl + "/admin/project/finance/payment_schedule";
    return apputil.postRequest(url, data);
  },
  paymentTransferredProject(data) {
    const url = config.baseUrl + "/admin/project/finance/transferred";
    return apputil.postRequest(url, data);
  },
  paymentRescheduledProject(data) {
    const url = config.baseUrl + "/admin/project/finance/reschedule_payment";
    return apputil.postRequest(url, data);
  },
  postProjectCreateReport(data) {
    const url = config.baseUrl + "/admin/report/project/add";
    return apputil.postRequest(url, data);
  },

  funcGetProjectStatusClass(status) {
    if (status == "Waiting for Approval") {
      return "project-waiting-approval";
    } else if (status == "Approved") {
      return "project-approved";
    } else if (status == "Rejected") {
      return "project-rejected";
    } else if (status == "On Payment Schedule") {
      return "project-onpayment-schedule";
    } else if (status == "Done") {
      return "project-done";
    } else if (status == "Payment Transferred") {
      return "project-payment-transferred";
    }
  },
};

export default ProjectService;
