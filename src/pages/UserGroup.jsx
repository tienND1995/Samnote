import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context";
import api from "../api";
import { Box, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SubdirectoryArrowRightSharpIcon from "@mui/icons-material/SubdirectoryArrowRightSharp";

const UserGroup = () => {
  const [group, setGroup] = useState(null);
  const [userNotes, setUserNotes] = useState(null);

  const appContext = useContext(AppContext);
  const { user } = appContext;
  // const CurrentDateTime = () => {
  //   const [currentDateTime, setCurrentDateTime] = useState("");

  //   useEffect(() => {
  //     const now = new Date();
  //     const dayOfWeek = now.toLocaleString("en-US", { weekday: "long" });
  //     const day = now.toLocaleString("en-US", { day: "2-digit" });
  //     const month = now.toLocaleString("en-US", { month: "long" });
  //     const year = now.getFullYear();

  //     setCurrentDateTime(`${dayOfWeek}, ${day} ${month} ${year}`);
  //   }, []);

  //   return <div className="font-normal text-xl">{currentDateTime}</div>;
  // };
  useEffect(() => {
    let ignore = false;
    const getGroup = async () => {
      try {
        const res = await api.get(
          // `https://samnote.mangasocial.online/group/all/${user.id}`
          `https://samnote.mangasocial.online/group/all/10`
          // `https://samnote.mangasocial.online/group/messages/10`
        );
        if (!ignore) {
          setGroup(res.data.data);
          setUserNotes(res.data.data);
          console.log(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getGroup();

    return () => {
      ignore = true;
    };
  }, []);
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
            boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.5)               ",
            paddingLeft: "10px",
          }}
        >
          {" "}
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
            <AddIcon sx={{ cursor: "pointer" }} />
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
              {" "}
              <SearchIcon sx={{ marginLeft: "15px", color: "#333" }} />
              <InputBase
                sx={{ ml: 1, flex: 1, color: "#333" }}
                placeholder="Search Messenger"
                inputProps={{ "aria-label": "search google maps" }}
              />
            </Box>
          </div>
        </Box>

        <div style={{ overflow: "hidden", paddingBottom: "100px" }}>
          <div
            style={{
              overflow: "auto",
              height: "541px",
              scrollbarWidth: "none",
            }}
          >
            {group?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  margin: " 20px",
                  color: "text.main",
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    height: "40px",
                    width: "40px",
                    marginRight: "15px",
                  }}
                  src="../public/img/avata.jpg"
                  alt=""
                />
                <div style={{ width: "80%" }}>
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
            ))}
          </div>
        </div>
      </Box>
      <div style={{ borderLeft: "1px solid black" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: " 20px",
            color: "text.main",
            backgroundColor: "bg.main",
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar
              src="../public/img/avata.jpg"
              sx={{ width: "15px", height: "15px" }}
            />
            <Avatar
              src="../public/img/avata.jpg"
              sx={{
                width: "15px",
                height: "15px",
                position: "relative",
                left: "-5%",
              }}
            />
            <Avatar
              src="../public/img/avata.jpg"
              sx={{
                width: "15px",
                height: "15px",
                position: "relative",
                left: "-10%",
              }}
            />
            <Avatar
              src="../public/img/avata.jpg"
              sx={{
                width: "15px",
                height: "15px",
                position: "relative",
                left: "-15%",
              }}
            />
            <Avatar
              src="../public/img/avata.jpg"
              sx={{
                width: "15px",
                height: "15px",
                position: "relative",
                left: "-20%",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              style={{
                height: "40px",
                width: "40px",
                marginRight: "15px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <div>
              <h3 style={{ margin: 0 }}>Groups name</h3>
              <p style={{ margin: 0 }}>last seen 45 minutes ago</p>
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
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>{" "}
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                margin: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "mymes.main",
                color: "#fff",
                textAlign: "right",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>{" "}
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>{" "}
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                margin: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "mymes.main",
                color: "#fff",
                textAlign: "right",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                margin: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "mymes.main",
                color: "#fff",
                textAlign: "right",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                margin: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "mymes.main",
                color: "#fff",
                textAlign: "right",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>{" "}
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "bgmessenger.main",
                textAlign: "left",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
          <div
            style={{
              padding: "10px ",
              display: "flex",
              alignItems: "center",
              flexDirection: "row-reverse",
            }}
          >
            {" "}
            <Avatar
              sx={{
                height: "30px",
                width: "30px",
                margin: "5px",
              }}
              src="../public/img/avata.jpg"
              alt=""
            />
            <Box
              className="content-messenger-left"
              sx={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "mymes.main",
                color: "#fff",
                textAlign: "right",
                padding: "0px 15px 0",
                borderRadius: "10px",
                margin: 0,
              }}
            >
              <p>nội dung tin nhắn</p>
            </Box>
          </div>
        </Box>
        <Box sx={{ backgroundColor: "bgitem.main" }}>
          {" "}
          <Box
            component="form"
            sx={{
              backgroundColor: "item.main",
              display: "flex",
              alignItems: "center",
              border: "1px solid #888",
              borderRadius: "20px",
            }}
          >
            <IconButton sx={{ p: "10px" }}>
              <AttachFileIcon sx={{ cursor: "pointer" }} />
            </IconButton>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Type here..." />
            <IconButton type="button" sx={{ p: "10px" }}>
              <EmojiEmotionsIcon sx={{ cursor: "pointer" }} />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton sx={{ p: "10px" }}>
              <Box
                sx={{
                  width: "30px",
                  height: "30px",
                  fontSize: "5px",
                  color: "text.main",
                  backgroundColor: "text.main",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {" "}
                <SubdirectoryArrowRightSharpIcon
                  sx={{
                    fontSize: "25px",
                    width: "30px",
                    marginLeft: "3px",
                    color: "bgitem.main",
                  }}
                />
              </Box>
            </IconButton>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default UserGroup;
