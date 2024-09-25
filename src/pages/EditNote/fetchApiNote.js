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
