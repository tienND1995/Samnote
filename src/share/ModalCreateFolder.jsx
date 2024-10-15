import React, { useContext, useState } from 'react'

import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { fetchApiSamenote } from '../utils/fetchApiSamnote'
import { AppContext } from '../context'

const ModalCreateFolder = ({
 showModalFolder,
 setShowModalFolder,
 folderList,
 setFolderList,
}) => {
 // create folder

 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext

 const [nameFolder, setNameFolder] = useState('')

 const handleHideModalFolder = () => {
  setShowModalFolder(false)
  setNameFolder('')
 }

 const handleChangeNameFolder = (e) => setNameFolder(e.target.value)

 const handleCreateFolder = () => {
  if (nameFolder.trim() === '') return

  fetchApiSamenote('post', `/folder/${user?.id}`, { nameFolder }).then(
   (response) => {
    setSnackbar({
     isOpen: true,
     message: 'Create folder success',
     severity: 'success',
    })

    setNameFolder('')

    fetchApiSamenote('get', `/folder/${user?.id}`).then((data) =>
     setFolderList(data.folder)
    )
   }
  )
 }

 const handleDeleteFolder = (id) => {
  Swal.fire({
   title: 'Are you sure?',
   text: "You won't be able to revert this!",
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
   if (result.isConfirmed) {
    fetchApiSamenote('delete', `/changefolder/${id}`).then((data) => {
     if (data.error)
      return Swal.fire({
       text: data.error,
       icon: 'error',
      })

     Swal.fire({
      title: 'Deleted!',
      text: 'Your folder has been deleted.',
      icon: 'success',
     })

     fetchApiSamenote('get', `/folder/${user?.id}`).then((data) =>
      setFolderList(data.folder)
     )
    })
   }
  })
 }

 return (
  <Modal
   size='sm'
   centered={true}
   show={showModalFolder}
   onHide={handleHideModalFolder}
  >
   <div className='text-white bg-[#3A3F42] rounded-lg p-4 overflow-hidden border border-white'>
    <h5 className='mb-3'>New Folder</h5>

    <div className='flex flex-col gap-3'>
     <div>
      <input
       className='form-control'
       placeholder='Untitled folder'
       type='text'
       value={nameFolder}
       onChange={handleChangeNameFolder}
      />
     </div>

     <div className='flex gap-3 justify-end '>
      <button
       onClick={handleHideModalFolder}
       className='text-white'
       type='button'
      >
       Cancel
      </button>
      <button onClick={handleCreateFolder} className='text-white' type='button'>
       Create
      </button>
     </div>
    </div>

    <ul className='flex flex-col gap-1 max-h-[33vh] mt-3 overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
     {folderList?.map(({ id, nameFolder }) => (
      <li
       key={id}
       className='flex items-center justify-between hover:bg-slate-800 ease-in duration-150 px-2'
      >
       <h5 className='capitalize text-sm'>{nameFolder}</h5>

       <button onClick={() => handleDeleteFolder(id)}>
        <DeleteForeverIcon className='text-white text-lg' />
       </button>
      </li>
     ))}
    </ul>
   </div>
  </Modal>
 )
}

export default ModalCreateFolder
