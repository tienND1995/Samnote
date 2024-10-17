import { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'

const ChecklistNote = ({ checklist, setChecklist }) => {
 const [value, setValue] = useState('')

 console.log('checklist', checklist)

 const handleChangeValue = (e) => setValue(e.target.value)
 const handleDeleteItem = (index) => {
  setChecklist((prev) => prev?.filter((_v, idx) => idx !== index))
 }

 const handleAdd = (e) => {
  if (value.trim() === '') return

  const item = {
   content: value,
   status: false,
  }

  setChecklist([...checklist, item])
  setValue('')
 }

 const handleChecked = (e, index) => {
  setChecklist(
   checklist.map((_v, idx) =>
    idx === index ? { ..._v, status: e.target.checked } : _v
   )
  )
 }

 return (
  <div className='bg-white flex flex-col flex-grow-1 min-h-[300px]'>
   <div
    style={{ boxShadow: '0px 8px 10px 0px #00000026' }}
    className='flex justify-center items-end p-md-3 gap-md-5 p-1 py-2 gap-sm-3 gap-1'
   >
    <div>
     <input
      style={{ borderBottom: '1px solid gray' }}
      type='text'
      className='px-2'
      placeholder='Enter content...'
      onChange={handleChangeValue}
      value={value}
     />
    </div>

    <button
     onClick={handleAdd}
     type='button'
     className='btn btn-primary sm:text-sm text-[10px]'
    >
     ADD
    </button>
   </div>

   <ul className='p-[30px]'>
    {checklist?.map(({ content, status }, index) => (
     <li key={content}>
      <input
       onChange={(e) => handleChecked(e, index)}
       checked={status}
       type='checkbox'
      />
      <span className='ms-2'>{content}</span>
      <span className='ms-3'>
       <a onClick={() => handleDeleteItem(index)} href='#'>
        <CloseIcon className='text-sm text-red-500' />
       </a>
      </span>
     </li>
    ))}
   </ul>
  </div>
 )
}

export default ChecklistNote
