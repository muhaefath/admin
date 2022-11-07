import axios from "axios";
import moment from "moment";
import Cookies from "universal-cookie";
import * as CryptoJS from "crypto-js";

const _akey = "pert_panjar";
const _aeskey = "pert_panjar_2022";
const x_api_key = "Basic 15cb7zbf4-3xc2-h2ts-b856-2522c1eo87u6";
const cookies = new Cookies();

const apputil = {
  isLogin() {
    if (this.getLocalStorage("_token")) {
      return true;
    } else {
      return false;
    }
  },
  sendOTP() {},
  verifyOTP() {},
  resendTimer() {},
  async getRequest(url, data, withToken = false) {
    try {
      const token = this.getLocalStorage("_token");
      const response = await axios.get(url, {
        params: data,
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": x_api_key,
          "Content-Type": "application/json",
          Token: token,
        },
      });
      // console.log(response.data);
      //console.log("@param:" + JSON.stringify(data) + "@url: " + url);
      if (response.status === 200) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (ex) {
      console.log(ex);
      if (ex.toString() === "Error: Request failed with status code 403") {
        this.redirectLogin("exp");
      } else {
      }
      return null;
    }
  },
  async postRequest(url, data, param) {
    try {
      const token = this.getLocalStorage("_token");
      var config = {
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": x_api_key,
          "Content-Type": "application/json",
          Token: token,
        },
      };
      const response = await axios.post(url, data, config);
      // console.log(response.data);
      //console.log("@param:" + JSON.stringify(data) + "@url: " + url);
      if (response.status === 200) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (ex) {
      console.log(ex);
      if (ex === "Error: Request failed with status code 403") {
        this.redirectLogin("exp");
      } else {
      }
      return null;
    }
  },
  async deleteRequest(url, data, param) {
    try {
      const token = this.getLocalStorage("_token");
      var config = {
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Api-Key": x_api_key,
          Token: token,
          //param: param, //need to disabled
        },
        data: data,
      };
      const response = await axios.delete(url, config);
      // console.log(response.data);
      console.log("@url: " + url);
      if (response.status === 200) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (ex) {
      console.log(ex);
      if (ex === "Error: Request failed with status code 403") {
        this.redirectLogin("exp");
      } else {
      }
      return null;
    }
  },
  redirectLogin(stat, force = true) {
    //force = false / logout
    if (stat === "exp1" || !force) {
      if (force) {
        localStorage.setItem("sessexpmessage", "Session expired");
      }
    }
  },
  getCookie: function (key) {
    var tkey = _akey + key;
    //console.log(tkey);
    const value = cookies.get(tkey);
    let decValue;
    if (value) {
      decValue = value;
      // decValue = this.decryptValue(value);
    }
    return decValue;
  },
  setCookie: function (key, value) {
    try {
      var tkey = _akey + key;
      //console.log("setCookie", tkey);
      const encValue = value;
      // const encValue = this.encryptValue(value);
      return cookies.set(tkey, encValue, { path: "/" });
    } catch (ex) {
      console.log(ex);
    }
  },
  removeCookie: function (key) {
    var tkey = _akey + key;
    return cookies.remove(tkey);
  },
  getLocalStorage: function (key) {
    var tkey = _akey + key;
    var decValue;
    if (process.browser) {
      const value = localStorage.getItem(tkey);
      // console.log(value);
      if (value) {
        decValue = this.decryptValue(value);
      }
      // console.log(decValue);
    }
    return decValue;
  },
  setLocalStorage: function (key, value) {
    var tkey = _akey + key;
    if (process.browser) {
      const encValue = this.encryptValue(value);
      //console.log(encValue);
      localStorage.setItem(tkey, encValue);
    }
  },
  removeLocalStorage: function (key) {
    var tkey = _akey + key;
    if (process.browser) {
      localStorage.removeItem(tkey);
    }
  },
  encryptValue: function (value) {
    const encVal = CryptoJS.AES.encrypt(value, _aeskey, { iv: 4 });
    return encVal;
  },
  decryptValue: function (value) {
    const encVal = CryptoJS.AES.decrypt(value, _aeskey, { iv: 4 });
    const plaintext = encVal.toString(CryptoJS.enc.Utf8);
    return plaintext;
  },
  formatDate: function (val, formatdate = "DD MMM YYYY") {
    try {
      return moment(val).format(formatdate);
    } catch (ex) {
      console.log(ex);
      return "";
    }
  },
  formatCurrency: function (val, symbol) {
    try {
      if (!symbol) {
        symbol = "";
      }
      var value = 0;
      if (val) {
        if (typeof val === "string") {
          value = parseInt(val);
        }
        value = value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return symbol + value;
      } else {
        return symbol + "0";
      }
    } catch (ex) {
      console.log(ex);
      return "0";
    }
  },
  formatCurrencyLabel: function (n, useSymbol = false) {
    var val = "";
    if (useSymbol) {
      val = "Rp ";
    }
    if (n < 1e3) return val + n;
    if (n >= 1e3 && n < 1e6) return val + n / 1e3 + " Rb";
    if (n >= 1e6 && n < 1e9) return val + (n / 1e6).toFixed(1) + " Jt";
    if (n >= 1e9 && n < 1e12) return val + (n / 1e9).toFixed(1) + " M";
    if (n >= 1e12) return val + (n / 1e12).toFixed(1) + " T";
  },
  resizeGridHeight(callback) {
    // try {
    //   let elHeaderHeight = document.getElementById("scmainheader").clientHeight;
    //   let elFooterHeight = document.getElementById("scmainfooter").clientHeight;
    //   let elNavHeight = document.getElementById("scmainnav").clientHeight;
    //   let elToolbarHeight = document.getElementById("scmaintoolbar1")
    //     ? document.getElementById("scmaintoolbar1").clientHeight
    //     : 0;
    //   let elPaginatorHeight =
    //     document.getElementsByClassName("p-paginator")[0].clientHeight;
    //   let elTabHeight = 30; //34;
    //   let windowHeight = window.innerHeight;
    //   let totalHeight =
    //     elHeaderHeight +
    //     elNavHeight +
    //     elTabHeight +
    //     elToolbarHeight +
    //     elPaginatorHeight +
    //     elFooterHeight;
    //   let gridHeight = windowHeight - totalHeight;
    //   let elRowheight = 38;
    //   let rows = Math.floor(gridHeight / elRowheight);
    //   // console.log(
    //   //   elHeaderHeight,
    //   //   elNavHeight,
    //   //   elTabHeight,
    //   //   elToolbarHeight,
    //   //   elFooterHeight
    //   // );
    //   //console.log(windowHeight, totalHeight, gridHeight);
    //   if (callback) callback(false, rows, gridHeight);
    // } catch (ex) {
    //   console.log(ex);
    // }
  },
  removeArrItem(arr, index) {
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  },
  addDays(d, days) {
    return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
  },
  isWindow() {
    var isWindow = true;
    let width;
    try {
      if (window) {
        width = window.screen.width;
        if (width < 600) {
          isWindow = false;
        }
      }
    } catch (error) {}

    // console.log("@isWindow: ", isWindow, width);
    return isWindow;
  },
  base64Convert(file, successCallback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("@base64Convert: sucess");
      successCallback(reader.result);
    };
    reader.readAsDataURL(file);
  },
  getMenuItemByPath(pathname) {
    // console.log(pathname);
    let selectedItem;
    try {
      let path;
      if (window) {
        path = window.location.pathname;
      }

      if (pathname) {
        path = pathname;
      }
      const listMenu = JSON.parse(apputil.getLocalStorage("_menu"));
      let bigMenu;
      for (let index = 0; index < listMenu.length; index++) {
        const element = listMenu[index];
        if (element.path_url == path) {
          selectedItem = element;
          break;
        }
        if (element.submenu) {
          bigMenu = element;
          for (let j = 0; j < element.submenu.length; j++) {
            const e = element.submenu[j];
            if (e.path_url == path) {
              selectedItem = e;
              selectedItem.isSubmenu = true;
              break;
            }
          }
        }
      }
      // console.log("@selectedMenu: " + JSON.stringify(selectedItem));
    } catch (error) {
      // console.log("@Error getMenuItemByPath" + error);
    }
    if (!selectedItem) {
      selectedItem = {};
      selectedItem.is_view = 0;
      selectedItem.is_add = 0;
      selectedItem.is_edit = 0;
      selectedItem.is_delete = 0;
    }
    return selectedItem;
  },
  onlyNumberKey(val) {
    const re = /^[0-9\b]+$/;
    if (re.test(val) || val == "") {
      return true;
    }
    return true;
  },
  onPagination(tableConfig, event) {
    // console.log("@onPagination", event);
    // console.log("@SET OFFSET", `${event.rows} * ${event.page}`);
    // console.log("@SET CURRPAGE", `${event.page + 1}`);
    tableConfig.offset = event.rows * event.page;
    tableConfig.limit = event.rows;
    tableConfig.currentPage = event.page + 1;

    return tableConfig;
  },
  onSort(tableConfig, event) {
    // console.log("@onSort", event);
    tableConfig.sortField = event.sortField;
    tableConfig.sortOrder = event.sortOrder;
    tableConfig.multiSortMeta = event.multiSortMeta;
    return tableConfig;
  },
  onFilter(tableConfig, event) {
    // console.log("@onFilter", event);
    tableConfig.filters = event.filters;

    return tableConfig;
  },

  removeDgtGroup(str) {
    return str.replaceAll(",", "");
  },
  getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    return "unknown";
  },
};

export default apputil;
