import { useState, forwardRef } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Sử dụng forwardRef để truyền ref vào TextField
const PasswordField = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      {...props}
      inputRef={ref} // Đảm bảo rằng bạn truyền ref ở đây
      sx={{ width: "300px" }}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleClickShowPassword}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
    />
  );
});

// Đặt tên cho component để tránh cảnh báo
PasswordField.displayName = "PasswordField";

export default PasswordField;
