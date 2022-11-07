import apputil from "../../helper/apputil.js";
import config from "../config.js";

const MasterService = {
  //jabatan
  getJabatan(data) {
    const url = config.baseUrl + "/admin/master/jabatan/list";
    return apputil.getRequest(url, data);
  },
  postJabatanCreate(data) {
    const url = config.baseUrl + "/admin/master/jabatan/add";
    return apputil.postRequest(url, data);
  },
  postJabatanUpdate(data) {
    const url = config.baseUrl + "/admin/master/jabatan/edit";
    return apputil.postRequest(url, data);
  },
  deleteJabatan(data) {
    const url = config.baseUrl + "/admin/master/jabatan/delete";
    return apputil.deleteRequest(url, data);
  },
  //klasifikasi
  getKlasifikasi(data) {
    const url = config.baseUrl + "/admin/master/klasifikasi/list";
    return apputil.getRequest(url, data);
  },
  postKlasifikasiCreate(data) {
    const url = config.baseUrl + "/admin/master/klasifikasi/add";
    return apputil.postRequest(url, data);
  },
  postKlasifikasiUpdate(data) {
    const url = config.baseUrl + "/admin/master/klasifikasi/edit";
    return apputil.postRequest(url, data);
  },
  deleteKlasifikasi(data) {
    const url = config.baseUrl + "/admin/master/klasifikasi/delete";
    return apputil.deleteRequest(url, data);
  },
  //priority

  getPriority(data) {
    const url = config.baseUrl + "/admin/master/priority/list";
    return apputil.getRequest(url, data);
  },
  postPriorityCreate(data) {
    const url = config.baseUrl + "/admin/master/priority/add";
    return apputil.postRequest(url, data);
  },
  postPriorityUpdate(data) {
    const url = config.baseUrl + "/admin/master/priority/edit";
    return apputil.postRequest(url, data);
  },
  deletePriority(data) {
    const url = config.baseUrl + "/admin/master/priority/delete";
    return apputil.deleteRequest(url, data);
  },
  //Item
  getItem(data) {
    const url = config.baseUrl + "/admin/master/item/list";
    return apputil.getRequest(url, data);
  },
  postItemCreate(data) {
    const url = config.baseUrl + "/admin/master/item/add";
    return apputil.postRequest(url, data);
  },
  postItemUpdate(data) {
    const url = config.baseUrl + "/admin/master/item/edit";
    return apputil.postRequest(url, data);
  },
  deleteItem(data) {
    const url = config.baseUrl + "/admin/master/item/delete";
    return apputil.deleteRequest(url, data);
  },

  //Pengguna Jasa
  getPenggunaJasa(data) {
    const url = config.baseUrl + "/admin/master/penggunajasa/list";
    return apputil.getRequest(url, data);
  },
  postPenggunaJasaCreate(data) {
    const url = config.baseUrl + "/admin/master/penggunajasa/add";
    return apputil.postRequest(url, data);
  },
  postPenggunaJasaUpdate(data) {
    const url = config.baseUrl + "/admin/master/penggunajasa/edit";
    return apputil.postRequest(url, data);
  },
  deletePenggunaJasa(data) {
    const url = config.baseUrl + "/admin/master/penggunajasa/delete";
    return apputil.deleteRequest(url, data);
  },
};

export default MasterService;
