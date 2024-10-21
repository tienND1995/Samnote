import { useState, useContext, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Avatar,
  responsiveFontSizes,
} from "@mui/material";
import Swal from "sweetalert2";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AppContext } from "../../context";
import PasswordField from "../../share/PasswordField";
import api from "../../api"; // Make sure to import the API instance

import avatarDefault from "../../assets/avatar-default.png";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { SettingChangePwSchema } from "../../utils/schema";
import { SettingChangePwSchemaPw2 } from "../../utils/schema";
import { SettingEditPw2Schema } from "../../utils/schema";
import { SettingForgotPw2Schema } from "../../utils/schema";
import axios from "axios";
import { fetchApiSamenote } from "../../utils/fetchApiSamnote";

const UpdatePassword = ({ data }) => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar, setUser } = appContext;

  const [status, setStatus] = useState({
    openChangePW: false,
    openPw2: false,
    openCreatePw2: false,
    openForgotpw2: false,
  });
  const [loading, setLoading] = useState({
    loadingChangePW: false,
    loadingPw2: false,
    loadingFogotPw2: false,
  });
  const { openChangePW, openPw2, openCreatePw2, openForgotpw2 } = status;
  const { loadingChangePW, loadingPw2, loadingFogotPw2 } = loading;

  const {
    handleSubmit: handleSubmitFormpw,
    register: registerFormpw,
    formState: { errors: errorsForm1 },
  } = useForm({
    resolver: joiResolver(SettingChangePwSchema),
    defaultValues: {
      password: "",
      new_password: "",
    },
  });

  // Hook useForm cho form tạo pw2
  const {
    handleSubmit: handleSubmitFormPw2,
    register: registerFormPw2,
    formState: { errors: errorsForm2 },
  } = useForm({
    resolver: joiResolver(SettingChangePwSchemaPw2),
    defaultValues: {
      private_password: "",
      confirm_private_password: "",
    },
  });

  // Hook useForm cho form sửa pw2
  const {
    handleSubmit: handleEditPw2,
    register: registerEditPw2,
    formState: { errors: errorsEditPw2 },
  } = useForm({
    resolver: joiResolver(SettingEditPw2Schema),
    defaultValues: {
      old_private_password: "",
      new_private_password: "",
      confirm_private_password: "",
    },
  });

  // Hook useForm cho form reset pw2
  const {
    handleSubmit: handleFogotPw2,
    register: registerFogotPw2,
    formState: { errors: errorsFogotPw2 },
  } = useForm({
    resolver: joiResolver(SettingForgotPw2Schema),
    defaultValues: {
      email: "",
    },
  });
  console.log("errorsEditPw2", errorsEditPw2);

  const toggleOpenChangePw2 = () => {
    setStatus((prev) => ({ ...prev, openPw2: !openPw2 }));
  };
  const toggleOpenCreatePw2 = () => {
    setStatus((prev) => ({ ...prev, openCreatePw2: !openCreatePw2 }));
  };
  const toggleOpenForgotpw2 = () => {
    setStatus((prev) => ({ ...prev, openForgotpw2: !openForgotpw2 }));
  };
  const registerPw2 = async (data) => {
    console.log("đã nhận đăng kí pw2");

    const payload = {
      id_user: user.id,
      private_password: data.private_password,
      confirm_private_password: data.confirm_private_password,
    };
    console.log("dataForm", payload);

    setLoading((prev) => ({ ...prev, loadingChangePW: true }));
    fetchApiSamenote("post", `/create_password_2`, payload)
      .then((response) => {
        if (response?.error) {
          console.log("trả về ");
          setSnackbar({
            isOpen: true,
            message: response?.error,
            severity: "error",
          });
        } else {
          console.log("trả về ", response);
          if (response?.status === 500) {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: response.message,
              icon: "success",
            });
            setUser(response);
          }
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, loadingChangePW: false }));
      });
  };
  const editPw2 = async (data) => {
    console.log("đã nhận editpw2");

    const payload = {
      id_user: user.id,
      old_private_password: data.old_private_password,
      new_private_password: data.new_private_password,
      confirm_private_password: data.confirm_private_password,
    };
    console.log("data", data);

    setLoading((prev) => ({ ...prev, loadingChangePW: true }));
    fetchApiSamenote("post", `/reset_password_2`, payload)
      .then((response) => {
        if (response?.error) {
          console.log("trả về ");
          setSnackbar({
            isOpen: true,
            message: response?.error,
            severity: "error",
          });
        } else {
          console.log("trả về ", response);
          if (response?.status === 500) {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: response.message,
              icon: "success",
            });
            setUser(response);
          }
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, loadingChangePW: false }));
      });
  };

  const FogotPw2 = async (data) => {
    console.log("đã nhận fogotpw2");

    const payload = {
      email: data.gmail,
    };

    setLoading((prev) => ({ ...prev, loadingChangePW: true }));
    fetchApiSamenote("post", `/forgot_password_2`, payload)
      .then((response) => {
        if (response?.error) {
          console.log("trả về ");
          setSnackbar({
            isOpen: true,
            message: response?.error,
            severity: "error",
          });
        } else {
          console.log("trả về ", response);
          if (response?.status === 500) {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: response.message,
              icon: "success",
            });
            setUser(response);
          }
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, loadingChangePW: false }));
      });
  };

  const onSubmitPw = async (data) => {
    const payload = {
      gmail: user.gmail,
      password: data.password,
      new_password: data.new_password,
    };
    console.log("dataForm", payload);

    setLoading((prev) => ({ ...prev, loadingChangePW: true }));
    fetchApiSamenote("post", `/login/change_password/${user.id}`, payload)
      .then((response) => {
        if (response?.error) {
          console.log("trả về ");
          setSnackbar({
            isOpen: true,
            message: response?.error,
            severity: "error",
          });
        } else {
          console.log("trả về ", response);
          if (response?.status === 500) {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: response.message,
              icon: "success",
            });
          }
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, loadingChangePW: false }));
      });
  };

  const toggleOpenChangePw = () => {
    setStatus((prev) => ({
      ...prev,
      openChangePW: !openChangePW,
    }));
  };
  return (
    <>
      {" "}
      <div className="">
        <Typography
          variant="h5"
          sx={{
            marginTop: "20px",
            color: "#0FB7FF",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Update Password
        </Typography>

        <Box className="flex mt-[20px] flex-col md:flex-row">
          {" "}
          <Typography className="w-[300px]">Password:</Typography>
          {!openChangePW ? (
            <Box className="flex flex-col sm:flex-row sm:items-center mt-[10px]">
              <input
                required
                disabled
                className="h-[37px] w-[300px] bg-white rounded-md"
                value="  ********"
              />
              <Button
                variant="outlined"
                className="mx-[10px] h-[35px] w-[90px] mt-[10px] sm:mt-0"
                onClick={toggleOpenChangePw}
              >
                change
              </Button>
            </Box>
          ) : (
            <form
              onSubmit={handleSubmitFormpw(onSubmitPw)}
              action="submit"
              className="gap-3 flex flex-col"
            >
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  placeholder="Enter current password"
                  className=" form-control w-[300px] bg-white rounded-md"
                  {...registerFormpw("password")}
                />
                {errorsForm1?.password && (
                  <span className="text-red-400 mt-3">
                    {errorsForm1.password.message}
                  </span>
                )}
              </div>{" "}
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  placeholder="Enter new password"
                  className="sm:w-[300px] form-control w-[200px]"
                  {...registerFormpw("new_password")}
                />
                {errorsForm1?.new_password && (
                  <span className="text-red-400 mt-3">
                    {errorsForm1.new_password.message}
                  </span>
                )}
              </div>
              <div className="flex gap-4 ">
                <Button
                  variant="outlined"
                  className=" w-[110px] h-[40px]"
                  onClick={toggleOpenChangePw}
                >
                  cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  className="btn btn-primary px-4 py-2 uppercase w-[110px] h-[40px]"
                >
                  {loadingChangePW ? (
                    <CircularProgress size={24} color="#fff" />
                  ) : (
                    "UPDATE"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Box>
      </div>
      <p className="my-4">
        *What is Password 2 used for? => If you have sensitive information such
        as private photos, lover's contacts... you want to secure it so that
        anyone holding your phone cannot see it?, Password 2 was born to provide
        2-layer security, for example, your wife holds your phone but they also
        cannot access your secure notes information.
      </p>
      <Box className="flex mt-[20px] flex-col md:flex-row">
        <Typography className="w-[300px] mb-[10px] sm:mb-0">
          Password 2:
        </Typography>
        {data.password_2 !== null ? (
          !openPw2 ? (
            //quên pw2
            <Box className="flex flex-col gap-3">
              {!openForgotpw2 && (
                <>
                  <input
                    required
                    disabled
                    className=" form-control w-[300px] bg-white rounded-md"
                    value="********"
                  />
                  <Box className="flex gap-3">
                    <Button
                      variant="outlined"
                      sx={{ height: "35px" }}
                      onClick={toggleOpenChangePw2}
                    >
                      change
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ height: "35px" }}
                      onClick={toggleOpenForgotpw2}
                    >
                      forgot password
                    </Button>
                  </Box>
                </>
              )}
              {openForgotpw2 && (
                <form
                  onSubmit={handleFogotPw2(FogotPw2)}
                  action="submit"
                  className="flex flex-col relative items-start gap-3"
                >
                  Enter gmail to reset your private password?
                  <div className="flex flex-col">
                    {" "}
                    <input
                      size="small"
                      className=" form-control  w-[300px] bg-white rounded-md"
                      placeholder="Enter current password 2"
                      {...registerFogotPw2("email")}
                    />
                    {errorsFogotPw2?.email && (
                      <span className="text-red-400 mt-3">
                        {errorsFogotPw2.email.message}
                      </span>
                    )}
                  </div>
                  <Box className="flex items-center justify-center flex-row pb-[10px]">
                    <Button variant="outlined" onClick={toggleOpenForgotpw2}>
                      cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loadingFogotPw2}
                      className="ml-[10px]"
                    >
                      {loadingFogotPw2 ? (
                        <CircularProgress size={24} />
                      ) : (
                        "reset password 2"
                      )}
                    </Button>
                  </Box>
                </form>
              )}
            </Box>
          ) : (
            //sửa pw2
            <form
              onSubmit={handleEditPw2(editPw2)}
              action="submit"
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  className=" form-control w-[300px] bg-white rounded-md"
                  placeholder="Current Password 2"
                  {...registerEditPw2("old_private_password")}
                />
                {errorsEditPw2?.old_private_password && (
                  <span className="text-red-400 mt-3">
                    {errorsEditPw2.old_private_password.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  className=" form-control w-[300px] bg-white rounded-md"
                  placeholder="New Password 2"
                  {...registerEditPw2("new_private_password")}
                />
                {errorsEditPw2?.new_private_password && (
                  <span className="text-red-400 mt-3">
                    {errorsEditPw2.new_private_password.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  className="form-control  bg-white rounded-md"
                  placeholder="Confim new password 2"
                  {...registerEditPw2("confirm_private_password")}
                />
                {errorsEditPw2?.confirm_private_password && (
                  <span className="text-red-400 mt-3">
                    {errorsEditPw2.confirm_private_password.message}
                  </span>
                )}
              </div>
              <Box>
                {" "}
                <Button
                  variant="outlined"
                  sx={{ margin: "0px 10px 0 0" }}
                  onClick={toggleOpenChangePw2}
                >
                  cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: "90px" }}
                  disabled={loadingPw2}
                >
                  {loadingPw2 ? <CircularProgress size={24} /> : "UPDATE"}
                </Button>
              </Box>
            </form>
          )
        ) : !openCreatePw2 ? (
          //tạo pw2
          <Button
            variant="contained"
            sx={{ marginTop: "10px" }}
            onClick={toggleOpenCreatePw2}
          >
            create
          </Button>
        ) : (
          //box tạo pw2
          <form
            onSubmit={handleSubmitFormPw2(registerPw2)}
            action="submit"
            className="gap-3 flex flex-col"
          >
            {" "}
            <PasswordField
              className=" form-control w-[300px] bg-white rounded-md"
              placeholder="Enter your password 2"
              {...registerFormPw2("private_password")}
            />
            {errorsForm2?.private_password && (
              <span className="text-red-400 mt-3">
                {errorsForm2.private_password.message}
              </span>
            )}
            <PasswordField
              className=" form-control w-[300px] bg-white rounded-md"
              placeholder="Confim your password 2"
              {...registerFormPw2("confirm_private_password")}
            />
            {errorsForm2?.confirm_private_password && (
              <span className="text-red-400 mt-3">
                {errorsForm2.confirm_private_password.message}
              </span>
            )}
            <Box>
              {" "}
              <Button
                variant="outlined"
                sx={{ margin: "0px 10px 0 0" }}
                onClick={toggleOpenCreatePw2}
              >
                cancel
              </Button>
              <Button
                type="submit"
                disabled={loadingPw2}
                variant="contained"
                sx={{ margin: "0px 10px 0", width: "90px" }}
                // onClick={CreatePassWord2}
              >
                {loadingPw2 ? <CircularProgress size={24} /> : "Create"}
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </>
  );
};
export default UpdatePassword;
