import React, { useEffect, useState } from 'react'
import './Demo.css'

import io from 'socket.io-client'
const Demo = () => {
 const [socket, setSocket] = useState(null)
 const [type, setType] = useState('all')
 useEffect(() => {
  const socketIo = io('https://samnote.mangasocial.online')
  socketIo.on('connect', () => {
   console.log('connect')
   setSocket(socketIo)
  })
 }, [])

 useEffect(() => {
  if (!socket) return

  socket.on('send_message', () => {
   console.log('send_message')
   console.log('type socket', type)
  })
 }, [socket])

 useEffect(() => {
  console.log(type)
 }, [type])

 const sendMsg = async () => {
  const room = '77#127'
  socket.emit('join_room', { room })

  const data = {
   idSend: '127',
   idReceive: '77',
   type: 'text',
   state: '',
   content: 'test',
  }

  socket.emit('send_message', {
   room,
   data,
  })
 }

 return (
  <div className='container-fluid'>
   <button
    className='btn btn-primary'
    onClick={() => {
     setType('unread')
    }}
   >
    set type
   </button>

   <button className='btn btn-success' onClick={sendMsg}>
    send message
   </button>
   <form action=''>
    <div className='form'>
     <div>
      <div>
       <label>Type</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Lock</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Backgroud</label>

       <input type='text' className='form-control' />
      </div>
     </div>

     <div>
      <div>
       <label>Type</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Lock</label>

       <input type='text' className='form-control' />
      </div>
      <div>
       <label>Backgroud</label>

       <input type='text' className='form-control' />
      </div>
     </div>

     <div>
      <div className='flex flex-col h-full justify-between'>
       <div>
        <label>Type</label>
        <input type='date' className='form-control' />
       </div>

       <div>
        <button type='submit' className='btn btn-primary'>
         save
        </button>
       </div>
      </div>
     </div>
    </div>
   </form>
  </div>
 )
}

export default Demo
