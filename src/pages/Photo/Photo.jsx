import { useContext, useEffect, useState } from 'react'

import { AppContext } from '../../context'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import DeleteIcon from '@mui/icons-material/Delete'
import PhotoIcon from '@mui/icons-material/Photo'

import { useChecklist } from 'react-checklist'
import Swal from 'sweetalert2'

const Photo = () => {
 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext

 const [photoList, setPhotoList] = useState([])
 const [imagesCheckList, setImagesCheckList] = useState([])

 const { handleCheck, isCheckedAll, checkedItems, setCheckedItems } =
  useChecklist(imagesCheckList, {
   key: 'id_images',
   keyType: 'number',
  })

 const fetchPhotoList = () => {
  fetchApiSamenote('get', `/profile/image_history/${user.id}`).then((data) => {
   setPhotoList(data)

   // convert photo list to images check list
   let newImageList = []
   data.forEach((item) => {
    newImageList = [...newImageList, ...item.image]
   })

   setImagesCheckList(newImageList)
  })
 }

 useEffect(() => {
  if (!user?.id) return

  fetchPhotoList()
 }, [user])

 const slectedImages = [...checkedItems]

 const handleDeleteImages = () => {
  const imagesDelete = imagesCheckList.filter((item) =>
   slectedImages.some((id) => item.id_images === id)
  )

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
    imagesDelete.forEach(({ id_images, idNote }, index) => {
     const data = new FormData()
     data.append('id_user', user?.id)
     data.append('id_images', id_images)
     data.append('id_note', idNote)

     fetchApiSamenote('delete', '/profile/delete_image_profile', data).then(
      (response) => {
       if (index === imagesDelete.length - 1) {
        fetchPhotoList()
        setCheckedItems(new Set())

        setSnackbar({
         isOpen: true,
         message: `Delete images success!`,
         severity: 'success',
        })
       }
      }
     )
    })
    Swal.fire({
     title: 'Deleted!',
     text: 'Your image has been deleted.',
     icon: 'success',
    })
   }
  })
 }

 return (
  <div className='bg-[#181A1B] text-white w-full overflow-y-auto py-3 px-5'>
   <div className='flex gap-2 justify-center items-center'>
    <PhotoIcon className='text-5xl' />

    <h5 className='text-3xl'>All Photo({photoList.length})</h5>
   </div>

   {photoList.length > 1 ? (
    <>
     <div className='flex justify-end gap-3'>
      <div>
       <input
        id='checked-list'
        onChange={handleCheck}
        checked={isCheckedAll}
        type='checkbox'
        hidden
       />
       <label
        className='text-white text-3xl bg-[#1876D2] rounded-lg px-2 py-1 cursor-pointer ease-in duration-200 hover:bg-blue-600 '
        htmlFor='checked-list'
       >
        {isCheckedAll ? 'Cancel' : 'Select All'}
       </label>
      </div>

      <div>
       <button
        disabled={slectedImages.length < 1}
        onClick={handleDeleteImages}
        className={`flex items-center text-white text-3xl bg-[#ff0000] rounded-lg px-2 py-1 ease-in duration-200 ${
         slectedImages.length < 1
          ? 'opacity-50 cursor-auto'
          : 'opacity-100 cursor-pointer'
        }`}
       >
        Delete <DeleteIcon className='text-3xl' />
       </button>
      </div>
     </div>

     {photoList?.map(({ image, time }) => (
      <div key={time} className='mb-5'>
       <time className='text-4xl  font-bold'>{time}</time>
       <ul className='grid grid-cols-3 gap-3'>
        {image?.map(({ image, id_images, type, idNote }) => (
         <li
          className='relative rounded-lg overflow-hidden cursor-pointer border border-white'
          key={id_images}
         >
          <img
           className='w-full aspect-[3/2] object-cover'
           src={image}
           alt='img upload'
          />

          <div className='absolute top-2 right-2'>
           <input
            className='w-[20px] h-[20px]'
            type='checkbox'
            data-key={id_images}
            onChange={handleCheck}
            checked={checkedItems.has(id_images)}
           />
          </div>
         </li>
        ))}
       </ul>
      </div>
     ))}
    </>
   ) : (
    <h3>No photos available !</h3>
   )}
  </div>
 )
}

export default Photo
