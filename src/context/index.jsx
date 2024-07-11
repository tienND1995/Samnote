import { createContext, useState, useEffect, useReducer } from "react";
import { USER } from "../constant";
import axios from "axios";

export const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    severity: "",
  });
  const [chat, dispatch] = useReducer(chatReducer, [
    {
      id: 0,
      Avarta: "",
      name: "",
    },
  ]);
  console.log(chat);

  const addChat = (newChat) => {
    // @ts-ignore
    dispatch({ type: "ADD_CHAT", payload: newChat });
  };

  const removeChat = (index) => {
    // @ts-ignore
    dispatch({ type: "REMOVE_CHAT", payload: index });
  };

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi component mount
    const localUser = localStorage.getItem(USER);
    try {
      const parseUser = JSON.parse(localUser);
      if (parseUser) {
        setUser(parseUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }

    // Đăng ký sự kiện lắng nghe thay đổi trong localStorage
    const handleStorageChange = (event) => {
      if (event.key === USER) {
        try {
          const parseUser = JSON.parse(event.newValue);
          if (parseUser) {
            setUser(parseUser);
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up function để loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Gọi API mỗi 6 giây
    const interval = setInterval(() => {
      axios
        .get(`https://samnote.mangasocial.online/check-status/77`)
        .then((response) => {
          console.log("API called successfully");
        })
        .catch((error) => {
          console.error("Error calling API:", error);
        });
    }, 60000);

    // Clean up function để xóa interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  const addChat = (newChat) => {
    dispatch({ type: "ADD_CHAT", payload: newChat });
  };

  const removeChat = (index) => {
    dispatch({ type: "REMOVE_CHAT", payload: index });
  };

  const updateUserInLocalStorage = (newUserData) => {
    try {
      // Cập nhật dữ liệu mới vào localStorage
      localStorage.setItem(USER, JSON.stringify(newUserData));

      // Cập nhật state `user` ngay tại đây nếu cần
      setUser(newUserData);
    } catch (error) {
      console.error("Error updating user in localStorage:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        snackbar,
        setSnackbar,
        updateUserInLocalStorage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
