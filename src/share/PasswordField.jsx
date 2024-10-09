import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PasswordField = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      {...props}
      sx={{ width: "300px" }}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleClickShowPassword}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        ),
      }}
      // Truyền tất cả các props còn lại vào đây
    />
  );
};

export default PasswordField;
