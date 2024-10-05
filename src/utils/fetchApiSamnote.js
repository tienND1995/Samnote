import axios from 'axios'
import configs from '../configs/configs.json'

const { API_SERVER_URL } = configs

export const fetchApiSamenote = async (nameMethod = 'get', url = '', data = {}) => {
 const response = await axios({
  method: nameMethod,
  url: `${API_SERVER_URL}${url}`,
  data,
 })

 return response.data
}
