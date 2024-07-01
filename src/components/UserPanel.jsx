// import { Outlet, useNavigate } from "react-router-dom";
// import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
// import NoteAddIcon from "@mui/icons-material/NoteAdd";
// import SearchIcon from "@mui/icons-material/Search";
// import SettingsIcon from "@mui/icons-material/Settings";
// import HomeIcon from "@mui/icons-material/Home";
// import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
// import MenuIcon from "@mui/icons-material/Menu";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import GroupIcon from "@mui/icons-material/Group";
// import DeleteIcon from "@mui/icons-material/Delete";
// import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
// import { handleLogOut } from "../helper";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useContext, useEffect, useState, React } from "react";
// import { AppContext } from "../context";
// import api from "../api";

// const navbarItems = [
//   {
//     name: "Home Page",
//     icon: <HomeIcon />,
//     url: "/",
//   },
//   {
//     name: "Photos",
//     icon: <PhotoLibraryIcon />,
//     url: "/user/photo",
//   },
//   {
//     name: "Note",
//     icon: <EventNoteIcon />,
//     url: "/user/note",
//   },
//   {
//     name: "Group",
//     icon: <GroupIcon />,
//     url: "/user/group",
//   },
//   {
//     name: "Dustbin",
//     icon: <DeleteIcon />,
//     url: "/user/dustbin",
//   },
//   {
//     name: "Sketch",
//     icon: <DriveFileRenameOutlineIcon />,
//     url: "/user/sketch",
//   },
// ];

// const UserPanel = () => {
//   const appContext = useContext(AppContext);
//   const { user, setUser } = appContext;
//   const [userInfomations, setUserInformations] = useState(null);
//   const lgScreen = useMediaQuery("(max-width:991px)");
//   const navigate = useNavigate();

//   const [open, setOpen] = React.useState(false);

//   const toggleDrawer = (newOpen: boolean) => () => {
//     setOpen(newOpen);
//   };
//   useEffect(() => {
//     let ignore = false;
//     const getUserInformation = async () => {
//       try {
//         const res = await api.get(
//           `https://samnote.mangasocial.online/profile/${user.id}`
//         );
//         if (!ignore) {
//           setUserInformations(res.data.user);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     getUserInformation();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return (
//     <>
//       {userInfomations && (
//         <div
//           style={
//             lgScreen
//               ? { display: "grid", gridTemplateColumns: " 1fr" }
//               : { display: "grid", gridTemplateColumns: "250px 1fr" }
//           }
//         >
//           <div
//             style={
//               lgScreen
//                 ? { position: "fixed", zIndex: "100" }
//                 : { display: "block" }
//             }
//           >
//             {" "}
//             <Box
//               className={`w-[250px] h-[100%] bg-[#1D1D1D] text-white p-8 pt-3 bg-[#4A4B51]`}
//               style={
//                 lgScreen ? { display: "none", height: 0 } : { display: "block" }
//               }
//               open={open}
//               onClose={toggleDrawer(false)}
//             >
//               <Box className="flex items-center justify-between">
//                 <Box
//                   className="flex gap-3 items-center cursor-pointer"
//                   onClick={() => navigate(`/user/profile`)}
//                 >
//                   <img
//                     src={userInfomations.Avarta}
//                     alt=""
//                     className="rounded-full w-12 h-12"
//                   />
//                   <Typography className="text-2xl">
//                     {userInfomations.name}
//                   </Typography>
//                 </Box>
//                 <SettingsIcon
//                   fontSize="large"
//                   className="cursor-pointer"
//                   onClick={() => navigate(`/user/setting`)}
//                 />
//               </Box>

//               <Box className="flex items-end text-white mb-6">
//                 <TextField
//                   id="input-with-sx"
//                   label="Search messenger"
//                   variant="standard"
//                   sx={{ input: { color: "white" } }}
//                   InputLabelProps={{ style: { color: "white" } }}
//                 />
//                 <IconButton>
//                   <SearchIcon
//                     sx={{
//                       color: "white",
//                       marginLeft: "5px",
//                       cursor: "pointer",
//                     }}
//                   />
//                 </IconButton>
//               </Box>

//               <Box>
//                 <Button
//                   variant="contained"
//                   className="bg-[#5BE260] rounded-full w-full mb-4"
//                   onClick={() => navigate(`/user/create-note`)}
//                 >
//                   <NoteAddIcon className="text-blue-500" />
//                   <Typography>New</Typography>
//                 </Button>
//               </Box>

