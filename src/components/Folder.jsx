import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export const CreateFolder = ({ number }) => {
  const [loadingCreateFolder, setLoadingCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [resultMessage, setResultMessage] = useState(null);
  const [showInputBox, setShowInputBox] = useState(false);

  const handleCreateFolder = async () => {
    try {
      setLoadingCreateFolder(true);
      const response = await api.post(`/folder/${number}`, {
        nameFolder: folderName,
      });
      setResultMessage(response.data.message);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Error creating folder.");
    } finally {
      setLoadingCreateFolder(false);
      setShowInputBox(false);
      setFolderName("");
    }
  };

  return (
    <div>
      <MenuItem onClick={() => setShowInputBox(true)} className="font-semibold">
        + create new folder
      </MenuItem>
      {resultMessage !== null && (
        <Box className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center flex-col">
          <Box className="flex relative items-center justify-center bg-white h-[120px] w-[500px] pb-[50px] rounded-lg">
            {resultMessage}
            <Button
              className="absolute bottom-0"
              variant="contained"
              sx={{ margin: "10px" }}
              onClick={() => setResultMessage(null)}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}
      {showInputBox && (
        <div className="fixed h-[100vh] flex items-center justify-center inset-0 bg-[rgba(0,0,0,0.9)]">
          <div className="bg-white w-[300px] h-[200px] flex items-center justify-center flex-col rounded-md">
            <TextField
              label="Folder Name"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
            <Box>
              <Button
                variant="outlined"
                sx={{ margin: "10px 10px 0 0" }}
                onClick={() => setShowInputBox(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={loadingCreateFolder}
                variant="contained"
                sx={{ margin: "10px 10px 0", width: "90px" }}
                onClick={handleCreateFolder}
              >
                {loadingCreateFolder ? (
                  <CircularProgress size={24} />
                ) : (
                  "Create"
                )}
              </Button>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};

export const DeleteFolder = ({ folderId }) => {
  const [showInputBox, setShowInputBox] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [resultMessage, setResultMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRenameFolder = async () => {
    try {
      setLoading(true);
      const response = await api.patch(`/changefolder/${folderId}`, {
        nameFolder: newFolderName,
      });
      setResultMessage(response.data.message);
    } catch (error) {
      console.error("Error renaming folder:", error);
      alert("Error renaming folder.");
    } finally {
      setLoading(false);
      setShowInputBox(false);
      setNewFolderName("");
    }
  };

  return (
    <div>
      <ModeEditIcon onClick={() => setShowInputBox(true)} />
      {resultMessage !== null && (
        <Box className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center flex-col">
          <Box className="flex relative items-center justify-center bg-white h-[120px] w-[500px] pb-[50px] rounded-lg">
            {resultMessage}
            <Button
              className="absolute bottom-0"
              variant="contained"
              sx={{ margin: "10px" }}
              onClick={() => setResultMessage(null)}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}
      {showInputBox && (
        <div className="fixed h-[100vh] flex items-center justify-center inset-0 bg-[rgba(0,0,0,0.9)]">
          <div className="bg-white w-[300px] h-[200px] flex items-center justify-center flex-col rounded-md">
            <TextField
              label="Folder Name"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
            <Box>
              <Button
                variant="outlined"
                sx={{ margin: "10px 10px 0 0" }}
                onClick={() => setShowInputBox(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                variant="contained"
                sx={{ margin: "10px 10px 0", width: "90px" }}
                onClick={handleRenameFolder}
              >
                {loading ? <CircularProgress size={24} /> : "Rename"}
              </Button>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
};
