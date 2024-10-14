import { Outlet, useNavigate, useParams } from "react-router-dom";
import IconChatUnknow from "../assets/iconChatUnknow";
import IconCreateNewNote from "../assets/iconCreateNewNote";
import IconLogout from "../assets/iconLogout";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Slide,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import api from "../api";
import { NavLink } from "react-router-dom";
import "../App.css";
import { AppContext } from "../context";
import { handleLogOut } from "../utils/utils";
import avatarDefault from "../assets/avatar-default.png";

const UserPanel = () => {
  const appContext = useContext(AppContext);
  const { user, setUser } = appContext;
  const [userInfomations, setUserInformations] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };
  const navbarItems = [
    {
      name: "Profile",
      icon: (
        <img
          src={userInfomations ? userInfomations.Avarta : avatarDefault}
          alt=""
          className="img-user-panel rounded-full size-[80px]"
        />
      ),
      url: `/profile/${user.id}`,
    },
    {
      name: "Find Note",
      icon: (
        <SearchIcon className="mr-1 text-white md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/",
    },
    {
      name: "Create Note",
      icon: (
        <div className="bg-[#198E39] rounded-full w-[100px] h-[50px] items-center flex justify-center">
          <IconCreateNewNote className=" md:size-[20px] xl:size-[25px]" />
          <span className="text-[20px] xl:text-[25px] pl-1">new</span>
        </div>
      ),
      url: "/create-note",
    },
    {
      name: "Home Page",
      icon: (
        <HomeIcon className="md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/",
    },
    {
      name: "Photos",
      icon: (
        <PhotoLibraryIcon className="md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/photo",
    },
    {
      name: "Note",
      icon: (
        <EventNoteIcon className="md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: `/editnote`,
    },
    {
      name: "Group",
      icon: (
        <GroupIcon className=" md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/group",
    },

    {
      name: "incognito",
      icon: (
        <IconChatUnknow className="md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/user/incognito",
      state: { userInfomations: null },
    },
    {
      name: "Sketch",
      icon: (
        <DriveFileRenameOutlineIcon className=" md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/user/sketch",
    },
    {
      name: "setting",
      icon: (
        <SettingsIcon className="  md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      ),
      url: "/user/setting",
    },
  ];

  useEffect(() => {
    let ignore = false;
    const getUserInformation = async (userID) => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${userID}`
        );
        if (!ignore) {
          setUserInformations(res.data.user);
        }
      } catch (err) {
        console.log(err);
      }
    };

    user && getUserInformation(user.id);

    return () => {
      ignore = true;
    };
  }, [user]);

  return (
    <>
      {" "}
      <Box
        id="navbar"
        // className="bg-gray-700 text-white w-full pt-3 flex items-lg-center flex-col gap-3"
      >
        <NavLink
          to={`/profile/${user.id}`}
          className="flex items-center cursor-pointer lg:hidden block"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <img
            src={userInfomations ? userInfomations.Avarta : avatarDefault}
            alt=""
            className="rounded-full size-[80px]"
          />
        </NavLink>
        {navbarItems.map((item, idx) => (
          <NavLink
            to={item.url}
            key={idx}
            className="cursor-pointer item-navbar lg:block"
            title={item.name}
            onClick={() => {
              if (item.state) {
                navigate(item.url, { state: item.state });
              } else {
                navigate(item.url);
              }
            }}
          >
            <span className="item-icon-panel  text-white">{item.icon}</span>
            <span className="item-name-panel text-[30px]">{item.name}</span>
          </NavLink>
        ))}
        <Button
          className="hidden lg:block"
          onClick={() => {
            const submit = confirm("Do you want to logout?");
            if (submit) {
              setUser(null);
              handleLogOut();
            }
          }}
        >
          <IconLogout className="md:size-[25px] lg:size-[30px] xl:size-[35px] " />
        </Button>
        <MenuIcon
          onClick={handleToggle}
          className="lg:hidden block text-black text-[35px] cursor-pointer"
        />
        <Slide
          timeout={1000}
          direction="right"
          in={open}
          mountOnEnter
          unmountOnExit
          id="navbar-mobile"
        >
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
            onClick={handleToggle}
          >
            <div
              className=" relative bg-gray-700 text-white w-[120px] h-[100vh] pt-5 px-2 flex items-lg-center flex-col gap-3"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {/* <span
                style={{
                  position: "absolute",
                  top: 10,
                  right: 1,
                  backgroundColor: "#fff",
                  color: "#000",
                }}
                onClick={handleToggle}
              >
                <CloseIcon />
              </span> */}
              {navbarItems.map((item, idx) => (
                <NavLink
                  to={item.url}
                  key={idx}
                  className="cursor-pointer lg:block items-center flex w-full justify-center"
                  title={item.name}
                  onClick={() => {
                    if (item.state) {
                      navigate(item.url, { state: item.state });
                    } else {
                      navigate(item.url);
                    }
                  }}
                >
                  <span className="text-white">{item.icon}</span>
                </NavLink>
              ))}
              {/* {navbarItems.slice(3).map((item, idx) => (
                <NavLink
                  to={item.url}
                  key={idx}
                  className="cursor-pointer lg:block"
                  title={item.name}
                  onClick={() => {
                    if (item.state) {
                      navigate(item.url, { state: item.state });
                    } else {
                      navigate(item.url);
                    }
                  }}
                >
                  <span className="text-white">{item.icon}</span>
                  <span className="name-icon-navbar-mobile text-[25px] ml-3 text-white">
                    {item.name}
                  </span>
                </NavLink>
              ))} */}
              <Button
                className=""
                onClick={() => {
                  const submit = confirm("Do you want to logout?");
                  if (submit) {
                    setUser(null);
                    handleLogOut();
                  }
                }}
              >
                <IconLogout className="md:size-[25px] lg:size-[30px] xl:size-[35px] " />
              </Button>
            </div>
          </div>
        </Slide>
      </Box>
    </>
  );
};

export default UserPanel;
