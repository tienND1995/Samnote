import { useRef } from 'react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const TextEditor = ({ setDataContent, onChangeTextEditor, value }) => {
 const reactQuillRef = useRef()

 const modules = {
  toolbar: {
   container: [
    // [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [
     { list: 'ordered' },
     { list: 'bullet' },
     // { list: 'check' },
     // { indent: '-1' },
     // { indent: '+1' },
    ],

    //['code-block'],

    ['clean'],
    //[{ color: [] }, { background: [] }],
   ],
  },
 }

 return (
  <div className='bg-white flex flex-grow-1 overflow-hidden'>
   <ReactQuill
    ref={reactQuillRef}
    style={{
     display: 'flex',
     flexDirection: 'column',
     flexGrow: 1,
     maxWidth: '100%',
     minHeight: '300px',
    }}
    modules={modules}
    theme='snow'
    value={value}
    onChange={(newValue) => {
     setDataContent((prev) => ({ ...prev, content: newValue }))
     const textEditor = reactQuillRef.current?.getEditor().getText(0, 1000)
     onChangeTextEditor(textEditor)

    }}
    placeholder='Start writting...'
   />
  </div>
 )
}

export default TextEditor
