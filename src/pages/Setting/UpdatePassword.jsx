import { useState, useContext, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
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
  console.log("data", data);

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: joiResolver(SettingChangePwSchema),
    defaultValues: {
      password: "",
      new_password: "",
      private_password: "",
      confirm_private_password: "",
    },
  });
  console.log("errors", errors);
  const toggleOpenChangePw2 = () => {
    setStatus((prev) => ({ ...prev, openPw2: !openPw2 }));
  };
  const toggleOpenCreatePw2 = () => {
    setStatus((prev) => ({ ...prev, openCreatePw2: !openCreatePw2 }));
  };
  const toggleOpenForgotpw2 = () => {
    setStatus((prev) => ({ ...prev, openForgotpw2: !openForgotpw2 }));
  };

  const onSubmit = async (data) => {
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
            color: "#6a53cc",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Update Password
        </Typography>

        <Box className="flex mt-[20px] flex-col sm:flex-row">
          {" "}
          <Typography className="w-[300px]">Password:</Typography>
          {!openChangePW ? (
            <Box className="flex flex-col sm:flex-row  mt-[10px]">
              <TextField disabled sx={{ width: "300px" }} value="********" />
              <Button
                variant="outlined"
                sx={{ margin: "10px 10px  0", height: "35px", width: "90px" }}
                onClick={toggleOpenChangePw}
              >
                change
              </Button>
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              action="submit"
              className="gap-3 flex flex-col"
            >
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  placeholder="Enter current password"
                  className="sm:w-[300px] form-control w-[200px]"
                  {...register("password")}
                />
                {errors?.password && (
                  <span className="text-red-400 mt-3">
                    {errors.password.message}
                  </span>
                )}
              </div>{" "}
              <div className="flex flex-col">
                {" "}
                <PasswordField
                  placeholder="Enter new password"
                  className="sm:w-[300px] form-control w-[200px]"
                  {...register("new_password")}
                />
                {errors?.new_password && (
                  <span className="text-red-400 mt-3">
                    {errors.new_password.message}
                  </span>
                )}
              </div>
              <div className="flex gap-4 ">
                <Button
                  variant="contained"
                  type="submit"
                  className="btn btn-primary px-4 py-2 uppercase w-[110px] h-[40px]"
                  onClick={() =>
                    clearErrors([
                      "private_password",
                      "confirm_private_password",
                    ])
                  }
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
      <Box className="flex mt-[20px] flex-col sm:flex-row ">
        <Typography className="sm:w-[200px] mb-[10px] sm:mb-0">
          Password 2:
        </Typography>
        {data.password_2 !== null ? (
          openPw2 ? (
            //quên pw2
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField required sx={{ width: "300px" }} value="********" />
              <Box>
                {" "}
                <Button
                  variant="outlined"
                  sx={{ margin: "10px 0", height: "35px" }}
                  onClick={toggleOpenChangePw2}
                >
                  change
                </Button>{" "}
                <Button
                  variant="outlined"
                  sx={{ margin: "10px 0", height: "35px" }}
                  onClick={toggleOpenForgotpw2}
                >
                  fogot password
                </Button>
                {openForgotpw2 ? (
                  <Box className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center flex-col">
                    <Box className="flex flex-col relative items-center justify-center bg-white h-[120px] w-[500px] pt-[30px] rounded-lg">
                      Are you want to reset password 2
                      <Box className="flex items-center justify-center flex-row pt-[30px] pb-[10px]">
                        <Button
                          variant="outlined"
                          sx={{ margin: "10px " }}
                          onClick={() => toggleOpenForgotpw2()}
                        >
                          cancel
                        </Button>
                        <Button
                          variant="contained"
                          disabled={loadingFogotPw2}
                          sx={{ margin: "10px" }}
                          // onClick={() => FogotPw2()}
                        >
                          {loadingFogotPw2 ? (
                            <CircularProgress size={24} />
                          ) : (
                            "ok"
                          )}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </Box>
          ) : (
            //sửa pw2
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <PasswordField
                label="Current Password 2"
                placeholder="Enter current password 2"
              />

              <PasswordField
                label="New Password 2"
                placeholder="Enter new password 2"
              />
              <PasswordField
                label="Confim new password 2"
                placeholder="Confim new password 2"
              />
              <Box>
                {" "}
                <Button
                  variant="outlined"
                  sx={{ margin: "10px 10px 0 0" }}
                  onClick={toggleOpenChangePw2}
                >
                  cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ marginTop: "10px", width: "90px" }}
                  disabled={loadingPw2}
                >
                  {loadingPw2 ? <CircularProgress size={24} /> : "UPDATE"}
                </Button>
              </Box>
            </Box>
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
          <Box className="gap-3 flex flex-col">
            {" "}
            <PasswordField
              label="New Password 2"
              placeholder="Enter your password 2"
            />
            <PasswordField
              label="Confim Password 2"
              placeholder="Confim your password 2"
            />
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
                disabled={loadingPw2}
                variant="contained"
                sx={{ margin: "0px 10px 0", width: "90px" }}
                // onClick={CreatePassWord2}
              >
                {loadingPw2 ? <CircularProgress size={24} /> : "Create"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
export default UpdatePassword;
