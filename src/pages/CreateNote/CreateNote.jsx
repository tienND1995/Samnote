import React, { useEffect } from 'react'

import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

const CreateNote = () => {
 useEffect(() => {
  fetchApiSamenote('get', '/notes/127').then((data) => {
   console.log(data)
  })
 }, [])
 return <div>CreateNote</div>
}

export default CreateNote
