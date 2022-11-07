import apputil from "../../helper/apputil.js";
import config from "../config.js";

const AuthService = {
  postAuthLogin(data) {
    const url = config.baseEmpathyUrl + "/v1/admin/login";
    return apputil.postRequest(url, data);
  },
  postAuthGoogleLogin(data) {
    const url = config.baseUrl + "/admin/login/google";
    return apputil.postRequest(url, data);
  },
  postAuthRegister(data) {
    const url = config.baseUrl + "/api/admin/v1/student";
    return apputil.postRequest(url, data);
  },
  getProfile(data) {
    const url = config.baseUrl + "/admin/profile";
    return apputil.getRequest(url, data);
  },
  postUpdateProfile(data) {
    const url = config.baseUrl + "/admin/profile/update";
    return apputil.postRequest(url, data);
  },
};

export default AuthService;
