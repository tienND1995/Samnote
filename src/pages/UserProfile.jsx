import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import api from "../api";
import { Box, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SvgIcon from "@mui/material/SvgIcon";
import Avatar from "@mui/material/Avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./UserProfile.css";

const UserProfile = () => {
  const appContext = useContext(AppContext);
  const { setSnackbar, user } = appContext;
  const [userInfomations, setUserInformations] = useState(null);
  const [notePrivate, setNotePrivate] = useState([]);
  const [lastUsers, setLastUsers] = useState([]);
  const [userNotes, setUserNotes] = useState(null);
  const archivedNotes = (userNotes || []).filter((note) => note.inArchived);
  const [value, setValue] = useState("1");
  const [valueNotePrivate, setValueNotePrivate] = useState("1");
  const [reload, setReload] = useState(0); // State to trigger updates
  const [allNotePublic, setAllNotePublic] = useState([]);

  useEffect(() => {
    fetchLastUsers();
    fetchAllNotesProfile();
    fetchAllNotePublic();
  }, []);
  const fetchLastUsers = async () => {
    const response = await api.get("/lastUser");
    if (response && response.data.status === 200) {
      setLastUsers(response.data.data);
    }
  };

  const fetchAllNotePublic = async () => {
    try {
      const response = await api.get("/notes_public");
      if (response && response.data.message === "success") {
        setAllNotePublic(response.data.public_note);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllNotesProfile = async () => {
    const response = await api.get(`/profile/${user.id}`).then((res) => {
      const dataFilter = res.data.note.filter(
        (notes) => notes.notePublic === 0
      );
      return dataFilter;
    });
    setNotePrivate(response);
  };

  const deleteNote = async (index) => {
    try {
      await api.delete(`https://samnote.mangasocial.online/notes/${index}`);
      setSnackbar({
        isOpen: true,
        message: `Remove note successfully ${index}`,
        severity: "success",
      });
      setReload((prev) => prev + 1); // Update the state to trigger useEffect
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: `Failed to remove note ${index}`,
        severity: "error",
      });
    }
  };

  function convertUpdate(dateStr) {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  function convertCreate(dateStr) {
    const [datePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-");
    return `${day}-${month}-${year}`;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeNotePrivate = (event, newValue) => {
    setValueNotePrivate(newValue);
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
          setUserNotes(res.data.note);
          console.log("note", res.data.note);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserInformation();

    return () => {
      ignore = true;
    };
  }, [user.id, reload]);

  const getTimeDifference = (time1, time2) => {
    const realTime = time1 + "+0700";
    const diffInMs = new Date(time2).getTime() - new Date(realTime).getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return `${diffInMinutes} min`;
    } else if (diffInDays < 1) {
      return `${diffInHours} hours`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day`;
    } else {
      return `more 30 day`;
    }
  };

  return (
    <Box className="w-full bg-[#4A4B51] h-[2300px]">
      {userInfomations && (
        <>
          <Box className=" relative">
            <img
              src={userInfomations.AvtProfile}
              alt=""
              className="w-full h-[500px] object-fit"
            />
          </Box>
          <Box className="flex items-center justify-between w-full mx-auto my-3">
            <div className="flex items-center gap-8 w-10/12 mx-auto">
              <img
                src={userInfomations.Avarta}
                alt=""
                className="w-28 h-28 rounded-full"
              />
              <Box>
                <Typography variant="h5" className="uppercase font-bold">
                  {userInfomations.name}
                </Typography>
                <Typography className="text-xl">
                  {userInfomations.gmail}
                </Typography>
              </Box>
            </div>
            <div className="mr-10">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_295_3410)">
                  <path
                    d="M0.00198132 23.278C0.00198132 9.898 10.482 0 24.002 0C37.522 0 48 9.9 48 23.278C48 36.656 37.52 46.554 24 46.554C21.58 46.554 19.24 46.234 17.06 45.634C16.6345 45.5195 16.1825 45.5548 15.78 45.734L11 47.834C10.7118 47.9623 10.3965 48.0176 10.0819 47.995C9.76732 47.9724 9.46312 47.8727 9.19622 47.7047C8.92931 47.5366 8.70791 47.3054 8.5516 47.0315C8.39528 46.7575 8.30887 46.4493 8.29998 46.134L8.15998 41.854C8.14913 41.5961 8.08694 41.343 7.97704 41.1095C7.86715 40.876 7.71176 40.6667 7.51998 40.494C5.11521 38.324 3.20093 35.6661 1.90487 32.6977C0.608801 29.7293 -0.0392407 26.5187 0.00398132 23.28L0.00198132 23.278ZM16.642 18.898L9.60198 30.098C8.90198 31.158 10.242 32.376 11.242 31.598L18.822 25.858C19.342 25.458 20.022 25.458 20.562 25.858L26.162 30.058C27.842 31.318 30.242 30.858 31.362 29.098L38.402 17.898C39.102 16.838 37.762 15.638 36.762 16.398L29.182 22.138C28.682 22.538 27.982 22.538 27.462 22.138L21.862 17.938C21.4637 17.6372 21.0073 17.4224 20.5216 17.3074C20.036 17.1924 19.5317 17.1796 19.0408 17.2698C18.55 17.3601 18.0832 17.5515 17.6703 17.8318C17.2573 18.1121 16.9071 18.4752 16.642 18.898Z"
                    fill="#F4F4F4"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_295_3410">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </Box>
          <Box className="flex">
            <Box className="flex-[4]">
              {archivedNotes.length > 0 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0px 0 10px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Box component="h3" sx={{ color: "text.main" }}>
                      PUBLIC NOTE
                    </Box>
                    <MoreHorizIcon
                      sx={{ cursor: "pointer", color: "text.main" }}
                    />
                  </div>
                  <TabContext value={value}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        marginBottom: "24px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Resent" value="1" />
                        <Tab label="Recommended" value="2" />
                      </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ width: "770px", padding: 0 }}>
                      <div className="overflow-scroll w-full h-[910px] hide-scrollbar">
                        {archivedNotes &&
                          archivedNotes.map((info, index) => (
                            <div
                              key={`Silde ${index}`}
                              className="p-2 border-[1px] rounded-xl border-black border-solid my-3 w-[98%]"
                              style={{
                                backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  margin: "10px 20px",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: " 10px 0",
                                  }}
                                >
                                  <Avatar
                                    style={{
                                      height: "45px",
                                      width: "45px",
                                      marginRight: "10px",
                                      objectFit: "cover",
                                    }}
                                    src={userInfomations.Avarta}
                                    alt=""
                                  />
                                  <Box sx={{ color: "text.main" }}>
                                    <p style={{ margin: 0 }}>
                                      <strong>{userInfomations.name}</strong>
                                    </p>
                                    <p style={{ margin: 0 }}>
                                      {" "}
                                      Create at {convertCreate(
                                        info.createAt
                                      )}{" "}
                                    </p>
                                  </Box>
                                </div>
                                <div className=" flex items-center">
                                  <div className=" flex items-center">
                                    <SvgIcon
                                      style={{
                                        marginRight: "3px",
                                        color: "#fff",
                                        width: "28px",
                                        height: "30px",
                                      }}
                                      viewBox="0 0 32 25"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M30.4044 10.5738C30.7877 11.1021 31 11.7884 31 12.5C31 13.2117 30.7877 13.898 30.4044 14.4263C27.9767 17.675 22.4507 24 16 24C9.54928 24 4.02338 17.675 1.59568 14.4263C1.21225 13.898 1 13.2117 1 12.5C1 11.7884 1.21225 11.1021 1.59568 10.5738C4.02338 7.32501 9.54928 1 16 1C22.4507 1 27.9767 7.32501 30.4044 10.5738Z"
                                        stroke="black"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M15.9999 17.6108C18.5538 17.6108 20.6241 15.3225 20.6241 12.4997C20.6241 9.67697 18.5538 7.38867 15.9999 7.38867C13.446 7.38867 11.3757 9.67697 11.3757 12.4997C11.3757 15.3225 13.446 17.6108 15.9999 17.6108Z"
                                        stroke="black"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </SvgIcon>

                                    {info.view}
                                  </div>
                                  <SvgIcon
                                    onClick={() => deleteNote(info.idNote)}
                                    sx={{
                                      color: "#fff",
                                      marginLeft: "10px",
                                    }}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M1.71429 6H22.2857"
                                      stroke="black"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M4.28571 6H19.7143V21.4286C19.7143 21.8832 19.5336 22.3193 19.2122 22.6407C18.8907 22.9622 18.4546 23.1429 18 23.1429H5.99999C5.54533 23.1429 5.1093 22.9622 4.7878 22.6407C4.46632 22.3193 4.28571 21.8832 4.28571 21.4286V6Z"
                                      stroke="black"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M7.71429 6V5.14286C7.71429 4.00622 8.16582 2.91612 8.96955 2.1124C9.77327 1.30868 10.8634 0.857147 12 0.857147C13.1366 0.857147 14.2267 1.30868 15.0305 2.1124C15.8342 2.91612 16.2857 4.00622 16.2857 5.14286V6"
                                      stroke="black"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M9.42859 11.1454V18.0051"
                                      stroke="black"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M14.5714 11.1454V18.0051"
                                      stroke="black"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </SvgIcon>
                                </div>
                              </div>
                              <Box
                                component="div"
                                sx={{
                                  color: "text.main",
                                  margin: "10px 10px 0px",
                                  height: "160px",
                                  overflow: "hidden",
                                }}
                              >
                                <strong style={{ fontSize: "20px" }}>
                                  {info.title}
                                </strong>
                                <div
                                  style={{ marginTop: "10px" }}
                                  dangerouslySetInnerHTML={{
                                    __html: info.data,
                                  }}
                                />
                              </Box>
                              <Box
                                component="div"
                                sx={{
                                  color: "text.secondary",
                                  textAlign: "end",
                                  padding: "0 10px 0 0",
                                }}
                              >
                                <p style={{ margin: 0 }}>
                                  Last edit at {convertUpdate(info.updateAt)}
                                </p>

                                <Box
                                  component="div"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "text.main",
                                    justifyContent: "flex-end",
                                  }}
                                ></Box>
                              </Box>
                            </div>
                          ))}
                      </div>
                    </TabPanel>
                    <TabPanel value="2" sx={{ width: "100%", padding: 0 }}>
                      tab2
                    </TabPanel>
                  </TabContext>
                </>
              ) : (
                <Box className="bg-white p-4 rounded-lg">
                  <Typography
                    variant="h5"
                    className="font-semibold text-center"
                  >
                    No note to show
                  </Typography>
                </Box>
              )}
            </Box>
            <div
              className={` w-[240px] absolute right-1 bottom-[-184%] hide-quick ${
                value === "1" ? "flex flex-col" : "flex-none"
              }`}
            >
              <div className="w-full h-[285px] w-full bg-[#FFF4BA] rounded-xl">
                <div className="flex justify-between w-full mt-2">
                  <span className="ml-3">Quick notes</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3"
                  >
                    <path
                      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-3 w-full h-[285px] bg-[#fff] rounded-xl">
                <div className="mx-2 my-2 w-[95%] h-[90%]">
                  <span className="font-[700] text-[#888888] text-xl">
                    New User
                  </span>
                  <div className="mt-1 w-full h-[78%] overflow-hidden">
                    {lastUsers.length > 0 ? (
                      <div>
                        {lastUsers.map((item, index) => (
                          <div
                            key={`user ${index}`}
                            className="w-full h-[15%] flex justify-between my-1 ml-2"
                          >
                            <img
                              className="w-[20px] h-[20px] rounded-xl object-cover mt-2"
                              src={item.linkAvatar}
                              alt="anh"
                            />
                            <span className="truncate-text w-[80px] mr-2">
                              {item.user_name}
                            </span>
                            <span className="mr-3">
                              {item.createAt.split(" ").slice(1, 4).join(" ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full h-[285px] bg-[#fff] rounded-xl">
                {allNotePublic.length > 0 ? (
                  <div className="mt-2 w-[95%] h-[95%] ml-2">
                    {allNotePublic.slice(0, 6).map((item, index) => (
                      <div
                        key={`notePublic ${index}`}
                        className="w-full h-[15%] flex justify-between my-1 ml-2"
                      >
                        <span className="text-sm w-[30%] h-[full] truncate-text border-l-4 border-black-200">
                          {item.author}
                        </span>
                        <span className="w-[45%] break-words text-xs">
                          Has added a new public note
                        </span>
                        <span className="text-xs">
                          {getTimeDifference(item.update_at, new Date())}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Box>
          <br />

          <Box className="flex-[4]">
            {notePrivate.length > 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0px 0 10px",
                    backgroundColor: "#fff",
                  }}
                >
                  <Box component="h3" sx={{ color: "text.main" }}>
                    PRIVATE NOTE
                  </Box>
                  <MoreHorizIcon
                    sx={{ cursor: "pointer", color: "text.main" }}
                  />
                </div>
                <TabContext value={valueNotePrivate}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      marginBottom: "24px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <TabList
                      onChange={handleChangeNotePrivate}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Resent" value="1" />
                      <Tab label="Recommended" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel value="1" sx={{ width: "1000px", padding: 0 }}>
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2.5}
                      navigation
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      {notePrivate &&
                        notePrivate.map((info, index) => (
                          <SwiperSlide
                            key={index}
                            className="p-2 border-[1px] rounded-xl border-black border-solid"
                            style={{
                              backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                margin: "10px 20px",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: " 10px 0",
                                }}
                              >
                                <Avatar
                                  style={{
                                    height: "45px",
                                    width: "45px",
                                    marginRight: "10px",
                                    objectFit: "cover",
                                  }}
                                  src={userInfomations.Avarta}
                                  alt=""
                                />
                                <Box sx={{ color: "text.main" }}>
                                  <p style={{ margin: 0 }}>
                                    <strong>{userInfomations.name}</strong>
                                  </p>
                                  <p style={{ margin: 0 }}>
                                    {" "}
                                    Create at {convertCreate(
                                      info.createAt
                                    )}{" "}
                                  </p>
                                </Box>
                              </div>
                              <div className=" flex items-center">
                                <div className=" flex items-center">
                                  <SvgIcon
                                    style={{
                                      marginRight: "3px",
                                      color: "#fff",
                                      width: "28px",
                                      height: "30px",
                                    }}
                                    viewBox="0 0 32 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M30.4044 10.5738C30.7877 11.1021 31 11.7884 31 12.5C31 13.2117 30.7877 13.898 30.4044 14.4263C27.9767 17.675 22.4507 24 16 24C9.54928 24 4.02338 17.675 1.59568 14.4263C1.21225 13.898 1 13.2117 1 12.5C1 11.7884 1.21225 11.1021 1.59568 10.5738C4.02338 7.32501 9.54928 1 16 1C22.4507 1 27.9767 7.32501 30.4044 10.5738Z"
                                      stroke="black"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M15.9999 17.6108C18.5538 17.6108 20.6241 15.3225 20.6241 12.4997C20.6241 9.67697 18.5538 7.38867 15.9999 7.38867C13.446 7.38867 11.3757 9.67697 11.3757 12.4997C11.3757 15.3225 13.446 17.6108 15.9999 17.6108Z"
                                      stroke="black"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </SvgIcon>

                                  {info.view}
                                </div>
                                <SvgIcon
                                  onClick={() => deleteNote(info.idNote)}
                                  sx={{
                                    color: "#fff",
                                    marginLeft: "10px",
                                  }}
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.71429 6H22.2857"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M4.28571 6H19.7143V21.4286C19.7143 21.8832 19.5336 22.3193 19.2122 22.6407C18.8907 22.9622 18.4546 23.1429 18 23.1429H5.99999C5.54533 23.1429 5.1093 22.9622 4.7878 22.6407C4.46632 22.3193 4.28571 21.8832 4.28571 21.4286V6Z"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7.71429 6V5.14286C7.71429 4.00622 8.16582 2.91612 8.96955 2.1124C9.77327 1.30868 10.8634 0.857147 12 0.857147C13.1366 0.857147 14.2267 1.30868 15.0305 2.1124C15.8342 2.91612 16.2857 4.00622 16.2857 5.14286V6"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9.42859 11.1454V18.0051"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M14.5714 11.1454V18.0051"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </SvgIcon>
                              </div>
                            </div>
                            <Box
                              component="div"
                              sx={{
                                color: "text.main",
                                margin: "10px 10px 0px",
                                height: "160px",
                                overflow: "hidden",
                              }}
                            >
                              <strong style={{ fontSize: "20px" }}>
                                {info.title}
                              </strong>
                              <div
                                style={{ marginTop: "10px" }}
                                dangerouslySetInnerHTML={{
                                  __html: info.data,
                                }}
                              />
                            </Box>
                            <Box
                              component="div"
                              sx={{
                                color: "text.secondary",
                                textAlign: "end",
                                padding: "0 10px 0 0",
                              }}
                            >
                              <p style={{ margin: 0 }}>
                                Last edit at {convertUpdate(info.updateAt)}
                              </p>

                              <Box
                                component="div"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "text.main",
                                  justifyContent: "flex-end",
                                }}
                              ></Box>
                            </Box>
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </TabPanel>
                  <TabPanel value="2" sx={{ width: "100%", padding: 0 }}>
                    tab2
                  </TabPanel>
                </TabContext>
              </>
            ) : (
              <Box className="bg-white p-4 rounded-lg">
                <Typography variant="h5" className="font-semibold text-center">
                  No note to show
                </Typography>
              </Box>
            )}
          </Box>
          <footer className="absolute bg-[black] w-[1264px] h-[50px] bottom-[-291%] right-[0%] flex items-center justify-center">
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
          </footer>
        </>
      )}
    </Box>
  );
};

export default UserProfile;
