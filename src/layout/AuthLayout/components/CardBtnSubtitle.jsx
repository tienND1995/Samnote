import React from 'react'
import { NavLink } from 'react-router-dom'

const CardBtnSubtitle = ({ name, link }) => {
 return (
  <div className='bg-[#0E0F131C] cursor-pointer hover:bg-[#090c141c] ease-linear duration-200 h-[46px] rounded-lg flex'>
   <NavLink
    className='text-decoration-none font-Mulish text-[#08174E] flex w-full h-full justify-center items-center'
    to={link}
   >
    {name}
   </NavLink>
  </div>
 )
}

export default CardBtnSubtitle
