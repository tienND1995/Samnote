import { useState, forwardRef } from "react";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Sử dụng forwardRef để truyền ref vào input
const PasswordField = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        {...props}
        ref={ref} // Đảm bảo rằng bạn truyền ref ở đây
        type={showPassword ? "text" : "password"}
        style={{ width: "100%", paddingRight: "40px" }}
      />
      <IconButton
        onClick={handleClickShowPassword}
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </div>
  );
});

// Đặt tên cho component để tránh cảnh báo
PasswordField.displayName = "PasswordField";

export default PasswordField;
