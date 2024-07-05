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
          className="lg:grid lg:grid-cols-[250px_1fr] relative flex"
          // style={{ gridTemplateColumns: "250px 1fr" }}
        >
          <Box
            // className={`w-[320px] min-h-screen bg-[#1D1D1D] text-white p-8 fixed top-0 left-0`}
            className={`lg:w-[250px] w-full lg:h-[100%] h-[3%] bg-[#1D1D1D] fixed bottom-0 z-10 lg:static text-white p-8 pt-3 bg-[#4A4B51]`}
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

            <Box className="flex items-end text-white mb-6 hidden lg:block">
              <SearchIcon className="mr-1 my-1" />
              <TextField
                id="input-with-sx"
                label="Search messenger"
                variant="standard"
                sx={{ input: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
            </Box>

            <Button
              variant="contained"
              className="bg-[#5BE260] rounded-full w-full mb-4 hidden lg:flex"
              onClick={() => navigate(`/user/incognito`)}
              // onClick={() => navigate(`/user/create-note`)}
            >
              <NoteAddIcon className="text-blue-500" />
              <Typography>new</Typography>
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
      {/* <footer className="bg-[black] w-full h-[50px] text-center hidden lg:block">
        <svg
          width="80"
          height="30"
          viewBox="0 0 120 103"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="34.2" cy="34.2" r="34.2" fill="#7BD15D" />
          <circle cx="85.4998" cy="34.2" r="34.2" fill="#62A7E6" />
          <circle cx="58.4246" cy="68.3997" r="34.2" fill="#EB1CD6" />
        </svg>

        <span className="text-[white] mx-4 text-lg">
          Now available on IOS and Android platform. Download now
        </span>
        <svg
          width="30"
          height="60"
          viewBox="0 0 79 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M39.2076 13.8231C36.7225 16.6644 36.7963 17.9774 36.4766 20.4054C40.2588 20.2458 42.4083 19.9425 46.66 16.3164C48.8146 13.9218 49.321 12.537 49.1132 10C45.5869 10.4853 43.5496 10.9348 39.2076 13.8231Z"
            fill="#FDFDFD"
          />
          <path
            d="M26.1083 22.8582C29.2096 22.8582 32.7662 24.1347 37.0323 24.9526L42.8183 23.4899C45.4369 22.6525 47.2329 22.5507 50.8725 22.8582L55.3624 23.7226L59.2969 25.7172L61.2411 27.2465L59.2969 28.1108L55.3624 31.2025C54.0677 33.3545 53.76 34.6165 54.1127 36.987C54.3587 39.0394 55.1501 40.0496 57.0751 41.7409L60.269 43.9683L63 45.0653L60.269 49.1211L57.0751 52.7447L54.1127 54.9388L52.724 56.0359L49.2987 57C46.7308 56.8155 45.3997 56.6355 43.4201 56.0359C40.9449 55.1377 39.5443 54.9454 37.0323 54.9388C34.9403 55.1371 33.9391 55.3715 32.4961 56.0359L29.3485 56.6675L26.1083 57L23.6087 56.3683L21.0166 54.9388C18.4311 52.8393 17.0394 51.5492 14.8603 48.6557C13.6137 47.139 12.9825 46.6003 11.3424 43.2701C10.7087 41.0645 10.3908 39.7431 10 36.987C10.1702 34.3786 10.42 32.927 11.3424 30.3714C13.2088 28.108 14.4439 26.9066 17.1747 24.9526C20.8331 23.5211 23.007 22.8582 26.1083 22.8582Z"
            fill="#FDFDFD"
            stroke="black"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M38.8571 65.2857C38.8571 64.5756 37.8018 64 36.5 64C35.1982 64 34.1429 64.5756 34.1429 65.2857V70H28.6429C27.6895 70 26.83 70.3133 26.4651 70.7937C26.1003 71.2741 26.302 71.8271 26.9761 72.1949L34.8332 76.4806C35.0592 76.6038 35.3197 76.6968 35.5977 76.7596C35.8756 76.8225 36.1804 76.8571 36.5 76.8571C36.8196 76.8571 37.1244 76.8225 37.4023 76.7596C37.6803 76.6968 37.9407 76.6038 38.1668 76.4806L46.0238 72.1949C46.6979 71.8271 46.8997 71.2741 46.5348 70.7937C46.1699 70.3133 45.3105 70 44.3571 70H38.8571V65.2857ZM16.0714 78.2638C15.6547 78.2638 15.255 78.3541 14.9603 78.5149C14.6656 78.6756 14.5 78.8936 14.5 79.1209V85.4127C14.5 86.0948 14.9967 86.7488 15.8808 87.231C16.7649 87.7132 17.964 87.9841 19.2143 87.9841H53.7857C55.0359 87.9841 56.2353 87.7132 57.1193 87.231C58.0034 86.7488 58.5 86.0948 58.5 85.4127V79.1209C58.5 78.8936 58.3344 78.6756 58.0399 78.5149C57.7451 78.3541 57.3453 78.2638 56.9286 78.2638H47.5839C46.3334 78.2638 45.1344 78.5347 44.2503 79.017C43.3662 79.4992 42.8695 80.1533 42.8695 80.8352C42.8695 82.5054 39.8036 83.8043 36.4928 83.7922C33.2728 83.7803 30.2981 82.4752 30.2981 80.8352C30.2981 80.1533 29.8014 79.4992 28.9173 79.017C28.0332 78.5347 26.8341 78.2638 25.5838 78.2638H16.0714Z"
            fill="white"
          />
        </svg>

        <svg
          width="30"
          height="60"
          viewBox="0 0 76 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2"
        >
          <path
            d="M51.369 31.1483C50.035 31.1483 48.933 29.9991 48.933 28.5704C48.933 27.1417 50.035 26.0236 51.369 26.0236C52.703 26.0236 53.805 27.1417 53.805 28.5704C53.805 29.9991 52.703 31.1483 51.369 31.1483ZM24.689 31.1483C23.355 31.1483 22.253 29.9991 22.253 28.5704C22.253 27.1417 23.355 26.0236 24.689 26.0236C26.023 26.0236 27.096 27.1417 27.096 28.5704C27.096 29.9991 26.023 31.1483 24.689 31.1483ZM52.239 15.5879L57.082 6.64298C57.343 6.11499 57.169 5.46275 56.705 5.18323C56.212 4.87264 55.603 5.05899 55.4 5.58699L50.441 14.6251C46.5381 12.7126 42.2919 11.7373 38 11.7677C33.563 11.7677 29.3 12.7926 25.617 14.594L20.716 5.55593C20.6545 5.43016 20.5695 5.31927 20.4663 5.2301C20.3632 5.14093 20.244 5.07539 20.1162 5.03754C19.9885 4.99969 19.8548 4.99033 19.7235 5.01005C19.5922 5.02977 19.4661 5.07814 19.353 5.15217C18.86 5.4317 18.715 6.08393 18.976 6.61192L23.79 15.5568C15.525 20.402 9.841 29.3779 9 40H67C66.188 29.409 60.533 20.433 52.239 15.5879Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M40.5781 51.3005C40.5781 50.5823 39.4238 50 38 50C36.5762 50 35.4219 50.5823 35.4219 51.3005V56.069H29.4062C28.3635 56.069 27.4234 56.3858 27.0244 56.8718C26.6253 57.3577 26.8459 57.9171 27.5832 58.2891L36.177 62.624C36.4242 62.7487 36.709 62.8428 37.0131 62.9062C37.3171 62.9698 37.6504 63.0049 38 63.0049C38.3496 63.0049 38.6829 62.9698 38.9869 62.9062C39.291 62.8428 39.5758 62.7487 39.823 62.624L48.4167 58.2891C49.154 57.9171 49.3747 57.3577 48.9756 56.8718C48.5765 56.3858 47.6365 56.069 46.5938 56.069H40.5781V51.3005ZM15.6562 64.4278C15.2004 64.4278 14.7632 64.5191 14.4409 64.6817C14.1186 64.8443 13.9375 65.0648 13.9375 65.2948V71.6588C13.9375 72.3487 14.4807 73.0103 15.4477 73.498C16.4147 73.9858 17.7262 74.2598 19.0938 74.2598H56.9062C58.2737 74.2598 59.5854 73.9858 60.5524 73.498C61.5194 73.0103 62.0625 72.3487 62.0625 71.6588V65.2948C62.0625 65.0648 61.8813 64.8443 61.5592 64.6817C61.2368 64.5191 60.7996 64.4278 60.3438 64.4278H50.123C48.7552 64.4278 47.4438 64.7018 46.4768 65.1896C45.5099 65.6774 44.9666 66.3389 44.9666 67.0287C44.9666 68.7181 41.6134 70.032 37.9921 70.0196C34.4703 70.0077 31.2166 68.6876 31.2166 67.0287C31.2166 66.3389 30.6734 65.6774 29.7064 65.1896C28.7394 64.7018 27.4279 64.4278 26.0604 64.4278H15.6562Z"
            fill="white"
          />
        </svg>
      </footer> */}
    </>
  );
};

export default UserPanel;
