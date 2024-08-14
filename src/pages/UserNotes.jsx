import EditNoteIcon from "@mui/icons-material/EditNote";
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
  CircularProgress,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api";
import { AppContext } from "../context";
import { format } from "date-fns";
import Folder from "../components/Folder";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const Checklist = ({ data }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleChange = (index) => {
    const updatedItems = [...items];
    updatedItems[index].status = !updatedItems[index].status;
    setItems(updatedItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <input
            style={{ marginRight: "5px" }}
            type="checkbox"
            checked={item.status}
            onChange={() => handleChange(index)}
          />
          {item.content}
        </div>
      ))}
    </div>
  );
};

const notePublicOptions = ["private", "public"];
const ChecklistComponent = ({ checklistItems, setChecklistItems, data }) => {
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (data) {
      setChecklistItems(data);
    }
  }, [data, setChecklistItems]);

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
          placeholder="  Add a new list item"
        />
        <span onClick={handleAddItem}>
          <AddIcon />
        </span>
      </div>
    </div>
  );
};

export default function UserNotes() {
  const [type, setType] = useState(""); // Add state for type
  const [title, setTitle] = useState("");
  const [idFolder, setIdFolder] = useState(null);
  const [dueAt, setDueAt] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [lock, setLock] = useState("");
  const [remindAt, setRemindAt] = useState(null);
  const [data, setData] = useState("");
  const [notePublic, setNotePublic] = useState(0);
  const [color, setColor] = useState({ r: "255", g: "255", b: "255", a: "1" });
  const [folder, setUserFolder] = useState([]);
  const [note, setUserNote] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [noteEdit, setNoteEdit] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [allColor, setAllColor] = useState([]);
  const [reload, setReload] = useState(0);
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  console.log("color", color);
  useEffect(() => {
    let ignore = false;
    const getUserFolder = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/allfolder/${user.id}`
        );
        if (!ignore) {
          setUserFolder(res.data.folder.reverse());
          console.log("Folder", folder);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserFolder();

    return () => {
      ignore = true;
    };
  }, [user.id, reload]);

  useEffect(() => {
    let ignore = false;
    const getUserNote = async () => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/notes/${user.id}`
        );
        if (!ignore) {
          const filteredNotes = res.data.notes.filter(
            (note) =>
              note.type === "text" ||
              note.type === "checkList" ||
              note.type === "checklist"
          );
          setUserNote(filteredNotes);
          console.log(filteredNotes);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserNote();

    return () => {
      ignore = true;
    };
  }, [user.id, updateTrigger]);

  const handleReload = () => {
    setReload((prev) => prev + 1);
  };

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

  const handleChangeNotePublic = (e) => {
    setNotePublic(e.target.value);
  };

  const handleEditorChange = (content) => {
    setData(content);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleSubmit = async (value) => {
    const payloadData = type === "text" ? data : checklistItems;
    const selectedColor = allColor.find((col) => col.id === color);
    console.log("selectedColor", selectedColor);
    const parsedColor = {
      r: parseInt(selectedColor.r),
      g: parseInt(selectedColor.g),
      b: parseInt(selectedColor.b),
      a: 1,
    };

    const payload = {
      type,
      data: payloadData,
      title,
      color: parsedColor,
      idFolder,
      dueAt: format(new Date(dueAt), "dd/MM/yyyy HH:mm a '+07:00'"),
      pinned,
      lock,
      remindAt: remindAt
        ? format(new Date(remindAt), "dd/MM/yyyy HH:mm a '+07:00'")
        : null,
      linkNoteShare: "",
      notePublic,
    };

    try {
      await api.patch(`/notes/${value}`, payload);
      setSnackbar({
        isOpen: true,
        message: "Update note successfully ",
        severity: "success",
      });

      setUpdateTrigger((prev) => prev + 1); // Trigger the useEffect to fetch notes again
      console.log("payload", payload);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message;
      setSnackbar({
        isOpen: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const deleteNote = async (index) => {
    try {
      await api.delete(`https://samnote.mangasocial.online/notes/${index}`);
      setSnackbar({
        isOpen: true,
        message: `Remove note successfully ${index}`,
        severity: "success",
      });
      console.log("index", index);
      setUpdateTrigger((prev) => prev + 1); // Update the state to trigger useEffect
    } catch (err) {
      console.error(err);
      setSnackbar({
        isOpen: true,
        message: `Failed to remove note ${index}`,
        severity: "error",
      });
    }
  };

  const handleGetValue = (info) => {
    setNoteEdit(info);
    setType(info.type);
    setTitle(info.title);
    setIdFolder(info.idFolder);
    setDueAt(info.dueAt);
    setPinned(info.pinned);
    setLock(info.lock);
    setRemindAt(new Date(info.remindAt));
    setData(info.data);
    setNotePublic(info.notePublic);
    setColor(info.color);
    console.log("now color", info.color);
    console.log("idFolder", info.idFolder);
  };
  return (
    <Box className="grid grid-cols-[350px_1fr]">
      <div className="mx-3 overflow-y-auto h-[100vh] border-r border-black border-solid">
        <Box className="flex justify-between items-center mt-3">
          <div className="flex">
            <EditNoteIcon />
            <p className="m-0 p-0">Edit Note</p>
          </div>
          <p className="m-0 py-0 pr-2">{note.length} note</p>
        </Box>
        {note && note.length !== 0 ? (
          note.map((info, index) => (
            <div
              key={index}
              className="my-1 p-3 rounded-xl "
              style={{
                border: "1px solid #000",
                backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
              }}
              onClick={() => handleGetValue(info)}
            >
              <Box className="flex items-center justify-between">
                <h4>{info.title}</h4>
                <DeleteIcon
                  className="relative z-50 cursor-pointer"
                  // onClick={() => deleteNote(info.idNote)}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(info.idNote);
                  }}
                />
              </Box>

              {info.type === "checkList" || info.type === "checklist" ? (
                <>
                  <Checklist data={info.data.slice(0, 3)} />
                  {info.data.length - 3 > 0 && (
                    <div className="font-bold">
                      +{info.data.length - 3} item hidden
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="max-h-[100px] text-start overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: info.data }}
                />
              )}
            </div>
          ))
        ) : (
          <>
            <div className="w-full h-full flex items-center justify-center">
              {" "}
              <CircularProgress size={30} />
            </div>
          </>
        )}
      </div>
      {noteEdit === null ? (
        note.length === 0 ? (
          // <h3>You don't have notes to edit</h3>
          <div className="w-full h-full flex items-center justify-center">
            {" "}
            <CircularProgress size={30} />
          </div>
        ) : (
          <h3>Click any note to edit</h3>
        )
      ) : (
        <Box className="max-w mx-auto mt-3">
          <div className="flex justify-end items-center mr-3">
            <Button
              className="h-8"
              variant="contained"
              onClick={() => handleSubmit(noteEdit.idNote)}
            >
              Save
            </Button>
          </div>

          <Box className="flex flex-wrap">
            <FormControl className="w-full sm:w-1/3 mx-2 my-2">
              <TextField
                id="demo-simple-select"
                label="Type"
                value={type}
                size="small"
              />
            </FormControl>
            <TextField
              className="w-full sm:w-1/3 mx-2 my-2"
              label="Title"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormControl className="w-full sm:w-1/3 mx-2 my-2">
              <InputLabel id="demo-simple-select-color-label">
                Background-color
              </InputLabel>
              <Select
                labelId="demo-simple-select-color-label"
                id="demo-simple-select-color"
                label="Background-color"
                size="small"
                value={color}
                onChange={handleColorChange}
              >
                {allColor.map((colorOption) => (
                  <MenuItem key={colorOption.id} value={colorOption.id}>
                    <Box display="flex" alignItems="center">
                      <span
                        style={{
                          height: "20px",
                          width: "20px",
                          border: "1px solid black",
                          marginRight: "8px",
                          backgroundColor: `rgba(${colorOption.r}, ${colorOption.g}, ${colorOption.b})`,
                        }}
                      ></span>
                      {colorOption.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-full sm:w-1/3 mx-2 my-2 flex items-center flex-row">
              <InputLabel id="demo-simple-select-color-label">
                Folder
              </InputLabel>
              <Select
                style={{ width: "300px" }}
                size="small"
                // value="rtgiuy"
                value={idFolder}
                onChange={(e) => setIdFolder(e.target.value)}
              >
                {folder &&
                  folder.map((data, index) => (
                    <MenuItem key={index} value={data.id}>
                      {data.nameFolder}
                    </MenuItem>
                  ))}
                <Folder setReloadfunction={handleReload} />
              </Select>
            </FormControl>
            <TextField
              className="w-full sm:w-1/3 mx-2 my-2"
              label="Lock"
              size="small"
              type="password"
              value={lock === null ? "" : lock}
              onChange={(e) => setLock(e.target.value)}
            />
            <FormControl className="w-full sm:w-1/3 mx-2 my-2">
              <InputLabel id="demo-simple-select-color-label">
                NotePublic
              </InputLabel>
              <Select
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
            <Box className="flex items-center w-full sm:w-1/2 z-50 mx-2 my-2">
              <h6>RemindAt:</h6>{" "}
              <DatePicker
                selected={remindAt}
                onChange={(date) => setRemindAt(date)}
                showTimeSelect
                dateFormat="Pp"
              />
            </Box>
            <FormControlLabel
              className="w-full sm:w-1/2 mx-2 my-2"
              label="Pinned"
              control={
                <Checkbox
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                />
              }
            />{" "}
            <Box className="w-full">
              <h5 className="ml-2">Content</h5>
              {noteEdit.type === "text" ? (
                <div>
                  <Editor
                    apiKey="c9fpvuqin9s9m9702haau5pyi6k0t0zj29nelhczdvjdbt3y"
                    value={data}
                    init={{
                      height: "100vh",
                      menubar: true,
                      statusbar: false,
                      toolbar:
                        "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              ) : (
                <ChecklistComponent
                  checklistItems={checklistItems}
                  setChecklistItems={setChecklistItems}
                  data={noteEdit.data}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
