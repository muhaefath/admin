import apputil from "../../helper/apputil.js";
import config from "../config.js";

const PegawaiService = {
  getPegawai(data) {
    const url = config.baseUrl + "/admin/master/kepegawaian/list";
    return apputil.getRequest(url, data);
  },
  postPegawaiCreate(data) {
    const url = config.baseUrl + "/admin/master/kepegawaian/add";
    return apputil.postRequest(url, data);
  },
  postPegawaiUpdate(data) {
    const url = config.baseUrl + "/admin/master/kepegawaian/edit";
    return apputil.postRequest(url, data);
  },
  deletePegawai(data) {
    const url = config.baseUrl + "/admin/master/kepegawaian/delete";
    return apputil.deleteRequest(url, data);
  },
};

export default PegawaiService;
