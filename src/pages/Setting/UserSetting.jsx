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
import UpdateAvatar from "./UpdateAvatar";
import UpdatePassword from "./UpdatePassword";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { settingSchema } from "../../utils/schema";
import axios from "axios";

const UserSetting = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  const [reload, setReload] = useState(0);
  const [payLoad, setPayload] = useState({
    avatar: null,
    urlAvatar: null,
    imgCover: null,
    urlImgCover: null,
    name: null,
    gmail: null,
    pw2: null,
    currentPassword: null,
    newPassword: null,
  });

  const [loading, setLoading] = useState({
    loadingChangeImg: false,
  });

  const [status, setStatus] = useState({
    openChangePW: false,
  });

  const { loadingChangeImg } = loading;
  const { openChangePW } = status;
  const {
    avatar,
    urlAvatar,
    name,
    gmail,
    imgCover,
    urlImgCover,
    pw2,
    currentPassword,
    newPassword,
  } = payLoad;

  useEffect(() => {
    if (user) {
      const getUserInformation = async () => {
        try {
          const res = await api.get(
            `https://samnote.mangasocial.online/profile/${user.id}`
          );
          //           console.log("restrar về data", res.data.user);

          setPayload((prev) => ({
            ...prev,
            name: res.data.user.name,
            urlAvatar: res.data.user.Avarta,
            urlImgCover: res.data.user.AvtProfile,
            gmail: res.data.user.gmail,
            pw2: res.data.user.password_2,
          }));
        } catch (err) {
          console.error(err);
        }
      };

      getUserInformation();
    }
  }, [user, reload]);

  const handleChangeImageCover = (e) => {
    const selectedCoverImage = e.target.files[0];
    if (selectedCoverImage) {
      const imageCoverUrl = URL.createObjectURL(selectedCoverImage);

      // Cập nhật state của payLoad
      setPayload((prevPayload) => ({
        ...prevPayload,
        imgCover: selectedCoverImage,
        urlImgCover: imageCoverUrl, // URL của ảnh để hiển thị
      }));
    }
  };

  const handleChangeAvatar = (e) => {
    const selectedAvatar = e.target.files[0];
    if (selectedAvatar) {
      const urlAvatar = URL.createObjectURL(selectedAvatar);

      // Cập nhật state của payLoad
      setPayload((prevPayload) => ({
        ...prevPayload,
        avatar: selectedAvatar, // file ảnh gốc
        urlAvatar: urlAvatar, // URL của ảnh
      }));
    }
  };

  const handleProfileUpdate = async () => {
    if (!user || !user.id) {
      Swal.fire({
        title: "Error!",
        text: "User ID not found. Cannot update profile.",
        icon: "error",
      });
      return;
    }

    try {
      setLoading((prev) => ({
        ...prev,
        loadingChangeImg: true,
      }));

      let Avarta = null;
      let AvtProfile = null;

      if (avatar) {
        Avarta = await uploadToImgBB(avatar);
      }

      if (imgCover) {
        AvtProfile = await uploadToImgBB(imgCover);
      }

      const payload = {
        name: name,
        AvtProfile,
        Avarta,
      };

      await api.patch(
        `https://samnote.mangasocial.online/profile/change_Profile/${user.id}`,
        payload
      );

      setReload((prev) => prev + 1);

      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating your profile.",
        icon: "error",
      });
    } finally {
      setLoading((prev) => ({
        ...prev,
        loadingChangeImg: false,
      }));
    }
  };

  const toggleOpenChangePw = () => {
    setStatus((prev) => ({
      ...prev,
      openChangePW: !openChangePW,
    }));
  };

  const handlePasswordUpdate = async () => {
    const payload = {
      gmail,
      password: currentPassword,
      new_password: newPassword,
    };

    if (!currentPassword) {
      setSnackbar({
        isOpen: true,
        message: "Current password cannot be empty",
        severity: "error",
      });
      return;
    }

    if (!newPassword) {
      setSnackbar({
        isOpen: true,
        message: "New password cannot be empty",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        `https://samnote.mangasocial.online/login/change_password/${user.id}`,
        payload
      );
      //       setResultMessage(response.data.message);
      console.log("payload", payload);
      console.log(response.data);
    } catch (error) {
      console.error("lỗi", error);
      setSnackbar({
        isOpen: true,
        message: "Failed to update password",
        severity: "error",
      });
    } finally {
      setLoading(false); // Set loading state to false after request is complete
    }
  };
  /////code chưa sửa
  const toggleOpenChangePw2 = () => {
    setOpenPw2((prevState) => !prevState);
  };
  const toggleOpenCreatePw2 = () => {
    setOpenCreatePw2((prevState) => !prevState);
  };

  // const FogotPw2 = () => {
  //   setFogotPw2Message("");
  // };
  const FogotPw2 = async () => {
    const payload = {
      email: user.gmail,
    };

    try {
      setLoadingFogotPw2(true); // Set loading state to true when starting the request
      const res = await api.post(`/forgot_password_2`, payload);
      toggleOpenForgotpw2();
      setResultMessage(res.data.message);
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to fogot password 2",
        severity: "error",
      });
    } finally {
      setLoadingFogotPw2(false); // Set loading state to false after request is complete
    }
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const CreatePassWord2 = async () => {
    if (!currentCreatePassword2) {
      setSnackbar({
        isOpen: true,
        message: "Confirm password 2 is not empty",
        severity: "error",
      });
      return;
    }

    if (!createPassword2) {
      setSnackbar({
        isOpen: true,
        message: "Password 2 is not empty",
        severity: "error",
      });
      return;
    }

    const payload = {
      id_user: user.id,
      private_password: createPassword2,
      confirm_private_password: currentCreatePassword2,
    };

    try {
      setLoadingPw2(true); // Set loading state to true when starting the request
      const res = await api.post(`/create_password_2`, payload);
      setResultMessage(res.data.message);
      console.log("resultMessage", resultMessage);
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to create password 2",
        severity: "error",
      });
    } finally {
      setLoadingPw2(false); // Set loading state to false after request is complete
    }
  };

  const UpdatePw2 = async () => {
    const payload = {
      id_user: user.id,
      old_private_password: currentPassword2,
      new_private_password: newPassword2,
      confirm_private_password: confimNewPassword2,
    };

    if (!currentPassword2) {
      setSnackbar({
        isOpen: true,
        message: "Current password 2 cannot be empty",
        severity: "error",
      });
      return;
    }

    if (!newPassword2) {
      setSnackbar({
        isOpen: true,
        message: "New password 2 cannot be empty",
        severity: "error",
      });
      return;
    }
    if (!confimNewPassword2) {
      setSnackbar({
        isOpen: true,
        message: "Confim password 2 cannot be empty",
        severity: "error",
      });
      return;
    }

    try {
      setLoadingPw2(true);
      const response = await api.post(`/reset_password_2`, payload);
      console.log("payload", payload);
      console.log("response.data", response.data);
      setResultMessage(response.data.message);
      console.log("resultMessage", resultMessage);
    } catch (error) {
      console.error(error);
      setSnackbar({
        isOpen: true,
        message: "Failed to update password",
        severity: "error",
      });
    } finally {
      setLoadingPw2(false); // Set loading state to false after request is complete
    }
  };

  const uploadToImgBB = async (imageData) => {
    const apiKey = "0165c1b60ac134636927900246669e17";
    const formData = new FormData();
    formData.append("image", imageData);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.data?.url) {
      return data.data.url;
    } else {
      throw new Error("Failed to upload image to ImgBB");
    }
  };

  return (
    <Container>
      <h1 className="uppercase">setting</h1>
      <UpdateAvatar />
      <UpdatePassword />
      <Box sx={{ marginTop: "20px" }}>
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <PasswordField
                label="Current password"
                placeholder="Enter current password"
                value={currentPassword}
                className=""
                onChange={(e) =>
                  setPayload((prevPayload) => ({
                    ...prevPayload,
                    currentPassword: e.target.value,
                  }))
                }
              />
              <PasswordField
                label="New password"
                className="mt-2"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setPayload((prevPayload) => ({
                    ...prevPayload,
                    newPassword: e.target.value,
                  }))
                }
              />
              <Box>
                {" "}
                <Button
                  variant="outlined"
                  sx={{ margin: "10px 10px 0 0" }}
                  onClick={toggleOpenChangePw}
                >
                  cancel
                </Button>
                <Button
                  variant="contained"
                  // disabled={loading}
                  sx={{ marginTop: "10px" }}
                  onClick={handlePasswordUpdate}
                >
                  {loadingChangeImg ? <CircularProgress size={24} /> : "UPDATE"}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        {/* <Typography
           variant="h5"
           sx={{
             marginTop: "30px",
             color: "#6a53cc",
             fontSize: "22px",
             fontWeight: 700,
           }}
         >
           Update Password 2
         </Typography>{" "}
         <Box className="flex mt-[20px] flex-col sm:flex-row">
           <Typography className="sm:w-[200px] mb-[10px] sm:mb-0">
             Password 2:
           </Typography>
           {user.password_2 !== null ? (
             openPw2 ? (
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
                   {OpenForgotpw2 ? (
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
                             onClick={() => FogotPw2()}
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
               <Box sx={{ display: "flex", flexDirection: "column" }}>
                 <PasswordField
                   label="Current Password 2"
                   placeholder="Enter current password 2"
                   value={currentPassword2}
                   onChange={(e) => setCurrentPassword2(e.target.value)}
                 />

                 <PasswordField
                   label="New Password 2"
                   placeholder="Enter new password 2"
                   value={newPassword2}
                   onChange={(e) => setNewPassword2(e.target.value)}
                 />
                 <PasswordField
                   label="Confim new password 2"
                   placeholder="Confim new password 2"
                   value={confimNewPassword2}
                   onChange={(e) => setConfimNewPassword2(e.target.value)}
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
                     onClick={UpdatePw2}
                   >
                     {loadingPw2 ? <CircularProgress size={24} /> : "UPDATE"}
                   </Button>
                 </Box>
               </Box>
             )
           ) : openCreatePw2 ? (
             <Button
               variant="contained"
               sx={{ marginTop: "10px" }}
               onClick={toggleOpenCreatePw2}
             >
               create
             </Button>
           ) : (
             <Box sx={{ display: "flex", flexDirection: "column" }}>
               {" "}
               <PasswordField
                 label="New Password 2"
                 placeholder="Enter your password 2"
                 value={createPassword2}
                 onChange={(e) => setCreatePassword2(e.target.value)}
               />
               <PasswordField
                 label="Confim Password 2"
                 placeholder="Confim your password 2"
                 value={currentCreatePassword2}
                 onChange={(e) => setCurrentCreatePassword2(e.target.value)}
               />
               <Box>
                 {" "}
                 <Button
                   variant="outlined"
                   sx={{ margin: "10px 10px 0 0" }}
                   onClick={toggleOpenCreatePw2}
                 >
                   cancel
                 </Button>
                 <Button
                   disabled={loadingPw2}
                   variant="contained"
                   sx={{ margin: "10px 10px 0", width: "90px" }}
                   onClick={CreatePassWord2}
                 >
                   {loadingPw2 ? <CircularProgress size={24} /> : "Create"}
                 </Button>
               </Box>
             </Box>
           )}
         </Box> */}
      </Box>
    </Container>
  );
};

export default UserSetting;
