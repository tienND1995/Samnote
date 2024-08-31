// @ts-nocheck
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import io from "socket.io-client";
import { AppContext } from "../context";
import api from "../api";
import {
  Box,
  Typography,
  Avatar,
  InputBase,
  IconButton,
  Modal,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SubdirectoryArrowRightSharpIcon from "@mui/icons-material/SubdirectoryArrowRightSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

const newSocket = io("https://samnote.mangasocial.online");

const UserGroup = () => {
  const location = useLocation();
  const [dataInfomations, setDataInfomations] = useState(location.state);
  console.log(dataInfomations);
  const [group, setGroup] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState({
    id: 0,
    Avarta: "",
    name: "",
    describe: "",
  });
  const [message, setMessage] = useState([
    {
      id: 0,
      idReceive: 0,
      idSend: 0,
      image: null,
      sendAt: "",
      state: "",
      text: "",
      type: "",
    },
  ]);
  const [messageGroup, setMessageGroup] = useState("");
  const [userChat, setUserChat] = useState([
    {
      idMessage: 0,
      idReceive: 0,
      idRoom: "",
      idSend: 0,
      is_seen: 0,
      last_text: "",
      last_image: "",
      sendAt: "",
      user: {
        Avarta: "",
        AvtProfile: "",
        createAccount: "",
        df_color: {
          a: 0,
          b: 0,
          g: 0,
          r: 0,
        },
        gmail: "",
        id: 0,
        name: "",
        password_2: null,
        status_Login: true,
        user_Name: "",
      },
    },
  ]);
  const [isSeen, setIsSeen] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [inputEmoji, setInputEmoji] = useState(null);
  const [emojiBase64, setEmojiBase64] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [imageContent, setImageContent] = useState(null);
  const [socketMess, setSocketMess] = useState([]);

  const appContext = useContext(AppContext);
  const { setSnackbar, user } = appContext;
  const [socket, setSocket] = useState(null);
  const pickerEmojiRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleGroupDescriptionChange = (e) =>
    setGroupDescription(e.target.value);
  const handleMemberIdChange = (e) => setMemberId(e.target.value);
  const handleMemberEmailChange = (e) => setMemberEmail(e.target.value);
  const handleMessageContentChange = (e) => {
    setMessageContent(e.target.value);
  };

  // Kết nối tới server Socket.IO khi component được tạo ra
  useMemo(() => {
    console.log(newSocket);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to server");
    });
    newSocket.on("send_message", (result) => {
      setSocketMess((prevMessages) => [...prevMessages, result.data]);
      fetchUserChat();
    });

    const fetchUserChat = async () => {
      const response = await api.get(
        `https://samnote.mangasocial.online/message/list_user_chat1vs1/${user.id}`
      );
      if (response && response.data.status === 200) {
        response.data.data.map((item) => {
          newSocket.emit("join_room", { room: item.idRoom });
        });
        setUserChat(response.data.data);
      }
    };
    const getGroup = async () => {
      try {
        const res = await api.get(`/group/all/${user.id}`);
        if (res && res.data.status === 200) {
          res.data.data.map((item) => {
            newSocket.emit("join_room", { room: item.idGroup });
          });
          setGroup(res.data.data);
        }
        console.log("group", res.data);
      } catch (err) {
        console.error(err);
      }
    };

    getGroup();
    fetchUserChat();

    return () => {
      newSocket.disconnect(); // Ngắt kết nối khi component bị xoá
    };
  }, []);

  useEffect(() => {
    const fetchMessWhenNavi = async () => {
      const response = await api.get(
        `https://samnote.mangasocial.online/message/list_message_chat1vs1/${user.id}/${dataInfomations.id}`
      );
      if (response && response.data.status === 200) {
        setMessage(response.data.data[0].messages);
      }
    };
    fetchMessWhenNavi();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, [selectedGroup]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.scrollTop =
      scrollContainer.scrollHeight - scrollContainer.clientHeight;
  }, [socketMess]);

  console.log(userChat);
  const handleUserChatClick = async (group) => {
    console.log(group);
    console.log(user.id);
    if (group.is_seen === 0) {
      const response = await api.post(
        `https://samnote.mangasocial.online/message/${group.idMessage}`
      );
      console.log(response.data);
    }
    const response = await api.get(
      `https://samnote.mangasocial.online/message/list_message_chat1vs1/${user.id}/${group.user.id}`
    );
    console.log(response.data.data[0].messages);
    if (response && response.data.status === 200) {
      setMessageGroup("");
      setMessage(response.data.data[0].messages);
      setSocketMess([]);
    }
    setSelectedGroup(group.user);
    setDataInfomations(group.user);
  };

  const handleGroupClick = async (group) => {
    try {
      console.log(group);
      const response = await api.get(
        `https://samnote.mangasocial.online/group/messages/${group.idGroup}`
      );
      console.log(response.data.status);
      if (response && response.data.status === 200) {
        setMessageGroup(response.data.data);
        setSocketMess([]);
      }
      setSelectedGroup(group);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(message);

  const handleAddMember = () => {
    setMembers([
      ...members,
      { gmail: memberEmail, id: memberId, role: "member" },
    ]);
    setMemberEmail("");
    setMemberId("");
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        name: groupName,
        createAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        idOwner: user.id,
        describe: groupDescription,
        members: [
          {
            gmail: memberEmail,
            id: memberId,
            role: "member",
          },
          ...members,
        ],
      };
      console.log("groupData", groupData);
      const res = await api.post(`/group/create/${user.id}`, groupData);

      console.log("Response message:", res.data.message);

      setGroup([...group, res.data]);
      handleClose();
      setSnackbar({
        isOpen: true,
        message: `Create group complete`,
        severity: "success",
      });
      console.log("groupData log", groupData);
    } catch (err) {
      console.error(err);

      const errorMessage =
        err.response?.data?.message || "Failed to create group";

      setSnackbar({
        isOpen: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const roomSplit = (idUser, idOther) => {
    if (idUser > idOther) {
      return `${idOther}#${idUser}`;
    } else {
      return `${idUser}#${idOther}`;
    }
  };

  const sendMessage = (room, data) => {
    if (socket) {
      // socket.emit("join_room", room);
      newSocket.emit("send_message", { room, data }); // Gửi sự kiện "send_message" tới server
      setMessageContent("");
      setImageContent(null);
      setInputEmoji(null);

      // Xử lý logic khi tin nhắn được gửi đi
      // Ví dụ: cập nhật giao diện ngay lập tức
    } else {
      console.error("Socket.io not initialized.");
      // Xử lý khi socket chưa được khởi tạo
    }
  };

  const handleImageChange = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageContent(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    event.target.files[0] = null;
  };

  console.log(imageContent);
  console.log(socketMess);

  const handleButtonSend = () => {
    if (selectedGroup) {
      if (imageContent !== null) {
        const imageData = {
          idSend: +user.id,
          idReceive:
            selectedGroup.id !== 0 ? +selectedGroup.id : +dataInfomations.id,
          type: "image",
          state: "",
          data: imageContent,
          content: messageContent,
        };
        sendMessage(
          roomSplit(
            +user.id,
            selectedGroup.id !== 0 ? +selectedGroup.id : +dataInfomations.id
          ),
          imageData
        );
      } else if (messageContent !== "") {
        const textData = {
          idSend: +user.id,
          idReceive:
            selectedGroup.id !== 0 ? +selectedGroup.id : +dataInfomations.id,
          type: "text", // Giả sử loại tin nhắn là text
          state: "",
          content: messageContent,
        };
        sendMessage(
          roomSplit(
            +user.id,
            selectedGroup.id !== 0 ? +selectedGroup.id : +dataInfomations.id
          ),
          textData
        );
      } else if (inputEmoji !== null) {
        const emojiData = {
          idSend: +user.id,
          idReceive:
            selectedGroup.id !== 0 ? +selectedGroup.id : +dataInfomations.id,
          type: "icon-image", // Giả sử loại tin nhắn là text
          state: "",
          data: emojiBase64,
          content: messageContent,
        };
        sendMessage(
          roomSplit(
            +user.id,
            selectedGroup.id !== 0 ? +selectedGroup.id : +dataInfomations.id
          ),
          emojiData
        );
      }
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      handleButtonSend();
    }
    if (event.key === "Backspace") {
      if (inputEmoji !== null) {
        setInputEmoji(null);
      }
    }
  };

  const handleLastText = (lastText, idSend, image) => {
    if (!lastText) {
      if (idSend === user.id) {
        if (image.includes(`dataimage/pngbase64`)) {
          return "Bạn đã gửi 1 nhãn dán";
        } else {
          return "Bạn đã gửi 1 ảnh";
        }
      } else {
        if (image.includes(`dataimage/pngbase64`)) {
          return "Bạn đã gửi 1 nhãn dán";
        } else {
          ("Đã gửi 1 ảnh");
        }
      }
    } else {
      if (idSend === user.id) {
        return `Bạn: ${lastText}`;
      } else {
        `${lastText}`;
      }
    }
  };

  const handleToggleEmoji = () => {
    setIsEmoji(!isEmoji);
  };

  const handleClickEmoji = (emoji) => {
    console.log(emoji);
    setInputEmoji(emoji.emoji);
    convertEmojiToBase64(emoji.emoji);
  };
  console.log("emoji", emojiBase64);

  const convertEmojiToBase64 = (emoji) => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    context.font = "48px Arial";
    context.fillText(emoji, 0, 48);

    const base64 = canvas.toDataURL();
    setEmojiBase64(base64);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerEmojiRef.current &&
        !pickerEmojiRef.current.contains(event.target)
      ) {
        setIsEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageMess = (image) => {
    if (image === null) {
      return;
    }
    const imageType = ["png", "jpeg", "jpg"];
    for (let i = 0; i < imageType.length; i++) {
      if (image.includes(`dataimage/${imageType[i]}base64`)) {
        if (image.includes(`dataimage/pngbase64`)) {
          const newImage = image.replace(
            `dataimage/${imageType[i]}base64`,
            `data:image/${imageType[i]};base64,`
          );
          const newImageReal = newImage.slice(0, -1);
          return newImageReal;
        } else {
          const newImage = image.replace(
            `dataimage/${imageType[i]}base64`,
            `data:image/${imageType[i]};base64,`
          );
          return newImage;
        }
      } else {
        continue;
      }
    }
  };

  const handleTimeUserChat = (time) => {
    const realTime = new Date();
    const diffInMs = realTime.getTime() - new Date(time).getTime();
    const daysDifference = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const monthsDifference = Math.floor(daysDifference / 30.436875); // Trung bình số ngày trong một tháng
    const yearsDifference = Math.floor(daysDifference / 365.25);
    const timeSplit = time.split(" ");

    if (daysDifference < 1) {
      return `${timeSplit[4].slice(0, -3)}`;
    } else if (daysDifference < 7) {
      return `${timeSplit[0].slice(0, -1)}`;
    } else if (daysDifference < 30) {
      return `${timeSplit[1]}${timeSplit[2]}`;
    } else if (monthsDifference < 12) {
      return `${timeSplit[2]}`;
    } else {
      return `${timeSplit[3]}`;
    }
  };
  return (
    <div
      className="mb-[3rem] lg:mb-0"
      style={{
        display: "grid",
        gridTemplateColumns: "40% 60%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "bgitem.main",
          paddingTop: "10px",
          height: "635px",
        }}
      >
        <Box
          sx={{
            color: "text.main",
            boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.5)",
            paddingLeft: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: "700",
              fontSize: "20px",
              padding: "10px 10px 20px",
            }}
          >
            Chat
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="form"
              sx={{
                backgroundColor: "#DADADA",
                display: "flex",
                alignItems: "center",
                height: "40px",
                width: "100%",
                borderRadius: "30px",
                margin: "0 10px 10px 0px",
              }}
            >
              <SearchIcon sx={{ marginLeft: "15px", color: "#333" }} />
              <InputBase
                sx={{ ml: 1, flex: 1, color: "#333" }}
                placeholder="Search Messenger"
                inputProps={{ "aria-label": "search google maps" }}
              />
            </Box>
          </div>
        </Box>
        <Accordion>
          <AccordionSummary>
            <ExpandMoreIcon />
            <Typography>Chat</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                maxHeight: "400px",
                overflow: "auto",
                scrollbarWidth: "none",
              }}
            >
              {userChat.map((item, index) => {
                return (
                  <Box
                    key={`chat ${index}`}
                    sx={{
                      margin: "2px 0",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "text.main",
                      backgroundColor: " rgba(178, 178, 178, 0.1)",
                      borderRadius: "30px",
                      "&:hover": {
                        backgroundColor: " rgba(178, 178, 178, 0.3)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleUserChatClick(item)}
                  >
                    <Avatar
                      src={item.user.Avarta}
                      sx={{ width: "30px", height: "30px", margin: "10px" }}
                    />
                    <div style={{ width: "100%" }}>
                      <strong
                        style={{
                          padding: 0,
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.user.name}
                      </strong>
                      <p
                        className={
                          item.is_seen === 0 && item.idReceive === user.id
                            ? "p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[700]"
                            : "p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis"
                        }
                      >
                        {handleLastText(
                          item.last_text,
                          item.idSend,
                          item.last_image
                        )}
                      </p>
                    </div>
                    <div className="h-full mr-4 flex items-start">
                      <p className="mt-3 text-xs">
                        {handleTimeUserChat(item.sendAt)}
                      </p>
                    </div>
                  </Box>
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={
              <AddIcon sx={{ cursor: "pointer" }} onClick={handleOpen} />
            }
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <ExpandMoreIcon />
            <Typography>Group</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {group?.map((item, index) => {
                if (item.numberMems >= 1) {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        margin: "20px",
                        color: "text.main",
                        "&:hover": {
                          backgroundColor: "#BFEFFF",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleGroupClick(item)}
                    >
                      <Avatar
                        src="../public/groupImg.png"
                        sx={{ width: "30px", height: "30px", margin: "20px" }}
                      />
                      <div style={{ width: "100%" }}>
                        <strong>{item.name}</strong>
                        <p
                          style={{
                            padding: 0,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.describe}
                        </p>
                      </div>
                    </Box>
                  );
                } else {
                  return null;
                }
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      <div
        className="mb-2"
        style={{ borderLeft: "1px solid black", height: "auto" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            color: "text.main",
            backgroundColor: "bg.main",
            borderBottom: "1px solid #999",
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar
              style={{
                height: "40px",
                width: "40px",
                marginRight: "15px",
              }}
              src={
                dataInfomations ? dataInfomations.Avarta : selectedGroup.Avarta
              }
              alt=""
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedGroup && (
              <>
                <h3 style={{ margin: 0 }}>{selectedGroup.name}</h3>
                <p style={{ margin: 0 }}>{selectedGroup.describe}</p>
              </>
            )}
          </div>
          <MoreHorizIcon />
        </Box>
        <Box
          ref={scrollContainerRef}
          sx={{
            backgroundColor: "bgitem.main",
            height: "515px",
            overflow: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {/* Đã cập nhật để hiển thị tin nhắn từ server */}
          {messageGroup.length > 0 ? (
            <>
              {messageGroup
                .slice()
                .reverse()
                .map((item, index) =>
                  item.idSend === user.id ? (
                    <div
                      key={`message ${index}`}
                      className="w-[98%] h-auto my-2 ml-2 flex flex-col items-end"
                    >
                      {item.image ? (
                        <img
                          className={
                            item.image.includes(`dataimage/pngbase64`)
                              ? "w-[50px] h-auto"
                              : "w-[100px] h-auto"
                          }
                          src={handleImageMess(item.image)}
                        />
                      ) : (
                        <p className="max-w-[50%] break-words bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto">
                          {item.content}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      key={`message ${index}`}
                      className="w-full h-auto my-2 ml-2 flex flex-col items-start"
                    >
                      {item.image ? (
                        <img
                          className={
                            item.image.includes(`dataimage/pngbase64`)
                              ? "w-[50px] h-auto"
                              : "w-[100px] h-auto"
                          }
                          src={handleImageMess(item.image)}
                        />
                      ) : (
                        <p className="max-w-[50%] break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto">
                          {item.content}
                        </p>
                      )}
                    </div>
                  )
                )}
            </>
          ) : (
            <>
              {message
                .slice()
                .reverse()
                .map((item, index) =>
                  item.idSend === user.id ? (
                    <div
                      key={`message ${index}`}
                      className="w-[98%] h-auto my-2 ml-2 flex flex-col items-end"
                    >
                      {item.image ? (
                        <img
                          className={
                            item.image.includes(`dataimage/pngbase64`)
                              ? "w-[50px] h-auto"
                              : "w-[100px] h-auto"
                          }
                          src={handleImageMess(item.image)}
                        />
                      ) : (
                        <p className="max-w-[50%] break-words bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto">
                          {item.text}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      key={`message ${index}`}
                      className="w-full h-auto my-2 ml-2 flex flex-col items-start"
                    >
                      {item.image ? (
                        <img
                          className={
                            item.image.includes(`dataimage/pngbase64`)
                              ? "w-[50px] h-auto"
                              : "w-[100px] h-auto"
                          }
                          src={handleImageMess(item.image)}
                        />
                      ) : (
                        <p className="max-w-[50%] break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto">
                          {item.text}
                        </p>
                      )}
                    </div>
                  )
                )}
            </>
          )}
          {socketMess &&
            socketMess
              .filter(
                (item) =>
                  item.ReceivedID === user.id || item.SenderID === user.id
              )
              .map((item, index) =>
                item.SenderID === user.id ? (
                  <div
                    key={`message ${index}`}
                    className="w-[98%] h-auto my-2 ml-2 flex flex-col items-end"
                  >
                    {item.Content === "" ? (
                      <img
                        className={
                          item.Image.includes(`dataimage/pngbase64`)
                            ? "w-[50px] h-auto"
                            : "w-[100px] h-auto"
                        }
                        src={handleImageMess(item.Image)}
                      />
                    ) : (
                      <p className="max-w-[50%] break-words bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto">
                        {item.Content}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    key={`message ${index}`}
                    className="w-full h-auto my-2 ml-2 flex flex-col items-start"
                  >
                    {item.Content === "" ? (
                      <img
                        className={
                          item.Image.includes(`dataimage/pngbase64`)
                            ? "w-[50px] h-auto"
                            : "w-[100px] h-auto"
                        }
                        src={handleImageMess(item.Image)}
                      />
                    ) : (
                      <p className="max-w-[50%] break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto">
                        {item.Content}
                      </p>
                    )}
                  </div>
                )
              )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            height: "auto",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "10px 10px 0 10px",
              backgroundColor: "#F4F4F4",
              borderRadius: "15px",
              margin: "0 10px",
              position: "relative",
            }}
          >
            <IconButton>
              <button className="border-none" onClick={handleToggleEmoji}>
                <EmojiEmotionsIcon />
              </button>
            </IconButton>
            <div
              className={
                imageContent !== null ? "w-[100%] h-auto relative" : "hidden"
              }
            >
              <img
                className="w-[100px] h-auto object-fit"
                src={imageContent}
                alt="convert image"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-[18px] h-auto cursor-pointer bg-black rounded-full text-white absolute left-0"
                onClick={() => {
                  setImageContent(null);
                }}
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Type your message..."
              value={inputEmoji ? inputEmoji : messageContent}
              onChange={handleMessageContentChange}
              onKeyUp={handleKeyUp}
            />
            <IconButton>
              <input
                id="file"
                type="file"
                className="hidden m-0"
                onChange={(e) => handleImageChange(e)}
              />
              <label htmlFor="file">
                <AttachFileIcon />
              </label>
            </IconButton>
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="Send message"
              onClick={() => handleButtonSend()}
              className={
                messageContent === "" &&
                imageContent === null &&
                inputEmoji === null
                  ? "text-black"
                  : "text-[#1976d2]"
              }
            >
              <SubdirectoryArrowRightSharpIcon sx={{ cursor: "pointer" }} />
            </IconButton>
            <div
              ref={pickerEmojiRef}
              className="absolute top-[-705%] left-[6%] w-[5px] h-[5px]"
            >
              {isEmoji && (
                <EmojiPicker
                  emojiStyle={EmojiStyle.FACEBOOK}
                  lazyLoadEmojis={true}
                  onEmojiClick={handleClickEmoji}
                />
              )}
            </div>
          </Box>
        </Box>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group
          </Typography>
          <TextField
            fullWidth
            label="Group Name"
            variant="outlined"
            margin="normal"
            value={groupName}
            onChange={handleGroupNameChange}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            value={groupDescription}
            onChange={handleGroupDescriptionChange}
          />
          <List>
            {members?.map((member, index) => (
              <ListItem key={index}>
                <ListItemText primary={member.gmail} secondary={member.role} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveMember(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <TextField
              label="Member Email"
              value={memberEmail}
              onChange={handleMemberEmailChange}
              fullWidth
            />
            <TextField
              label="Member ID"
              value={memberId}
              onChange={handleMemberIdChange}
              fullWidth
            />
            <IconButton onClick={handleAddMember}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateGroup}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default UserGroup;
