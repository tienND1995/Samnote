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
import ImageLogo from "../../assets/imagelogo.jsx"; // Giả định bạn có một component ImageLogo
import api from "../../api"; // Giả định bạn đang sử dụng axios cho API

function GiphySearch({ onGifSelect }) {
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
}

const ImageUploader = ({ onImageSelect, onImageRemove }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setSelectedImage(result);
        if (onImageSelect) {
          onImageSelect(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Mở ô chọn file
  };

  const handleRemoveImage = () => {
    setSelectedImage(null); // Xóa ảnh đã chọn
    if (onImageSelect) {
      onImageSelect(null); // Thông báo cho component cha rằng ảnh đã bị xóa
    }
    if (onImageRemove) {
      onImageRemove(); // Gọi hàm xóa ảnh từ component cha
    }
  };

  return (
    <>
      <div className="absolute mx-2 px-2 top-0 transform -translate-y-[101%] bg-white left-0 right-0 w-full">
        {selectedImage && (
          <div>
            <img
              src={selectedImage}
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
                display: "block",
                marginTop: "10px",
                padding: "5px 10px",
                backgroundColor: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Xóa ảnh
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

function InputMessage({ data }) {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [componentVisibility, setComponentVisibility] = useState({
    giphySearch: false,
    OpenSelectImage: false,
  });
  const { giphySearch, OpenSelectImage } = componentVisibility; //track ra để dùng
  const [payLoadData, setPayLoadData] = useState({
    idRoom: null,
    idReceive: null,
    content: "",
    img: "",
    gif: "",
    type: "",
  });
  const handleImageRemove = () => {
    setComponentVisibility((prev) => ({
      ...prev,
      OpenSelectImage: false, // Đặt OpenSelectImage về false khi ảnh bị xóa
    }));
  };

  const sendMesage = async () => {
    const { idReceive, idRoom, gif, type, img, content } = payLoadData;

    const formData = new FormData();
    formData.append("idReceive", idReceive);
    formData.append("idRoom", idRoom);
    formData.append("gif", gif);
    formData.append("type", type);
    formData.append("img", img);
    formData.append("content", content);
    try {
      const response = await fetch(
        `https://samnote.mangasocial.online/message/chat-unknown-image2/${user.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      // console.log("gửi thành công", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("Dữ liệu trả về:", data);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }

    //
  };

  const handleGifSelect = (gif) => {
    setPayLoadData((prevData) => ({
      ...prevData,
      idReceive: user.id == data.idReceive ? data.idReceive : data.idSend,
      idRoom: data.idRoom,
      gif: gif.images.fixed_height.url,
      type: "gif",
    }));
  };
  const handleImageSelect = (image) => {
    console.log("Image selected:", image);
    setPayLoadData((prevData) => ({
      ...prevData,
      idReceive: user.id == data.idReceive ? data.idReceive : data.idSend,
      idRoom: data.idRoom,
      img: image,
      type: "image",
    }));
    setComponentVisibility((prev) => ({
      ...prev,
      OpenSelectImage: true,
    }));
  };
  console.log("payload data", payLoadData);
  //mở các component

  const handleToggle = (componentName) => {
    setComponentVisibility((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName], // Chỉ toggle component được click
    }));
  };
  console.log("trạng thái ", giphySearch, OpenSelectImage);

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
                OpenSelectImage: true, // Đảm bảo GiphySearch ẩn đi khi mở OpenSelectImage
              }));
            }}
          >
            <ImageUploader
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove} // Truyền hàm xóa ảnh vào
            />
          </div>

          <IconButton
            sx={{ p: "5px" }}
            onClick={() => {
              handleToggle("giphySearch"); // Toggle trạng thái hiển thị GiphySearch
            }}
          >
            <GifIcon width={32} height={35} />
          </IconButton>

          <InputBase
            disabled={giphySearch || OpenSelectImage} // Sử dụng giphySearch để điều kiện
            sx={{ ml: 1, flex: 1, width: "90%" }}
            placeholder="Type your message..."
          />
        </Box>
        <SendIcon
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
}

export default InputMessage;
