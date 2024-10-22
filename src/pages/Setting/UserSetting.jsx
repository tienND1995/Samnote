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
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `https://samnote.mangasocial.online/profile/${user.id}`
        );
        setUserInfo(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="bg-black w-full overflow-y-auto relative text-white py-4">
      {" "}
      {userInfo && (
        <Container>
          <h1 className="uppercase">setting</h1>
          <UpdateAvatar />
          <UpdatePassword data={userInfo} />
          <Typography
            variant="h5"
            sx={{
              margin: "25px 0 20px",
              color: "#0FB7FF",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            General
          </Typography>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography className="sm:w-[200px]">Default screen:</Typography>
              <Select
                size="small"
                sx={{ minWidth: "150px", backgroundColor: "#fff" }}
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
              color: "#0FB7FF",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Online Sync & Backup
          </Typography>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: "300px" }}>Sync on launch:</Typography>
              <CheckCircleOutlineIcon className="bg-[#00ba00] rounded-full" />
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}
            >
              <Typography sx={{ width: "300px" }}>Auto backup:</Typography>
              <CheckCircleOutlineIcon className="bg-[#00ba00] rounded-full" />
            </Box>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default UserSetting;
