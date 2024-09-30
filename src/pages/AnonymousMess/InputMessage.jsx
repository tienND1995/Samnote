import { useState, useEffect, useRef, useContext } from "react";
import {
  TextField,
  IconButton,
  CircularProgress,
  InputBase,
  Box,
} from "@mui/material";
import { AppContext } from "../../context";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import GifIcon from "../../assets/gifIcon.jsx";
import SendIcon from "@mui/icons-material/Send";
import ImageLogo from "../../assets/imagelogo.jsx";
import api from "../../api";
import createEmptyImageFile from "../../components/CreateEmptyImageFile"; // Giả định bạn có một component ImageLogo

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
        }?api_key=${API_KEY}&q=${query || ""}&limit=10`
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
    fetchGifs(searchTerm.trim());
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

  const { gifs, selectedGif, loading, error } = state;

  return (
    <div className="bg-white w-full absolute top-0 transform -translate-y-[100%]">
      <div className="flex flex-row w-full items-center justify-center">
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
            value={searchTerm}
            id="standard-basic"
            variant="standard"
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <SearchIcon className="mr-1 my-1" onClick={handleSearch} />
            )}
          </IconButton>
        </div>
      </div>
      <div className="">
        {error ? (
          // Hiển thị thông báo lỗi nếu có lỗi
          <p className="text-center w-full text-red-500">{error}</p>
        ) : loading ? (
          // Hiển thị trạng thái loading nếu đang tải GIF
          <p className="text-left text-black mb-[50px] ml-[40px] text-[30px]">
            Loading GIFs...
          </p>
        ) : selectedGif ? (
          // Hiển thị GIF đã được chọn nếu có
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
          // Hiển thị danh sách các GIF nếu có dữ liệu
          gifs.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              onClick={() => handleGifClick(gif)}
              style={{
                cursor: "pointer",
                margin: "10px",
                borderRadius: "4px",
                width: "200px",
                height: "auto",
              }}
            />
          ))
        ) : (
          // Trường hợp không có GIF nào được tìm thấy
          <p className="text-center">No GIFs found.</p>
        )}
      </div>
    </div>
  );
};

const ImageUploader = ({ onImageSelect, onImageRemove }) => {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file); // Lưu file gốc vào state
      if (onImageSelect) {
        onImageSelect(file); // Gọi hàm onImageSelect với file gốc
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null); // Xóa file đã chọn
    if (onImageSelect) {
      onImageSelect(null); // Gọi hàm onImageSelect với null
    }
    if (onImageRemove) {
      onImageRemove(); // Gọi hàm onImageRemove nếu có
    }
  };

  return (
    <>
      <div className="absolute mx-2 px-2 top-0 transform -translate-y-[101%] bg-white left-0 right-0 w-full">
        {selectedImageFile && (
          <div className="relative w-fit">
            <img
              src={URL.createObjectURL(selectedImageFile)} // Tạo URL từ file
              alt="Selected"
              style={{
                marginTop: "10px",
                width: "200px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={handleRemoveImage}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                marginTop: "10px",
                height: "35px",
                top: -10,
                right: -13,
                width: "35px",
                borderRadius: "50%",
                backgroundColor: "#000",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>
      <div>
        <IconButton sx={{ p: "5px" }} onClick={handleIconClick}>
          <ImageLogo width={30} height={30} />
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

  const [componentVisibility, setComponentVisibility] = useState({
    giphySearch: false,
    OpenSelectImage: false,
  });
  const { giphySearch, OpenSelectImage } = componentVisibility;

  const [payLoadData, setPayLoadData] = useState({
    idRoom: data.idRoom,
    idReceive: data.idReceive,
    content: "",
    img: null,
    gif: "",
    type: "",
  });

  const handleReload = (data) => {
    onReload(data);
  };

  const handleImageRemove = () => {
    setComponentVisibility((prev) => ({
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

  const sendMesage = async () => {
    const { idReceive, idRoom, gif, type, img, content } = payLoadData;
    const [num1, num2] = idRoom.split("#").map(Number);
    setPayLoadData((prevData) => ({
      ...prevData,
      idReceive: user.id != num1 ? num1 : num2,
    }));
    const formData = new FormData();
    formData.append("idReceive", idReceive);
    formData.append("idRoom", idRoom);
    formData.append("gif", gif);
    formData.append("type", type);
    formData.append("img", img === null ? createEmptyImageFile() : img); // Nếu img là null, tạo file rỗng
    formData.append("content", content);

    try {
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
        content: "",
        img: null,
        gif: "",
      }));
      setComponentVisibility((prevData) => ({
        ...prevData,
        giphySearch: false,
      }));
      handleImageRemove();

      console.log("Gửi thành công:", data.message);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };
  console.log("trạng thái ", giphySearch, OpenSelectImage);

  const handleGifSelect = (gif) => {
    const [num1, num2] = data.idRoom.split("#").map(Number);
    setPayLoadData((prevData) => ({
      ...prevData,
      idReceive: user.id != num1 ? num1 : num2,
      idRoom: data.idRoom,
      gif: gif.images.fixed_height.url,
      type: "gif",
      content: null,
    }));
  };

  const handleImageSelect = (image) => {
    const [num1, num2] = data.idRoom.split("#").map(Number);
    setPayLoadData((prevData) => ({
      ...prevData,
      idReceive: user.id != num1 ? num1 : num2,
      idRoom: data.idRoom,
      img: image, // Gán hình ảnh được chọn vào payload
      type: "image",
      content: null,
    }));
    setComponentVisibility((prev) => ({
      ...prev,
      OpenSelectImage: true,
    }));
  };

  const handleToggle = (componentName) => {
    setComponentVisibility((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName],
    }));
  };

  return (
    <div className="relative">
      {giphySearch && <GiphySearch onGifSelect={handleGifSelect} />}
      <Box
        sx={{
          display: "flex",
          height: "80px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 10px 0 10px",
          backgroundColor: "#F4F4F4",
        }}
      >
        <Box className="w-[95%] flex items-center">
          <div
            onClick={() => {
              setComponentVisibility((prevState) => ({
                ...prevState,
                giphySearch: false,
              }));
            }}
          >
            <ImageUploader
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
            />
          </div>

          <IconButton
            sx={{ p: "5px" }}
            onClick={() => {
              handleToggle("giphySearch");
              handleImageRemove();
            }}
          >
            <GifIcon width={32} height={35} />
          </IconButton>

          <InputBase
            disabled={giphySearch || OpenSelectImage}
            sx={{ ml: 1, flex: 1, width: "90%" }}
            placeholder="Type your message..."
            value={payLoadData.content} // Gán giá trị cho input
            onChange={handleInputChange}
          />
        </Box>
        <SendIcon
          onClick={sendMesage}
          sx={{
            cursor: "pointer",
            color: "#0095FF",
            fontSize: "40px",
            width: "6%",
          }}
        />
      </Box>
    </div>
  );
};
export default InputMessage;
