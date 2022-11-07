import apputil from "../../helper/apputil.js";
import config from "../config.js";

const UserService = {
  getUsers(data) {
    const url = config.baseUrl + "/admin/users/list";
    return apputil.getRequest(url, data);
  },
  postUserCreate(data) {
    const url = config.baseUrl + "/admin/user/add";
    return apputil.postRequest(url, data);
  },
  deleteUser(data) {
    const url = config.baseUrl + "/admin/user/delete";
    return apputil.deleteRequest(url, data);
  },
  getRole(data) {
    const url = config.baseUrl + "/admin/role/list";
    return apputil.getRequest(url, data);
  },
  postRoleCreate(data) {
    const url = config.baseUrl + "/admin/role/add";
    return apputil.postRequest(url, data);
  },
  postRoleUpdate(data) {
    const url = config.baseUrl + "/admin/role/edit";
    return apputil.postRequest(url, data);
  },
  deleteRole(data) {
    const url = config.baseUrl + "/admin/role/delete";
    return apputil.deleteRequest(url, data);
  },
};

export default UserService;
