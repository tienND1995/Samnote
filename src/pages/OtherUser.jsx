import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Avatar, Box, SvgIcon, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "./UserProfile.css";
import ModalComments from "../components/ModalComments";

const OtherUser = () => {
  const [userInfomations, setUserInformations] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [joinDay, setJoinDay] = useState("");
  const params = useParams();
  const [value, setValue] = React.useState("1");
  const [isModalNote, setIsModalNote] = useState(false);
  const [infoNote, setInfoNote] = useState({});
  const [commentNote, setCommentNote] = useState([]);

  useEffect(() => {
    let ignore = false;
    const getUserInformation = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${params.id}`
        );
        if (!ignore) {
          setUserInformations(res.data.user);
          setJoinDay(res.data.user.createAccount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getNoteOtherUser = async () => {
      try {
        const res = await api.get(`/notes/${params.id}`);
        console.log(res.data);
        if (res) {
          const data = res.data.notes.filter((notes) => notes.type !== "image");
          console.log(data);
          setUserNotes(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserInformation();
    getNoteOtherUser();

    return () => {
      ignore = true;
    };
  }, []);

  const convertDay = joinDay.split(" ").slice(1, 4);

  function convertCreate(dateStr) {
    const [datePart] = dateStr.split(" ");
    const [year, month, day] = datePart.split("-");
    return `${day}-${month}-${year}`;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const modalNote = async (info) => {
    setIsModalNote(true);
    setInfoNote(info);
  };

  const toggleModal = () => {
    setIsModalNote(false);
    setInfoNote({});
  };
  return (
    <Box className="bg-zinc-100 w-full">
      {userInfomations && (
        <>
          <Box className="relative">
            <img
              src={userInfomations.AvtProfile}
              alt=""
              className="w-full h-[80vh]"
            />
          </Box>

          <Box className="flex items-center gap-4 ml-3 my-4">
            <Box className="flex items-center gap-4">
              <Box className="relative">
                <img
                  src={userInfomations.Avarta}
                  alt="anh avatar"
                  className="w-28 rounded-full"
                />
                <span
                  style={{
                    backgroundColor: userInfomations.status_Login
                      ? "#31A24C"
                      : "#999",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    // border: "1px solid #000",
                    position: "absolute",
                    bottom: "3%",
                    right: "3%",
                  }}
                ></span>
              </Box>
              <Box
                sx={{
                  overflow: "hidden",
                  width: "250px",
                  textOverflow: "ellipsis",
                }}
              >
                <Typography
                  variant="h5"
                  className="uppercase font-bold text-ellipsis overflow-hidden"
                >
                  {userInfomations.name}
                </Typography>
                <Typography className="text-xl text-ellipsis overflow-hidden">
                  {userInfomations.user_name}
                </Typography>
                <Typography className="text-xl text-ellipsis overflow-hidden">
                  {userInfomations.gmail}
                </Typography>
                <Typography className="text-xl text-ellipsis overflow-hidden">
                  {`Join at ${convertDay[0]}, ${convertDay[1]} ${convertDay[2]}`}
                </Typography>
              </Box>
            </Box>
            <div className="flex flex-col justify-center items-end">
              <div className="flex justify-center items-center">
                <button
                  style={{
                    height: "40px",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    border: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    background: "#3644C7",
                    padding: "8px 10px",
                    borderRadius: "5px",
                    color: "#fff",
                  }}
                >
                  <svg
                    style={{ marginRight: "5px" }}
                    width="30"
                    height="33"
                    viewBox="0 0 49 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25.3901 16.5951C26.3568 15.5284 27.0988 14.3117 27.6161 12.9451C28.1335 11.5784 28.3915 10.1617 28.3901 8.69507C28.3901 7.2284 28.1315 5.81174 27.6141 4.44507C27.0968 3.0784 26.3555 1.86174 25.3901 0.795069C27.3901 1.06174 29.0568 1.94507 30.3901 3.44507C31.7235 4.94507 32.3901 6.69507 32.3901 8.69507C32.3901 10.6951 31.7235 12.4451 30.3901 13.9451C29.0568 15.4451 27.3901 16.3284 25.3901 16.5951ZM36.3901 32.6951V26.6951C36.3901 25.4951 36.1235 24.3531 35.5901 23.2691C35.0568 22.1851 34.3568 21.2271 33.4901 20.3951C35.1901 20.9951 36.7655 21.7704 38.2161 22.7211C39.6668 23.6717 40.3915 24.9964 40.3901 26.6951V32.6951H36.3901ZM40.3901 18.6951V14.6951H36.3901V10.6951H40.3901V6.69507H44.3901V10.6951H48.3901V14.6951H44.3901V18.6951H40.3901ZM16.3901 16.6951C14.1901 16.6951 12.3068 15.9117 10.7401 14.3451C9.17347 12.7784 8.39014 10.8951 8.39014 8.69507C8.39014 6.49507 9.17347 4.61174 10.7401 3.04507C12.3068 1.4784 14.1901 0.695068 16.3901 0.695068C18.5901 0.695068 20.4735 1.4784 22.0401 3.04507C23.6068 4.61174 24.3901 6.49507 24.3901 8.69507C24.3901 10.8951 23.6068 12.7784 22.0401 14.3451C20.4735 15.9117 18.5901 16.6951 16.3901 16.6951ZM0.390137 32.6951V27.0951C0.390137 25.9617 0.682137 24.9197 1.26614 23.9691C1.85014 23.0184 2.6248 22.2937 3.59014 21.7951C5.6568 20.7617 7.7568 19.9864 9.89014 19.4691C12.0235 18.9517 14.1901 18.6937 16.3901 18.6951C18.5901 18.6951 20.7568 18.9537 22.8901 19.4711C25.0235 19.9884 27.1235 20.7631 29.1901 21.7951C30.1568 22.2951 30.9321 23.0204 31.5161 23.9711C32.1001 24.9217 32.3915 25.9631 32.3901 27.0951V32.6951H0.390137Z"
                      fill="white"
                    />
                  </svg>
                  Add to your group
                </button>
                <button
                  style={{
                    height: "40px",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    border: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    margin: "0 10px",
                    background: "#3644C7",
                    padding: "8px 10px",
                    borderRadius: "5px",
                    color: "#fff",
                  }}
                >
                  <svg
                    style={{ marginRight: "5px" }}
                    width="25"
                    height="41"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.3926 0.695068C31.6586 0.695068 40.3926 8.94907 40.3926 20.0951C40.3926 31.2411 31.6586 39.4951 20.3926 39.4951C18.4369 39.5001 16.4894 39.2418 14.6026 38.7271C14.2482 38.6296 13.8711 38.6572 13.5346 38.8051L9.56458 40.5571C9.32484 40.663 9.06274 40.7085 8.80132 40.6894C8.53991 40.6703 8.28719 40.5873 8.06538 40.4476C7.84356 40.308 7.65946 40.116 7.52924 39.8885C7.39902 39.661 7.32668 39.4051 7.31858 39.1431L7.21058 35.5831C7.20312 35.3665 7.15156 35.1536 7.05906 34.9576C6.96655 34.7616 6.83505 34.5865 6.67258 34.4431C2.78258 30.9631 0.392578 25.9271 0.392578 20.0951C0.392578 8.94907 9.12458 0.695068 20.3926 0.695068ZM8.38258 25.7691C7.81858 26.6631 8.91858 27.6711 9.76058 27.0311L16.0706 22.2431C16.2788 22.0859 16.5326 22.0008 16.7936 22.0008C17.0545 22.0008 17.3083 22.0859 17.5166 22.2431L22.1886 25.7431C22.5202 25.9921 22.8998 26.1697 23.3035 26.2646C23.7072 26.3595 24.1261 26.3697 24.534 26.2945C24.9418 26.2194 25.3296 26.0604 25.6729 25.8278C26.0162 25.5952 26.3076 25.294 26.5286 24.9431L32.4026 15.6231C32.9666 14.7271 31.8666 13.7191 31.0246 14.3571L24.7146 19.1491C24.5063 19.3063 24.2525 19.3913 23.9916 19.3913C23.7306 19.3913 23.4768 19.3063 23.2686 19.1491L18.5946 15.6491C18.263 15.4004 17.8836 15.2231 17.4801 15.1283C17.0766 15.0336 16.6579 15.0235 16.2503 15.0987C15.8427 15.1738 15.4552 15.3326 15.112 15.5651C14.7689 15.7975 14.4776 16.0985 14.2566 16.4491L8.38258 25.7691Z"
                      fill="white"
                    />
                  </svg>
                  Messenger
                  <svg
                    className="ml-1"
                    width="30"
                    height="30"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.39062 12.6951L16.3906 20.6951L24.3906 12.6951"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  style={{
                    height: "40px",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                    border: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",

                    background: "#3644C7",
                    padding: "8px 10px",
                    borderRadius: "5px",
                    color: "#fff",
                  }}
                >
                  <svg
                    style={{ marginRight: "5px" }}
                    width="25"
                    height="25"
                    viewBox="0 0 43 43"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.390625 42.6951C0.390625 38.4516 2.07633 34.3819 5.07692 31.3814C8.0775 28.3808 12.1472 26.6951 16.3906 26.6951C20.6341 26.6951 24.7038 28.3808 27.7043 31.3814C30.7049 34.3819 32.3906 38.4516 32.3906 42.6951H0.390625ZM16.3906 24.6951C9.76062 24.6951 4.39062 19.3251 4.39062 12.6951C4.39062 6.06507 9.76062 0.695068 16.3906 0.695068C23.0206 0.695068 28.3906 6.06507 28.3906 12.6951C28.3906 19.3251 23.0206 24.6951 16.3906 24.6951ZM31.1166 29.1611C34.1759 29.9474 36.9092 31.6788 38.9273 34.1087C40.9454 36.5387 42.1454 39.5434 42.3566 42.6951H36.3906C36.3906 37.4751 34.3906 32.7231 31.1166 29.1611ZM27.0706 24.6091C28.7466 23.11 30.0869 21.2737 31.0037 19.2206C31.9206 17.1674 32.3932 14.9436 32.3906 12.6951C32.3949 9.962 31.6958 7.27381 30.3606 4.88907C32.6259 5.34425 34.6636 6.56981 36.1275 8.35746C37.5914 10.1451 38.3911 12.3845 38.3906 14.6951C38.3912 16.12 38.0871 17.5286 37.4988 18.8264C36.9106 20.1243 36.0517 21.2813 34.9797 22.2202C33.9078 23.159 32.6476 23.8578 31.2835 24.2698C29.9194 24.6818 28.483 24.7975 27.0706 24.6091Z"
                      fill="white"
                    />
                  </svg>
                  Create group
                </button>
              </div>
              <button className="h-[45px] bg-[black] mt-4 w-[42%] text-white text-center rounded-[21px] flex justify-evenly items-center">
                <img
                  className="w-[25px] h-[25px] bg-[#f9f9f9]"
                  src="https://s3-alpha-sig.figma.com/img/9765/1fb1/545af073cb81365ffa194ba6a7206ff1?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kIbW1u5rmHVPa1hPZrZ83xZD3w7OsqPGnozeYeoRcd~~tjA-S80lOURbIIJ2uQM7-EzsDKibGrDMQEvWlQbH1QX5gmE5b6B0r7R3iMc5DrSuPwcEllcaR5nj1T2hoB~k85t4y~fBl1Gi2RPQKjHMuEKhhqDUwDZpyMvW2q~Ku8sej6A-yyZUXfkAaWEvnJ1Kr1V-SOHTQ-bNAAIbApS9oTJU82JxJs44y3MOM-CFVgYSVvHgU4p46WA~HS6CEbCnFGCXdvjojef6EpNKxp8ntp-TBXJD14KNXT9mmvt7VHVXydHLuQg8JuXhYdbXg45yhDwj6ZtR7U-9wlt~6XnOtQ__"
                  alt="chat_an_danh"
                />
                <span>Chat anonymously</span>
              </button>
            </div>
          </Box>
          <br />
          <Box className="flex-[4] h-[900px]">
            {userNotes.length > 0 ? (
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
                  <TabPanel value="1" sx={{ width: "1000px", padding: 0 }}>
                    <div className="overflow-scroll w-full h-[700px] hide-scrollbar">
                      {userNotes &&
                        userNotes.map((info, index) => (
                          <div
                            key={`slide ${index}`}
                            className="p-2 border-[1px] h-[250px] rounded-xl border-black border-solid my-3"
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
                              </div>
                            </div>
                            <Box
                              component="div"
                              sx={{
                                color: "text.main",
                                margin: "10px 10px 0px",
                                height: "120px",
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
                              <Box
                                component="div"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "text.main",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <div
                                  className="h-[30px] text-right cursor-pointer"
                                  onClick={() => modalNote(info)}
                                >
                                  <svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 30 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M25.7992 14.4002C25.8033 15.9841 25.4333 17.5465 24.7192 18.9602C23.8725 20.6543 22.5709 22.0792 20.9602 23.0754C19.3494 24.0715 17.4931 24.5995 15.5992 24.6002C14.0154 24.6044 12.453 24.2343 11.0392 23.5202L4.19922 25.8002L6.47922 18.9602C5.76514 17.5465 5.39509 15.9841 5.39922 14.4002C5.39995 12.5063 5.92795 10.6501 6.92408 9.03929C7.92021 7.42853 9.34512 6.12691 11.0392 5.28023C12.453 4.56615 14.0154 4.1961 15.5992 4.20023H16.1992C18.7004 4.33822 21.0629 5.39394 22.8342 7.16526C24.6055 8.93658 25.6612 11.299 25.7992 13.8002V14.4002Z"
                                      stroke="black"
                                      stroke-width="1.8"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                  <span className="text-md mx-[2px]">100</span>
                                </div>
                              </Box>
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
                <Typography variant="h5" className="font-semibold text-center">
                  No note to show
                </Typography>
              </Box>
            )}
          </Box>
          <footer className="absolute bg-[black] w-[1264px] h-[50px] bottom-[-167%] right-[0%] flex items-center justify-center">
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
      {isModalNote && (
        <ModalComments
          toggleModal={toggleModal}
          isModalNote={isModalNote}
          data={infoNote}
          userInfomations={userInfomations}
        />
      )}
    </Box>
  );
};

export default OtherUser;
