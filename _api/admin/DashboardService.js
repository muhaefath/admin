import apputil from "../../helper/apputil.js";
import config from "../config.js";

const DashboardService = {
  getDashboard(data) {
    const url = config.baseUrl + "/admin/dashboard";
    return apputil.getRequest(url, data);
  },
};

export default DashboardService;
