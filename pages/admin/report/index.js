import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import useAPINotif from "../../../component/common/hooks/useAPINotif";
import Admin from "../../../layouts/Admin";
import userService from "../../../_api/admin/UserService";

function ReportPage() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addError, stat, setIsLoading } = useAPINotif();
  const [data, setData] = useState([]);
  const [roleConfig, setRoleConfig] = useState({});
  const [tableConfig, setTableConfig] = useState({
    offset: 0,
    limit: 25,
    currentPage: 0,
    totalPage: 0,
    totalRecord: 0,
    sortField: "id",
    sortOrder: "1",
    filters: null,
    multiSortMeta: [],
  });

  useEffect(() => {
    setRoleConfig(apputil.getMenuItemByPath());
    getData();
  }, []);

  async function getData() {
    try {
      setIsLoadingData(true);
      var query = { ...tableConfig };
      var res = await userService.getUsers(query);
      setIsLoadingData(false);
      if (res.status == "ok") {
        setData(res.data);
        res.meta.currentPage = query.currentPage;
        res.meta.sortField = query.sortField;
        res.meta.sortOrder = query.sortOrder;
        res.meta.filters = query.filters;
        res.meta.multiSortMeta = query.multiSortMeta;
        setTableConfig(res.meta);
      }
    } catch (error) {}
  }
  return (
    <div>
      <DataTable value={data}>
        <Column sortable field="id" header="id"></Column>
      </DataTable>
    </div>
  );
}

ReportPage.layout = Admin;

export default ReportPage;
