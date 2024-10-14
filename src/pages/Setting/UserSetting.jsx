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
    <>
      {" "}
      {userInfo && (
        <Container className="mb-[80px] overflow-y-scroll h-[100vh]">
          <h1 className="uppercase">setting</h1>
          <UpdateAvatar />
          <UpdatePassword data={userInfo} />
        </Container>
      )}
    </>
  );
};

export default UserSetting;
