import { Button, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AppContext } from "../../context";
import PasswordField from "../../share/PasswordField";

import avatarDefault from "../../assets/avatar-default.png";

import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import { useForm } from "react-hook-form";
import { fetchApiSamenote } from "../../utils/fetchApiSamnote";
import {
  SettingDeleteAccountSchema,
  SettingForgotPwSchema,
  settingSchema,
} from "../../utils/schema";

const UpdateAvatar = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar, setUser } = appContext;
  const [checkChange, setCheckChange] = useState(false);
  const [openDeleteTab, setOpenDeleteTab] = useState(false);
  const [loading, setLoading] = useState({
    loadingDeleteAccount: false,
    loadingFogotPassword: false,
  });
  const { loadingDeleteAccount, loadingFogotPassword } = loading;
  // Hook useForm cho form tạo pw2
  const {
    handleSubmit: handleDeleteAccount,
    register: registerDeleteAccount,
    formState: { errors: errorsDeleteAccount },
  } = useForm({
    resolver: joiResolver(SettingDeleteAccountSchema),
    defaultValues: {
      password: "",
      user_name: "",
    },
  });
  console.log("errorsDeleteAccount", errorsDeleteAccount);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, dirtyFields },
    reset,
    watch,
  } = useForm({
    resolver: joiResolver(settingSchema),
    defaultValues: {
      name: "",
      gmail: "",
    },
  });

  const [avatarProfile, setAvatarProfile] = useState({
    thumb: "",
    file: null,
    isChange: false,
  });

  const [backgroundProfile, setBackgroundProfile] = useState({
    thumb: "",
    file: null,
    isChange: false,
  });

  useEffect(() => {
    if (dirtyFields?.name) {
      setCheckChange(true);
    }
  }, [watch("name")]);

  //  Sử dụng useEffect để cập nhật khi user thay đổi
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `https://samnote.mangasocial.online/profile/${user.id}`
        );

        const { Avarta, name, gmail, AvtProfile } = res.data.user;

        setAvatarProfile({ ...avatarProfile, thumb: Avarta });
        setBackgroundProfile({ ...avatarProfile, thumb: AvtProfile });

        // Cập nhật form với dữ liệu mới
        setValue("name", name);
        setValue("gmail", gmail);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserData();
  }, [user, reset]);

  const openDeleteAccount = () => {
    setOpenDeleteTab(!openDeleteTab);

    console.log("mở màn xóa", openDeleteTab);
  };

  const onSubmit = async (data) => {
    const dataForm = { name: data.name };

    if (avatarProfile.isChange) {
      const imageFormData = new FormData();
      imageFormData.append("image", avatarProfile.file);

      const dataImage = await fetchApiSamenote(
        "post",
        `/upload_image/${user.id}`,
        imageFormData
      );

      dataForm.Avarta = dataImage.imagelink;
    }

    if (backgroundProfile.isChange) {
      const imageFormData = new FormData();
      imageFormData.append("image", backgroundProfile.file);

      const dataImage = await fetchApiSamenote(
        "post",
        `/upload_image/${user.id}`,
        imageFormData
      );

      dataForm.AvtProfile = dataImage.imagelink;
    }

    fetchApiSamenote(
      "patch",
      `/profile/change_Profile/${user.id}`,
      dataForm
    ).then((response) => {
      if (response?.error) {
        setSnackbar({
          isOpen: true,
          message: response?.error,
          severity: "error",
        });
      } else {
        setUser(response);
        setSnackbar({
          isOpen: true,
          message: "Updated profile !",
          severity: "success",
        });
      }
    });
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    const blobUrl = URL.createObjectURL(file);

    setAvatarProfile({ thumb: blobUrl, file, isChange: true });
    setCheckChange(true);
  };

  const handleChangeBackground = (e) => {
    const file = e.target.files[0];
    const blobUrl = URL.createObjectURL(file);

    setBackgroundProfile({ thumb: blobUrl, file, isChange: true });
    setCheckChange(true);
  };

  const deleteAccount = (data) => {
    const payload = {
      user_name: data.user_name,
      password: data.password,
    };

    console.log("đã xóa", payload);
    setLoading((prev) => ({ ...prev, loadingDeleteAccount: true }));
    fetchApiSamenote("post", `/user/${user.id}`, payload)
      .then((response) => {
        if (response?.error) {
          console.log("trả về ");
          Swal.fire({
            title: "Error!",
            text: response.error,
            icon: "error",
          });
        } else {
          console.log("trả về ", response);
          if (response?.status === 400) {
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
        setLoading((prev) => ({ ...prev, loadingDeleteAccount: false }));
      });
  };
  //quên mật khẩu
  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const {
    handleSubmit: handleSubmitFogotPassword,
    register: registerFogotPassword,
    formState: { errors: errorsFogotPassword },
  } = useForm({
    resolver: joiResolver(SettingForgotPwSchema),
    defaultValues: {
      gmail: "",
    },
  });
  console.log("lỗi quên mật khẩu ", errorsFogotPassword);

  const handleForgotPassword = (data) => {
    console.log("đã nhận quên mk");

    const payload = {
      gmail: data.gmail,
    };
    setLoading((prev) => ({ ...prev, loadingFogotPassword: true }));
    fetchApiSamenote("post", "/resetPassword", payload)
      .then((response) => {
        if (response?.error) {
          Swal.fire({
            title: "Error!",
            text: response.error,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occurred.",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, loadingFogotPassword: false }));
      });
  };

  return (
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
        Update Profile
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action="submit"
        className="gap-3 flex flex-col"
      >
        <div className="flex items-md-center items-start md:flex-row flex-col gap-2">
          <label htmlFor="" className="w-[300px]">
            Avatar:
          </label>

          <div className="flex items-center gap-3">
            <img
              className="size-[60px] lg:size-[50px] object-cover rounded-full"
              src={avatarProfile.thumb || avatarDefault}
              alt="avatar default"
            />

            <div className="">
              <input
                id="setting-upload-avatar"
                type="file"
                hidden
                onChange={handleChangeAvatar}
              />
              <label
                htmlFor="setting-upload-avatar"
                className="border h-[35px] flex items-center border-primary text-primary cursor-pointer py-1 px-3 uppercase rounded-md"
              >
                change
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-md-center items-start flex-md-row flex-col gap-2">
          <label className="w-[300px]">Name:</label>

          <div className="flex flex-col">
            <input
              type="text"
              placeholder="name..."
              className="w-[300px] form-control "
              {...register("name")}
            />
            {errors?.name && (
              <span className="text-red-400 mt-3">{errors.name.message}</span>
            )}
          </div>
        </div>

        <div className="flex items-md-center items-start flex-md-row flex-col gap-2">
          <label className="w-[300px]">Email:</label>

          <input
            disabled
            type="text"
            className="w-[300px] form-control"
            value={watch("gmail")}
          />
        </div>
        <div className="flex items-md-center items-start flex-md-row flex-col gap-2">
          <label htmlFor="" className="w-[300px]">
            Avatar Profile:
          </label>

          <div className="flex items-center gap-3">
            <img
              className="size-[60px] lg:size-[50px] object-cover rounded-lg"
              src={backgroundProfile.thumb || avatarDefault}
              alt="avatar default"
            />

            <div className="">
              <input
                id="setting-upload-avatarProfile"
                type="file"
                hidden
                onChange={handleChangeBackground}
              />
              <label
                htmlFor="setting-upload-avatarProfile"
                className="border h-[35px] flex items-center border-primary text-primary cursor-pointer py-1 px-3 uppercase rounded-md"
              >
                change
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            disabled={!checkChange}
            variant={checkChange ? "contained" : "outlined"}
            type="submit"
            className=" px-4 uppercase border-[1px] border-white text-white h-[35px]"
          >
            Update
          </Button>

          <button
            type="button"
            onClick={() => {
              openDeleteAccount();
            }}
            className="btn btn-danger h-[35px]"
          >
            Delete account
          </button>
        </div>
      </form>
      {openDeleteTab ? (
        <div className="bg-[rgba(153,153,153,0.6)] fixed top-0 left-0 bottom-0 right-0 text-white z-[100] flex items-center justify-center">
          <div className="bg-black  px-4 py-5 gap-3 flex flex-col rounded-lg">
            <h5>Delete this account?</h5>
            <span>
              *Confirm both passwords to delete the account permanently.
            </span>
            <form
              action="submit"
              className="flex gap-3 flex-col"
              onSubmit={handleDeleteAccount(deleteAccount)}
            >
              {" "}
              <div className="flex gap-3 flex-md-row flex-col">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <input
                    className=" form-control w-[300px] bg-white rounded-md"
                    placeholder="Confim your user name"
                    {...registerDeleteAccount("user_name")}
                  />
                  {errorsDeleteAccount?.user_name && (
                    <span className="text-red-400 mt-3">
                      {errorsDeleteAccount.user_name.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {" "}
                  <PasswordField
                    className=" form-control w-[300px] bg-white rounded-md"
                    placeholder="Confim your password"
                    {...registerDeleteAccount("password")}
                  />
                  {errorsDeleteAccount?.password && (
                    <span className="text-red-400">
                      {errorsDeleteAccount.password.message}
                    </span>
                  )}
                  <span
                    className="cursor-pointer"
                    onClick={() => setOpenForgotPassword(!openForgotPassword)}
                  >
                    Forgot password
                  </span>
                </div>
              </div>
              <div className="flex w-full justify-end gap-3 mt-7">
                {" "}
                <button
                  type="submit"
                  className="btn btn-danger w-[135px] h-[35px]"
                >
                  {!loadingDeleteAccount ? (
                    "Delete account"
                  ) : (
                    <CircularProgress size={24} color="#fff" />
                  )}
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    openDeleteAccount();
                  }}
                  className="btn bg-white h-[35px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}
      {openForgotPassword && (
        <div className="bg-[rgba(153,153,153,0.6)] fixed top-0 left-0 bottom-0 right-0 text-white z-[100] flex items-center justify-center">
          <div className="bg-black px-4 py-5 gap-3 flex flex-col rounded-lg">
            <h5>Forgot Password</h5>
            <form
              onSubmit={handleSubmitFogotPassword(handleForgotPassword)}
              className="flex gap-3 flex-col"
            >
              <input
                className="form-control w-[300px] h-[35px] bg-white rounded-md"
                placeholder="Enter your user name"
                {...registerFogotPassword("gmail")} // Đăng ký trường
              />
              {errorsFogotPassword?.gmail && (
                <span className="text-red-400">
                  {errorsFogotPassword.gmail.message}
                </span>
              )}
              <div className="flex w-full justify-end gap-3 mt-7">
                <button
                  type="submit"
                  className="btn btn-danger w-[80px] h-[35px]"
                >
                  {!loadingFogotPassword ? (
                    "Submit"
                  ) : (
                    <CircularProgress size={24} color="#fff" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenForgotPassword(false)}
                  className="btn bg-white h-[35px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UpdateAvatar;
