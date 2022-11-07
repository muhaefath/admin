import { useEffect, useRef, useState } from "react";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import apputil from "../helper/apputil";
import authService from "../_api/admin/AuthService";
import { auth } from "../_api/FirebaseService";

function Login() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [obscurePassword, setObscurePassword] = useState(true);
  const formRef = useRef(null);
  useEffect(() => {
    if (apputil.getLocalStorage("forcesessionendmessage")) {
      // apphelper.showNotification({
      //   status: "error",
      //   title: "Information",
      //   content: apputil.getLocalStorage("forcesessionendmessage"),
      // });
      apputil.removeLocalStorage("forcesessionendmessage");
      apputil.removeLocalStorage("user");
    }

    if (window.location.hostname == "localhost") {
      setEmail("efath");
      // setEmail("awd@yopa.com"); //finance
      // setEmail("zainudin123@yopmail.com"); //approver
      // setEmail("jamal123@gmail.com"); //pic
      setPassword("123456");
    }
  }, []);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        formRef.current.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  async function signInWithGoogle() {
    setErrorMessage("");
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (re) => {
        try {
          // console.log(re);
          const rawUserInfo = JSON.parse(re._tokenResponse.rawUserInfo);
          const token = re._tokenResponse.oauthAccessToken;
          const googleId = rawUserInfo.id;
          const firstName = rawUserInfo.firstName;
          const data = {
            google_user_id: googleId,
            first_name: firstName,
            access_token: token,
            device_model: "linux",
            device_type: "WEB",
            device_id: "123",
          };
          var response = await authService.postAuthGoogleLogin(data);

          if (response.status == "ok") {
            const userData = response.data;
            const saveUserData = {
              full_name: userData.full_name,
              email: userData.email,
              role_id: userData.role_id,
              role_name: userData.role_name,
              image_profile: userData.image_profile,
            };
            const tokenUserData = {
              token: userData.token,
              token_expire: userData.token_expire,
            };
            apputil.setLocalStorage("_pp", saveUserData.image_profile);
            apputil.setLocalStorage("_jz", JSON.stringify(saveUserData));
            apputil.setLocalStorage("_token", tokenUserData.token);
            apputil.setLocalStorage(
              "_menu",
              JSON.stringify(userData.list_menu)
            );

            window.location = "/admin/dashboard";
          } else {
            setErrorMessage(response.pesan);
            // addError("Informasi", response.pesan, stat.error);
          }
        } catch (ex) {
          console.log(ex);
          setErrorMessage("Error login");
          // addError("Informasi", "Error Login", stat.error);
        }
      })
      .catch((err) => {
        setErrorMessage("Error login");
        // console.log(err);
      });
  }

  async function onClickLogin(logintype) {
    setErrorMessage("");
    apputil.removeCookie("_jz");
    apputil.removeCookie("_rzx");
    var data = {
      username: email,
      password: password,
      // logintype: logintype,
    };
    // apputil.setCookie("usertype", "admin");
    // apputil.setCookie("token", "123");
    // window.location = "/admin/dashboard";
    setIsSubmittingData(true);
    var response = await authService.postAuthLogin(data);
    try {
      if (response.status == 1) {
        //console.log(response);
        // if (!apputil.isNull(response.data.userrole)) {
        //   if (response.data.userrole !== "[]") {
        //     response.data.userrole = response.data.userrole.split(",");
        //   } else {
        //     response.data.userrole = JSON.parse(response.data.userrole);
        //   }
        // }
        const userData = response.data;
        const saveUserData = {
          full_name: userData.user.username,
          email: userData.user.username,
          role_id: userData.user.role,
          role_name: userData.user.role,
        };
        const tokenUserData = {
          token: userData.token.access_token,
        };
        // var menuDataRaw = response.menurole;
        // var menuDataMap = renderMenuObject(menuDataRaw);
        // var homeURL = response.url;

        // const sessionData = {
        //   userData: saveUserData,
        // menuData: menuDataMap,
        // menuDataRaw: menuDataRaw,
        // };
        //console.log(sessionData);
        apputil.setLocalStorage("_jz", JSON.stringify(saveUserData));
        apputil.setLocalStorage("_token", tokenUserData.token);
        apputil.setLocalStorage("_menu", JSON.stringify(userData.list_menu));

        window.location = "/admin/dashboard";
      } else {
        setErrorMessage(response.pesan);
        //("Informasi", response.pesan, stat.error);
      }
    } catch (ex) {
      setErrorMessage("Error login");
      // addError("Informasi", "Error Login", stat.error);
    }
    setIsSubmittingData(false);
  }
  async function onClickLogin2(logintype) {
    var data = {
      email: email,
      password: password,
      // logintype: logintype,
    };
    authService.postAuthLogin(data).then((response) => {});
  }

  const renderMenuObject = (data) => {
    var menuMapList = [];
    var menuList = [];
    let menuMap = {
      id: null,
      _children: [],
    };
    var parentList = [];
    for (var _p = 0; _p < data.length; _p++) {
      try {
        if (data[_p].parent > 1) {
          if (!parentList.includes(data[_p].parent)) {
            parentList.push(data[_p].parent);
            var filteredData = data.filter(function (element) {
              //filter stat = 1 & propvalue = 1
              return (
                element.parent === data[_p].parent &&
                element.stat === 1 &&
                element.propvalue === 1
              );
            });
            filteredData.sort((a, b) => a.seq - b.seq);
            menuMap = { id: data[_p].parent, _children: filteredData };
            if (menuMap._children.length > 0) {
              for (var k = 0; k < menuMap._children.length; k++) {
                menuMap._children[k]._tag = "CSidebarNavItem";
                menuMap._children[k].name = menuMap._children[k].idname;
                menuMap._children[k].to = menuMap._children[k].route;
                // delete menuMap._children[k].route;
              }
              menuList.push(menuMap); //jika ada children push
            }
          }
        } else {
          if (data[_p].stat === 1 && data[_p].propvalue === 1) {
            data[_p]._tag = "CSidebarNavDropdown";
            data[_p].name = data[_p].idname;
            data[_p].to = data[_p].route;
            menuMapList.push(data[_p]);
          }
        }
      } catch (ex) {
        console.log(ex);
      }
    }
    menuList.sort((a, b) => b.id - a.id);
    menuMapList.sort((a, b) => a.seq - b.seq);
    for (var _j = 0; _j < menuList.length; _j++) {
      for (var _k = 0; _k < menuList.length; _k++) {
        if (_j !== _k) {
          for (var _l = 0; _l < menuList[_k]._children.length; _l++) {
            if (menuList[_k]._children[_l].id === menuList[_j].id) {
              //jika sama
              if (menuList[_k]._children[_l]._children) {
                menuList[_k]._children[_l]._children.push(
                  menuList[_j]._children
                );
              } else {
                menuList[_k]._children[_l]._tag = "CSidebarNavDropdown"; //ubah tag jadi parent
                menuList[_k]._children[_l]._children = menuList[_j]._children;
              }
            }
          }
        }
      }
    }
    for (var _m = 0; _m < menuMapList.length; _m++) {
      for (var _n = 0; _n < menuList.length; _n++) {
        if (menuMapList[_m].id === menuList[_n].id) {
          menuMapList[_m]._children = menuList[_n]._children;
        }
      }
    }
    // console.log(menuList);
    // console.log(menuMapList);
    return menuMapList;
  };

  return (
    <main
      className="mainclass"
      style={{
        width: "100%",
        overflow: "hidden",
        position: "absolute",
        backgroundImage: "url(" + "/images/background1.jpeg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="login-box"
        style={{ margin: "auto", textAlign: "center" }}
      >
        <img width="100px" src="/sidebar-logo.svg" alt=""></img>
        <div style={{ height: "20px" }}></div>
        <div className="">
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
              onClickLogin();
            }}
          >
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ display: "flex" }}>
                Email/Username
              </Form.Label>
              <Form.Control
                value={email}
                className="shadow-none"
                placeholder={"Masukkan username"}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ textAlign: "left" }}
              >
                Masukkan email/username
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ display: "flex" }}>Password</Form.Label>

              <InputGroup>
                <Form.Control
                  value={password}
                  type={obscurePassword ? "password" : "text"}
                  className="shadow-none"
                  placeholder={"Masukkan password"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                  // style={{ borderRight: "0px solid" }}
                />
                <InputGroup.Text
                  id="basic-addon2"
                  style={{ background: "white" }}
                  onClick={() => {
                    setObscurePassword(!obscurePassword);
                  }}
                >
                  {
                    <img
                      height={"16px"}
                      width={"16px"}
                      src={
                        obscurePassword
                          ? "/icons/eye-show.svg"
                          : "/icons/eye-hide.svg"
                      }
                    ></img>
                  }
                </InputGroup.Text>
                <Form.Control.Feedback
                  type="invalid"
                  style={{ textAlign: "left" }}
                >
                  Masukkan password
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div style={{ height: "10px" }}></div>
            <label className="w100 taright">
              <a href="#" className={"grey-tc"} style={{ fontSize: "12px" }}>
                Lupa Password?
              </a>
            </label>
            <div style={{ height: "20px" }}></div>
            {errorMessage != "" ? (
              <div className="alert alert-danger w100" role="alert">
                {errorMessage}
              </div>
            ) : (
              ""
            )}
            <Button
              ref={formRef}
              className="w100 tacenter login-btn-color"
              type="submit"
            >
              {isSubmittingData ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <img src="/icons/sb-logout.svg"></img>
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                    Login
                  </span>
                </>
              )}
            </Button>
          </Form>
          <Button
            onClick={() => {
              signInWithGoogle();
            }}
            className="w100 tacenter mt-3"
            style={{ background: "transparent", border: "1px solid lightgrey" }}
          >
            <img
              src="/icons/google.svg"
              alt="google logo"
              width={"24px"}
              height={"24px"}
            />
            <span
              style={{ marginLeft: "10px", fontWeight: "bold", color: "black" }}
            >
              Sign in with Google
            </span>
          </Button>
          {/* <Button
            className="w100 tacenter sb-pm-color sb-pm-textcolor"
            onClick={() => {
              onClickLogin2();
            }}
          >
            <img src="/icons/sb-logout.svg"></img>
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
              Login2
            </span>
          </Button> */}
        </div>
      </div>
    </main>
  );
}

export default Login;
