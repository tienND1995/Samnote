import { Editor } from "@tinymce/tinymce-react";
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import { CreateFolder, DeleteFolder } from "../components/Folder";
import { AppContext } from "../context";
import { format } from "date-fns";

const types = ["text", "checkList"];
const notePublicOptions = ["private", "public"];

const ChecklistComponent = ({ checklistItems, setChecklistItems }) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      setChecklistItems([
        ...checklistItems,
        { content: newItem, status: false },
      ]);
      setNewItem("");
    }
  };

  const handleToggleItem = (index) => {
    const updatedItems = checklistItems.map((item, idx) =>
      idx === index ? { ...item, status: !item.status } : item
    );
    setChecklistItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = checklistItems.filter((_, idx) => idx !== index);
    setChecklistItems(updatedItems);
  };

  return (
    <div className="w-full p-2">
      <h2>Checklist</h2>
      <ul>
        {checklistItems.map((item, index) => (
          <li key={index}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.status}
                  onChange={() => handleToggleItem(index)}
                />
              }
              label={item.content}
            />
            <span onClick={() => handleDeleteItem(index)}>
              <DeleteIcon />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center pl-4">
        <input
          type="text"
          style={{ height: "40px" }}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new list item"
        />
        <span onClick={handleAddItem}>
          <AddIcon />
        </span>
      </div>
    </div>
  );
};

const CreateNote = () => {
  const [type, setType] = useState("text");
  const [title, setTitle] = useState("");
  const [idFolder, setIdFolder] = useState("");
  const [pinned, setPinned] = useState(false);
  const [lock, setLock] = useState("");
  const [remindAt, setRemindAt] = useState(null);
  const [dataText, setDataText] = useState("");
  const [checklistItems, setChecklistItems] = useState([]);
  const [notePublic, setNotePublic] = useState(0);
  const [color, setColor] = useState("");
  const [folder, setUserFolder] = useState(null);
  const [allColor, setAllColor] = useState([]);

  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  console.log("remindAt", remindAt);
  const outputDate = format(new Date(remindAt), "dd/MM/yyyy HH:mm a '+07:00'");

  function getCurrentFormattedDateTime() {
    const date = new Date();

    // Lấy các thành phần của ngày và giờ
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0-11, cần +1
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Xác định AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Giờ 0 thành 12
    const formattedHours = String(hours).padStart(2, "0");

    // Lấy múi giờ
    const timeZoneOffset = -date.getTimezoneOffset();
    const offsetSign = timeZoneOffset >= 0 ? "+" : "-";
    const offsetHours = String(
      Math.floor(Math.abs(timeZoneOffset) / 60)
    ).padStart(2, "0");
    const offsetMinutes = String(Math.abs(timeZoneOffset) % 60).padStart(
      2,
      "0"
    );

    // Tạo chuỗi thời gian định dạng
    const formattedDateTime = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm} ${offsetSign}${offsetHours}:${offsetMinutes}`;

    return formattedDateTime;
  }

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
  }, [user.id]);

  useEffect(() => {
    const getAllColor = async () => {
      try {
        const res = await api.get(`get_all_color`);
        setAllColor(res.data.data);
        console.log("User color", res.data.data);
      } catch (err) {
        console.error("Failed to fetch colors:", err);
      }
    };

    getAllColor();
  }, []);

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  const handleChangeNotePublic = (e) => {
    setNotePublic(e.target.value);
  };

  const handleChangeColor = (e) => {
    setColor(e.target.value);
  };

  const handleSubmit = async () => {
    const payloadData = type === "text" ? dataText : checklistItems;

    const selectedColor = allColor.find((col) => col.id === color);

    const parsedColor = selectedColor
      ? {
          r: parseInt(selectedColor.r),
          g: parseInt(selectedColor.g),
          b: parseInt(selectedColor.b),
          a: 1,
        }
      : { r: 255, g: 255, b: 255, a: 1 };

    const payload = {
      type,
      data: payloadData,
      title: title ? title : "TITLE",
      color: parsedColor,
      idFolder: idFolder ? idFolder : null,
      dueAt: getCurrentFormattedDateTime(),
      pinned,
      lock,
      remindAt: remindAt ? outputDate : null,
      linkNoteShare: "",
      notePublic,
    };

    console.log("payload", payload); // Check payload structure before sending

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

  return (
    <>
      <Box className="max-w mx-auto mt-3">
        <Box className="flex justify-between">
          <h2 className="ml-2 mb-4 uppercase">Create Note</h2>
          <Button
            className="mt-2 mb-5 mr-4"
            variant="contained"
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>

        <Box className="flex flex-wrap">
          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
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
          <TextField
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
            label="Title"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
            <InputLabel id="demo-simple-select-color-label">
              Background-color
            </InputLabel>
            <Select
              labelId="demo-simple-select-color-label"
              id="demo-simple-select-color"
              label="Background-color"
              size="small"
              value={color}
              onChange={handleChangeColor}
            >
              {allColor.map((colorOption) => (
                <MenuItem key={colorOption.id} value={colorOption.id}>
                  {colorOption.name}
                  <span
                    style={{
                      height: "20px",
                      width: "20px",
                      border: "1px solid black",
                      marginLeft: "3px",
                      background: `rgba(${colorOption.r}, ${colorOption.g}, ${colorOption.b})`,
                    }}
                  ></span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
            <InputLabel id="demo-simple-select-folder">Folder</InputLabel>
            <Select
              label="Folder"
              size="small"
              labelId="demo-simple-select-folder"
              id="demo-simple-select"
              value={idFolder}
              onChange={(e) => setIdFolder(e.target.value)}
            >
              {folder &&
                folder.map((data, index) => (
                  <MenuItem key={index} value={data.id}>
                    {data.nameFolder}
                    <DeleteFolder />
                  </MenuItem>
                ))}
              <CreateFolder number={user.id} />
            </Select>
          </FormControl>

          <TextField
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
            label="Lock"
            size="small"
            type="password"
            value={lock}
            onChange={(e) => setLock(e.target.value)}
          />

          <FormControl className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2">
            <InputLabel id="demo-simple-select-notePublic">
              Note Public
            </InputLabel>
            <Select
              label="Note Public"
              size="small"
              labelId="demo-simple-select-notePublic"
              id="demo-simple-select"
              value={notePublic}
              onChange={handleChangeNotePublic}
            >
              {notePublicOptions.map((data, index) => (
                <MenuItem key={index} value={index}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className="flex items-center w-full md:w-1/3 lg:w-1/4 xl:w-1/4 z-50 mx-4 my-2">
            <h6>RemindAt:</h6>
            {/* <DatePicker
              selected={remindAt}
              onChange={(date) => setRemindAt(date)}
              showTimeSelect
              dateFormat="Pp"
            /> */}
            <DatePicker
              selected={remindAt ? remindAt : null}
              onChange={(date) => setRemindAt(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Select a date and time"
              isClearable
            />
          </Box>
          <FormControlLabel
            className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
            label="Pinned"
            control={
              <Checkbox
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
            }
          />
        </Box>
        {type === "text" ? (
          <>
            <h5 className="ml-2">Content</h5>
            <Editor
              apiKey="c9fpvuqin9s9m9702haau5pyi6k0t0zj29nelhczdvjdbt3y"
              value={dataText}
              init={{
                height: "50vh",
                menubar: true,
                statusbar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={(content) => setDataText(content)}
            />
          </>
        ) : (
          <ChecklistComponent
            checklistItems={checklistItems}
            setChecklistItems={setChecklistItems}
          />
        )}
      </Box>
    </>
  );
};

export default CreateNote;
