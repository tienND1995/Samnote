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
import RestoreIcon from "@mui/icons-material/Restore";

const UserDustbin = () => {
  const appContext = useContext(AppContext);
  const { setSnackbar, user } = appContext;

  const [userInfomations, setUserInformations] = useState(null);
  const [userNotes, setTrashNotes] = useState(null);
  const [userNoteImage, setTrashNoteImage] = useState(null);
  const [value, setValue] = useState("1");
  const [reload, setReload] = useState(0); // State to trigger updates

  const deleteNote = async (index) => {
    try {
      await api.delete(
        `https://samnote.mangasocial.online/trunc-notes/${index}`
      );
      setSnackbar({
        isOpen: true,
        message: `Delete note successfully ${index}`,
        severity: "success",
      });
      setReload((prev) => prev + 1); // Update the state to trigger useEffect
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: `Failed to delete note ${index}`,
        severity: "error",
      });
    }
  };

  const restoreNote = async (index) => {
    try {
      await api.post(`https://samnote.mangasocial.online/trash-res/${index}`);
      setSnackbar({
        isOpen: true,
        message: `Restore note successfully ${index}`,
        severity: "success",
      });
      setReload((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: `Failed to restore note ${index}`,
        severity: "error",
      });
    }
  };

  const convertToHttps = (url) => {
    if (url && url.startsWith("http://")) {
      return url.replace("http://", "https://", 1);
    }
    return url;
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

  const CurrentDateTime = () => {
    const [currentDateTime, setCurrentDateTime] = useState("");

    useEffect(() => {
      const now = new Date();
      const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
      const day = now.toLocaleString("en-US", { day: "2-digit" });
      const month = now.toLocaleString("en-US", { month: "long" });
      const year = now.getFullYear();

      setCurrentDateTime(`${dayOfWeek}, ${day} ${month} ${year}`);
    }, []);

    return <div className="font-normal text-xl">{currentDateTime}</div>;
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
  }, [user.id, reload]);

  useEffect(() => {
    let ignore = false;
    const getTrash = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/trash/${user.id}`
        );
        if (!ignore) {
          const filteredNotes = res.data.notes.filter(
            (note) =>
              note.type === "Text" ||
              note.type === "checklist" ||
              note.type === "text"
          );
          setTrashNotes(filteredNotes);
          const filterNotesImage = res.data.notes.filter(
            (note) => note.type === "image"
          );
          setTrashNoteImage(filterNotesImage);

          console.log("filterNotesImage", filterNotesImage);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTrash();

    return () => {
      ignore = true;
    };
  }, [user.id, reload]);

  return (
    <Box className="bg-zinc-100 w-full">
      {userInfomations && (
        <>
          <Box className=" relative">
            <img
              src={userInfomations.AvtProfile}
              alt=""
              className="w-full h-[500px]"
            />

            <Typography
              variant="h4"
              className="inline-block text-white font-medium absolute right-10 top-10 p-7 rounded-lg"
            >
              Hello {userInfomations.name} !
              <CurrentDateTime />
            </Typography>
          </Box>
          <Box className="flex items-center gap-8 w-10/12 mx-auto my-3 ">
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
          </Box>

          <Box className="w-100">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px 10px 0px 20px",
                padding: "10px 0px 0 10px",
              }}
            >
              <Box component="h3" sx={{ color: "text.main" }}>
                PUBLIC NOTE
              </Box>
              <MoreHorizIcon sx={{ cursor: "pointer", color: "text.main" }} />
            </div>
            {userNotes?.length > 0 ? (
              <>
                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      marginBottom: "24px",
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
                  <TabPanel
                    value="1"
                    sx={{ width: "1000px", margin: "0 auto", padding: 0 }}
                  >
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2.5}
                      navigation
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      {userNotes &&
                        userNotes.map((info, index) => (
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
                              <div className="flex items-center">
                                <RestoreIcon
                                  onClick={() => restoreNote(info.idNote)}
                                  sx={{
                                    fontSize: "30px",
                                    cursor: "pointer",
                                    color: "",
                                  }}
                                />

                                <SvgIcon
                                  onClick={() => deleteNote(info.idNote)}
                                  sx={{
                                    color: "#fff",
                                    marginLeft: "10px",
                                    cursor: "pointer",
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
          <Box className="w-100">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px 10px 0px 20px",
                padding: "10px 0px 0 10px",
              }}
            >
              <Box component="h3" sx={{ color: "text.main" }}>
                NOTE IMAGE
              </Box>
              <MoreHorizIcon sx={{ cursor: "pointer", color: "text.main" }} />
            </div>
            {userNoteImage?.length > 0 ? (
              <>
                <TabContext value={value}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      marginBottom: "24px",
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
                  <TabPanel
                    value="1"
                    sx={{ width: "1000px", margin: "0 auto", padding: 0 }}
                  >
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={2.5}
                      navigation
                      onSlideChange={() => console.log("slide change")}
                      onSwiper={(swiper) => console.log(swiper)}
                    >
                      {userNoteImage &&
                        userNoteImage.map((info, index) => (
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
                              <div className="flex items-center">
                                <RestoreIcon
                                  onClick={() => restoreNote(info.idNote)}
                                  sx={{
                                    fontSize: "30px",
                                    cursor: "pointer",
                                    color: "",
                                  }}
                                />

                                <SvgIcon
                                  onClick={() => deleteNote(info.idNote)}
                                  sx={{
                                    color: "#fff",
                                    marginLeft: "10px",
                                    cursor: "pointer",
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
                                height: "60px",
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
                            <img
                              style={{
                                height: "200px",
                                width: "100%",
                                marginTop: "10px",
                              }}
                              src={convertToHttps(info.image)}
                              alt=""
                            />
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
        </>
      )}
    </Box>
  );
};

export default UserDustbin;
