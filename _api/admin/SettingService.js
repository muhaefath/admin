import apputil from "../../helper/apputil.js";
import config from "../config.js";

const SettingService = {
  getSysInfo(data) {
    const url = config.baseUrl + "/admin/setting/sys-info";
    return apputil.getRequest(url, data);
  },
  postSysInfoUpdate(data) {
    const url = config.baseUrl + "/admin/setting/sys-info/edit";
    return apputil.postRequest(url, data);
  },
  postSysInfoUploadImage(data) {
    const url = config.baseUrl + "/admin/setting/sys-info/upload-image";
    return apputil.postRequest(url, data);
  },

  //notification
  getNotification(data) {
    const url = config.baseUrl + "/admin/notif/list";
    return apputil.getRequest(url, data);
  },
  postReadNotification(data) {
    const url = config.baseUrl + "/admin/notif/isread";
    return apputil.postRequest(url, data);
  },
  deleteNotification(data) {
    const url = config.baseUrl + "/admin/notif/delete";
    return apputil.deleteRequest(url, data);
  },
};

export default SettingService;
