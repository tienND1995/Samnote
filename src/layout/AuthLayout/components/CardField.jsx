import { useState } from 'react'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const CardField = ({
 Icon,
 type,
 placeholder,
 register,
 registerName,
 errors,
}) => {
 const [isTypePassword, setIsTypePassword] = useState(true)

 return (
  <div>
   <div className='bg-white h-[60px] rounded-xl p-3 flex items-center relative'>
    <div
     style={{ borderRight: '1px solid #DBE3FF' }}
     className='pe-2 h-max me-2'
    >
     <Icon />
    </div>

    <input
     className='text-[#3B3B3B] w-full'
     placeholder={placeholder}
     type={type === 'password' && isTypePassword ? type : 'text'}
     {...register(registerName)}
    />

    {type === 'password' && (
     <button type='button' onClick={() => setIsTypePassword((prev) => !prev)}>
      {!isTypePassword ? (
       <VisibilityIcon />
      ) : (
       <VisibilityOffIcon className='text-gray-400' />
      )}
     </button>
    )}
   </div>

   {errors[registerName] && (
    <span className='text-red-700 text-sm font-Mulish'>
     {errors[registerName].message}
    </span>
   )}
  </div>
 )
}

export default CardField
