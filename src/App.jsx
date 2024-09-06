import { useContext } from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import UserPanel from "./components/UserPanel";
import { AppContext } from "./context";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import UserNotes from "./pages/UserNotes";
import Incognito from "./pages/incognito";
import UserSetting from "./pages/UserSetting";
import UserSketch from "./pages/UserSketch";
import UserDustbin from "./pages/UserDustbin";
import UserGroup from "./pages/UserGroup";
import { Alert, Snackbar, Button } from "@mui/material";
import OtherUser from "./pages/OtherUser";
import UserPhoto from "./pages/UserPhoto";
import CreateNote from "./pages/CreateNote";
import SearchResults from "./pages/searchNote";

const publicRoutes = [{ path: "/", element: <Home /> }];

const authRoutes = [{ path: "/login", element: <Login /> }];

const userRoutes = [
  { path: "/other-user/:id", element: <OtherUser /> },
  { path: "/user", element: <UserProfile /> },
  { path: "/user/note", element: <UserNotes /> },
  { path: "/user/setting", element: <UserSetting /> },
  { path: "/user/sketch", element: <UserSketch /> },
  { path: "/user/group", element: <UserGroup /> },
  { path: "/user/dustbin", element: <UserDustbin /> },
  { path: "/user/photo", element: <UserPhoto /> },
  { path: "/user/create-note", element: <CreateNote /> },
  { path: "/user/profile", element: <UserProfile /> },
  { path: "/user/incognito", element: <Incognito /> },
  { path: "/user/search", element: <SearchResults /> },
];

const AppSnackbar = () => {
  const appContext = useContext(AppContext);
  const { snackbar, setSnackbar } = appContext;
  const { isOpen, message, severity } = snackbar;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({ isOpen: false, message: "", severity: "" });
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={1000}
      onClose={handleCloseSnackbar}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

function App() {
  const appContext = useContext(AppContext);
  const { user } = appContext;

  return (
    <BrowserRouter>
      <AppSnackbar />

      <Routes>
        {publicRoutes.map((r) => (
          <Route path={r.path} element={r.element} key={r.path} />
        ))}
        {authRoutes.map((r) => (
          <Route
            path={r.path}
            element={!user ? r.element : <Navigate replace to="/user" />}
            key={r.path}
          />
        ))}
        <Route
          path="/"
          element={user ? <UserPanel /> : <Navigate replace to="/login" />}
        >
          {userRoutes.map((r) => (
            <Route path={r.path} element={r.element} key={r.path} />
          ))}
        </Route>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
