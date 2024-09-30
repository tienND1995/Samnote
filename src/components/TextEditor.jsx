import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const TextEditor = ({ setValue, value }) => {
 const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  //   ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  //   [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  //   [{ font: [] }],
  //   [{ align: [] }],

  ['clean'], // remove formatting button
 ]

 const modules = {
  toolbar: toolbarOptions,
 }

 return (
  <div className='bg-white flex flex-grow-1 rounded-[10px] overflow-hidden'>
   <ReactQuill
    style={{
     display: 'flex',
     flexDirection: 'column',
     flexGrow: 1,
     maxWidth: '100%',
    }}
    modules={modules}
    theme='snow'
    value={value}
    onChange={(newValue) => setValue('data', newValue)}
    placeholder='Style writting...'
   />
  </div>
 )
}

export default TextEditor
