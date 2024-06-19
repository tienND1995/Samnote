// import { useState } from "react";
// import { Stage, Layer, Rect, Line } from "react-konva";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";

// // import svg2pxImage from "https://i.ibb.co/jWSf72q/hinh-nen-may-tinh-4k-1.jpg";
// // import svg4pxImage from "https://i.ibb.co/jWSf72q/hinh-nen-may-tinh-4k-1.jpg";
// // import svg8pxImage from "https://i.ibb.co/jWSf72q/hinh-nen-may-tinh-4k-1.jpg";
// // import easerImage from "https://i.ibb.co/jWSf72q/hinh-nen-may-tinh-4k-1.jpg";

// const userSketch = () => {
//   const [lines, setLines] = useState([]);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [color, setColor] = useState("black");
//   const [lineWidth, setLineWidth] = useState(2);
//   const [selectedColor, setSelectedColor] = useState("black");
//   const [isEraserActive, setIsEraserActive] = useState(false);

//   const toggleEraser = () => {
//     setIsEraserActive(!isEraserActive);
//   };

//   const handleMouseDown = (event) => {
//     setIsDrawing(true);
//     const { offsetX, offsetY } = event.target.getStage().getPointerPosition();
//     setLines([
//       ...lines,
//       {
//         points: [offsetX, offsetY],
//         color: isEraserActive ? "white" : color,
//         width: isEraserActive ? 10 : lineWidth,
//       },
//     ]);
//   };

//   const handleUndo = () => {
//     setLines(lines.slice(0, -1));
//   };

//   const handleMouseMove = (event) => {
//     if (!isDrawing) return;

//     const stage = event.target.getStage();
//     const point = stage.getPointerPosition();
//     let lastLine = lines[lines.length - 1];

//     if (lastLine) {
//       if (!lastLine.points) {
//         lastLine.points = [];
//       }
//       lastLine.points = lastLine.points.concat([point.x, point.y]);
//       setLines([...lines.slice(0, lines.length - 1), lastLine]);
//     }
//   };

//   const handleSaveAndExport = () => {
//     console.log(lines);
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//   };

//   const handleColorChange = (newColor) => {
//     setColor(newColor);
//     setSelectedColor(newColor);
//   };

//   const handleWidthChange = (newValue) => {
//     setLineWidth(newValue);
//   };

//   const boardWidth = window.innerWidth - 267;
//   const boardHeight = 550;

