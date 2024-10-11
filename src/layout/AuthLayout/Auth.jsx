import { Box, Button, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'

const Auth = ({ onShowModal }) => {
 return (
  <Box className='flex flex-col gap-12 top-0 left-0 w-full h-full  justify-center items-center text-center'>
   <Box className='flex items-center gap-4'>
    <img
     src='/public/logo.png'
     alt=''
     className='lg:w-[100px] lg:h-[92px] md:w-[80px] md:h-[70px] w-[60px] h-[50px]'
    />

    <Typography className='uppercase font-bold text-white lg:text-[70px] md:text-[50px] text-[30px]'>
     samnotes
    </Typography>
   </Box>
   <Typography className='text-2xl lg:text-4xl md:text-3xl text-white'>
    A place to store and share your ideas. Anytime, anywhere.
   </Typography>
   <Box className='flex gap-3 justify-center md:flex-row flex-col'>
    <NavLink to='/auth/register'>
     <Button
      onClick={() => onShowModal()}
      variant='contained'
      className='w-[200px] h-[50px] bg-[#5BE260] text-[20px] font-black  text-black rounded-[30px]'
     >
      Get Started
     </Button>
    </NavLink>

    <NavLink to='/auth/signin'>
     <Button
      onClick={() => onShowModal()}
      variant='contained'
      className='w-[200px] h-[50px] font-black text-[20px] bg-[#DADADA] text-black rounded-[30px]'
     >
      login
     </Button>
    </NavLink>
   </Box>
  </Box>
 )
}

export default Auth
