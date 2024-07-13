import { Outlet, useNavigate } from "react-router-dom";

import { Box, Button, TextField, IconButton, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { handleLogOut } from "../helper";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import api from "../api";

const navbarItems = [
  {
    name: "Home Page",
    icon: <HomeIcon />,
    url: "/",
  },
  {
    name: "Photos",
    icon: <PhotoLibraryIcon />,
    url: "/user/photo",
  },
  {
    name: "Note",
    icon: <EventNoteIcon />,
    url: "/user/note",
  },
  {
    name: "Group",
    icon: <GroupIcon />,
    url: "/user/group",
  },
  {
    name: "Dustbin",
    icon: <DeleteIcon />,
    url: "/user/dustbin",
  },
  {
    name: "Sketch",
    icon: <DriveFileRenameOutlineIcon />,
    url: "/user/sketch",
  },
];

const UserPanel = () => {
  const appContext = useContext(AppContext);
  const { user, setUser } = appContext;
  const [userInfomations, setUserInformations] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    let ignore = false;
    const getUserInformation = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${user.id}`
        );
        if (!ignore) {
          setUserInformations(res.data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserInformation();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      {userInfomations && (
        <Box
          // className="flex pl-[320px]"
          className="lg:grid lg:grid-cols-[250px_1fr] relative flex"
          // style={{ gridTemplateColumns: "250px 1fr" }}
        >
          <Box
            // className={`w-[320px] min-h-screen bg-[#1D1D1D] text-white p-8 fixed top-0 left-0`}
            className={`lg:w-[250px] w-full lg:h-[100%] h-[3%] bg-[#1D1D1D] fixed bottom-0 z-10 lg:static text-white px-8 py-4 pt-3 bg-[#4A4B51] `}
          >
            <Box className="flex items-center justify-between">
              <Box
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => navigate(`/user/profile`)}
              >
                <img
                  src={userInfomations.Avarta}
                  alt=""
                  className="rounded-full w-12 h-12 hidden lg:block"
                />
                <Typography className="text-2xl hidden lg:block">
                  {userInfomations.name}
                </Typography>
              </Box>
              <SettingsIcon
                fontSize="large"
                className="cursor-pointer hidden lg:block"
                onClick={() => navigate(`/user/setting`)}
              />
            </Box>

            <Box className="flex items-end text-white mb-4 hidden lg:block whitespace-nowrap ">
              <TextField
                id="input-with-sx"
                label="Search messenger"
                variant="standard"
                sx={{ input: { color: "white" }, width: "80%" }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <IconButton sx={{ p: "10px" }}>
                <SearchIcon className="mr-1 mt-2 text-white" />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              className="bg-[#5BE260] rounded-full w-full mb-4 flex absolute top-[-45%] left-[47%] transform-translate-x-[-50%] w-[20px] lg:w-full lg:static"
              // onClick={() => navigate(`/user/incognito`)}
              onClick={() => navigate(`/user/create-note`)}
            >
              <NoteAddIcon className="text-blue-500" />
              <Typography className="hidden lg:block">new</Typography>
            </Button>

            <Box className="flex lg:flex-col lg:justify-normal justify-around gap-4">
              {navbarItems.map((item, idx) => (
                <Box
                  key={idx}
                  className="flex gap-1 text-xl cursor-pointer"
                  onClick={() => navigate(item.url)}
                >
                  {item.icon}
                  <Typography className="hidden lg:block">
                    {item.name}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button
              variant="contained"
              className="bg-red-500 w-full rounded-full mt-4 hidden lg:block"
              onClick={() => {
                const submit = confirm("Do you want to logout?");
                if (submit) {
                  setUser(null);
                  handleLogOut();
                }
              }}
            >
              Logout
            </Button>
          </Box>
          <Outlet />
        </Box>
      )}
    </>
  );
};

export default UserPanel;
