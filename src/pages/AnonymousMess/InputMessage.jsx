import { useState, useEffect, useRef, useContext } from 'react'
import {
<<<<<<< HEAD
 TextField,
 IconButton,
 CircularProgress,
 InputBase,
 Box,
} from '@mui/material'
import { AppContext } from '../../context'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import GifIcon from '../../assets/gifIcon.jsx'
import SubdirectoryArrowRightSharpIcon from '@mui/icons-material/SubdirectoryArrowRightSharp'
import ImageLogo from '../../assets/imagelogo.jsx' // Giả định bạn có một component ImageLogo
import api from '../../api' // Giả định bạn đang sử dụng axios cho API

function GiphySearch({ onGifSelect }) {
 const [searchTerm, setSearchTerm] = useState('')
 const [state, setState] = useState({
  gifs: [],
  selectedGif: null,
  loading: false,
  error: null,
 })

 const API_KEY = '3f9X5UA8I0bbK3h9fwysbiEbluBM6JrC'

 const fetchGifs = async (query) => {
  setState({
   gifs: [],
   selectedGif: null,
   loading: true,
   error: null,
  })

  try {
   const response = await fetch(
    `https://api.giphy.com/v1/gifs/${
     query ? 'search' : 'trending'
    }?api_key=${API_KEY}&q=${query || ''}&limit=10`
   )
   const data = await response.json()
   setState({
    gifs: data.data,
=======
  TextField,
  IconButton,
  CircularProgress,
  InputBase,
  Box,
  Button,
} from "@mui/material";
import "./AnonymousMess.css";
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
>>>>>>> lvd
    selectedGif: null,
    loading: false,
    error: null,
   })
  } catch (error) {
   console.error('Error fetching GIFs:', error)
   setState((prev) => ({
    ...prev,
    error: 'Failed to load GIFs. Please try again later.',
    loading: false,
   }))
  }
 }

 const handleSearch = () => {
  fetchGifs(searchTerm.trim())
 }

 useEffect(() => {
  fetchGifs() // Load trending GIFs initially
 }, [])

<<<<<<< HEAD
 const handleGifClick = (gif) => {
  setState((prev) => ({ ...prev, selectedGif: gif }))
  if (onGifSelect) {
   onGifSelect(gif) // Gọi hàm từ parent component để cập nhật payLoadData
  }
 }

 const { gifs, selectedGif, loading, error } = state

 return (
  <div className='max-h-[500px] w-full'>
   <div className='flex flex-row w-full items-center justify-center'>
    <div
     style={{
      display: 'flex',
      alignItems: 'center',
      background: '#999',
      borderRadius: '30px',
      height: '40px',
      margin: '10px 0',
      width: 'fit-content',
      justifyContent: 'center',
      paddingLeft: '10px',
     }}
    >
     <TextField
      type='text'
      value={searchTerm}
      id='standard-basic'
      variant='standard'
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder='Search for GIFs'
      sx={{
       width: '90%',
       border: 'none',
       margin: '0 0 0px 10px',
       input: { color: '#000' },
      }}
     />
     <IconButton disabled={loading}>
      {loading ? (
       <CircularProgress size={24} className='mr-1 my-1' />
      ) : (
       <SearchIcon className='mr-1 my-1' onClick={handleSearch} />
      )}
     </IconButton>
    </div>
   </div>
   <div className=''>
    {error ? (
     <p className='text-center w-full text-red-500'>{error}</p>
    ) : selectedGif ? (
     <img
      key={selectedGif.id}
      src={selectedGif.images.fixed_height.url}
      alt={selectedGif.title}
      onClick={() => handleGifClick(selectedGif)}
      style={{ cursor: 'pointer', margin: '10px', borderRadius: '4px' }}
     />
    ) : gifs.length > 0 ? (
     gifs.map((gif) => (
      <img
       key={gif.id}
       src={gif.images.fixed_height.url}
       alt={gif.title}
       onClick={() => handleGifClick(gif)}
       style={{
        cursor: 'pointer',
        margin: '10px',
        borderRadius: '4px',
       }}
      />
     ))
    ) : (
     <p className='text-center'>loading...</p>
    )}
   </div>
  </div>
 )
}
function InputMessage({ data }) {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [payLoadData, setPayLoadData] = useState({
  idRoom: null,
  idReceive: null,
  content: 'halelugia 1995',
  img: '',
  gif: '',
  type: '',
 })

 if (!data.idRoom && !data.idReceive) return
 //  console.log('Data truyền vào', data)

 const sendMesage = async () => {
  const { idReceive, idRoom, gif, type, img, content } = payLoadData

  const formData = new FormData()
  formData.append('idReceive', idReceive)
  formData.append('idRoom', idRoom)
  formData.append('gif', gif)
  formData.append('type', type)
  formData.append('img', img)
  formData.append('content', content)
  try {
   const response = await fetch(
    `https://samnote.mangasocial.online/message/chat-unknown-image2/${user.id}`,
    {
     method: 'POST',
     body: formData,
    }
   )
   console.log('gửi thành công', response)

   if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
   }
   const data = await response.json()
   console.log('Dữ liệu trả về:', data)
  } catch (err) {
   console.error('Lỗi khi gửi tin nhắn:', err)
  }
 }

 const [fileUploadImage, setFileUploadImage] = useState(null)

 const newfile = new File([''], 'filename')

 const handleGifSelect = (gif) => {
  setPayLoadData((prevData) => ({
   ...prevData,
   idReceive: user.id == data.idReceive ? data.idReceive : data.idSend,
   idRoom: data.idRoom,
   gif: gif.images.fixed_height.url,
   type: 'text',
   //  img: newfile,
  }))

  // sendMesage()
 }

 console.log('payLoadData', payLoadData)

 const inputFileRef = useRef()

 return (
  <div className='h-[300px] bg-black'>
   <div>
    <label htmlFor=''>upload file</label>
    <input type='file' onChange={(e) => console.log(e.target.files[0])} />
   </div>

   <GiphySearch onGifSelect={handleGifSelect} />
   {/* {payLoadData.gif && (
        <div>
          <h3>GIF đã chọn:</h3>
          <img src={payLoadData.gif} alt="Selected GIF" />
        </div>
      )} */}

   <div>
    <input type='file' ref={inputFileRef} />

    <button className='btn btn-danger' onClick={sendMesage}>
     Send
    </button>
   </div>
  </div>
 )
}

