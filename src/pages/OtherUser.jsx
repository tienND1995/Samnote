import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Box, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

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

const OtherUser = () => {
  const [userInfomations, setUserInformations] = useState(null);
  const [userNotes, setUserNotes] = useState(null);
  const params = useParams();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let ignore = false;
    const getUserInformation = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${params.id}`
        );
        if (!ignore) {
          setUserInformations(res.data.user);
          setUserNotes(res.data.note);
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
    <Box className="bg-zinc-100 w-full">
      {userInfomations && (
        <>
          <Box className=" relative">
            <img
              src={userInfomations.AvtProfile}
              alt=""
              className="w-full h-[80vh]"
            />

            <Typography
              variant="h4"
              className="inline-block font-semibold text-white font-medium absolute right-10 top-10 p-7 rounded-lg"
            >
              Hello {userInfomations.name} !
              <CurrentDateTime />
            </Typography>
          </Box>

          <Box className="flex items-center gap-4 ml-3 my-4">
            <Box className="flex items-center gap-4">
              <Box className=" relative">
                <img
                  src={userInfomations.Avarta}
                  alt=""
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
                  {userInfomations.gmail}
                </Typography>
              </Box>
            </Box>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
          </Box>
          <Box className="flex gap-10 px-10">
            <Box className="flex-[2]">
              {userNotes.length > 0 ? (
                <>
                  {" "}
                  <Box
                    sx={{
                      backgroundColor: "bgitem.main",
                      borderRadius: "10px",
                      padding: "0 0px 30px 10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 30px 0 20px",
                      }}
                    >
                      <Box component="h3" sx={{ color: "text.main" }}>
                        NOTE
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
                      <TabPanel value="1" sx={{ width: "100%", padding: 0 }}>
                        tab1
                      </TabPanel>
                      <TabPanel value="2" sx={{ width: "100%", padding: 0 }}>
                        tab2
                      </TabPanel>
                    </TabContext>
                  </Box>
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
            <Box className="flex-1 bg-[#FFF4BA] p-4 rounded-lg">
              <Box className="flex justify-between ">
                <Typography
                  variant="h5"
                  className="font-semibold text-zinc-400"
                >
                  Scratch Path
                </Typography>
                <MoreHorizIcon />
              </Box>
              <Typography>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint,
                sequi? Corporis, eum enim? Quod in est quae necessitatibus vero,
                temporibus incidunt, fugit aliquid, deleniti provident officia
                cumque itaque asperiores neque.
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OtherUser;
