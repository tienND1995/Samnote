import axios from 'axios'
import configs from '../configs/configs.json'

const { API_SERVER_URL } = configs

export const fetchApiSamenote = async (
 nameMethod = 'get',
 url = '',
 data = {},
 params = {}
) => {
 const isFormData = data instanceof FormData

 if (Object.keys(params).length) {
  url = url + '?' + new URLSearchParams(params).toString()
 }

 const option = {
  method: nameMethod,
  url: `${API_SERVER_URL}${url}`,
  data,
  headers: {
   'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
  },
 }

 try {
  const response = await axios(option)
  return response.data
 } catch (error) {
  return {
   error: error.response.data.message,
   status: error.response.data.status,
  }
 }
}
