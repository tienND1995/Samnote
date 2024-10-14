import { Navigate, Outlet } from "react-router-dom";
import UserPanel from "../share/UserPanel";

const RootLayout = () => {
  const isLogin = JSON.parse(localStorage.getItem("USER"));

  return isLogin ? (
    <section className="w-full vh-100 flex flex-col lg:flex-row">
      <div className="lg:w-[100px] w-full static z-[1000]">
        <UserPanel />
      </div>
      <div className="w-full flex flex-grow-1 mt-[100px] lg:mt-0">
        <Outlet />
      </div>
    </section>
  ) : (
    <Navigate to="/login" />
  );
};

export default RootLayout;
