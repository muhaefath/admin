import apputil from "../../helper/apputil.js";
import config from "../config.js";

const MenuService = {
  getMenu(data) {
    const url = config.baseUrl + "/admin/list_menu";
    return apputil.getRequest(url, data);
  },
  postMenuCreate(data) {
    const url = config.baseUrl + "/admin/menu/add";
    return apputil.postRequest(url, data);
  },
  postMenuUpdate(data) {
    const url = config.baseUrl + "/admin/menu/edit";
    return apputil.postRequest(url, data);
  },
  deleteMenu(data) {
    const url = config.baseUrl + "/admin/menu/delete";
    return apputil.deleteRequest(url, data);
  },
};

export default MenuService;
