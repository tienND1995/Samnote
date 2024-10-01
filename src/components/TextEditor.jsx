import { useCallback, useEffect, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import ResizeModule from '@botom/quill-resize-module'

import { uploadImage } from '../utils/share'

Quill.register('modules/resize', ResizeModule)

const TextEditor = ({ setValue, value }) => {
 const reactQuillRef = useRef()

 const [content, setContent] = useState('')
 const [linkImage, setLinkImage] = useState('')
 const [widthImage, setWidthImage] = useState(null)

 useEffect(() => {
  // * set width text content
  const contentElement = document.body.querySelector(
   '.ql-container.ql-snow > .ql-editor'
  )
  contentElement.style.inlineSize = `${contentElement.offsetWidth}px`
 }, [])

 useEffect(() => {
  if (!value) return

  setContent(value)
 }, [value])

 useEffect(() => {
  if (widthImage === null && linkImage !== '') {
   const imageStringRemove = `<img src="${linkImage}"`
   const newContent = content.replaceAll(imageStringRemove, '')

   setValue('data', newContent)

   return
  }

  if (widthImage && linkImage !== '') {
   const imageStringWidth = `<img src="${linkImage}" width="${widthImage}"`
   const newContent = content.replaceAll(imageStringWidth, '')

   setValue('data', newContent)

   return
  }

  setValue('data', content)
 }, [linkImage, content, widthImage])

 useEffect(() => {
  const imageSize = document.querySelector('.showSize')
  if (!imageSize) {
   setWidthImage(null)
   return
  }

  const imageWidth = imageSize?.textContent.split(',')[0]
  setWidthImage(imageWidth)
 }, [content])

 const imageHandler = useCallback(async () => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = () => {
   if (input !== null && input.files !== null) {
    const file = input.files[0]

    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
     const quill = reactQuillRef.current
     const newLinkImage = await uploadImage(127, 1346, file)
     setLinkImage(newLinkImage)

     if (quill && newLinkImage) {
      const range = quill.getEditorSelection()

      range && quill.getEditor().insertEmbed(range.index, 'image', newLinkImage)
     }
    }
   }
  }
 }, [])

 const modules = {
  resize: {
   locale: {
    // change them depending on your language
    altTip: 'Hold down the alt key to zoom',
    floatLeft: 'Left',
    floatRight: 'Right',
    center: 'Center',
    restore: 'Restore',
   },

   showSize: true,
  },

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
    ['image'],
   ],

   handlers: {
    image: imageHandler,
   },
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
    value={content}
    onChange={(newValue) => {
     setContent(newValue)
    }}
    //  setValue('data', newValue)
    placeholder='Start writting...'
   />
  </div>
 )
}

export default TextEditor
