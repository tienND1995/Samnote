import { useContext, useEffect, useState } from 'react'

import { AppContext } from '../../context'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import PhotoIcon from '@mui/icons-material/Photo'
import ImageList from './ImageList'

const Photo = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext

 const [photoList, setPhotoList] = useState([])
 const [imagesCheckList, setImagesCheckList] = useState([])

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

 return (
  <div className='bg-[#181A1B] text-white w-full overflow-y-auto py-1 px-3 py-md-3 px-md-5'>
   <div className='flex gap-2 justify-center items-center'>
    <PhotoIcon className='text-5xl' />

    <h5 className='text-3xl'>All Photo({imagesCheckList.length})</h5>
   </div>

   <ImageList
    photoList={photoList}
    imagesCheckList={imagesCheckList}
    onGetPhotoList={fetchPhotoList}
    userID={user?.id}
   />
  </div>
 )
}

export default Photo
