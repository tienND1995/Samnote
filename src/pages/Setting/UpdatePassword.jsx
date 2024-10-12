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
} from "@mui/material";
import Swal from "sweetalert2";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AppContext } from "../../context";
import PasswordField from "../../share/PasswordField";
import api from "../../api"; // Make sure to import the API instance

import avatarDefault from "../../assets/avatar-default.png";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { settingSchema } from "../../utils/schema";
import axios from "axios";

const UpdatePassword = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  const [status, setStatus] = useState({
    openChangePW: false,
  });
  const { openChangePW } = status;
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(settingSchema),
    defaultValues: {
      password: "",
      new_password: "",
    },
  });
  const toggleOpenChangePw = () => {
    setStatus((prev) => ({
      ...prev,
      openChangePW: !openChangePW,
    }));
  };

  const onSubmit = (data) => {
    console.log("data", data);

    setSnackbar({
      isOpen: true,
      message: "user đã có",
      severity: "error",
    });
  };
  return (
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
        <Typography className="sm:w-[200px]">Password:</Typography>
        {!openChangePW ? (
          <Box className="flex flex-col sm:flex-row  mt-[10px]">
            <TextField required sx={{ width: "300px" }} value="********" />
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
            <div className="flex gap-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 uppercase"
              >
                Update
              </button>

              <button type="button" className="btn btn-danger">
                delete
              </button>
            </div>
            {/* {errors?.errorApi && (
                    <span className="text-red-400 mt-3">{errors.errorApi.message}</span>
                  )} */}
          </form>
        )}
      </Box>
    </div>
  );
};
export default UpdatePassword;