//   return (
//     <Box sx={{}}>
//       {" "}
//       <div style={{ position: "relative" }}>
//         <Box
//           className="list-button"
//           sx={{
//             width: "fit-content",
//             height: "fit-content",
//             padding: "0 40px",
//             borderRadius: "40px",
//             zIndex: "20",
//             backgroundColor: "#999",
//             bottom: "50px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             position: "absolute",
//             display: "flex",
//             color: "text.main",
//             flexDirection: "row",
//             justifyContent: "space-evenly",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <button
//               className="color-button"
//               style={{
//                 backgroundColor: "#0000FF",
//                 width: "20px",
//                 height: "20px",
//                 margin: "5px",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 border:
//                   selectedColor === "#0000FF"
//                     ? "3px solid #fff"
//                     : "0.5px solid #fff",
//               }}
//               onClick={() => handleColorChange("#0000FF")}
//             />
//             <button
//               className="color-button"
//               style={{
//                 backgroundColor: "#FF0000",
//                 width: "20px",
//                 height: "20px",
//                 margin: "5px",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 border:
//                   selectedColor === "#FF0000"
//                     ? "3px solid #fff"
//                     : "0.5px solid #fff",
//               }}
//               onClick={() => handleColorChange("#FF0000")}
//             />
//             <button
//               className="color-button"
//               style={{
//                 backgroundColor: "#800080",
//                 width: "20px",
//                 height: "20px",
//                 margin: "5px",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 border:
//                   selectedColor === "#800080"
//                     ? "3px solid #fff"
//                     : "0.5px solid #fff",
//               }}
//               onClick={() => handleColorChange("#800080")}
//             />
//             <button
//               className="color-button"
//               style={{
//                 backgroundColor: "#FFFF00",
//                 width: "20px",
//                 height: "20px",
//                 margin: "5px",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 border:
//                   selectedColor === "#FFFF00"
//                     ? "3px solid #fff"
//                     : "0.5px solid #fff",
//               }}
//               onClick={() => handleColorChange("#FFFF00")}
//             />
//             <button
//               className="color-button"
//               style={{
//                 backgroundColor: "#000000",
//                 width: "20px",
//                 height: "20px",
//                 margin: "5px",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 border:
//                   selectedColor === "#000000"
//                     ? "3px solid #fff"
//                     : "0.5px solid #fff",
//               }}
//               onClick={() => handleColorChange("#000000")}
//             />
//           </div>
//           <div
//             style={{
//               marginLeft: "20px",
//               display: "flex",
//               alignItems: "center",
//               height: "80px",
//             }}
//           >
//             <button
//               style={{
//                 margin: "0",
//                 padding: "0px",
//                 cursor: "pointer",
//                 border: "none",
//                 transform: lineWidth === 2 ? "scale(1.1)" : "scale(0.8)",
//               }}
//               onClick={() => handleWidthChange(2)}
//             >
//               2px
//             </button>
//             <button
//               style={{
//                 margin: "0 10px",
//                 padding: "0px",
//                 cursor: "pointer",
//                 border: "none",
//                 transform: lineWidth === 4 ? "scale(1.3)" : "scale(1)",
//               }}
//               onClick={() => handleWidthChange(4)}
//             >
//               4px
//             </button>{" "}
//             <button
//               style={{
//                 margin: "0",
//                 padding: "0px",
//                 cursor: "pointer",
//                 border: "none",
//                 transform: lineWidth === 8 ? "scale(1.3)" : "scale(1)",
//               }}
//               onClick={() => handleWidthChange(8)}
//             >
//               8px
//             </button>{" "}
//           </div>
//           <div
//             style={{
//               marginLeft: "20px",
//               whiteSpace: "nowrap",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//             }}
//           >
//             <Button variant="outlined" onClick={handleUndo}>
//               undo
//             </Button>
//           </div>
//           <div
//             style={{
//               marginLeft: "20px",
//               whiteSpace: "nowrap",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "flex-end",
//             }}
//           >
//             <Button variant="contained" onClick={handleSaveAndExport}>
//               save
//             </Button>
//           </div>
//         </Box>
//         <div
//           style={{
//             width: boardWidth,
//             height: boardHeight,
//             overflow: "hidden",
//           }}
//         >
//           <Stage
//             width={boardWidth}
//             height={boardHeight}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//           >
//             <Layer>
//               <Rect width={boardWidth} height={boardHeight} fill="white" />
//               {lines.map((line, i) => (
//                 <Line
//                   key={i}
//                   points={line.points}
//                   stroke={line.color}
//                   strokeWidth={line.width}
//                   tension={0.5}
//                   lineCap="round"
//                 />
//               ))}
//             </Layer>
//           </Stage>
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default userSketch;
import { useState, useContext } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import { Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import { SketchPicker } from "react-color";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import api from "../api";
import axios from "axios";
import DatePicker from "react-datepicker";
import { AppContext } from "../context";

const userSketch = () => {
  const appContext = useContext(AppContext);
  const { user, setSnackbar } = appContext;
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(2);
  const [selectedColor, setSelectedColor] = useState("black");
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState(null);

  const [colorNote, setColorNote] = useState({
    r: "255",
    g: "255",
    b: "255",
    a: "1",
  });
  const outputDate = format(new Date(remindAt), "yyyy/M/d HH:mm:ss");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const toggleEraser = () => {
    setIsEraserActive(!isEraserActive);
  };

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        points: [offsetX, offsetY],
        color: isEraserActive ? "white" : color,
        width: isEraserActive ? 10 : lineWidth,
      },
    ]);
  };

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;

    const stage = event.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    if (lastLine) {
      if (!lastLine.points) {
        lastLine.points = [];
      }
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      setLines([...lines.slice(0, lines.length - 1), lastLine]);
    }
  };

  // const handleSaveAndExport = async () => {
  //   const screenshotElement = document.getElementById("screenshot");
  //   if (screenshotElement) {
  //     try {
  //       setSnackbar({
  //         isOpen: true,
  //         message: "Loading...",
  //         severity: "warning",
  //       });
  //       // Chụp ảnh màn hình của phần tử HTML
  //       const canvas = await html2canvas(screenshotElement);
  //       const imageData = canvas.toDataURL("image/png").split(",")[1]; // Lấy dữ liệu ảnh dạng base64

  //       // Tạo đối tượng FormData và thêm dữ liệu ảnh vào
  //       const formData = new FormData();
  //       formData.append("image", imageData);

  //       // Tải ảnh lên ImgBB
  //       const apiKey = "0165c1b60ac134636927900246669e17";
  //       const response = await fetch(
  //         `https://api.imgbb.com/1/upload?key=${apiKey}`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );

  //       const data = await response.json();

  //       // Kiểm tra và log ra đường dẫn của ảnh
  //       if (data.data?.url) {
  //         console.log("Link ảnh:", data.data.url);
  //         const parsedColor = {
  //           r: parseInt(colorNote.r),
  //           g: parseInt(colorNote.g),
  //           b: parseInt(colorNote.b),
  //           a: parseInt(colorNote.a),
  //         };

  //         const payload = {
  //           type: "image",
  //           image_note: data.data.url,
  //           title,
  //           color: parsedColor,
  //           remind: outputDate ? outputDate : null,
  //           linkNoteShare: "",
  //         };
  //         console.log("payload", payload);
  //         try {
  //           await api.post(`/new-note-image/${user.id}`, payload);
  //           setSnackbar({
  //             isOpen: true,
  //             message: "Created new note successfully",
  //             severity: "success",
  //           });
  //         } catch (err) {
  //           console.error(err);
  //           const errorMessage = err.response?.data?.message;
  //           setSnackbar({
  //             isOpen: true,
  //             message: "Failed to create note",
  //             severity: "error",
  //           });
  //         }
  //       } else {
  //         setSnackbar({
  //           isOpen: true,
  //           message: "Failed to upload image",
  //           severity: "error",
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       setSnackbar({
  //         isOpen: true,
  //         message: "Error:" + error,
  //         severity: "error",
  //       });
  //     }
  //   } else {
  //     console.error("Element with id 'screenshot' not found.");
  //     setSnackbar({
  //       isOpen: true,
  //       message: "Note not found.",
  //       severity: "error",
  //     });
  //   }
  // };

  const handleSaveAndExport = async () => {
    const screenshotElement = document.getElementById("screenshot");
    if (screenshotElement) {
      try {
        // Chụp ảnh màn hình của phần tử HTML
        const canvas = await html2canvas(screenshotElement);
        const imageData = canvas.toDataURL("image/png").split(",")[1];
        const formDataimage = new FormData();
        formDataimage.append(imageData);
        console.log("imageData", imageData);
        // Example of processing the colorNote
        const parsedColor = {
          r: parseInt(colorNote.r),
          g: parseInt(colorNote.g),
          b: parseInt(colorNote.b),
          a: parseInt(colorNote.a),
        };

        const payload = {
          type: "image",
          image_note: formDataimage,
          title,
          color: parsedColor,
          remind: outputDate ? outputDate : null,
          linkNoteShare: "",
        };
        console.log("payload", payload);

        // Example of posting the payload to your API
        try {
          await api.post(`/new-note-image/${user.id}`, payload);
          setSnackbar({
            isOpen: true,
            message: "Created new note successfully",
            severity: "success",
          });
        } catch (err) {
          console.error(err);
          const errorMessage =
            err.response?.data?.message || "Failed to create note";
          setSnackbar({
            isOpen: true,
            message: errorMessage,
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setSnackbar({
          isOpen: true,
          message: "Error: " + error,
          severity: "error",
        });
      }
    } else {
      console.error("Element with id 'screenshot' not found.");
      setSnackbar({
        isOpen: true,
        message: "Note not found.",
        severity: "error",
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setSelectedColor(newColor);
  };

  const handleWidthChange = (newValue) => {
    setLineWidth(newValue);
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColorNote(color.rgb);
  };

  const boardWidth = window.innerWidth - 267;
  const boardHeight = 500;

  return (
    <Box sx={{}}>
      <div
        style={{ borderBottom: "1px solid black" }}
        className="flex flex-wrap"
      >
        {" "}
        <TextField
          className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
          label="Title"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          className="w-full md:w-1/3 lg:w-1/4 xl:w-1/4 mx-4 my-2"
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
              border: "0.1px solid black",
              marginLeft: "5px",
              borderRadius: "2px",
              background: ` rgba(${colorNote.r}, ${colorNote.g}, ${colorNote.b}, ${colorNote.a})`,
            }}
          />
        </div>
        {displayColorPicker ? (
          <div
            style={{
              position: "absolute",
              right: "45%",

              top: "50px",
              zIndex: "50",
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
        <Box className="flex items-center w-full md:w-1/3 lg:w-1/4 xl:w-1/4 z-50 mx-4 my-2">
          <h6>RemindAt:</h6>{" "}
          <DatePicker
            selected={remindAt}
            onChange={(date) => setRemindAt(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </Box>
      </div>
      {/* <div style={{ position: "relative" }}>
        <Box
          className="list-button"
          sx={{
            width: "fit-content",
            height: "fit-content",
            padding: "0 40px",
            borderRadius: "40px",
            zIndex: "20",
            backgroundColor: "#999",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            position: "absolute",
            display: "flex",
            color: "text.main",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className="color-button"
              style={{
                backgroundColor: "#0000FF",
                width: "20px",
                height: "20px",
                margin: "5px",
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  selectedColor === "#0000FF"
                    ? "3px solid #fff"
                    : "0.5px solid #fff",
              }}
              onClick={() => handleColorChange("#0000FF")}
            />
            <button
              className="color-button"
              style={{
                backgroundColor: "#FF0000",
                width: "20px",
                height: "20px",
                margin: "5px",
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  selectedColor === "#FF0000"
                    ? "3px solid #fff"
                    : "0.5px solid #fff",
              }}
              onClick={() => handleColorChange("#FF0000")}
            />
            <button
              className="color-button"
              style={{
                backgroundColor: "#800080",
                width: "20px",
                height: "20px",
                margin: "5px",
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  selectedColor === "#800080"
                    ? "3px solid #fff"
                    : "0.5px solid #fff",
              }}
              onClick={() => handleColorChange("#800080")}
            />
            <button
              className="color-button"
              style={{
                backgroundColor: "#FFFF00",
                width: "20px",
                height: "20px",
                margin: "5px",
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  selectedColor === "#FFFF00"
                    ? "3px solid #fff"
                    : "0.5px solid #fff",
              }}
              onClick={() => handleColorChange("#FFFF00")}
            />
            <button
              className="color-button"
              style={{
                backgroundColor: "#000000",
                width: "20px",
                height: "20px",
                margin: "5px",
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  selectedColor === "#000000"
                    ? "3px solid #fff"
                    : "0.5px solid #fff",
              }}
              onClick={() => handleColorChange("#000000")}
            />
          </div>
          <div
            style={{
              marginLeft: "20px",
              display: "flex",
              alignItems: "center",
              height: "80px",
            }}
          >
            <button
              style={{
                margin: "0",
                padding: "0px",
                cursor: "pointer",
                border: "none",
                transform: lineWidth === 2 ? "scale(1.1)" : "scale(0.8)",
              }}
              onClick={() => handleWidthChange(2)}
            >
              2px
            </button>
            <button
              style={{
                margin: "0 10px",
                padding: "0px",
                cursor: "pointer",
                border: "none",
                transform: lineWidth === 4 ? "scale(1.3)" : "scale(1)",
              }}
              onClick={() => handleWidthChange(4)}
            >
              4px
            </button>{" "}
            <button
              style={{
                margin: "0",
                padding: "0px",
                cursor: "pointer",
                border: "none",
                transform: lineWidth === 8 ? "scale(1.3)" : "scale(1)",
              }}
              onClick={() => handleWidthChange(8)}
            >
              8px
            </button>{" "}
          </div>
          <div
            style={{
              marginLeft: "20px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={handleUndo}>
              undo
            </Button>
          </div>
          <div
            style={{
              marginLeft: "20px",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="contained" onClick={handleSaveAndExport}>
              save
            </Button>
          </div>
        </Box>
        <div
          id="screenshot"
          style={{
            width: boardWidth,
            height: boardHeight,
            overflow: "hidden",
          }}
        >
          <Stage
            width={boardWidth}
            height={boardHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              <Rect width={boardWidth} height={boardHeight} fill="white" />
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.width}
                  tension={0.5}
                  lineCap="round"
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div> */}
      <div>
        <div
          id="screenshot"
          style={{
            width: boardWidth,
            borderBottom: "1px solid black",
            height: boardHeight,
            overflow: "hidden",
          }}
        >
          <Stage
            width={boardWidth}
            height={boardHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              <Rect width={boardWidth} height={boardHeight} fill="white" />
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.width}
                  tension={0.5}
                  lineCap="round"
                />
              ))}
            </Layer>
          </Stage>
        </div>{" "}
        <div className="flex items-center justify-center py-2">
          {" "}
          <Box
            className="list-button"
            sx={{
              width: "fit-content",
              height: "fit-content",
              padding: "0 40px",
              borderRadius: "40px",
              zIndex: "20",
              backgroundColor: "#999",
              display: "flex",
              color: "text.main",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="color-button"
                style={{
                  backgroundColor: "#0000FF",
                  width: "20px",
                  height: "20px",
                  margin: "5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    selectedColor === "#0000FF"
                      ? "3px solid #fff"
                      : "0.5px solid #fff",
                }}
                onClick={() => handleColorChange("#0000FF")}
              />
              <button
                className="color-button"
                style={{
                  backgroundColor: "#FF0000",
                  width: "20px",
                  height: "20px",
                  margin: "5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    selectedColor === "#FF0000"
                      ? "3px solid #fff"
                      : "0.5px solid #fff",
                }}
                onClick={() => handleColorChange("#FF0000")}
              />
              <button
                className="color-button"
                style={{
                  backgroundColor: "#800080",
                  width: "20px",
                  height: "20px",
                  margin: "5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    selectedColor === "#800080"
                      ? "3px solid #fff"
                      : "0.5px solid #fff",
                }}
                onClick={() => handleColorChange("#800080")}
              />
              <button
                className="color-button"
                style={{
                  backgroundColor: "#FFFF00",
                  width: "20px",
                  height: "20px",
                  margin: "5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    selectedColor === "#FFFF00"
                      ? "3px solid #fff"
                      : "0.5px solid #fff",
                }}
                onClick={() => handleColorChange("#FFFF00")}
              />
              <button
                className="color-button"
                style={{
                  backgroundColor: "#000000",
                  width: "20px",
                  height: "20px",
                  margin: "5px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border:
                    selectedColor === "#000000"
                      ? "3px solid #fff"
                      : "0.5px solid #fff",
                }}
                onClick={() => handleColorChange("#000000")}
              />
            </div>
            <div
              style={{
                marginLeft: "20px",
                display: "flex",
                alignItems: "center",
                height: "80px",
              }}
            >
              <button
                style={{
                  margin: "0",
                  padding: "0px",
                  cursor: "pointer",
                  border: "none",
                  transform: lineWidth === 2 ? "scale(1.1)" : "scale(0.8)",
                }}
                onClick={() => handleWidthChange(2)}
              >
                2px
              </button>
              <button
                style={{
                  margin: "0 10px",
                  padding: "0px",
                  cursor: "pointer",
                  border: "none",
                  transform: lineWidth === 4 ? "scale(1.3)" : "scale(1)",
                }}
                onClick={() => handleWidthChange(4)}
              >
                4px
              </button>{" "}
              <button
                style={{
                  margin: "0",
                  padding: "0px",
                  cursor: "pointer",
                  border: "none",
                  transform: lineWidth === 8 ? "scale(1.3)" : "scale(1)",
                }}
                onClick={() => handleWidthChange(8)}
              >
                8px
              </button>{" "}
            </div>
            <div
              style={{
                marginLeft: "20px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outlined" onClick={handleUndo}>
                undo
              </Button>
            </div>
            <div
              style={{
                marginLeft: "20px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" onClick={handleSaveAndExport}>
                save
              </Button>
            </div>
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default userSketch;
