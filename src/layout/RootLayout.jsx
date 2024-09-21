import { Navigate, Outlet } from "react-router-dom";
import UserPanel from "../components/UserPanel";

const RootLayout = () => {
  const isLogin = JSON.parse(localStorage.getItem("USER"));

  return isLogin ? (
    <section className="vh-100 flex">
      <div className="w-[100px] h-[100%] flex flex-grow-1">
        <UserPanel />
      </div>

      <div className="w-full flex overflow-y-auto">
        <Outlet />
      </div>
    </section>
  ) : (
    <Navigate to="/login" />
  );
};

export default RootLayout;