export default InputMessage
=======
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
    <div className="bg-white w-[600px] left-[1%] absolute top-0 transform -translate-y-[101%] h-[500px] rounded-[5px] shadow-[0_0_15px_rgba(0,0,0,0.8)]">
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
                className="bg-[#000] text-[#fff] rounded-md w-[25px] h-[25px] flex p-3 items-center justify-center"
                onClick={handleIconClick}
              >
                <AddIcon sx={{ fontSize: "30px" }} />
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
        </div>
      )}
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
  console.log("info truyền vào thanh input để gửi tin nhắn", data);
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
    // Cập nhật payloadData khi data thay đổi
    setPayLoadData((prev) => ({
      ...prev,
      idRoom:
        data.idRoom == undefined ? `${user.id}#${data.idUser}` : data.idRoom,
      idReceive: data.idReceive == undefined ? data.idUser : data.idReceive,
    }));

    handleReload({});
  }, [data, user.id]);
  console.log(
    "info truyền vào thanh inptut để gửi tin nhắn",
    payLoadData.idRoom
  );
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
    console.log(
      "điều kiện để gửi tin nhắn: payLoadData.content" +
        payLoadData.content +
        "gif" +
        payLoadData.gif +
        "img" +
        payLoadData.img
    );

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
    const [num1, num2] = idRoom.split("#").map(Number);

    // Cập nhật idReceive
    const newIdReceive = user.id != num1 ? num1 : num2;

    const formData = new FormData();
    formData.append("idReceive", newIdReceive);
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

      // Reset payload data
      setPayLoadData((prevData) => ({
        ...prevData,
        img: "",
        content: "", // Chỉ đặt lại content
        gif: "",
        // Không reset img ở đây
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
    console.log("gif trả về ", data);
    if (data?.idRoom) {
      const [num1, num2] = data.idRoom.split("#").map(Number);

      setPayLoadData((prevData) => ({
        ...prevData,
        idReceive: user.id !== num1 ? num1 : num2,
        idRoom: data.idRoom,
        gif: gif.images.fixed_height.url,
        type: "gif",
        content: "",
      }));
    } else {
      setPayLoadData((prevData) => ({
        ...prevData,
        idReceive: data?.idUser,
        idRoom: `${user.id}#${data?.idUser}`,
        gif: gif.images.fixed_height.url,
        type: "gif",
        content: "",
      }));
    }

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
    if (data?.idRoom) {
      const [num1, num2] = data.idRoom.split("#").map(Number);
      setPayLoadData((prevData) => ({
        ...prevData,
        idReceive: user.id != num1 ? num1 : num2,
        idRoom: data.idRoom,
        img: image,
        type: "image",
        content: null,
      }));
    } else {
      setPayLoadData((prevData) => ({
        ...prevData,
        idReceive: data?.idUser,
        idRoom: `${user.id}#${data?.idUser}`,
        img: image, // Gán hình ảnh được chọn vào payload
        type: "image",
        content: null,
      }));
    }

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
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",
                  width: "33px",
                  borderRadius: "3px",
                  backgroundColor: "#000",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <CloseIcon />
              </div>
            ) : (
              <GifIcon width={32} height={35} />
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
        <div className="w-[50px]">
          {" "}
          {sending ? (
            <CircularProgress size={24} />
          ) : (
            <SendIcon
              onClick={() => {
                handleSendMessage();
              }}
              sx={{
                cursor:
                  payLoadData.content || payLoadData.gif || payLoadData.img
                    ? "pointer"
                    : "not-allowed",
                color:
                  payLoadData.content || payLoadData.gif || payLoadData.img
                    ? "#0095FF"
                    : "#999",
                fontSize: "40px",
              }}
            />
          )}
        </div>
      </Box>
    </div>
  );
};

export default InputMessage;
>>>>>>> lvd
