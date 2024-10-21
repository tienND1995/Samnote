import { useState, useEffect, useRef, useContext } from "react";
import {
  TextField,
  IconButton,
  CircularProgress,
  InputBase,
  Box,
  Button,
} from "@mui/material";
import "./AnonymousMess.css";
import { useParams, useLocation } from "react-router-dom";
import { AppContext } from "../../context";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import GifIcon from "../../assets/gifIcon.jsx";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ImageLogo from "../../assets/imagelogo.jsx";
import api from "../../api";
import createEmptyImageFile from "../../components/CreateEmptyImageFile"; // Giả định bạn có một component ImageLogo
import AnonymousMessage from "./AnonymousMessage";

const GiphySearch = ({ onGifSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState({
    gifs: [],
    selectedGif: null,
    loading: false,
    error: null,
  });

  const API_KEY = "3f9X5UA8I0bbK3h9fwysbiEbluBM6JrC";

  const fetchGifs = async (query) => {
    setState({
      gifs: [],
      selectedGif: null,
      loading: true,
      error: null,
    });

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/${
          query ? "search" : "trending"
        }?api_key=${API_KEY}&q=${query || ""}&limit=6`
      );
      const data = await response.json();
      setState({
        gifs: data.data,
        selectedGif: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to load GIFs. Please try again later.",
        loading: false,
      }));
    }
  };

  const handleSearch = () => {
    fetchGifs(searchTerm.trim()); // Chỉ tìm kiếm khi nhấn nút
  };

  useEffect(() => {
    fetchGifs(); // Load trending GIFs initially
  }, []);

  const handleGifClick = (gif) => {
    setState((prev) => ({ ...prev, selectedGif: gif }));
    if (onGifSelect) {
      onGifSelect(gif); // Gọi hàm từ parent component để cập nhật payLoadData
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Cập nhật giá trị searchTerm nhưng không gọi fetchGifs
  };

  const { gifs, selectedGif, loading, error } = state;

  return (
    <div className="bg-white w-[50%] xl:w-[600px] left-[1%] absolute top-0 transform -translate-y-[101%] h-[300px] overflow-y-auto  overflow-x-hidden xl:h-[500px] rounded-[5px] shadow-[0_0_15px_rgba(0,0,0,0.8)]">
      <div className="flex flex-row w-full items-center justify-center relative">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#D9D9D9",
            borderRadius: "30px",
            height: "40px",
            margin: "10px 0",
            width: "70%",
            justifyContent: "center",
            paddingLeft: "10px",
          }}
        >
          <TextField
            type="text"
            size="small"
            value={searchTerm}
            id="standard-basic"
            variant="standard"
            onChange={handleInputChange} // Chỉ cập nhật searchTerm
            placeholder="Search for GIFs"
            sx={{
              width: "90%",
              border: "none",
              margin: "0 0 0px 10px",
              input: { color: "#000" },
            }}
          />
          <IconButton disabled={loading}>
            {loading ? (
              <CircularProgress size={24} className="mr-1 my-1" />
            ) : (
              <SearchIcon className="mr-1 my-1" onClick={handleSearch} /> // Gọi fetch khi nhấn nút
            )}
          </IconButton>
        </div>
      </div>
      <div className="">
        {error ? (
          <p className="text-center w-full text-red-500">{error}</p>
        ) : loading ? (
          <p className="text-left text-black mb-[50px] ml-[40px] text-[30px]">
            Loading GIFs...
          </p>
        ) : selectedGif ? (
          <img
            key={selectedGif.id}
            src={selectedGif.images.fixed_height.url}
            alt={selectedGif.title}
            onClick={() => handleGifClick(selectedGif)}
            style={{
              cursor: "pointer",
              margin: "10px",
              borderRadius: "4px",
              width: "200px",
              height: "auto",
            }}
          />
        ) : gifs.length > 0 ? (
          <div className="grid-container">
            {gifs.map((gif) => (
              <div key={gif.id} className="grid-item">
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  onClick={() => handleGifClick(gif)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#000]">No GIFs found.</p>
        )}
      </div>
    </div>
  );
};

const ImageUploader = ({ onImageSelect, onImageRemove, OpenSelectImage }) => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      if (onImageSelect) {
        onImageSelect(file); // Gọi hàm onImageSelect với file gốc
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Kích hoạt input file khi click vào icon
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null); // Xóa file đã chọn
    if (onImageSelect) {
      onImageSelect(null); // Gọi hàm onImageSelect với null
    }
    if (onImageRemove) {
      onImageRemove(); // Gọi hàm onImageRemove nếu có
    }
    // Reset input file value
    fileInputRef.current.value = null; // Đặt lại giá trị của input file
  };

  return (
    <>
      {OpenSelectImage && selectedImageFile && (
        <div className="absolute m-auto px-4 py-4 top-0 transform -translate-y-[101%] bg-white left-0 right-0 w-[95%] rounded-md">
          <div className="relative w-fit flex pl-6 items-center">
            <div className="mr-6">
              <button
                className="bg-[#000] text-[#fff] rounded-md size-[25px] flex p-2 items-center justify-center"
                onClick={handleIconClick}
              >
                <AddIcon className="text-[20px] xl:text-[30px]" />
              </button>
              {/* <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              /> */}
            </div>
            <img
              src={URL.createObjectURL(selectedImageFile)}
              alt="Selected"
              style={{
                marginTop: "10px",
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={handleRemoveImage}
              className="flex items-center justify-center 
              absolute mt-[10px] size-[25px] xl:size-[35px] top-[-10px] right-[-13px]
              rounded-full bg-black text-white border-0 cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
      <div>
        <IconButton sx={{ p: "5px" }} onClick={handleIconClick}>
          <ImageLogo />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </>
  );
};

const InputMessage = ({ data, onReload }) => {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const params = useParams();
  let { pathname } = useLocation();
  let userID = params.id;
  const [status, setStatus] = useState({
    giphySearch: false,
    OpenSelectImage: false,
    sending: false,
  });
  const { giphySearch, OpenSelectImage, sending } = status;

  const [payLoadData, setPayLoadData] = useState({
    idRoom: null, // Khởi tạo giá trị mặc định
    idReceive: null,
    content: "",
    img: null,
    gif: "",
    type: "",
  });

  useEffect(() => {
    let idRoom;
    if (typeof pathname === "string" && pathname.includes("user")) {
      idRoom = `${user.id}#${userID}`;
    } else {
      idRoom = `${userID}#${user.id}`;
    }

    setPayLoadData((prev) => ({
      ...prev,
      idRoom,
      idReceive: userID,
    }));


    handleReload({});
  }, [pathname, userID, user.id]);

  const handleReload = (data) => {
    onReload(data);
  };

  const handleImageRemove = () => {
    setStatus((prev) => ({
      ...prev,
      OpenSelectImage: false,
    }));
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setPayLoadData((prevData) => ({
      ...prevData,
      content: value,
      type: "text",
    }));
  };

  const handleSendMessage = () => {
    // console.log(
    //   "điều kiện để gửi tin nhắn: payLoadData.content" +
    //     payLoadData.content +
    //     "gif" +
    //     payLoadData.gif +
    //     "img" +
    //     payLoadData.img
    // );

    if (payLoadData.content || payLoadData.gif || payLoadData.img) {
      sendMessage();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn không cho Enter xuống dòng
      handleSendMessage();
    }
  };

  const sendMessage = async () => {
    const { idReceive, idRoom, gif, type, img, content } = payLoadData;

    const formData = new FormData();
    formData.append("idReceive", idReceive);
    formData.append("idRoom", idRoom);
    formData.append("gif", gif);
    formData.append("type", type);
    formData.append(
      "img",
      img === "" || img === null ? createEmptyImageFile() : img
    );
    formData.append("content", content);

    try {
      setStatus((prevData) => ({
        ...prevData,
        sending: true,
      }));
      const response = await fetch(
        `https://samnote.mangasocial.online/message/chat-unknown-image2/${user.id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      handleReload(data.message);
      setPayLoadData((prevData) => ({
        ...prevData,
        img: "",
        content: "",
        gif: "",
      }));

      setStatus((prevData) => ({
        ...prevData,
        giphySearch: false,
        OpenSelectImage: false,
      }));

      console.log("Gửi thành công:", data.message);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    } finally {
      setStatus((prevData) => ({
        ...prevData,
        sending: false,
      }));
    }
  };

  const handleGifSelect = (gif) => {
    // console.log("gif trả về ", data);

    setPayLoadData((prevData) => ({
      ...prevData,
      gif: gif.images.fixed_height.url,
      type: "gif",
      content: "",
    }));

    // Đóng ImageUploader khi chọn GIF
    setStatus((prevStatus) => ({
      ...prevStatus,
      giphySearch: true,
      OpenSelectImage: false,
    }));
  };

  // useEffect để gọi sendMessage sau khi payLoadData được cập nhật
  useEffect(() => {
    if (payLoadData.gif && payLoadData.type == "gif") {
      sendMessage();
    }
  }, [payLoadData.gif]);

  const handleImageSelect = (image) => {
    setPayLoadData((prevData) => ({
      ...prevData,
      img: image, // Gán hình ảnh được chọn vào payload
      type: "image",
      content: null,
    }));

    // Đóng GIF khi chọn hình ảnh
    setStatus((prevStatus) => ({
      ...prevStatus,
      giphySearch: false, // Đóng GIF
      OpenSelectImage: true,
    }));
  };

  const handleToggle = (componentName) => {
    setStatus((prevState) => ({
      ...prevState,
      giphySearch:
        componentName === "giphySearch" ? !prevState.giphySearch : false,
      OpenSelectImage:
        componentName === "OpenSelectImage"
          ? !prevState.OpenSelectImage
          : false,
    }));
  };

  return (
    <div className="relative">
      {giphySearch && <GiphySearch onGifSelect={handleGifSelect} />}
      <Box
        className="flex justify-between items-center xl:h-[60px] h-[50px] "
        sx={{
          padding: "10px 10px 0 10px",
          backgroundColor: "#F4F4F4",
        }}
      >
        <Box className="w-[95%] flex items-center">
          <div
            onClick={() => {
              setStatus((prevState) => ({
                ...prevState,
                giphySearch: false,
              }));
            }}
          >
            <ImageUploader
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              OpenSelectImage={OpenSelectImage}
            />
          </div>

          <IconButton
            sx={{
              p: "5px",
              color: !giphySearch ? "#000" : "inherit",
            }}
            onClick={() => {
              handleToggle("giphySearch");
              handleImageRemove();
            }}
          >
            {giphySearch ? (
              <div
                className="flex items-center justify-center
              xl:size-[30px] size-[25px] rounded-[3px] bg-black text-white 
              border-0 cursor-pointer
              "
              >
                <CloseIcon />
              </div>
            ) : (
              <GifIcon />
            )}{" "}
          </IconButton>

          <InputBase
            disabled={giphySearch || OpenSelectImage}
            sx={{ ml: 1, flex: 1, width: "90%" }}
            placeholder="Type your message..."
            value={payLoadData.content} // Gán giá trị cho input
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
          />
        </Box>
        <div className="w-[30px] xl:w-[50px]">
          {" "}
          {sending ? (
            <CircularProgress size={24} />
          ) : (
            <SendIcon
              onClick={() => {
                handleSendMessage();
              }}
              className="xl:text-[40px]"
              sx={{
                cursor:
                  payLoadData.content || payLoadData.gif || payLoadData.img
                    ? "pointer"
                    : "not-allowed",
                color:
                  payLoadData.content || payLoadData.gif || payLoadData.img
                    ? "#0095FF"
                    : "#999",
              }}
            />
          )}
        </div>
      </Box>
    </div>
  );
};

export default InputMessage;
