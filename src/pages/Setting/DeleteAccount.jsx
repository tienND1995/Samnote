import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material"; // Nếu bạn sử dụng @mui/material
import Swal from "sweetalert2";
import PasswordField from "../../share/PasswordField"; // Đảm bảo đường dẫn chính xác
import { fetchApiSamenote } from "../../utils/fetchApiSamnote";
import { SettingDeleteAccountSchema } from "../../utils/schema";
import { joiResolver } from "@hookform/resolvers/joi";

const DeleteAccount = ({ info }) => {
  console.log("info", info);

  const [loading, setLoading] = useState({
    loadingDeleteAccount: false,
  });
  const { loadingDeleteAccount } = loading;
  const [openDeleteTab, setOpenDeleteTab] = useState(false);

  // Khai báo form cho việc xóa tài khoản
  const {
    handleSubmit: handleDeleteAccount,
    register: registerDeleteAccount,
    formState: { errors: errorsDeleteAccount },
  } = useForm({
    resolver: joiResolver(SettingDeleteAccountSchema),
    defaultValues: {
      password: "",
      user_name: "",
    },
  });

  const deleteAccount = (data) => {
    const payload = {
      user_name: data.user_name,
      password: data.password,
    };

    console.log("đã xóa", payload);
    setLoading((prev) => ({ ...prev, loadingDeleteAccount: true }));
    fetchApiSamenote("post", `/user/${info.id}`, payload)
      .then((response) => {
        if (response?.error) {
          console.log("trả về ");
          Swal.fire({
            title: "Error!",
            text: response.error,
            icon: "error",
          });
        } else {
          console.log("trả về ", response);
          if (response?.status === 400) {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: response.message,
              icon: "success",
            });
            setUser(response);
          }
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, loadingDeleteAccount: false }));
      });
  };

  return (
    <div>
      {/* Nút mở form xóa tài khoản */}
      <button
        type="button"
        onClick={() => setOpenDeleteTab((prev) => !prev)}
        className="btn btn-danger"
      >
        Delete account
      </button>

      {/* Hiển thị form xóa tài khoản khi openDeleteTab = true */}
      {openDeleteTab && (
        <div className="bg-[rgba(153,153,153,0.6)] fixed top-0 left-0 bottom-0 right-0 text-white z-[100] flex items-center justify-center">
          <div className="bg-black px-4 py-5 gap-3 flex flex-col rounded-lg">
            <h5>Delete this account?</h5>
            <span>
              *Confirm both passwords to delete the account permanently.
            </span>{" "}
            <form
              action="submit"
              className="flex gap-3 flex-col"
              onSubmit={handleDeleteAccount(deleteAccount)}
            >
              {" "}
              <div className="flex gap-3 flex-row">
                {" "}
                <div className="flex flex-col">
                  {" "}
                  <TextField
                    className=" form-control w-[300px] bg-white rounded-md"
                    label="User Name..."
                    placeholder="Confim your user name"
                    {...registerDeleteAccount("user_name")}
                  />
                  {errorsDeleteAccount?.user_name && (
                    <span className="text-red-400 mt-3">
                      {errorsDeleteAccount.user_name.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {" "}
                  <PasswordField
                    className=" form-control w-[300px] bg-white rounded-md"
                    label="Password..."
                    placeholder="Confim your password"
                    {...registerDeleteAccount("password")}
                  />
                  {errorsDeleteAccount?.password && (
                    <span className="text-red-400">
                      {errorsDeleteAccount.password.message}
                    </span>
                  )}
                  forgot password
                </div>
              </div>
              <div className="flex w-full justify-end gap-3 mt-7">
                {" "}
                <button type="submit" className="btn btn-danger">
                  Delete account
                </button>
                <button
                  type="reset"
                  onClick={() => {
                    openDeleteAccount();
                  }}
                  className="btn bg-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
