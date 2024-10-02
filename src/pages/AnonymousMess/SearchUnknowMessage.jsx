// import React, { useState, useContext } from "react";
// import {
//   Box,
//   TextField,
//   IconButton,
//   CircularProgress,
//   Typography,
//   Avatar,
//   Button,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import CloseIcon from "@mui/icons-material/Close";
// import { AppContext } from "../../context";
// import api from "../../api";
// import "./AnonymousMess.css";

// const SearchUnknowMessage = () => {
//   const appContext = useContext(AppContext);
//   const { user } = appContext;
//   const [state, setState] = useState({
//     searchData: "",
//     dataSearch: null,
//     loading: false,
//     status: false,
//   });

//   const handleSearchChange = (event) => {
//     setState({ ...state, searchData: event.target.value });
//   };

//   const SearchMessage = async () => {
//     try {
//       setState({ ...state, loading: true });

//       // Tạo payload cho body request
//       const payload = {
//         start_name: state.searchData, // Giả sử state.searchData chứa giá trị bạn muốn tìm kiếm
//       };

//       // Gửi request POST đến API
//       const res = await api.post(
//         "https://samnote.mangasocial.online/group/search_user_by_word",
//         payload
//       );

//       // Cập nhật state với dữ liệu trả về

//       setState({
//         ...state,
//         dataSearch: res.data.data,
//         loading: false,
//         status: true,
//       });

//       console.log("rés trả về của tìm kiếm", res);
//     } catch (err) {
//       console.error(err);
//       setState((prevState) => ({ ...prevState, loading: false })); // Đảm bảo loading được tắt ngay cả khi có lỗi
//     }
//   };

//   const clearSearch = () => {
//     setState({ ...state, status: false });
//   };

//   const handleClick = (event) => {
//     event.stopPropagation(); // Ngăn sự kiện click truyền lên cha
//   };

//   const { searchData, dataSearch, loading, status } = state;
//   console.log("trạng thái hiện tại ", searchData, dataSearch, loading, status);

//     return (
//       <Box>
//         {/* Search Input Box */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             background: "#fff",
//             borderRadius: "30px",
//             height: "60px",
//             margin: "10px auto",
//             width: "90%",
//             justifyContent: "center",
//           }}
//         >
//           <TextField
//             id="input-with-sx"
//             variant="standard"
//             placeholder="Search messenger"
//             value={searchData}
//             onChange={handleSearchChange}
//             sx={{
//               width: "90%",
//               margin: "0 0 0px 15px",
//               input: { color: "#000" },
//             }}
//             InputLabelProps={{ style: { color: "#000" } }}
//           />
//           <IconButton disabled={loading} onClick={SearchMessage}>
//             {loading ? <CircularProgress size={24} /> : <SearchIcon />}
//           </IconButton>
//         </Box>
//         {/* Search Results */}
//         {status && (
//           <div
//             className="absolute top-0 left-0 right-0 bottom-0 z-[100]"
//             style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
//             onClick={clearSearch}
//           >
//             <div
//               className="pb-[30px] max-h-[65vh] w-[400px] overflow-hidden absolute bg-white px-1 z-[10] rounded-md left-[100px] top-20"
//               onClick={handleClick}
//             >
//               <div className="py-[15px] px-[10px] flex items-center justify-between">
//                 <h2 className="text-black capitalize">search user</h2>
//                 <CloseIcon
//                   className="bg-black cursor-pointer"
//                   onClick={clearSearch}
//                 />
//               </div>
//               <div className="py-[15px] px-[10px] flex items-center justify-between">
//                 <TextField
//                   id="outlined-basic"
//                   placeholder="User Name"
//                   value={searchData}
//                   onChange={handleSearchChange}
//                   sx={{
//                     width: "90%",
//                     margin: "0 0 0px 15px",
//                     input: { color: "#000" },
//                   }}
//                   InputLabelProps={{ style: { color: "#000" } }}
//                 />
//                 <IconButton disabled={loading} onClick={SearchMessage}>
//                   {loading ? (
//                     <CircularProgress size={24} className="w-[100px]" />
//                   ) : (
//                     <Button variant="contained" className="bg-black w-[100px]">
//                       Search
//                     </Button>
//                   )}
//                 </IconButton>
//               </div>
//               <div className="overflow-auto h-[500px] scrollbar pb-4">
//                 {dataSearch !== undefined ? ( // Kiểm tra xem dataSearch có phần tử hay không
//                   dataSearch.map((item) => (
//                     <Box
//                       key={item.idUser}
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         borderRadius: "10px",
//                         margin: "5px 0px",
//                         padding: "5px",
//                         color: "#000",
//                         // backgroundColor: "#56565DCC",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center" }}>
//                         <Avatar
//                           sx={{
//                             width: "50px",
//                             height: "50px",
//                             margin: "4px",
//                           }}
//                           src={item.linkAvatar}
//                         />
//                         <Box sx={{ marginLeft: "10px" }}>
//                           <Typography variant="body1">{item.username}</Typography>
//                           <Typography
//                             sx={{
//                               overflow: "hidden",
//                               width: "140px",
//                               whiteSpace: "nowrap",
//                               textOverflow: "ellipsis",
//                               fontSize: "20px",
//                               fontWeight: "700",
//                             }}
//                           >
//                             {item.userName}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Button variant="contained" className="bg-[#F56852]">
//                         Chat
//                       </Button>
//                     </Box>
//                   ))
//                 ) : (
//                   <Typography
//                     variant="body2"
//                     sx={{ margin: "20px 0", color: "black" }}
//                   >
//                     No chat messages available.
//                   </Typography>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </Box>
//     );
//   };

