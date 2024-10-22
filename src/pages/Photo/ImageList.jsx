import { useChecklist } from 'react-checklist'
import Swal from 'sweetalert2'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import DeleteIcon from '@mui/icons-material/Delete'

const ImageList = ({ photoList, imagesCheckList, onGetPhotoList, userID }) => {
 const { handleCheck, isCheckedAll, checkedItems, setCheckedItems } =
  useChecklist(imagesCheckList, {
   key: 'id_images',
   keyType: 'number',
  })

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
     data.append('id_user', userID)
     data.append('id_images', id_images)
     data.append('id_note', idNote)

     fetchApiSamenote('delete', '/profile/delete_image_profile', data).then(
      (response) => {
       if (index === imagesDelete.length - 1) {
        onGetPhotoList()
        setCheckedItems(new Set())
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

 const slectedImages = [...checkedItems]

 if (photoList.length < 1) return <h3>No photos available !</h3>

 return (
  <>
   <div className='flex justify-end gap-3 my-2 my-md-3 '>
    <div>
     <input
      id='checked-list'
      onChange={handleCheck}
      checked={isCheckedAll}
      type='checkbox'
      hidden
     />
     <label
      className='text-white md:text-3xl sm:text-3xl text-lg bg-[#1876D2] rounded-lg px-2 py-1 cursor-pointer ease-in duration-200 hover:bg-blue-600 '
      htmlFor='checked-list'
     >
      {isCheckedAll ? 'Cancel' : 'Select All'}
     </label>
    </div>

    <div>
     <button
      disabled={slectedImages.length < 1}
      onClick={handleDeleteImages}
      className={`flex items-center text-white sm:text-2xl md:text-3xl text-lg bg-[#ff0000] rounded-lg px-2 py-1 ease-in duration-200 ${
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
     <time className='md:text-3xl xl:text-4xl text-2xl font-bold'>{time}</time>
     <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
      {image?.map(({ image, id_images }) => (
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
 )
}

export default ImageList
