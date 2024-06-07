import axios from "axios";

import { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { SketchPicker } from "react-color";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import { AppContext } from "../context";

const types = ["Text", "CheckList"];
const notePublicOptions = ["public", "Not-public"];
const CreateNote = () => {
  const [type, setType] = useState("Text");
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  const [idFolder, setIdFolder] = useState("");
  const [dueAt, setDueAt] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [lock, setLock] = useState("");
  const [remindAt, setRemindAt] = useState(null);
  // const [linkNoteShare, setLinkNoteShare] = useState("");
  const linkNoteShare = null;
  const [notePublic, setNotePublic] = useState(0);
  const [color, setColor] = useState({ r: "241", g: "112", b: "19", a: "1" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [folder, setUserFolder] = useState(null);
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;

  // const demoSubmit = async (e) => {
  //   e.preventDefault();
  //   const response = await axios.post(
  //     "https://samnote.mangasocial.online/folder/77",
  //     {
  //       nameFolder: "tesst 111111",
  //       idUser: 58,
  //     }
  //   );

  //   console.log(response.data);
  // };

  useEffect(() => {
    let ignore = false;
    const getUserFolder = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/allfolder/${user.id}`
        );
        if (!ignore) {
          setUserFolder(res.data.folder);
          console.log("User folder", res.data.folder);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserFolder();

    return () => {
      ignore = true;
    };
  }, []);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.rgb);
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleChangeNotePublic = (e) => {
    setNotePublic(e.target.value);
  };

  const handleSubmit = async () => {
    let idFolderNumber = idFolder;
    console.log(idFolderNumber);

    const parsedColor = {
      r: parseInt(color.r),
      g: parseInt(color.g),
      b: parseInt(color.b),
      a: parseInt(color.a),
    };

    const payload = {
      type,
      data,
      title,
      color: parsedColor,
      idFolder: idFolderNumber,
      dueAt: dueAt ? dueAt.toISOString() : null,
      pinned,
      lock,
      remindAt: remindAt ? remindAt.toISOString() : null,
      linkNoteShare,
      notePublic,
    };

    try {
      await api.post(`/notes/${user.id}`, payload);
      setSnackbar({
        isOpen: true,
        message: "Created new note successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: "Failed to create note",
        severity: "error",
      });
    }
  };

  // Tình thời đi học vốn như tơ
  // Có hợp có tan chẳng bất ngờ
  // Nhưng sao ta vẫn không quên được
  // Để mãi bây giờ lại làm thơ

  return (
    <>
      {" "}
      <Box className="max-w mx-auto mt-5">
        {/* <RemoveIcon
          className="absolute top-4 right-5 p-1 cursor-pointer  hover:text-red-500"
          onClick={() => {}}
        /> */}
        <Box className="grid grid-cols-3 gap-4">
          <FormControl>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Type"
              size="small"
              value={type}
              onChange={handleChangeType}
            >
              {types.map((type, idx) => (
                <MenuItem key={idx} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* {type === "Text" ? (
            <TextField
              label="Data"
              size="small"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          ) : (
            <>checklist</>
          )} */}
          <TextField
            label="Title"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div
            style={{
              padding: "5px",
              background: "#fff",
              borderRadius: "3px",
              boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              cursor: "pointer",
              display: "flex",
              height: "39px",
            }}
            onClick={handleClick}
          >
            Background-color:
            <div
              style={{
                width: "36px",
                height: "100%",
                marginLeft: "5px",
                borderRadius: "2px",
                background: ` rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              }}
            />
          </div>
          {displayColorPicker ? (
            <div
              style={{
                position: "absolute",
                zIndex: "2",
              }}
            >
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px",
                }}
                onClick={handleClose}
              />
              <SketchPicker color={color} onChange={handleChange} />
            </div>
          ) : null}
          {/* <TextField
          label="idFolder"
          size="small"
          type="number"
          value={idFolder}
          onChange={(e) => setIdFolder(e.target.value)}
        /> */}
          <FormControl>
            <InputLabel id="demo-simple-select-label">Folder</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={idFolder}
              label="Folder"
              onChange={(e) => setIdFolder(e.target.value)}
            >
              {folder &&
                folder.map((data, index) => (
                  <MenuItem key={index} value={data.idFolder}>
                    {data.idFolder}----{data.nameFolder}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <DatePicker
            selected={dueAt}
            onChange={(date) => setDueAt(date)}
            showTimeSelect
            dateFormat="Pp"
          />
          <FormControlLabel
            label="Pinned"
            control={
              <Checkbox
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
            }
          />
          <TextField
            label="Lock"
            size="small"
            type="password"
            value={lock}
            onChange={(e) => setLock(e.target.value)}
          />
          <DatePicker
            selected={remindAt}
            onChange={(date) => setRemindAt(date)}
            showTimeSelect
            dateFormat="Pp"
          />

          {/* <TextField
            label="LinkNoteShare"
            size="small"
            value={linkNoteShare}
            onChange={(e) => setLinkNoteShare(e.target.value)}
          /> */}
          <FormControl>
            <InputLabel id="demo-simple-select-label">Note Public</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="NotePublic"
              size="small"
              value={notePublic}
              onChange={handleChangeNotePublic}
            >
              {notePublicOptions.map((note, idx) => (
                <MenuItem key={idx} value={idx}>
                  {note}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
      {/* <form onSubmit={demoSubmit}>
        <button>submit</button>
      </form> */}
    </>
  );
};

export default CreateNote;