// export default SearchUnknowMessage;
import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../context";
import api from "../../api";
import "./AnonymousMess.css";

const SearchUnknowMessage = ({ onUserSelect }) => {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [state, setState] = useState({
    searchData: "",
    dataSearch: null,
    loading: false,
    status: false,
  });

  const handleSearchChange = (event) => {
    setState({ ...state, searchData: event.target.value });
  };

  const SearchMessage = async () => {
    try {
      setState({ ...state, loading: true });

      // Tạo payload cho body request
      const payload = {
        start_name: state.searchData, // Giả sử state.searchData chứa giá trị bạn muốn tìm kiếm
      };

      // Gửi request POST đến API
      const res = await api.post(
        "https://samnote.mangasocial.online/group/search_user_by_word",
        payload
      );

      // Cập nhật state với dữ liệu trả về
      setState({
        ...state,
        dataSearch: res.data.data,
        loading: false,
        status: true,
      });

      console.log("rés trả về của tìm kiếm", res);
    } catch (err) {
      console.error(err);
      setState((prevState) => ({ ...prevState, loading: false })); // Đảm bảo loading được tắt ngay cả khi có lỗi
    }
  };

  const clearSearch = () => {
    setState({ ...state, status: false });
  };

  const handleClick = (event) => {
    event.stopPropagation(); // Ngăn sự kiện click truyền lên cha
  };

  const { searchData, dataSearch, loading, status } = state;

  return (
    <Box>
      {/* Search Input Box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: "30px",
          height: "60px",
          margin: "10px auto",
          width: "90%",
          justifyContent: "center",
        }}
      >
        <TextField
          id="input-with-sx"
          variant="standard"
          placeholder="Search messenger"
          value={searchData}
          onChange={handleSearchChange}
          sx={{
            width: "90%",
            margin: "0 0 0px 15px",
            input: { color: "#000" },
          }}
          InputLabelProps={{ style: { color: "#000" } }}
        />
        <IconButton disabled={loading} onClick={SearchMessage}>
          {loading ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>

      {/* Search Results */}
      {status && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 z-[100]"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={clearSearch}
        >
          <div
            className="pb-[30px] max-h-[65vh] w-[400px] overflow-hidden absolute bg-white px-1 z-[10] rounded-md left-[100px] top-20"
            onClick={handleClick}
          >
            <div className="py-[15px] px-[10px] flex items-center justify-between">
              <h2 className="text-black capitalize">search user</h2>
              <CloseIcon
                className="bg-black cursor-pointer"
                onClick={clearSearch}
              />
            </div>
            <div className="py-[15px] px-[10px] flex items-center justify-between">
              <TextField
                id="outlined-basic"
                placeholder="User Name"
                value={searchData}
                onChange={handleSearchChange}
                sx={{
                  width: "90%",
                  margin: "0 0 0px 15px",
                  input: { color: "#000" },
                }}
                InputLabelProps={{ style: { color: "#000" } }}
              />
              <IconButton disabled={loading} onClick={SearchMessage}>
                {loading ? (
                  <CircularProgress size={24} className="w-[100px]" />
                ) : (
                  <Button variant="contained" className="bg-black w-[100px]">
                    Search
                  </Button>
                )}
              </IconButton>
            </div>
            <div className="overflow-auto h-[500px] scrollbar pb-4">
              {dataSearch && dataSearch.length > 0 ? (
                dataSearch.map((item) => (
                  <Box
                    key={item.idUser}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "10px",
                      margin: "5px 0px",
                      padding: "5px",
                      color: "#000",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: "50px",
                          height: "50px",
                          margin: "4px",
                        }}
                        src={item.linkAvatar}
                      />
                      <Box sx={{ marginLeft: "10px" }}>
                        <Typography variant="body1">{item.username}</Typography>
                        <Typography
                          sx={{
                            overflow: "hidden",
                            width: "140px",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontSize: "20px",
                            fontWeight: "700",
                          }}
                        >
                          {item.userName}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      className="bg-[#F56852]"
                      onClick={() => {
                        onUserSelect(item); // Gọi hàm truyền thông tin user
                        clearSearch(); // Xóa tìm kiếm
                      }}
                    >
                      Chat
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ margin: "20px 0", color: "black" }}
                >
                  No chat messages available.
                </Typography>
              )}
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default SearchUnknowMessage;
