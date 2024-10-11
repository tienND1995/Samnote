import React from 'react'

const CardBtnSubmit = ({ name }) => {
 return (
  <div>
   <button
    style={{ boxShadow: '0px 6px 18px 0px #9CADF2' }}
    type='submit'
    className='h-[60px] border-none outline-none rounded-lg btn w-full font-Mulish font-bold bg-[#5BE260] hover:bg-[#24dd2a] ease-linear duration-200'
   >
    {name}
   </button>
  </div>
 )
}

export default CardBtnSubmit
