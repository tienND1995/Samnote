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

const UpdateAvatar = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;

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
      name: "",
      Avarta: "",
      AvtProfile: "",
      email: "",
    },
  });

  // Sử dụng useEffect để cập nhật khi user thay đổi
  useEffect(() => {
    if (!user) {
      return; // Nếu không có user thì không làm gì cả
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `https://samnote.mangasocial.online/profile/${user.id}`
        );
        console.log("res", res.data.user);

        const { Avarta, name, gmail, AvtProfile } = res.data.user;
        setAvatar((prev) => ({
          ...prev,
          avatar1: Avarta,
          avatar2: AvtProfile,
        }));

        // Cập nhật form với dữ liệu mới
        reset({
          Avarta,
          name,
          email: gmail,
          AvtProfile,
        });
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserData();
  }, [user, reset]);

  const onSubmit = (data) => {
    console.log("data", data);

    setSnackbar({
      isOpen: true,
      message: "user đã có",
      severity: "error",
    });
  };

  const [avatar, setAvatar] = useState({ avatar1: null, avatar2: null });
  const { avatar1, avatar2 } = avatar;
  const handleChangeAvatar1 = (e) => {
    const blobUrl = URL.createObjectURL(e.target.files[0]);

    setValue("Avarta", blobUrl);
    setAvatar((prev) => ({ ...prev, avatar1: blobUrl }));
  };
  const handleChangeAvatar2 = (e) => {
    const blobUrl = URL.createObjectURL(e.target.files[0]);

    setValue("AvtProfile", blobUrl);
    setAvatar((prev) => ({ ...prev, avatar2: blobUrl }));
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
        Update Profile
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action="submit"
        className="gap-3 flex flex-col"
      >
        <div className="flex items-center">
          <label htmlFor="" className="w-[300px]">
            Avatar:
          </label>

          {errors?.Avarta && !avatar1 && (
            <span className="text-red-400 mt-3 w-full">
              {errors.Avarta.message}
            </span>
          )}

          <div className="flex items-center gap-3">
            <img
              className="size-[60px] object-cover rounded-full"
              src={avatar1}
              alt="avatar default"
            />

            <div className="">
              <input
                id="setting-upload-avatar"
                type="file"
                hidden
                onChange={handleChangeAvatar1}
              />
              <label
                htmlFor="setting-upload-avatar"
                className="border border-primary text-primary cursor-pointer py-2 px-4 uppercase rounded-md"
              >
                change
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-[300px]">Name:</label>

          <div className="flex flex-col">
            {" "}
            <TextField
              type="text"
              placeholder="name..."
              className="sm:w-[300px] form-control w-[200px]"
              {...register("name")}
            />
            {errors?.name && (
              <span className="text-red-400 mt-3">{errors.name.message}</span>
            )}
          </div>
        </div>

        <div className="flex items-center max-w">
          <label className="w-[300px]">Email:</label>

          <TextField
            disabled
            type="text"
            className="sm:w-[300px] form-control w-[200px]"
            {...register("email")}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="" className="w-[300px]">
            Avatar Profile:
          </label>

          {errors?.AvtProfile && !avatar2 && (
            <span className="text-red-400 mt-3">
              {errors.AvtProfile.message}
            </span>
          )}

          <div className="flex items-center gap-3">
            <img
              className="size-[60px] object-cover rounded-lg"
              src={avatar2}
              alt="avatar default"
            />

            <div className="">
              <input
                id="setting-upload-avatarProfile"
                type="file"
                hidden
                onChange={handleChangeAvatar2}
              />
              <label
                htmlFor="setting-upload-avatarProfile"
                className="border border-primary text-primary cursor-pointer py-2 px-4 uppercase rounded-md"
              >
                change
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary px-4 uppercase">
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
    </div>
  );
};
export default UpdateAvatar;
