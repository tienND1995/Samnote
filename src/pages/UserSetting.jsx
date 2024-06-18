import { useState, useContext, useEffect } from "react";
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

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageCover, setSelectedImageCover] = useState(null);
  const [userInformations, setUserInformations] = useState(null);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const getUserInformation = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${user.id}`
        );
        setUserInformations(res.data.user);
        setImage(res.data.user?.AvtProfile);
        setImageCover(res.data.user?.Avarta);
      } catch (err) {
        console.error(err);
      }
    };

    getUserInformation();
  }, [user.id, reload]);

  const [image, setImage] = useState(userInformations?.AvtProfile);
  const [imageCover, setImageCover] = useState(userInformations?.Avarta);
  const [selected, setSelected] = useState("");
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setSelectedImage(selectedImage);
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  };

  const handleImageCoverChange = (e) => {
    const selectedImageCover = e.target.files[0];
    setSelectedImageCover(selectedImageCover);
    if (selectedImageCover) {
      setImageCover(URL.createObjectURL(selectedImageCover));
    }
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  const Email = user.gmail;
  const handleProfileUpdate = async () => {
    setSnackbar({
      isOpen: true,
      message: "Loading .....",
      severity: "warning",
    });
    try {
      let updatedImage = image;
      let updatedImageCover = imageCover;
      if (selectedImage) {
        const imageUrl = await uploadToImgBB(selectedImage);
        updatedImage = imageUrl;
      }

      if (selectedImageCover) {
        const imageCoverUrl = await uploadToImgBB(selectedImageCover);
        updatedImageCover = imageCoverUrl;
      }

      const payload = {
        name,
        AvtProfile: updatedImage,
        Avarta: updatedImageCover,
      };

      await api.patch(
        `https://samnote.mangasocial.online/profile/change_Profile/${user.id}`,
        payload
      );

      setImage(updatedImage);
      setImageCover(updatedImageCover);

      setSnackbar({
        isOpen: true,
        message: "Profile updated successfully",
        severity: "success",
      });
      setReload((prev) => prev + 1);
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
      gmail: Email,
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
      const response = await api.post(
        `https://samnote.mangasocial.online/login/change_password/${user.id}`,
        payload
      );
      console.log("payload", payload);
      console.log(response.data);
      setSnackbar({
        isOpen: true,
        message: response.data,
        severity: "warning",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        isOpen: true,
        message: "Failed to update password",
        severity: "error",
      });
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
      <Box sx={{ display: "flex", marginTop: 2 }}>
        <Typography sx={{ width: "200px" }}>Avatar:</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            accept="image/*"
            id="avatar-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageCoverChange}
          />
          <Box sx={{ marginLeft: 2 }}>
            <img
              src={imageCover}
              alt="Avatar"
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ width: "300px" }}
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
            onChange={handleImageChange}
          />
          <Box sx={{ marginLeft: 2 }}>
            <img
              src={image}
              alt="Cover"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "10px",
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

      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={handleProfileUpdate}
      >
        UPDATE
      </Button>
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
        <Box sx={{ marginTop: "20px", display: "flex" }}>
          {" "}
          <Typography sx={{ width: "200px" }}>Password:</Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              required
              placeholder="Enter current password"
              sx={{ width: "300px" }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              required
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
        </Box>
      </Box>
      <Typography
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
            value={selected}
            onChange={handleChange}
            sx={{ minWidth: "150px" }}
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
