import {
  Box,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  InputBase,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";
import bg_chat from "../../assets/img-chat-an-danh.jpg";
import MenuSelect from "../../assets/menuselect.jsx";
import unknowAvt from "../../assets/unknow-avt.png";
import Loading from "../../share/Loading";
import GifIcon from "../../assets/gifIcon.jsx";
import ImageLogo from "../../assets/imagelogo.jsx";
import SendIcon from "@mui/icons-material/Send";
import SearchUnknowMessage from "./SearchUnknowMessage.jsx";
import InputMessage from "./InputMessage";
import { fetchApiSamenote } from "../../utils/fetchApiSamnote";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import "./AnonymousMess.css";

const AnonymousMessage = () => {
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const { user } = appContext;
  const [listChatUnknow, setListChatUnknow] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [reload, setReload] = useState(0);
  const [showChatBox, setShowChatBox] = useState({
    info: [],
    message: [],
    avatar: null,
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const { avatar, username, info, message } = showChatBox;
  const params = useParams();
  let { pathname } = useLocation();
  let userID = params.id;
  const [status, setStatus] = useState({ showSelectMenu: false });

  const selectMenu = () => {
    setStatus((prev) => ({
      ...prev,
      showSelectMenu: !prev.showSelectMenu,
    }));
  };
  // if (pathname == "/incognito") {
  //   setShowChatBox((prevState) => ({
  //     ...prevState,
  //     info: [],
  //     message: [],
  //     avatar: null,
  //     username: "",
  //   }));
  // }
  const handleGetMessage = async (data) => {
    console.log("idRoom truyền vào ", data.idRoom);

    const payload = {
      idRoom: `${data.idRoom}`,
    };

    setLoading(true);

    try {
      if (pathname.includes("user")) {
        const response = await fetchApiSamenote("get", `/profile/${userID}`);

        if (response?.error) {
          console.error("Lỗi tải profile 1:");
        } else {
          setShowChatBox((prevState) => ({
            ...prevState,
            info: response.user,
            avatar: response.user.Avarta,
            username: response.user.user_Name,
          }));
        }
      } else {
        setShowChatBox((prevState) => ({
          ...prevState,
          avatar:
            "http://samnote.mangasocial.online/get-image-chat/0/anonymous.png",
          username: "anonymous",
        }));
      }

      const res = await api.post(`/message/chat-unknown-id?page=1`, payload);

      setShowChatBox((prevState) => ({
        ...prevState,
        message: res.data.data,
      }));

      scrollToBottom();
    } catch (err) {
      // Nếu có lỗi, đặt message là mảng rỗng
      setShowChatBox((prevState) => ({
        ...prevState,
        message: [],
      }));
      console.error("Lỗi khi tải tin nhắn:", err);
    } finally {
      // Kết thúc quá trình tải
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      if (typeof pathname === "string" && pathname.includes("user")) {
        const idRoom = `${user.id}#${userID}`;
        handleGetMessage({ idRoom });
      } else {
        const idRoom = `${userID}#${user.id}`;
        handleGetMessage({ idRoom });
      }
    }
  }, [userID, pathname]);

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

          if (res.data.status === 200) {
            setListChatUnknow(res.data.data);
          } else {
            setListChatUnknow([]);
          }

          // console.log("data của listChatUnknow", res);
        } catch (err) {
          console.error("Error fetching chat list:", err);
        }
      };

      getListChatUnknow();
    }
  }, [user, reload]);

  const convertLastText = (lastText, idSend) => {
    return idSend === user.id ? `Bạn: ${lastText}` : `${lastText}`;
  };

  // Hàm lọc danh sách dựa trên tab hiện tại
  const filteredChatList = () => {
    // console.log("listChatUnknow", listChatUnknow);

    if (activeTab === "unread") {
      return listChatUnknow.filter((item) => item.unReadCount > 0);
    } else if (activeTab === "read") {
      return listChatUnknow.filter((item) => item.unReadCount === 0);
    }
    return listChatUnknow;
  };

  const deleteChatUnknown = async (data) => {
    // Kiểm tra xem user.id có tồn tại không
    if (!user || !user.id) {
      Swal.fire({
        title: "Error!",
        text: "User ID not found. Cannot delete chat.",
        icon: "error",
      });
      return;
    }

    const payload = {
      idRoom: data.idRoom ? data.idRoom : `${user.id}#${data.idUser}`,
    };

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this chat?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        const res = await api.post(`/message/delete_chat_unknown`, payload);
        setReload((prev) => prev + 1);
        // Reset chat box state
        navigate("/incognito");
        setShowChatBox((prevState) => ({
          ...prevState,
          avatar:
            "http://samnote.mangasocial.online/get-image-chat/0/anonymous.png",
          username: "anonymous",
        }));
        // console.log(":xóa thành công");

        setStatus((prev) => ({
          ...prev,
          showSelectMenu: false,
        }));
        Swal.fire({
          title: "Deleted!",
          text: "Chat deleted successfully.",
          icon: "success",
        });
      } catch (err) {
        // Optional: Handle error case, show error message
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting the chat.",
          icon: "error",
        });
      }
    }
  };

  const handleUserSelect = (infoUser) => {
    const data = {
      idRoom: `${user.id}#${infoUser.idUser}`,
    };
    setShowChatBox((prev) => {
      const updatedShowChatBox = {
        ...prev,
        avatar: infoUser.linkAvatar,
        username: infoUser.userName,
        info: infoUser,
      };
      return updatedShowChatBox;
    });
    // console.log("handleUserSelect truyền id room", data);

    setReload((prev) => prev + 1);
    handleGetMessage(data);
  };

  return (
    <Box
      className={`text-white lg:flex 
     bg-[#DFFFFE] 
         w-full h-full relative ${
           info.length >= 0
             ? ""
             : "overflow-hidden h-[1px] lg:overflow-y-auto lg:h-full"
         }`}
    >
      <Box
        className="w-full lg:w-[400px]"
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)",
          alignItems: "center",
        }}
      >
        <p className="bg-[#B6F6FF] h-[100px] lg:h-[150px] xl:h-[180px] uppercase text-black w-full flex justify-center items-center lg:text-2xl xl:text-3xl font-bold">
          Chat
        </p>

        <Box
          className="w-[100%] h-[10vh]"
          style={{
            margin: "0 0 15px",
          }}
        >
          <SearchUnknowMessage onUserSelect={handleUserSelect} />
        </Box>

        {/* Tabs for filtering */}
        <Box className="h-full w-full lg:w-[400px] overflow-hidden scrollbar-none text-black font-bold flex flex-col flex-grow-1">
          <div className="flex gap-[10px] justify-evenly px-4 pb-3 pt-1 h-[60px]">
            <Button
              className={`${
                activeTab === "all"
                  ? "bg-black h-[30px] text-white font-bold text-[12px] xl:text-[16px]"
                  : "text-black h-[30px] font-bold text-[12px] xl:text-[16px]"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </Button>

            <Button
              className={
                activeTab === "unread"
                  ? "bg-black h-[30px] text-white font-bold text-[12px] xl:text-[16px]"
                  : "text-black h-[30px] font-bold text-[12px] xl:text-[16px]"
              }
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </Button>
            <Button
              className={
                activeTab === "read"
                  ? "bg-black h-[30px] text-white font-bold text-[12px] xl:text-[16px]"
                  : "text-black h-[30px] font-bold text-[12px] xl:text-[16px]"
              }
              onClick={() => setActiveTab("read")}
            >
              Read
            </Button>
          </div>

          {/* Render filtered chat list */}
          <div className="overflow-y-auto overflow-x-hidden scrollbar">
            {" "}
            {filteredChatList()?.length > 0 ? (
              filteredChatList().map((item) => (
                <NavLink
                  to={
                    item.idRoom.split("#")[0] == user.id
                      ? `/incognito/user/${item.idRoom.split("#")[1]}`
                      : `/incognito/anonymous/${item.idRoom.split("#")[0]}`
                  }
                  key={item.idMessage}
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "anonimous-pending"
                      : activeIndex === item.idMessage
                      ? "anonimous-active"
                      : ""
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "30px",
                    margin: "5px 6px",
                    width: "95%",
                    color: "black",
                    textDecoration: "none",
                    backgroundColor: "#fff",
                    justifyContent: "space-between",
                  }}
                  onClick={() => {
                    setActiveIndex(item.idMessage);
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "85%",
                      margin: "auto",
                    }}
                  >
                    <Avatar
                      className="size-[50px] xl:size-[60px]"
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
                        <span className="font-bold lg:text-[20px] xl:text-[40px]">
                          {" "}
                          User name
                        </span>
                      ) : (
                        <Typography
                          variant="body1"
                          className="font-bold text-[20px] xl:text-[24px] overflow-hidden w-[82%] overflow-ellipsis capitalize"
                        >
                          {item.user.username}
                        </Typography>
                      )}
                      <Typography
                        className={`overflow-hidden w-[90%] text-[16px] xl:text-[20px] whitespace-nowrap overflow-ellipsis ${
                          item.unReadCount > 0 ? "font-bold" : "font-normal"
                        }`}
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
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ marginTop: "20px", textAlign: "center" }}
              >
                No chat messages.
              </Typography>
            )}
          </div>
        </Box>
      </Box>
      {pathname !== "/incognito" ? (
        <div className="flex flex-col w-[100%] h-[100vh] shadow-[0_0_10px_rgba(0,0,0,0.2)] fixed lg:static top-0 bottom-0 left-0 right-0 z-[1000] lg:z-[0] bg-white">
          {loading ? (
            <span className="flex items-center justify-center w-full h-full">
              {" "}
              <CircularProgress />
            </span>
          ) : (
            <>
              {" "}
              <div className="w-full h-[100px] lg:h-[100px] xl:h-[140px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] items-center flex justify-between px-2">
                <div className=" w-[95%] lg:w-full h-[100px] lg:h-[140px] items-center flex">
                  <NavLink
                    to="/incognito"
                    className="text-[50px] text-black lgEqual:hidden flex items-center"
                    onClick={() => {
                      setLoading(false);
                    }}
                  >
                    <ChevronLeftIcon className="mr-[10px] cursor-pointer rounded-full size-[34px] hover:bg-[rgba(0,0,0,0.1)]" />
                  </NavLink>
                  <Avatar
                    className=" size-[40px] lg:size-[50px] xl:size-[60px]"
                    src={avatar}
                  />
                  <p className="text-black text-[20px] lg:text-[25px] xl:text-[34px] font-bold capitalize ml-2 w-full truncate ">
                    {username}
                  </p>
                </div>
                <div className="relative size-[50px]">
                  <div
                    onClick={selectMenu}
                    className="flex items-center justify-center cursor-pointer rounded-full  hover:bg-[rgba(0,0,0,0.1)] mr-[8px] p-2"
                  >
                    <MenuSelect className="cursor-pointer size-[25px] lgEqual:size-[30px]" />
                  </div>

                  {status.showSelectMenu && (
                    <>
                      <div
                        className="anonimuos-overlay"
                        onClick={() =>
                          setStatus((prev) => ({
                            ...prev,
                            showSelectMenu: false,
                          }))
                        }
                      ></div>

                      <div className="dropdown-menu-anonimuos">
                        <ul>
                          <li>
                            <button
                              onClick={() => {
                                if (
                                  typeof pathname === "string" &&
                                  pathname.includes("user")
                                ) {
                                  const idRoom = `${user.id}#${userID}`;
                                  deleteChatUnknown({ idRoom });
                                } else {
                                  const idRoom = `${userID}#${user.id}`;
                                  deleteChatUnknown({ idRoom });
                                }
                              }}
                            >
                              <DeleteIcon />
                              Delete Chat
                            </button>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div
                className="bg-cover bg-center scrollbar w-full px-2 overflow-y-auto flex-grow shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                style={{
                  backgroundImage: `url(${bg_chat})`,
                }}
              >
                {Array.isArray(message) &&
                  message?.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        marginLeft: "10px",
                        display: "flex",
                        alignItems: "flex-end",
                        color: "#000",
                        justifyContent:
                          item.idReceive !== user.id
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      {item.idReceive === user.id ? (
                        <>
                          <div className="flex items-end h-full">
                            {" "}
                            <Avatar
                              sx={{
                                width: "50px",
                                height: "50px",
                                margin: "5px",
                              }}
                              src={avatar}
                            />
                          </div>
                          {item.type === "text" ? (
                            <Box
                              className="bg-white rounded-[10px] p-[5px] xl:text-[20px]
                        max-w-[70%] mb-[5px]
                        "
                            >
                              {item.content}
                            </Box>
                          ) : item.type === "image" ? (
                            <img
                              src={item.img}
                              alt="image"
                              className="w-[200px] h-[auto] my-2 rounded-md"
                            />
                          ) : item.type === "gif" ? (
                            <img
                              src={item.gif}
                              alt="GIF"
                              className="w-[200px] h-[auto] my-2 rounded-md"
                            />
                          ) : null}
                        </>
                      ) : (
                        <>
                          {" "}
                          {item.type === "text" ? (
                            <Box
                              className="rounded-[10px] p-[5px] xl:text-[20px]
                        max-w-[70%] mb-[5px] bg-[#1EC0F2]"
                            >
                              {item.content}
                            </Box>
                          ) : item.type === "image" ? (
                            <img
                              src={item.img}
                              alt="image"
                              className="w-[200px] h-[auto] my-2 rounded-md"
                            />
                          ) : item.type === "gif" ? (
                            <img
                              src={item.gif}
                              alt="GIF"
                              className="w-[200px] h-[auto] my-2 rounded-md"
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
              <div className="w-full h-[50px] xl:h-[60px] relative shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                {" "}
                <InputMessage data={info} onReload={handleReload} />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="hidden lgEqual:flex flex-col w-[100%] h-full shadow-[0_0_10px_rgba(0,0,0,0.2)] fixed lg:static top-0 bottom-0 left-0 right-0 z-[1000] lg:z-[0]">
          {" "}
          <div className="w-full h-[100px] lg:h-[100px] xl:h-[140px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] items-center flex justify-between px-2">
            <div className=" w-[95%] lg:w-full h-[100px] lg:h-[140px] items-center flex">
              <Avatar
                className=" size-[40px] lg:size-[50px] xl:size-[60px]"
                src={unknowAvt}
              />
              <p className="text-black text-[20px] lg:text-[25px] xl:text-[30px] font-bold capitalize ml-2 w-full truncate ">
                Anonymous chatter
              </p>
            </div>
            <div className="relative w-[13px]">
              <div className="flex items-center justify-center cursor-pointer rounded-full  hover:bg-[rgba(0,0,0,0.1)] mr-[8px]">
                <MenuSelect className="cursor-pointer" />
              </div>
            </div>
          </div>
          <div
            className="bg-cover bg-center scrollbar w-full px-2 flex-grow shadow-[0_0_10px_rgba(0,0,0,0.2)]"
            style={{
              backgroundImage: `url(${bg_chat})`,
            }}
          ></div>
          <div className="w-full bg-white flex items-center px-2 h-[50px] xl:h-[60px] shadow-[0_0_15px_rgba(0,0,0,0.2)]">
            <span className="p-[5px] gap-2 flex flex-row">
              <ImageLogo />
              <GifIcon />
            </span>
            <InputBase
              disabled
              sx={{ ml: 1, flex: 1, width: "90%" }}
              placeholder="Type your message..."
            />
            <SendIcon
              className="xl:text-[40px]"
              sx={{
                cursor: "not-allowed",
                color: "#999",
              }}
            />
          </div>
        </div>
      )}
    </Box>
  );
};

export default AnonymousMessage;
