import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { AppContext } from "../context";
import api from "../api";

const SearchResults = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  const location = useLocation();
  const { searchValue } = location.state || {};
  const [activeTab, setActiveTab] = useState(1);
  const [loadingSearchUnknowMess, setLoadingSearchUnknowMess] = useState(false);
  const [resultUnknowMessage, setResultUnknowMessage] = useState(null);
  const [loadingSearchUser, setLoadingSearchUser] = useState(false);
  const [resultUser, setResultUser] = useState(null);
  const [loadingSearchAllNote, setLoadingSearchAllNote] = useState(false);
  const [resultAllNote, setResultAllNote] = useState(null);

  const SearchUnknowMess = async () => {
    try {
      setLoadingSearchUnknowMess(true); // Set loading state to true when starting the request
      const res = await api.get(
        `/message/search_unknown_by_text/${user.id}/${searchValue}`
      );
      setResultUnknowMessage(res.data.data);
      console.log("res.data", res.data.data);
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to load search results",
        severity: "error",
      });
    } finally {
      setLoadingSearchUnknowMess(false); // Set loading state to false after request is complete
    }
  };

  const SearchAllNote = async () => {
    try {
      setLoadingSearchAllNote(true); // Set loading state to true when starting the request
      const res = await api.get(`/notes_search?key=${searchValue}`);
      setResultAllNote(res.data.data);
      console.log("res.data.allnote123", res.data.search_note);
      console.log("searchValue", searchValue);
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to load search results",
        severity: "error",
      });
    } finally {
      setLoadingSearchAllNote(false); // Set loading state to false after request is complete
    }
  };

  const SearchUser = async () => {
    const payload = {
      start_name: searchValue,
    };
    try {
      setLoadingSearchUser(true); // Set loading state to true when starting the request
      const res = await api.post(`/group/search_user_by_word`, payload);
      setResultUser(res.data.data);
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to load search results",
        severity: "error",
      });
    } finally {
      setLoadingSearchUser(false); // Set loading state to false after request is complete
    }
  };

  useEffect(() => {
    if (searchValue) {
      SearchUnknowMess();
      SearchUser();
      SearchAllNote();
    }
  }, [searchValue]);

  return (
    <div className="pt-4">
      <div className="flex justify-center">
        <img
          className="w-[50px] h-[50px]"
          src="https://i.ibb.co/XDxcbzf/iamge-Page-Search.png"
          alt="Search Icon"
        />
        <p className="text-2xl font-bold mb-4">Search Results</p>
      </div>

      {/* Tabs for filtering */}
      <div className="flex text-white text-center">
        <span
          onClick={() => setActiveTab(1)}
          className={`flex-1 px-4 py-2 cursor-pointer ${
            activeTab === 1 ? "bg-[#F56852]" : " bg-black"
          }`}
        >
          Everyone's notes
        </span>
        <span
          onClick={() => setActiveTab(2)}
          className={`flex-1 px-4 py-2 cursor-pointer ${
            activeTab === 2 ? "bg-[#F56852]" : " bg-black"
          }`}
        >
          Anonymous chat
        </span>
        <span
          onClick={() => setActiveTab(3)}
          className={`flex-1 px-4 py-2 cursor-pointer ${
            activeTab === 3 ? "bg-[#F56852]" : " bg-black"
          }`}
        >
          All your own
        </span>
        <span
          onClick={() => setActiveTab(4)}
          className={`flex-1 px-4 py-2 cursor-pointer ${
            activeTab === 4 ? "bg-[#F56852]" : " bg-black"
          }`}
        >
          Group chat
        </span>
      </div>

      <div className="bg-[url(/bg-search.png)] min-h-[90vh] text-white bg-cover bg-no-repeat pt-3">
        {/* Content for Tab 1 */}
        {activeTab === 1 &&
          (loadingSearchAllNote ? (
            <div className="flex justify-center">
              <CircularProgress size={24} />
            </div>
          ) : resultAllNote ? (
            <div>
              {/* {resultAllNote.map((item, index) => (
                <div key={index} className="mb-4 flex w-[90%] m-[auto]">
                  {" "}
                  <img
                    src={item.user.avatar}
                    alt="user avatar"
                    className="w-[40px] h-[40px] rounded-full mr-2"
                  />
                  <div className="bg-white text-black rounded-md w-[100%]">
                    {" "}
                    <strong>{item.user.name}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))} */}
            </div>
          ) : (
            <div>No results found for this search.</div>
          ))}

        {/* Content for Tab 2 - Anonymous Chat */}
        {activeTab === 2 &&
          (loadingSearchUnknowMess ? (
            <div className="flex justify-center">
              <CircularProgress size={24} />
            </div>
          ) : resultUnknowMessage ? (
            <div>
              {resultUnknowMessage.map((item, index) => (
                <div key={index} className="mb-4 flex w-[90%] m-[auto]">
                  {" "}
                  <img
                    src={item.user.avatar}
                    alt="user avatar"
                    className="w-[40px] h-[40px] rounded-full mr-2"
                  />
                  <div className="bg-white text-black rounded-md w-[100%]">
                    {" "}
                    <strong>{item.user.name}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No results found for this search.</div>
          ))}

        {/* Content for Tab 3 */}
        {activeTab === 3 &&
          (loadingSearchUser ? (
            <div className="flex justify-center">
              <CircularProgress size={24} />
            </div>
          ) : resultUser ? (
            <div>
              {resultUser.map((item, index) => (
                <div key={index} className="mb-4 flex w-[90%] m-[auto]">
                  {" "}
                  <img
                    src={item.linkAvatar}
                    alt="user avatar"
                    className="w-[40px] h-[40px] rounded-full mr-1"
                  />
                  <div className="bg-white text-black rounded-md w-[100%] flex flex-col p-2">
                    {" "}
                    <strong>{item.userName}</strong>
                    <span>{item.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No results found for this search.</div>
          ))}

        {/* Content for Tab 4 */}
        {activeTab === 4 && <div>Content for Tab 4</div>}
      </div>
    </div>
  );
};

export default SearchResults;
