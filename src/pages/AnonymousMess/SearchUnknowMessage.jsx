import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../context";
import api from "../../api";

const SearchUnknowMessage = () => {
  const appContext = useContext(AppContext);
  const { user } = appContext;
  const [state, setState] = useState({
    searchData: "",
    dataSearch: null,
    loading: false,
  });

  const handleSearchChange = (event) => {
    setState({ ...state, searchData: event.target.value });
  };

  const SearchMessage = async () => {
    try {
      setState({ ...state, loading: true });
      const res = await api.get(
        `/message/search_unknown_by_text/${user.id}/${state.searchData}`
      );
      setState({ ...state, dataSearch: res.data, loading: false });
    } catch (err) {
      console.error(err);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const clearSearch = () => {
    setState({ ...state, dataSearch: null });
  };

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
          value={state.searchData}
          onChange={handleSearchChange}
          sx={{
            width: "90%",
            margin: "0 0 0px 15px",
            input: { color: "#000" },
          }}
          InputLabelProps={{ style: { color: "#000" } }}
        />
        <IconButton disabled={state.loading} onClick={SearchMessage}>
          {state.loading ? <CircularProgress size={24} /> : <SearchIcon />}
        </IconButton>
      </Box>

      {/* Search Results */}
      {state.dataSearch && (
        <Box className="max-h-[65vh] min-w-[100%] overflow-auto absolute bg-white px-1 z-[10] rounded-xl left-[50%] transform -translate-x-1/2 py-[30px]">
          <CloseIcon
            className="bg-black fixed z-20 right-2 top-2 cursor-pointer"
            onClick={clearSearch}
          />
          {state.dataSearch.status === 200 ? (
            state.dataSearch.data.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  margin: "5px 0px",
                  padding: "5px",
                  backgroundColor: "#56565DCC",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: "40px",
                      height: "40px",
                      margin: "4px",
                    }}
                    src={item.user.avatar}
                  />
                  <Box sx={{ marginLeft: "10px" }}>
                    <Typography variant="body1">
                      {item.user.username}
                    </Typography>
                    <Typography
                      sx={{
                        overflow: "hidden",
                        width: "140px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      variant="body2"
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
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
        </Box>
      )}
    </Box>
  );
};

export default SearchUnknowMessage;
