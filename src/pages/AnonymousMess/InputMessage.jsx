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
import SubdirectoryArrowRightSharpIcon from "@mui/icons-material/SubdirectoryArrowRightSharp";
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
    <div className="max-h-[500px] w-full">
      <div className="flex flex-row w-full items-center justify-center">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#999",
            borderRadius: "30px",
            height: "40px",
            margin: "10px 0",
            width: "fit-content",
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
          <p className="text-center w-full text-red-500">{error}</p>
        ) : selectedGif ? (
          <img
            key={selectedGif.id}
            src={selectedGif.images.fixed_height.url}
            alt={selectedGif.title}
            onClick={() => handleGifClick(selectedGif)}
            style={{ cursor: "pointer", margin: "10px", borderRadius: "4px" }}
          />
        ) : gifs.length > 0 ? (
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
              }}
            />
          ))
        ) : (
          <p className="text-center">loading...</p>
        )}
      </div>
    </div>
  );
}
function InputMessage({ data }) {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [payLoadData, setPayLoadData] = useState({
    idRoom: null,
    idReceive: null,
    content: "",
    img: "",
    gif: "",
    type: "",
  });

  if (!data.idRoom && !data.idReceive) return;
  console.log("Data truyền vào", data);

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
      console.log("gửi thành công", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Dữ liệu trả về:", data);
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
    sendMesage();
  };
  console.log("payload data", payLoadData);
  return (
    <div className="h-[300px] bg-black">
      <GiphySearch onGifSelect={handleGifSelect} />
      {/* {payLoadData.gif && (
        <div>
          <h3>GIF đã chọn:</h3>
          <img src={payLoadData.gif} alt="Selected GIF" />
        </div>
      )} */}
    </div>
  );
}

export default InputMessage;
