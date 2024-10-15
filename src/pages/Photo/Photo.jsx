import { useContext, useEffect, useState, useMemo } from 'react'

import { AppContext } from '../../context'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import PhotoIcon from '@mui/icons-material/Photo'
import ImageList from './ImageList'
import Demo from './Demo'

// const Photo = () => {
//  const appContext = useContext(AppContext)
//  const { user } = appContext

//  const [photoList, setPhotoList] = useState([])
//  const [imagesCheckList, setImagesCheckList] = useState([])

//  const fetchPhotoList = () => {
//   fetchApiSamenote('get', `/profile/image_history/${user.id}`).then((data) => {
//    setPhotoList(data)

//    // convert photo list to images check list
//    let newImageList = []
//    data.forEach((item) => {
//     newImageList = [...newImageList, ...item.image]
//    })

//    setImagesCheckList(newImageList)
//   })
//  }

//  useEffect(() => {
//   if (!user?.id) return

//   fetchPhotoList()
//  }, [user])

//  const [count, setCount] = useState(0)

//  return (
//   <div className='bg-[#181A1B] text-white w-full overflow-y-auto py-3 px-5'>
//    <div className='flex gap-2 justify-center items-center'>
//     <PhotoIcon className='text-5xl' />

//     <button
//      className='btn btn-primary'
//      onClick={() => setCount((prev) => ++prev)}
//     >
//      increase
//     </button>

//     <h3>Count: {count}</h3>

//     <h5 className='text-3xl'>All Photo({imagesCheckList.length})</h5>
//    </div>

//    <ImageList
//     photoList={photoList}
//     imagesCheckList={imagesCheckList}
//     onGetPhotoList={fetchPhotoList}
//     userID={user?.id}
//    />
//   </div>
//  )
// }

// export default Photo

const Photo = () => {
 const [count, setCount] = useState(0)
 const [name, setName] = useState('dang tien')

 const handleIncrease = () => setCount((count) => ++count)

 const changeName = () => {
  return setTimeout(() => {
   setName('mai hang')

   console.log('name', name)
  }, 3000)
 }

 useMemo(() => {
  changeName()
 }, [])

 return (
  <div>
   <h1>Count: {count}</h1>

   <button className='btn btn-primary' onClick={handleIncrease}>
    click increase
   </button>

   <h3>Name: {name}</h3>
  </div>
 )
}

export default Photo
