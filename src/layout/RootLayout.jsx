import { Navigate, Outlet } from "react-router-dom";
import UserPanel from "../components/UserPanel";

const RootLayout = () => {
  const isLogin = JSON.parse(localStorage.getItem("USER"));

  return isLogin ? (
    <section className=" vh-full flex">
      <div className="w-[100px] flex flex-grow-1">
        <UserPanel />
      </div>

      <div className="w-full flex bg-[#3a3f42]">
        <Outlet />
      </div>
    </section>
  ) : (
    <Navigate to="/login" />
  );
};

export default RootLayout;
