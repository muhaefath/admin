import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { Form, Row, Spinner } from "react-bootstrap";
import useAPINotif from "../../component/common/hooks/useAPINotif";
import apputil from "../../helper/apputil";
import Admin from "../../layouts/Admin";
import settingService from "../../_api/admin/SettingService";

const page = "Notifikasi";

function NotificationPage() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addError, stat, setIsLoading } = useAPINotif();
  const [editItem, setEditItem] = useState({});
  const [roleConfig, setRoleConfig] = useState({});
  // "id": "6",
  // "full_name": "Nani wijaya",
  // "email": "nani123@gmail.com",
  // "phone": "085689878928",
  // "address": "Jl Tenjo No 6",
  // "username": "akudiamana",
  // "role_name": "PIC"

  useEffect(() => {
    setRoleConfig(apputil.getMenuItemByPath());
    getData();
  }, []);

  async function getData() {
    try {
      setIsLoading(true);
      var res = await settingService.getNotification();
      setIsLoading(false);
      if (res.status == "ok") {
        setEditItem(res.data);
      }
    } catch (error) {}
  }
  return <div></div>;
}

NotificationPage.layout = Admin;

export default NotificationPage;
