import axios from 'axios'

export const fetchNotsList = async (userID) => {
 try {
  const response = await axios.get(
   `https://samnote.mangasocial.online/notes/${userID}`
  )
  return response.data.notes
 } catch (error) {
  console.error(error)
 }
}

export const fetchAllFolder = async (userID) => {
 try {
  const response = await axios.get(
   `https://samnote.mangasocial.online/folder/${userID}`
  )

  return response.data.folder
 } catch (error) {
  console.error(error)
 }
}
