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

const UserSetting = () => {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [image, setImage] = useState(user.AvtProfile);
  const [imageCover, setImageCover] = useState(user.Avarta);
  const [showBox2, setShowBox2] = useState(true);
  const [showPassword2Edit, setShowPassword2Edit] = useState(false);
  const [selected, setSelected] = useState("");

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
        <TextField required id="outlined-required" defaultValue={user.name} />
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
            />
            <TextField
              required
              id="outlined-required"
              placeholder="Enter new password"
              sx={{ width: "300px", marginTop: "5px" }}
            />
            <Button variant="contained" sx={{ marginTop: "10px" }}>
              UPDATE
            </Button>
          </Box>
        )}
      </Box>
      <Box
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
              placeholder="Enter new password2"
              sx={{ width: "300px", marginTop: "5px" }}
            />
            <Button
              variant="outlined"
              component="span"
              sx={{ marginLeft: "20px" }}
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
            />
            <TextField
              required
              id="outlined-required"
              placeholder="Enter new password 2"
              sx={{ width: "300px", marginTop: "5px" }}
            />
            <Button variant="contained" sx={{ marginTop: "10px" }}>
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
      </Box>
      <Button sx={{ marginTop: "20px" }} variant="contained">
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
