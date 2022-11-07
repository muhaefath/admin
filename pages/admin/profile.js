import { useEffect, useRef, useState } from "react";
import { Button, Form, Image, Row, Col, Spinner } from "react-bootstrap";
import useAPINotif from "../../component/common/hooks/useAPINotif";
import { FallbackImage } from "../../component/FallbackImage";
import apputil from "../../helper/apputil";
import Admin from "../../layouts/Admin";
import authService from "../../_api/admin/AuthService";

const page = "Profile";

function ProfilePage() {
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

    setIsWindow(apputil.isWindow());
  }, []);

  async function getData() {
    try {
      setIsLoading(true);
      var res = await authService.getProfile();
      setIsLoading(false);
      if (res.status == "ok") {
        setEditItem(res.data);
        apputil.setLocalStorage("_pp", res.data.image_profile);
      }
    } catch (error) {}
  }

  async function onUpdate(data) {
    try {
      setIsSubmittingData(true);
      if (fileName) {
        data.image_profile = fileName;
      }
      var res = await authService.postUpdateProfile(data);
      // if (fileName) {
      //   var res2 = await authService.postUpdateProfile({
      //     id: data.id,
      //     image: fileName,
      //   });

      //   if (res2.status == "ok") {
      //     addError("Informasi", res.pesan, stat.success);
      //   } else {
      //     setErrorMessage(res.pesan ?? "");
      //   }
      // }
      setIsSubmittingData(false);
      if (res.status == "ok") {
        setFileName(null);
        addError("Informasi", res.pesan, stat.success);
        getData();
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
        <Form.Group
          as={Row}
          className="mb-3"
          style={{ flexWrap: "inherit", alignItems: "center" }}
        >
          <Col style={{ display: "flex", alignItems: "center" }}>
            <Form.Control
              autoComplete="off"
              disabled={editItem.user_view == 1 ? true : false}
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                try {
                  // console.log(e.target.files);
                  const file = e.target.files[0];
                  apputil.base64Convert(file, (fileRes) => {
                    setFileName(fileRes);
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            ></Form.Control>
            <FallbackImage
              src={fileName ?? editItem.image_profile}
              onErrorImage={"/images/default_account.jpeg"}
              width="100px"
              height="100px"
              style={{
                padding: "0",
                marginLeft: "10px",
                cursor: "pointer",
                borderRadius: "50px",
              }}
              onClick={() => {
                fileInputRef.current.click();
              }}
            ></FallbackImage>
            <span style={{ width: "10px" }}></span>
            <Form.Label
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                fileInputRef.current.click();
              }}
            >
              Edit Profile Photo
            </Form.Label>
          </Col>
        </Form.Group>

        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                disabled={true}
                // disabled={editItem.user_view == 1 ? true : false}
                value={editItem.full_name}
                // required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.full_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.first_name}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.first_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan first name
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.last_name}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.last_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan last name
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.email}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.email = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan email
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.phone}
                required
                maxLength={16}
                onChange={(e) => {
                  try {
                    if (apputil.onlyNumberKey(e.target.value)) {
                      let tmpSelectedItem = {
                        ...editItem,
                      };
                      tmpSelectedItem.phone = e.target.value.replace(/\D/g, "");
                      setEditItem(tmpSelectedItem);
                    }
                  } catch (error) {}
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan phone
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                disabled={editItem.user_view == 1 ? true : false}
                as="textarea"
                rows={3}
                value={editItem.address}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.address = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan address
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                disabled={true}
                // disabled={editItem.user_view == 1 ? true : false}
                value={editItem.username}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.username = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
            </Form.Group>
          </Col>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Rolename</Form.Label>
              <Form.Control
                disabled={true}
                // disabled={editItem.user_view == 1 ? true : false}
                value={editItem.role_name}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.role_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.bank_name}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.bank_name = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan bank name
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={isWindow ? 6 : 12}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Bank Account</Form.Label>
              <Form.Control
                disabled={editItem.user_view == 1 ? true : false}
                value={editItem.bank_account}
                required
                onChange={(e) => {
                  let tmpSelectedItem = {
                    ...editItem,
                  };
                  tmpSelectedItem.bank_account = e.target.value;
                  setEditItem(tmpSelectedItem);
                }}
              />
              <Form.Control.Feedback type="invalid">
                Masukkan bank account
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col lg={isWindow ? 6 : 12}>
            {/* {roleConfig.is_edit == 1 ? ( */}
            <Button className="btn-save" type="submit">
              {isSubmittingData ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>
            {/* ) : (
          ""
        )} */}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

ProfilePage.layout = Admin;

export default ProfilePage;
