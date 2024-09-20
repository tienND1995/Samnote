import React, { useEffect, useState } from 'react'
import './Demo.css'

import io from 'socket.io-client'
const Demo = () => {
 const demo = {
  "a": 0.99,
  "b": 255,
  "r": 255,
  "g": 255,
  
  "idOwner": 127,

  "createAt": '2024-09-20 05:40:11',
  "describe": 'Bắc Ninh quê tôi',
  
  "members": [{"gmail": "linhclon1@gmail.com", "id": 79, "role": 'member'}],
  "name": 'Hội lim',
  
 }
 return (
  <div className='container-fluid flex'>
   <div className='w-[200px] bg-blue-400'>sidebar</div>

   <div className='w-full bg-orange-200 flex flex-grow-1'>
    <div className='col-3 bg-red-500'>content1</div>
    <div className='col-9 bg-pink-500'>content2</div>
   </div>
  </div>
 )
}

export default Demo
