import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  InputBase,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SubdirectoryArrowRightSharpIcon from "@mui/icons-material/SubdirectoryArrowRightSharp";

const Incognito = () => {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [userChat, setUserChat] = useState([]);
  const [messenger, setMess] = useState(null);
  const [sendMess, setSendMess] = useState([]);
  const [idRecei, setIdReceive] = useState(null);
  const [reload, setReload] = useState(0);

  const handleInputChange = (event) => {
    setSendMess(event.target.value);
  };
  function getCurrentFormattedDateTime() {
    const date = new Date();

    // Lấy các thành phần của ngày và giờ
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0-11, cần +1
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Xác định AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Giờ 0 thành 12
    const formattedHours = String(hours).padStart(2, "0");

    // Lấy múi giờ
    const timeZoneOffset = -date.getTimezoneOffset();
    const offsetSign = timeZoneOffset >= 0 ? "+" : "-";
    const offsetHours = String(
      Math.floor(Math.abs(timeZoneOffset) / 60)
    ).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timeZoneOffset) % 60).padStart(
      2,
      "0"
    );

    // Tạo chuỗi thời gian định dạng
    const formattedDateTime = `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm} ${offsetSign}${offsetHours}:${offsetMinutes}`;

    return formattedDateTime;
  }
  const getMess = async (data) => {
    setIdReceive(data.idReceive);

    try {
      const res = await api.get(
        `https://samnote.mangasocial.online/message/chat-unknown-id/${data.idReceive}/${user.id}`
      );
      setMess(res.data.data.reverse());
      scrollToBottom();
    } catch (err) {
      console.log(err);
    }
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
    if (idRecei) {
      getSendMess();
    }
  }, [reload]);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      SendMessage();
    }
  };

  const SendMessage = async () => {
    const sendAt = getCurrentFormattedDateTime();
    const senmess = {
      content: sendMess,
      idReceive: idRecei,
      idSend: user.id,
      sendAt: sendAt,
    };
    try {
      await api.post(`/message/chat-unknown/${idRecei}`, senmess);
      setMess((prev) => [...prev, senmess]);
      setSendMess("");
      setReload((prev) => prev + 1);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
    console.log("Message to send:", senmess);
  };

  const getSendMess = async (data) => {
    try {
      const res = await api.get(
        `https://samnote.mangasocial.online/message/chat-unknown-id/${data.idReceive}/${user.id}`
      );
      scrollToBottom();

      setSendMess(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getUserChat = async () => {
      try {
        const res = await api.get(
          // `/message/list_user_unknown/77`
          `https://samnote.mangasocial.online/message/list_user_unknown/${user.id}`
        );

        setUserChat(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUserChat();
  }, [reload]);

  return (
    <Box className="text-white lg:flex bg-[#999] sm:grid sm:grid-cols-[300px_1fr]">
      <Box
        className="sm:w-[300px]"
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "0 10px",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: "30px",
            height: "40px",
            margin: "10px 0",
            width: "90%",
            justifyContent: "center",
          }}
        >
          <TextField
            id="input-with-sx"
            label="Search messenger"
            variant="standard"
            sx={{
              width: "90%",
              margin: "0 20px 10px",
              input: { color: "white" },
            }}
            InputLabelProps={{ style: { color: "#000" } }}
          />
          <IconButton sx={{}}>
            <SearchIcon className="mr-1 my-1" />
          </IconButton>
        </Box>
        <Box
          sx={{
            backgroundColor: "#56565DCC",
            textAlign: "center",
            borderRadius: "10px",
            margin: "0 10px 10px",
          }}
        >
          <div style={{ margin: "10px 0 0", padding: "0 10px 0" }}>
            <img
              style={{
                height: "20px",
                width: "20px",
                marginRight: "5px",
              }}
              src="https://s3-alpha-sig.figma.com/img/9765/1fb1/545af073cb81365ffa194ba6a7206ff1?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YP-6PnN36sD7~7-JrZkVVV7aDWVv4Ne6ZNik-vcASGppOo9~APa9puyjcWdbmvJp9z8RNmp6wMYmqquBvku5PUk6VjpGIpVbzDUS6M4BRabGwIKIiBIDCiM0zSiFEs8Aswgqp0aJ8YGDDhMoC5xfNoJyWHllBw0kuZCkhhJ9jGkRi-yp-niJCH38JZCi2nf9BsySXNaffArMVHFnECnOLKnk1nbVXHljJ-qbZ-rpdE2Kem9GOw4KYA~EnkIxbFhGIPzn2glqv5lOVZoUphbQ79wkVtjIfEAqN5egw8jT7kMIn-s7AMmpzKjGD1KfSD91P5wSA7TUAbJkt89e70gyEA__"
              alt="Incognito"
            />
            Incognito
          </div>
          <p style={{ padding: "0 10px 0" }}>
            You are now in incognito mode. You can send anonymous text with
            other people.
          </p>
          <Button
            variant="contained"
            sx={{ padding: "5px 10px", borderRadius: "10px", margin: "10px 0" }}
          >
            Quit
          </Button>
        </Box>
        {userChat.length > 0 ? (
          userChat.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                margin: "5px 20px",
                padding: "5px",
                backgroundColor: "#56565DCC",
                justifyContent: "space-between",
              }}
              onClick={() => getMess(item)}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {" "}
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.2804 4.30225H15.7736C8.60355 4.30225 4.3291 8.57669 4.3291 15.7467V32.2536C4.3291 37.7887 6.87013 41.5904 11.3416 43.0283C12.6416 43.4814 14.1387 43.698 15.7736 43.698H32.2804C33.9154 43.698 35.4124 43.4814 36.7125 43.0283C41.1839 41.5904 43.7249 37.7887 43.7249 32.2536V15.7467C43.7249 8.57669 39.4505 4.30225 32.2804 4.30225ZM40.7702 32.2536C40.7702 36.4689 39.1156 39.1281 35.7867 40.2312C33.876 36.4689 29.3455 33.79 24.027 33.79C18.7086 33.79 14.1978 36.4492 12.2674 40.2312H12.2477C8.95811 39.1675 7.28379 36.4886 7.28379 32.2733V15.7467C7.28379 10.1919 10.2188 7.25693 15.7736 7.25693H32.2804C37.8353 7.25693 40.7702 10.1919 40.7702 15.7467V32.2536Z"
                    fill="black"
                  />
                  <path
                    d="M24.0304 16.1208C20.1302 16.1208 16.9785 19.2725 16.9785 23.1727C16.9785 27.0729 20.1302 30.2442 24.0304 30.2442C27.9306 30.2442 31.0822 27.0729 31.0822 23.1727C31.0822 19.2725 27.9306 16.1208 24.0304 16.1208Z"
                    fill="black"
                  />
                </svg>
                <Box sx={{ marginLeft: "10px" }}>
                  <Typography variant="body1">User name</Typography>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      width: "140px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    variant="body2"
                  >
                    {item.last_text}
                  </Typography>
                </Box>
              </Box>
              <DeleteIcon />
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ marginTop: "20px" }}>
            No chat messages available.
          </Typography>
        )}
      </Box>
      {messenger !== null ? (
        <Box className="fixed inset-0 z-[3] sm:static w-full">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "5px 10px",
              backgroundColor: "#999",
              justifyContent: "space-between",
              height: "50px",
            }}
          >
            {" "}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <KeyboardBackspaceIcon
                className="sm:hidden block"
                sx={{ marginRight: "10px" }}
                onClick={() => setMess(null)}
              />
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.2804 4.30225H15.7736C8.60355 4.30225 4.3291 8.57669 4.3291 15.7467V32.2536C4.3291 37.7887 6.87013 41.5904 11.3416 43.0283C12.6416 43.4814 14.1387 43.698 15.7736 43.698H32.2804C33.9154 43.698 35.4124 43.4814 36.7125 43.0283C41.1839 41.5904 43.7249 37.7887 43.7249 32.2536V15.7467C43.7249 8.57669 39.4505 4.30225 32.2804 4.30225ZM40.7702 32.2536C40.7702 36.4689 39.1156 39.1281 35.7867 40.2312C33.876 36.4689 29.3455 33.79 24.027 33.79C18.7086 33.79 14.1978 36.4492 12.2674 40.2312H12.2477C8.95811 39.1675 7.28379 36.4886 7.28379 32.2733V15.7467C7.28379 10.1919 10.2188 7.25693 15.7736 7.25693H32.2804C37.8353 7.25693 40.7702 10.1919 40.7702 15.7467V32.2536Z"
                  fill="black"
                />
                <path
                  d="M24.0304 16.1208C20.1302 16.1208 16.9785 19.2725 16.9785 23.1727C16.9785 27.0729 20.1302 30.2442 24.0304 30.2442C27.9306 30.2442 31.0822 27.0729 31.0822 23.1727C31.0822 19.2725 27.9306 16.1208 24.0304 16.1208Z"
                  fill="black"
                />
              </svg>
              <Typography variant="body1">User name</Typography>
            </Box>
            <MoreHorizIcon />
          </Box>
          <Box
            className="h-[74vh] lg:h-[79vh]"
            sx={{
              width: "100%",
              backgroundColor: "#888",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
          >
            {messenger.map((info, index) => (
              <Box
                key={index}
                sx={{
                  marginLeft: "10px",
                  display: "flex",
                  alignItems: "center",
                  color: "#000",
                  justifyContent:
                    info.idSend == user.id ? "flex-end" : "flex-start",
                }}
                onClick={() => getSendMess(info)}
              >
                {info.idSend != user.id ? (
                  <>
                    {" "}
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32.2804 4.30225H15.7736C8.60355 4.30225 4.3291 8.57669 4.3291 15.7467V32.2536C4.3291 37.7887 6.87013 41.5904 11.3416 43.0283C12.6416 43.4814 14.1387 43.698 15.7736 43.698H32.2804C33.9154 43.698 35.4124 43.4814 36.7125 43.0283C41.1839 41.5904 43.7249 37.7887 43.7249 32.2536V15.7467C43.7249 8.57669 39.4505 4.30225 32.2804 4.30225ZM40.7702 32.2536C40.7702 36.4689 39.1156 39.1281 35.7867 40.2312C33.876 36.4689 29.3455 33.79 24.027 33.79C18.7086 33.79 14.1978 36.4492 12.2674 40.2312H12.2477C8.95811 39.1675 7.28379 36.4886 7.28379 32.2733V15.7467C7.28379 10.1919 10.2188 7.25693 15.7736 7.25693H32.2804C37.8353 7.25693 40.7702 10.1919 40.7702 15.7467V32.2536Z"
                        fill="black"
                      />
                      <path
                        d="M24.0304 16.1208C20.1302 16.1208 16.9785 19.2725 16.9785 23.1727C16.9785 27.0729 20.1302 30.2442 24.0304 30.2442C27.9306 30.2442 31.0822 27.0729 31.0822 23.1727C31.0822 19.2725 27.9306 16.1208 24.0304 16.1208Z"
                        fill="black"
                      />
                    </svg>{" "}
                    <Box
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        padding: "5px",
                        maxWidth: "70%",
                      }}
                    >
                      {info.content}
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      backgroundColor: "#1EC0F2",
                      borderRadius: "10px",
                      padding: "5px",
                      margin: "5px 10px",
                      maxWidth: "70%",
                    }}
                  >
                    {info.content}
                  </Box>
                )}
              </Box>
            ))}
            <div id="lastmessage" />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "10px 10px 0 10px",
              backgroundColor: "#F4F4F4",
              borderBottomLeftRadius: "15px",
              borderBottomrightRadius: "15px",
            }}
          >
            <IconButton sx={{ p: "10px" }}>
              <EmojiEmotionsIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Type your message..."
              value={sendMess}
              onChange={handleInputChange}
              // onKeyDown={sendMess ? () => handleKeyDown() : undefined}
              onKeyDown={sendMess ? handleKeyDown : undefined}
              // onKeyDown={handleKeyDown}
            />
            <IconButton sx={{ p: "10px" }}>
              <AttachFileIcon />
            </IconButton>
            <IconButton
              color={sendMess ? "primary" : "rgba(0,0,0,0.3)"}
              sx={{ p: "10px" }}
              aria-label="Send message"
              onClick={sendMess ? () => SendMessage() : undefined}
            >
              <SubdirectoryArrowRightSharpIcon sx={{ cursor: "pointer" }} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Incognito;
