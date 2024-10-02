import axios from 'axios'

import configs from '../../configs/configs.json'

const { API_SERVER_URL } = configs

export const fetchNoteList = async (userID) => {
 try {
  const response = await axios.get(`${API_SERVER_URL}/notes/${userID}`)
  return response.data.notes
 } catch (error) {
  console.error(error)
 }
}

export const fetchAllFolder = async (userID) => {
 try {
  const response = await axios.get(`${API_SERVER_URL}/folder/${userID}`)

  return response.data.folder
 } catch (error) {
  console.error(error)
 }
}

export const postImages = async (formData, setAlert) => {
 try {
  const response = await axios.post(
   `${API_SERVER_URL}/add_image_note`,
   formData
  )

  setAlert({
   isOpen: true,
   message: `Add images complete`,
   severity: 'success',
  })

  return response.data
 } catch (error) {
  console.error(error)
  setAlert({
   isOpen: true,
   message: error.message,
   severity: 'error',
  })
 }
}