//               <Box className="flex flex-col gap-4">
//                 {navbarItems.map((item, idx) => (
//                   <Box
//                     key={idx}
//                     className="flex gap-1 text-xl cursor-pointer"
//                     onClick={() => navigate(item.url)}
//                   >
//                     {item.icon}
//                     <Typography>{item.name}</Typography>
//                   </Box>
//                 ))}
//               </Box>

//               <Button
//                 variant="contained"
//                 className="bg-red-500 w-full rounded-full mt-4"
//                 onClick={() => {
//                   const submit = confirm("Do you want to logout?");
//                   if (submit) {
//                     setUser(null);
//                     handleLogOut();
//                   }
//                 }}
//               >
//                 Logout
//               </Button>
//             </Box>
//             <div
//               onClick={toggleDrawer(true)}
//               style={
//                 lgScreen
//                   ? {
//                       position: "fixed",
//                       top: "10px",
//                       left: "20px",
//                       zIndex: "100",
//                       backgroundColor: "#fff",
//                       height: "50px",
//                       width: "50px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: "50%",
//                       fontSize: "20px",
//                       border: "0.1px solid #000",
//                     }
//                   : { display: "none" }
//               }
//             >
//               {" "}
//               <MenuIcon />
//             </div>
//           </div>

//           <Outlet />
//         </div>
//       )}
//     </>
//   );
// };

// export default UserPanel;
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MenuIcon from "@mui/icons-material/Menu";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { handleLogOut } from "../helper";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const [userInformations, setUserInformations] = useState(null);
  const lgScreen = useMediaQuery("(max-width:991px)");
  const navigate = useNavigate();

  const checkStatus = lgScreen ? true : false;
  const [open, setOpen] = useState(checkStatus);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

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
  }, [user.id]);

  const drawerContent = (
    <Box
      className={`w-[250px] h-[100%] bg-[#1D1D1D] text-white p-8 pt-3 bg-[#4A4B51]`}
    >
      <Box className="flex items-center justify-between">
        <Box
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => navigate(`/user/profile`)}
        >
          <img
            src={userInformations?.Avarta}
            alt=""
            className="rounded-full w-12 h-12"
          />
          <Typography className="text-2xl">{userInformations?.name}</Typography>
        </Box>
        <SettingsIcon
          fontSize="large"
          className="cursor-pointer"
          onClick={() => navigate(`/user/setting`)}
        />
      </Box>

      <Box className="flex items-end text-white mb-6">
        <TextField
          id="input-with-sx"
          label="Search messenger"
          variant="standard"
          sx={{ input: { color: "white" } }}
          InputLabelProps={{ style: { color: "white" } }}
        />
        <IconButton>
          <SearchIcon
            sx={{
              color: "white",
              marginLeft: "5px",
              cursor: "pointer",
            }}
          />
        </IconButton>
      </Box>

      <Box>
        <Button
          variant="contained"
          className="bg-[#5BE260] rounded-full w-full mb-4"
          onClick={() => navigate(`/user/create-note`)}
        >
          <NoteAddIcon className="text-blue-500" />
          <Typography>New</Typography>
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
            <Typography>{item?.name}</Typography>
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
  );

  return (
    <>
      {userInformations && (
        <div
          style={
            lgScreen
              ? { display: "grid", gridTemplateColumns: " 1fr" }
              : { display: "grid", gridTemplateColumns: "250px 1fr" }
          }
        >
          <div
            style={
              lgScreen
                ? { position: "fixed", zIndex: "100" }
                : { display: "block" }
            }
          >
            {lgScreen ? (
              <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                {drawerContent}
              </Drawer>
            ) : (
              <div>{drawerContent}</div>
            )}
            <div
              onClick={toggleDrawer(true)}
              style={
                lgScreen
                  ? {
                      position: "fixed",
                      top: "10px",
                      left: "20px",
                      zIndex: "100",
                      backgroundColor: "#fff",
                      height: "50px",
                      width: "50px",
                      display: "flex",
                      cursor: "pointer",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      fontSize: "20px",
                      border: "0.1px solid #000",
                    }
                  : { display: "none" }
              }
            >
              <MenuIcon />
            </div>
          </div>

          <Outlet />
        </div>
      )}
    </>
  );
};

export default UserPanel;
