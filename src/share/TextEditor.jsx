import { useEffect, useRef } from 'react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const TextEditor = ({ setValue, value, onChangeTextEditor }) => {
 const reactQuillRef = useRef()

 useEffect(() => {
  if (!reactQuillRef?.current) return

  const textEditor = reactQuillRef.current.getEditor().getText(0, 1000)
  onChangeTextEditor(textEditor)
 }, [reactQuillRef, value])

 const modules = {
  toolbar: {
   container: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
     { list: 'ordered' },
     { list: 'bullet' },
     { indent: '-1' },
     { indent: '+1' },
    ],

    ['code-block'],
    ['clean'],
    [{ color: [] }, { background: [] }],
   ],
  },
 }

 return (
  <div className='bg-white flex flex-grow-1 rounded-[10px] overflow-hidden'>
   <ReactQuill
    ref={reactQuillRef}
    style={{
     display: 'flex',
     flexDirection: 'column',
     flexGrow: 1,
     maxWidth: '100%',
    }}
    modules={modules}
    theme='snow'
    value={value}
    onChange={(newValue) => {
     setValue('data', newValue)
     console.log('value', newValue)
    }}
    placeholder='Start writting...'
   />
  </div>
 )
}

export default TextEditor
