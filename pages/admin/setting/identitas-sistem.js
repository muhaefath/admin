import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import { Form, Image, Row, Col, Spinner } from "react-bootstrap";
import useAPINotif from "../../../component/common/hooks/useAPINotif";
import apputil from "../../../helper/apputil";
import Admin from "../../../layouts/Admin";
import settingService from "../../../_api/admin/SettingService";

const page = "Identitas Sistem";

function SettingIdentitasPage() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { addError, stat, setIsLoading } = useAPINotif();
  const [editItem, setEditItem] = useState({});

  const [roleConfig, setRoleConfig] = useState({});

  const [isWindow, setIsWindow] = useState(true);

  const [fileName, setFileName] = useState(null);

  const fileInputRef = useRef(null);
  // "id": "1",
  // "company_name": "company_name",
  // "company_logo": null,
  // "company_address": "address",
  // "company_phone": "021-6545656",
  // "company_email": "email@gmail.com",
  // "description": "App descriptions"

  useEffect(() => {
    setRoleConfig(apputil.getMenuItemByPath());
    getData();

    setIsWindow(apputil.isWindow());
  }, []);

  async function getData() {
    try {
      setIsLoadingData(true);
      var res = await settingService.getSysInfo();
      setIsLoadingData(false);
      if (res.status == "ok") {
        setEditItem(res.data);
        setFileName(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onUpdate(data) {
    try {
      setIsSubmittingData(true);
      var res = await settingService.postSysInfoUpdate(data);
      if (fileName) {
        var res2 = await settingService.postSysInfoUploadImage({
          id: data.id,
          image: fileName,
        });
        if (res2.status == "ok") {
          addError("Informasi", res.pesan, stat.success);
        } else {
          setErrorMessage(res.pesan ?? "");
        }
      }
      setIsSubmittingData(false);
      if (res.status == "ok") {
        addError("Informasi", res.pesan, stat.success);
      } else {
        setErrorMessage(res.pesan ?? "");
      }
    } catch (error) {
      addError("Informasi", "Error Request", stat.error);
      console.log(error);
    }
  }

  return (
    <div>
      <Form
        noValidate
        validated={validated}
        onSubmit={(e) => {
          const form = e.currentTarget;
          setValidated(true);
          e.preventDefault();
          e.stopPropagation();
          if (!form.checkValidity()) {
            return;
          }
          onUpdate(editItem);
        }}
      >
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group
              as={Row}
              className="mb-3"
              style={{
                flexWrap: isWindow ? "inherit" : "",
                alignItems: "center",
              }}
            >
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  try {
                    console.log(e.target.files);
                    const file = e.target.files[0];
                    apputil.base64Convert(file, (fileRes) => {
                      setFileName(fileRes);
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }}
              ></Form.Control>
              <Image
                src={
                  fileName ?? editItem.company_logo ?? "/images/no_image.png"
                }
                style={{
                  width: "100px",
                  height: "100px",
                  padding: "0",
                  marginLeft: "10px",
                  cursor: "pointer",
                  border: "1px solid lightgrey",
                }}
                roundedCircle
                onClick={() => {
                  fileInputRef.current.click();
                }}
              ></Image>

              <Form.Label
                style={{
                  cursor: "pointer",
                  padding: !isWindow ? "0" : "0 12px 0 12px",
                }}
                onClick={() => {
                  fileInputRef.current.click();
                }}
              >
                <Image
                  src="/icons/gallery.svg"
                  className="icon-2"
                  height={"20px"}
                  width={"20px"}
                  style={{ padding: "0", marginRight: "5px" }}
                />
                <span style={{ fontSize: "12px" }}> Choose Company Logo</span>
              </Form.Label>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/building.svg" className="icon-2 mr-2" />
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.company_name}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.company_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
            </Form.Group>
          </Col>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/sms.svg" className="icon-2 mr-2" />
              <Form.Label>Company Email</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.company_email}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.company_email = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan email
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/call.svg" className="icon-2 mr-2" />
              <Form.Label>Company Phone</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.company_phone}
                onChange={(e) => {
                  try {
                    if (apputil.onlyNumberKey(e.target.value)) {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.company_phone = e.target.value.replace(
                        /\D/g,
                        ""
                      );
                      setEditItem(tmpSelectedItem);
                    }
                  } catch (error) {}
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan nomor handphone
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/location.svg" className="icon-2 mr-2" />
              <Form.Label>Company Address</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                as="textarea"
                rows={3}
                value={editItem.company_address}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.company_address = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
            </Form.Group>
          </Col>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Image src="/icons/project/paper.svg" className="icon-2 mr-2" />
              <Form.Label>Description</Form.Label>
              <Form.Control
                autoComplete="off"
                disabled={editItem.user_view == 1 ? true : false}
                as="textarea"
                rows={3}
                value={editItem.description}
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.description = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            {roleConfig.is_edit == 1 ? (
              <Button className="btn-save" type="submit">
                Simpan Perubahan
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

SettingIdentitasPage.layout = Admin;

export default SettingIdentitasPage;
