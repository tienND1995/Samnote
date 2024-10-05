import { useContext, useEffect, useState } from 'react'

import { AppContext } from '../../context'

import DeleteIcon from '@mui/icons-material/Delete'
import PhotoIcon from '@mui/icons-material/Photo'

import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import uniqid from 'uniqid'

const Photo = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext

 const [photoList, setPhotoList] = useState([])
 const [imagesSlected, setImagesSlected] = useState([])

 useEffect(() => {
  if (!user?.id) return

  fetchApiSamenote('get', `/profile/image_history/${user.id}`).then((data) =>
   setPhotoList(data)
  )
 }, [user])


 console.log(photoList)

 const handleClickSelected = () => {}

 return (
  <div className='bg-[#181A1B] text-white w-full overflow-y-auto py-3 px-5'>
   <div className='flex gap-2 justify-center items-center'>
    <PhotoIcon className='text-5xl' />

    <h5 className='text-3xl'>All Photo(16)</h5>
   </div>

   <div className='flex justify-end gap-3'>
    <div>
     <button className='text-white text-3xl bg-[#1876D2] rounded-lg px-2 py-1'>
      Select All
     </button>
    </div>

    <div>
     <button className='flex items-center text-white text-3xl bg-[#ff0000] rounded-lg px-2 py-1'>
      Delete <DeleteIcon className='text-3xl' />
     </button>
    </div>
   </div>

   {photoList?.map(({ image, time }) => (
    <div key={time}>
     <time className='text-4xl  font-bold'>{time}</time>
     <ul className='row row-cols-2 row-cols-lg-3'>
      {image?.map(({ image, idNote, type }) => (
       <li className='col p-3' key={uniqid()} onClick={handleClickSelected}>
        <img
         className='w-full aspect-[3/2] object-cover rounded-xl cursor-pointer'
         src={image}
         alt='img upload'
        />
       </li>
      ))}
     </ul>
    </div>
   ))}
  </div>
 )
}

export default Photo
