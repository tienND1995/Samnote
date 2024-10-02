import { Box, Avatar, Typography, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context";
import { NavLink } from "react-router-dom";
import api from "../../api";
import bg_chat from "../../assets/img-chat-an-danh.jpg";
import SearchUnknowMessage from "./SearchUnknowMessage.jsx";
import InputMessage from "./InputMessage";
import "./AnonymousMess.css";

const AnonymousMessage = () => {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [listChatUnknow, setListChatUnknow] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [reload, setReload] = useState(0);
  const [showChatBox, setShowChatBox] = useState({ info: [], message: [] });
  const [activeIndex, setActiveIndex] = useState(null);
  // console.log("showChatBox", showChatBox);

  const handleGetMessage = async (data) => {
    const payload = {
      idRoom: `${data.idRoom}`,
    };
    try {
      const res = await api.post(`/message/chat-unknown-id?page=1`, payload);
      scrollToBottom();
      setShowChatBox((prevState) => ({
        ...prevState,
        message: res.data.data,
      }));

      // console.log("res.data.data", res.data.data);
      // console.log("check state", showChatBox.message);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReload = (payLoadData) => {
    setReload((prev) => prev + 1);
    setShowChatBox((prev) => ({
      ...prev, // Giữ nguyên các giá trị khác của showChatBox
      message: [...prev.message, payLoadData], // Nối dữ liệu mới vào mảng message
    }));
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const element = document.getElementById("lastmessage");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100); // Thời gian trễ là 100ms (có thể điều chỉnh tùy ý)
  };

  useEffect(() => {
    // Kiểm tra xem user có tồn tại và id có hợp lệ hay không
    if (user && user.id) {
      const getListChatUnknow = async () => {
        try {
          const res = await api.get(`/message/list_user_unknown/${user.id}`);
          setListChatUnknow(res.data.data);
          // console.log("data", res.data.data);
        } catch (err) {
          console.error("Error fetching chat list:", err);
        }
      };

      getListChatUnknow();
    } else {
      // Reset danh sách nếu không có user
      setListChatUnknow([]);
    }
  }, [user, reload]);

  const convertLastText = (lastText, idSend) => {
    return idSend === user.id ? `Bạn: ${lastText}` : `${lastText}`;
  };

  // Hàm lọc danh sách dựa trên tab hiện tại
  const filteredChatList = () => {
    if (activeTab === "unread") {
      return listChatUnknow.filter((item) => item.unReadCount > 0);
    } else if (activeTab === "read") {
      return listChatUnknow.filter((item) => item.unReadCount === 0);
    }
    return listChatUnknow; // Nếu tab là "all", trả về tất cả tin nhắn
  };

  return (
    <Box className="text-white lg:flex bg-[#DFFFFE] w-full">
      <Box
        className="w-[400px]"
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)",
          alignItems: "center",
        }}
      >
        <Box className="bg-[#B6F6FF] h-[140px] uppercase text-black w-full pt-[50px] text-center text-4xl font-bold">
          Chat
        </Box>

        <Box
          className="w-[90%]"
          style={{
            margin: "0 10px",
            boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SearchUnknowMessage />
        </Box>

        {/* Tabs for filtering */}
        <Box className="max-h-[47vh] w-[400px] lg:max-h-[50vh] overflow-auto scrollbar-none text-black font-bold">
          <div className="flex gap-[10px] justify-evenly my-4">
            <Button
              className={`${
                activeTab === "all"
                  ? "bg-black text-white font-bold text-[16px]"
                  : "text-black font-bold text-[16px]"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>

            <Button
              className={
                activeTab === "unread"
                  ? "bg-black text-white font-bold text-[16px]"
                  : "text-black font-bold text-[16px]"
              }
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </Button>
            <Button
              className={
                activeTab === "read"
                  ? "bg-black text-white font-bold text-[16px]"
                  : "text-black font-bold text-[16px]"
              }
              onClick={() => setActiveTab("read")}
            >
              Read
            </Button>
          </div>

          {/* Render filtered chat list */}
          {filteredChatList()?.length > 0 ? (
            filteredChatList().map((item) => (
              <NavLink
                to={`/user/incognito`}
                key={item.idMessage}
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : activeIndex === item.idMessage
                    ? "active"
                    : ""
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "30px",
                  margin: "5px 10px",
                  height: "70px",
                  width: "95%",
                  color: "black",
                  textDecoration: "none",
                  backgroundColor: "#fff",
                  justifyContent: "space-between",
                }}
                onClick={() => {
                  setShowChatBox((prevState) => ({
                    ...prevState,
                    info: item,
                  }));
                  setActiveIndex(item.idMessage);
                  handleGetMessage(item);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "85%",
                  }}
                >
                  <Avatar
                    sx={{ width: "60px", height: "60px", marginLeft: "4px" }}
                    src={item.user.avatar}
                  />
                  <Box
                    sx={{
                      marginLeft: "10px",
                      fontWeight: "700",
                      width: "100%",
                    }}
                  >
                    {item.user === "Unknow" ? (
                      <span style={{ fontWeight: "700", fontSize: "40px" }}>
                        User name
                      </span>
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "700",
                          fontSize: "24px",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.user.username}
                      </Typography>
                    )}
                    <Typography
                      sx={
                        item.unReadCount > 0
                          ? {
                              overflow: "hidden",
                              width: "90%",
                              fontSize: "20px",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              fontWeight: "700",
                            }
                          : {
                              overflow: "hidden",
                              width: "90%",
                              fontSize: "20px",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              fontWeight: "400",
                            }
                      }
                      variant="body2"
                    >
                      {convertLastText(item.last_text, item.idSend)}
                    </Typography>
                  </Box>
                </Box>
                <p className="">
                  {" "}
                  {item.unReadCount > 0 ? (
                    <span className="w-[35px] h-[35px] mr-2 rounded-[100%] bg-[#D9D9D9] flex items-center justify-center text-[#FF0404] text-[20px]">
                      {item.unReadCount}
                    </span>
                  ) : (
                    <svg
                      className="w-[30px] h-[30px] mr-2"
                      width="19"
                      height="14"
                      viewBox="0 0 19 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.03809 11.0455L1.53383 6.69202L0 8.16406L6.03809 14L19 1.47204L17.477 0L6.03809 11.0455Z"
                        fill="#00FF73"
                      />
                    </svg>
                  )}
                </p>
              </NavLink>
              // <NavLink
              //   to={`/user/incognito`}
              //   key={item.idMessage}
              //   className={({ isActive, isPending }) =>
              //     isPending
              //       ? "pending"
              //       : activeIndex === item.idMessage
              //       ? "active"
              //       : ""
              //   }
              //   style={{
              //     display: "flex",
              //     alignItems: "center",
              //     borderRadius: "30px",
              //     margin: "5px 10px",
              //     height: "70px",
              //     color: "black",
              //     textDecoration: "none",
              //     backgroundColor: "#fff",
              //     justifyContent: "space-between",
              //   }}
              //   onClick={() => {
              //     handleGetMessage(item);
              //     setActiveIndex(item.idMessage); // Cập nhật chỉ số của phần tử đang được kích hoạt
              //   }}
              // >
              //   <Box
              //     sx={{
              //       display: "flex",
              //       alignItems: "center",
              //     }}
              //   >
              //     <Avatar
              //       sx={{ width: "60px", height: "60px" }}
              //       src={item.user.avatar}
              //     />
              //     <Box sx={{ marginLeft: "10px", fontWeight: "700" }}>
              //       {item.user === "Unknow" ? (
              //         <span style={{ fontWeight: "700", fontSize: "40px" }}>
              //           User name
              //         </span>
              //       ) : (
              //         <Typography
              //           variant="body1"
              //           sx={{
              //             fontWeight: "700",
              //             fontSize: "24px",
              //             textTransform: "capitalize",
              //           }}
              //         >
              //           {item.user.username}
              //         </Typography>
              //       )}
              //       <Typography
              //         sx={{
              //           overflow: "hidden",
              //           width: "140px",
              //           fontSize: "20px",
              //           whiteSpace: "nowrap",
              //           textOverflow: "ellipsis",
              //         }}
              //         variant="body2"
              //       >
              //         {item.last_text}
              //       </Typography>
              //     </Box>
              //   </Box>
              //   {item.unReadCount > 0 ? (
              //     <span className="w-[35px] h-[35px] mr-2 rounded-[100%] bg-[#D9D9D9] flex items-center justify-center text-[#FF0404] text-[20px]">
              //       {item.unReadCount}
              //     </span>
              //   ) : (
              //     <svg
              //       className="w-[30px] h-[30px] mr-2"
              //       width="19"
              //       height="14"
              //       viewBox="0 0 19 14"
              //       fill="none"
              //       xmlns="http://www.w3.org/2000/svg"
              //     >
              //       <path
              //         d="M6.03809 11.0455L1.53383 6.69202L0 8.16406L6.03809 14L19 1.47204L17.477 0L6.03809 11.0455Z"
              //         fill="#00FF73"
              //       />
              //     </svg>
              //   )}
              // </NavLink>
            ))
          ) : (
            <Typography variant="body2" sx={{ marginTop: "20px" }}>
              No chat messages available.
            </Typography>
          )}
        </Box>
      </Box>
      {showChatBox.info.length !== 0 && (
        <div className="w-[100%] h-[100vh] shadow-[0_0_10px_rgba(0,0,0,0.4)]">
          {" "}
          <div className="w-full h-[140px] shadow-[0_0_10px_rgba(0,0,0,0.4)]">
            <div className="w-full h-[140px] items-center flex ">
              <Avatar
                sx={{ width: "90px", height: "90px", margin: "0 10px" }}
                src={showChatBox.info?.user.avatar}
              />
              <p className="text-black text-[40px] font-bold capitalize">
                {showChatBox.info?.user.username}
              </p>
            </div>
          </div>
          <div
            className="scrollbar shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            style={{
              width: "100%",
              backgroundImage: `url(${bg_chat})`,
              overflow: "auto",

              height: `calc(100% - 220px)`,
              // scrollbarWidth: "none",
              backgroundPosition: "bottom center",
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
            }}
          >
            {Array.isArray(showChatBox.message) &&
              showChatBox.message?.map((info, index) => (
                <Box
                  key={index}
                  sx={{
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "flex-end",
                    color: "#000",
                    justifyContent:
                      info.idReceive !== user.id ? "flex-end" : "flex-start",
                  }}
                >
                  {info.idReceive === user.id ? (
                    <>
                      <div className="flex items-end h-full">
                        {" "}
                        <Avatar
                          sx={{
                            width: "50px",
                            height: "50px",
                            margin: "5px",
                          }}
                          src={showChatBox.info?.user?.avatar}
                        />
                      </div>
                      {info.type === "text" ? (
                        <Box
                          sx={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            padding: "5px",
                            fontSize: "20px",
                            maxWidth: "70%",
                            marginBottom: "5px",
                          }}
                        >
                          {info.content}
                        </Box>
                      ) : info.type === "image" ? (
                        <img
                          src={info.img}
                          alt="image"
                          className="w-[200px] h-[auto] m-2 rounded-md"
                        />
                      ) : info.type === "gif" ? (
                        <img
                          src={info.gif}
                          alt="GIF"
                          className="w-[200px] h-[auto] m-2 rounded-md"
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      {" "}
                      {info.type === "text" ? (
                        <Box
                          sx={{
                            backgroundColor: "#1EC0F2",
                            borderRadius: "10px",
                            fontSize: "20px",
                            padding: "5px",
                            margin: "5px 10px",
                            maxWidth: "70%",
                          }}
                        >
                          {info.content}
                        </Box>
                      ) : info.type === "image" ? (
                        <img
                          src={info.img}
                          alt="image"
                          className="w-[200px] h-[auto] m-2 rounded-md"
                        />
                      ) : info.type === "gif" ? (
                        <img
                          src={info.gif}
                          alt="GIF"
                          className="w-[200px] h-[auto] m-2 rounded-md"
                        />
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Box>
              ))}
            <div id="lastmessage" />
          </div>
          <div className="w-full relative shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            {" "}
            <InputMessage data={showChatBox.info} onReload={handleReload} />
          </div>
        </div>
      )}
    </Box>
  );
};

export default AnonymousMessage;
