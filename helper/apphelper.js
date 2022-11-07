const apphelper = {
  actionS: Object.freeze({
    create: "C",
    copy: "CP",
    update: "U",
    forcedelete: "FD",
    delete: "D",
    view: "V",
    active: "A",
    block: "B",
    reload: "R",
    generate: "G",
    generateuser: "GU",
    resetsession: "RS",
    resetpassword: "RP",
    activeshipment: "AS",
    activecompleted: "AC",
  }),
  action: Object.freeze({
    create: "create",
    copy: "copy",
    update: "update",
    delete: "delete",
    forcedelete: "forcedelete",
    view: "view",
    active: "active",
    block: "block",
    reload: "reload",
    generate: "generate",
  }),
  msg: {
    title: Object.freeze({
      create: "Create New Data",
      copy: "Copy Data",
      edit: "Edit Data",
      delete: "Hapus Data",
      forcedelete: "Permanent Delete Data",
      view: "View",
      active: "Activate Data",
      block: "Block Data",
      cancelorder: "Cancel Order?",
      generate: "Generate Data",
      generateuser: "Generate User",
      save: "Save Data",
      resetsession: "Reset All Session",
      resetpassword: "Reset Password",
      print: "Print",
      activeprocess: "Process Order?",
      activeshipment: "Process Order to Shipment?",
      activecompleted: "Process Order Completed?",
    }),
    content: Object.freeze({
      copy: "Copy data?",
      update: "Update data?",
      delete: "Hapus data?",
      permanentdelete: "Hapus data?",
      active: "Activate data?",
      block: "Block data?",
      continue: "Lanjutkan?",
    }),
    action: Object.freeze({
      register: "Register",
      login: "Login",
      save: "Save",
      create: "Create",
      update: "Update",
      yes: "Yes",
      no: "No",
      cancel: "Cancel",
      close: "Close",
      print: "Print",
    }),
  },
  toolbar: {
    tooltip: Object.freeze({
      create: "New",
      copy: "Copy",
      edit: "Edit",
      delete: "Delete",
      forcedelete: "Permanent Delete",
      active: "Activate",
      block: "Block",
      reload: "Reload",
      generate: "Generate",
      save: "Save",
      resetsession: "Reset All Session",
      reset: "Reset",
      clear: "Clear",
      generateuser: "Generate User",
      resetpassword: "Reset Password",
      print: "Print",
      export: "Export",
      reportinvoice: "Report Invoice",
      paidprocess: "Confirm Payment",
      activeprocess: "Process Order",
      activeshipment: "Process Order to Shipment",
      activecompleted: "Process Order to Completed",
      cancel: "Cancel",
      search: "Search",
      discountedit: "Edit Discount",
      priceedit: "Edit Price",
    }),
    icon: Object.freeze({
      create: "fa fa-plus-square",
      copy: "fa fa-copy",
      edit: "fa fa-edit",
      delete: "fa fa-trash",
      forcedelete: "fa fa-trash",
      view: "Vew",
      active: "fa fa-check",
      block: "fa fa-ban",
      reload: "fa fa-refesh",
      generate: "Generate",
      save: "Save",
      resetsession: "fa fa-reset",
      print: "fa fa-print",
    }),
  },
  stat: {
    grid: [
      // gridstat
      { text: "new", value: "0" },
      { text: "active", value: "1" },
      { text: "block", value: "2" },
      { text: "all", value: "3" },
    ],
    shop: [
      // shopstat
      { text: "Submitted", value: "0" },
      { text: "Revision", value: "1" },
      { text: "Approved", value: "2" },
    ],
  },
  isNull: function (text) {
    if (text === "" || text === null || text === undefined) {
      return true;
    }
    return false;
  },
  castStringisNull: function (text, castempty) {
    var str = null;
    if (text) {
      str = text.toString();
    } else {
      if (castempty) {
        str = "";
      } else {
        str = undefined;
      }
    }
    return str;
  },
};

export default apphelper;
