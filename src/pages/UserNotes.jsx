import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function UserNotes() {
  const [content, setContent] = useState(null);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };
  const handleExport = () => {
    // Ví dụ: Xuất ra console
    console.log(content);
    // Hoặc bạn có thể xử lý lưu vào file hay gửi lên server tại đây
  };

  return (
    <div className="App">
      <button onClick={handleExport}>Xuất dữ liệu</button>
      <Editor
        apiKey="c9fpvuqin9s9m9702haau5pyi6k0t0zj29nelhczdvjdbt3y" // Nhập API key nếu có, nếu không có có thể để là "no-api-key"
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          height: "100vh",
          menubar: true,
          statusbar: false,
          // plugins: [
          //   "advlist autolink lists link image charmap print preview anchor",
          //   "searchreplace visualblocks code fullscreen",
          //   "insertdatetime media table paste code help wordcount",
          // ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat ",
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
