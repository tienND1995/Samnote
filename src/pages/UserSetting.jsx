import { useState, useContext } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AppContext } from "../context";
import api from "../api"; // Make sure to import the API instance

const UserSetting = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  const [image, setImage] = useState(user.AvtProfile);
  const [imageCover, setImageCover] = useState(user.Avarta);
  const [showBox2, setShowBox2] = useState(true);
  const [showPassword2Edit, setShowPassword2Edit] = useState(false);
  const [selected, setSelected] = useState("");
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  console.log("user", user);
  const handleEditClick = () => {
    setShowBox2((prevShowBox2) => !prevShowBox2);
  };

  const handlePassword2EditClick = () => {
    setShowPassword2Edit((prevShowPassword2Edit) => !prevShowPassword2Edit);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  };

  const handleImageCoverChange = (e) => {
    const selectedImageCover = e.target.files[0];
    if (selectedImageCover) {
      setImageCover(URL.createObjectURL(selectedImageCover));
    }
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  const handleProfileUpdate = async () => {
    const payload = {
      name,
      AvtProfile: image,
      Avarta: imageCover,
    };
    console.log(payload);
    try {
      await api.patch(
        `https://samnote.mangasocial.online/profile/change_Profile/${user.id}`,
        payload
      );
      setSnackbar({
        isOpen: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        isOpen: true,
        message: "Failed to update profile",
        severity: "error",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    const payload = {
      currentPassword,
      newPassword,
    };
    if (currentPassword === null || currentPassword === "") {
      setSnackbar({
        isOpen: true,
        message: "Current password not null",
        severity: "error",
      });
    } else if (newPassword === null || newPassword === "") {
      setSnackbar({
        isOpen: true,
        message: "New password not null",
        severity: "error",
      });
    } else {
      try {
        await api.patch(
          `https://samnote.mangasocial.online/login/change_password/${user.id}`,
          payload
        );
        setSnackbar({
          isOpen: true,
          message: "Password updated successfully",
          severity: "success",
        });
      } catch (error) {
        console.error(error);
        setSnackbar({
          isOpen: true,
          message: "Failed to update password",
          severity: "error",
        });
      }
    }
  };

  // const handlePassword2Update = async () => {
  //   const payload = {
  //     password2,
  //     newPassword2,
  //   };

  //   try {
  //     await api.patch(`/users/${user.id}/password2`, payload);
  //     setSnackbar({
  //       isOpen: true,
  //       message: "Password 2 updated successfully",
  //       severity: "success",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     setSnackbar({
  //       isOpen: true,
  //       message: "Failed to update password 2",
  //       severity: "error",
  //     });
  //   }
  // };

  return (
    <Container>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          marginTop: "20px",
          color: "#6a53cc",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        Update Account
      </Typography>
      <Box sx={{ display: "flex", marginTop: 2 }}>
        <Typography sx={{ width: "200px" }}>Avatar:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            accept="image/*"
            id="avatar-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <Box sx={{ marginLeft: 2 }}>
            <img
              src={image}
              alt="Uploaded"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          <label htmlFor="avatar-button-file" style={{ marginLeft: "10px" }}>
            <Button variant="outlined" component="span">
              Change
            </Button>
          </label>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
        <Typography sx={{ width: "200px" }}>Name:</Typography>
        <TextField
          required
          id="outlined-required"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
        <Typography sx={{ width: "200px" }}>Cover image:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            accept="image/*"
            id="cover-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageCoverChange}
          />
          <Box sx={{ marginLeft: 2 }}>
            <img
              src={imageCover}
              alt="Uploaded"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          <label htmlFor="cover-button-file" style={{ marginLeft: "10px" }}>
            <Button variant="outlined" component="span">
              Change
            </Button>
          </label>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Typography sx={{ width: "200px" }}>Gmail:</Typography>
        <Typography>{user.gmail}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Typography sx={{ width: "200px" }}>Password:</Typography>
        {showBox2 ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>*******</Typography>
            <Button
              variant="outlined"
              component="span"
              sx={{ marginLeft: "20px" }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              required
              id="outlined-required"
              placeholder="Enter current password"
              sx={{ width: "300px" }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              required
              id="outlined-required"
              placeholder="Enter new password"
              sx={{ width: "300px", marginTop: "5px" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ marginTop: "10px" }}
              onClick={handlePasswordUpdate}
            >
              UPDATE
            </Button>
          </Box>
        )}
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Typography sx={{ width: "200px" }}>Password 2:</Typography>
        {user.password_2 === null ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              required
              id="outlined-required"
              placeholder="Enter new password 2"
              sx={{ width: "300px", marginTop: "5px" }}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <Button
              variant="outlined"
              component="span"
              sx={{ marginLeft: "20px" }}
              onClick={handlePassword2Update}
            >
              Create
            </Button>
          </Box>
        ) : showPassword2Edit ? (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              required
              id="outlined-required"
              placeholder="Enter current password 2"
              sx={{ width: "300px" }}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <TextField
              required
              id="outlined-required"
              placeholder="Enter new password 2"
              sx={{ width: "300px", marginTop: "5px" }}
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ marginTop: "10px" }}
              onClick={handlePassword2Update}
            >
              UPDATE
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>*******</Typography>
            <Button
              variant="outlined"
              component="span"
              sx={{ marginLeft: "20px" }}
              onClick={handlePassword2EditClick}
            >
              Edit
            </Button>
          </Box>
        )}
      </Box> */}
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={handleProfileUpdate}
      >
        UPDATE PROFILE
      </Button>
      <Typography
        component="h2"
        variant="h5"
        sx={{
          margin: "25px 0 20px",
          color: "#6a53cc",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        General
      </Typography>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ width: "200px" }}>Default screen:</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selected}
            onChange={handleChange}
          >
            <MenuItem value="calendar">Calendar</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
            <MenuItem value="deleted">Deleted</MenuItem>
            <MenuItem value="settings">Settings</MenuItem>
          </Select>
        </Box>
        <Typography>Default color:</Typography>
      </Box>
      <Typography
        component="h2"
        variant="h5"
        sx={{
          margin: "20px 0",
          color: "#6a53cc",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        Online Sync & Backup
      </Typography>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ width: "300px" }}>Sync on launch:</Typography>
          <CheckCircleOutlineIcon />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
          <Typography sx={{ width: "300px" }}>Auto backup:</Typography>
          <CheckCircleOutlineIcon />
        </Box>
      </Box>
    </Container>
  );
};

export default UserSetting;
