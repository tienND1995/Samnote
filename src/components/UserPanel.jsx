import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
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
          className="grid"
          style={{ gridTemplateColumns: "250px 1fr" }}
        >
          <Box
            // className={`w-[320px] min-h-screen bg-[#1D1D1D] text-white p-8 fixed top-0 left-0`}
            className={`w-[250px] h-[100%] bg-[#1D1D1D] text-white p-8 pt-3 bg-[#4A4B51]`}
          >
            <Box className="flex items-center justify-between">
              <Box
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => navigate(`/user/profile`)}
              >
                <img
                  src={userInfomations.Avarta}
                  alt=""
                  className="rounded-full w-12 h-12"
                />
                <Typography className="text-2xl">
                  {userInfomations.name}
                </Typography>
              </Box>
              <SettingsIcon
                fontSize="large"
                className="cursor-pointer"
                onClick={() => navigate(`/user/setting`)}
              />
            </Box>

            <Box className="flex items-end text-white mb-6">
              <SearchIcon className="mr-1 my-1" />
              <TextField
                id="input-with-sx"
                label="Search messenger"
                variant="standard"
                sx={{ input: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Box>

            <Box>
              <Button
                variant="contained"
                className="bg-[#5BE260] rounded-full w-full mb-4"
                onClick={() => navigate(`/user/create-note`)}
              >
                <NoteAddIcon className="text-blue-500" />
                <Typography>new</Typography>
              </Button>
            </Box>

            <Box className="flex flex-col gap-4">
              {navbarItems.map((item, idx) => (
                <Box
                  key={idx}
                  className="flex gap-1 text-xl cursor-pointer"
                  onClick={() => navigate(item.url)}
                >
                  {item.icon}
                  <Typography>{item.name}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              variant="contained"
              className="bg-red-500 w-full rounded-full mt-4"
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
