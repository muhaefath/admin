import apputil from "../../helper/apputil.js";
import config from "../config.js";

const GeneralService = {
  getUserPegawaiList(data) {
    const url = config.baseUrl + "/admin/master/pegawai/list";
    return apputil.getRequest(url, data);
  },
  getProjectJabatanList(data) {
    const url = config.baseUrl + "/admin/master/jabatan/list";
    return apputil.getRequest(url, data);
  },
  getProjectKlasifikasiList(data) {
    const url = config.baseUrl + "/admin/master/klasifikasi/list";
    return apputil.getRequest(url, data);
  },
  getProjectPriorityList(data) {
    const url = config.baseUrl + "/admin/master/priority/list";
    return apputil.getRequest(url, data);
  },
  getProjectItemList(data) {
    const url = config.baseUrl + "/admin/master/item/list";
    return apputil.getRequest(url, data);
  },
  getPenggunaJasaList(data) {
    const url = config.baseUrl + "/admin/master/penggunajasa/ds/list";
    return apputil.getRequest(url, data);
  },
  getProjectList(data) {
    const url = config.baseUrl + "/admin/project/ds/list";
    return apputil.getRequest(url, data);
  },

  getItemNameById(dsItem, itemId) {
    try {
      return dsItem.find((x) => x.id == itemId).name;
    } catch (error) {
      return "";
    }
  },
};

export default GeneralService;
