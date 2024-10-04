import axios from 'axios'
import Swal from 'sweetalert2'

export const confirmDelete = (nameItem, idItem, callApiFn) => {
 return Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
 }).then((result) => {
  if (result.isConfirmed) {
   callApiFn(idItem)

   Swal.fire({
    title: 'Deleted!',
    text: `Your ${nameItem} has been deleted.`,
    icon: 'success',
   })
  }
 })
}

export const uploadImage = async (userID, noteID, imageFile) => {
 if (!userID || !noteID || !imageFile) return
 const data = new FormData()

 data.append('id_user', userID)
 data.append('id_note', noteID)
 data.append('image_note', imageFile)

 try {
  const response = await axios.post(
   `https://samnote.mangasocial.online/add_image_note`,
   data
  )

  const imageList = response.data.data.list_image

  return imageList[imageList.length - 1].link
 } catch (error) {
  console.error(error)
 }
}
