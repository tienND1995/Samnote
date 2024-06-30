import { useState, useEffect, useContext } from "react";
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

const UserGroup = () => {
  const [group, setGroup] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  const appContext = useContext(AppContext);
  const { setSnackbar, user, chat } = appContext;
  console.log(chat);
  const [socket, setSocket] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleGroupDescriptionChange = (e) =>
    setGroupDescription(e.target.value);
  const handleMemberIdChange = (e) => setMemberId(e.target.value);
  const handleMemberEmailChange = (e) => setMemberEmail(e.target.value);
  const handleMessageContentChange = (e) => setMessageContent(e.target.value);

  // Kết nối tới server Socket.IO khi component được tạo ra
  useEffect(() => {
    const newSocket = io("https://samnote.mangasocial.online");
    console.log(newSocket);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to socket.IO server", newSocket.id);
    });

    return () => {
      newSocket.disconnect(); // Ngắt kết nối khi component bị xoá
    };
  }, [user.id]);

  const handleGroupClick = (group) => {
    console.log(group);
    setSelectedGroup(group);
  };

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

  const sendMessage = (roomId, messageData) => {
    if (socket) {
      socket.emit("send_message", roomId, messageData); // Gửi sự kiện "send_message" tới server

      console.log("Message sent:", messageData);

      // Xử lý logic khi tin nhắn được gửi đi
      // Ví dụ: cập nhật giao diện ngay lập tức
    } else {
      console.error("Socket.io not initialized.");
      // Xử lý khi socket chưa được khởi tạo
    }
  };

  useEffect(() => {
    const getGroup = async () => {
      try {
        const res = await api.get(`/group/all/${user.id}`);
        setGroup(res.data.data);
        console.log("group", res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    getGroup();
  }, [user.id]);

  return (
    <div
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
              {chat.slice(1).map((item, index) => {
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
                    onClick={() => handleGroupClick(item)}
                  >
                    <Avatar
                      src={item.Avarta}
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
                        {item.name}
                      </strong>
                      <p
                        style={{
                          padding: 0,
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {/* {item.describe} */}
                        {item.id}
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

      <div style={{ borderLeft: "1px solid black" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
            color: "text.main",
            backgroundColor: "bg.main",
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar
              style={{
                height: "40px",
                width: "40px",
                marginRight: "15px",
              }}
              src="../public/groupImg.png"
              alt=""
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              {selectedGroup && (
                <>
                  <h3 style={{ margin: 0 }}>{selectedGroup.name}</h3>
                  <p style={{ margin: 0 }}>{selectedGroup.describe}</p>
                </>
              )}
            </div>
          </div>
          <MoreHorizIcon />
        </Box>
        <Box
          sx={{
            backgroundColor: "bgitem.main",
            height: "515px",
            overflow: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {/* Đây là ví dụ về cách hiển thị tin nhắn, bạn cần thay đổi để hiển thị tin nhắn thực tế */}
          {/* Đã cập nhật để hiển thị tin nhắn từ server */}
          {selectedGroup && (
            <Box>
              {selectedGroup.messages?.map((message, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection:
                      message.sender.id === user.id ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      height: "30px",
                      width: "30px",
                      margin: "5px",
                    }}
                    src={message.sender.avatar}
                    alt=""
                  />
                  <Box
                    className="content-messenger-left"
                    sx={{
                      height: "fit-content",
                      width: "fit-content",
                      backgroundColor:
                        message.sender.id === user.id
                          ? "mymes.main"
                          : "bgmessenger.main",
                      color: message.sender.id === user.id ? "#fff" : "#000",
                      textAlign:
                        message.sender.id === user.id ? "right" : "left",
                      padding: "0px 15px 0",
                      borderRadius: "10px",
                      margin: 0,
                    }}
                  >
                    <p>{message.content}</p>
                  </Box>
                </div>
              ))}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            height: "60px",
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
            }}
          >
            <IconButton sx={{ p: "10px" }}>
              <EmojiEmotionsIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Type your message..."
              value={messageContent}
              onChange={handleMessageContentChange}
            />
            <IconButton sx={{ p: "10px" }}>
              <AttachFileIcon />
            </IconButton>
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="Send message"
              onClick={() => {
                if (selectedGroup) {
                  const messageData = {
                    idSend: user.id,
                    idReceive: selectedGroup.id,
                    type: "text", // Giả sử loại tin nhắn là text
                    state: "",
                    content: messageContent,
                  };

                  sendMessage(
                    `send_message/${user.id}${selectedGroup.id}`,
                    messageData
                  );
                }
              }}
            >
              <SubdirectoryArrowRightSharpIcon sx={{ cursor: "pointer" }} />
            </IconButton>
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
