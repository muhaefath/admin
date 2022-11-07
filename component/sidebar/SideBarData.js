const sideBarData = {
  projectName: "Dog Market",
  items: [
    {
      title: "Dashboard",
      icon: <img src="/icons/sb-dashboard.svg"></img>,
      target: "/dashboard",
      layout: "/admin",
    },
    {
      title: "Kepegawaian",
      icon: <img src="/icons/sb-user.svg"></img>,
      target: "/user",
      layout: "/admin",
    },{
      title: "List Project",
      icon: <img src="/icons/sb-list-project.svg"></img>,
      target: "/project",
      layout: "/admin",
      items: [
        {
          title: "High Priority", 
          target: "/project/high",
          layout: "/admin",
        },
        {
          title: "Low Priority", 
          target: "/project/low",
          layout: "/admin",
        },
      ],
    },{
      title: "Master Data",
      icon: <img src="/icons/sb-master-data.svg"></img>,
      target: "/data",
      layout: "/admin",
      items: [
        {
          title: "Jabatan", 
          target: "/master/role",
          layout: "/admin",
        },
        {
          title: "User", 
          target: "/user",
          layout: "/admin",
        },
      ],
    },{
      title: "Pengaturan",
      icon: <img src="/icons/sb-setting.svg"></img>,
      target: "/setting",
      layout: "/admin",
      items: [
        {
          title: "Identitas Sistem", 
          target: "/setting/config",
          layout: "/admin",
        },
        {
          title: "Notifikasi", 
          target: "/setting/notification",
          layout: "/admin",
        },
        {
          title: "API", 
          target: "/setting/api",
          layout: "/admin",
        },
      ],
    },{
      title: "Report",
      icon: <img src="/icons/sb-report.svg"></img>,
      target: "/report",
      layout: "/admin",
    },
  ],
};
export default sideBarData;
