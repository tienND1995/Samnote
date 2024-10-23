import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import { AppContext } from '../../context'

const EditNoteLayout = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [totalNote, setTotalNote] = useState(0)

 useEffect(() => {
  user?.id &&
   fetchApiSamenote('get', `/notes/${user?.id}`).then((result) =>
    setTotalNote(result.notes.length)
   )
 }, [user?.id])
 
 return (
  <div className='bg-[#181A1B] relative p-lg-4 p-2 gap-lg-4 gap-3 flex flex-col w-full overflow-y-auto style-scrollbar-y style-scrollbar-y-md'>
   <div className='flex justify-center items-start gap-2 xl:gap-3'>
    <div>
     <svg
      width='50'
      height='45'
      className='xl:size-[50px] md:size-[40px] size-[30px]'
      viewBox='0 0 50 45'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
     >
      <path
       d='M0 28.125V22.5H19.4444V28.125H0ZM0 16.875V11.25H30.5555V16.875H0ZM0 5.625V0H30.5555V5.625H0ZM25 45V36.3516L40.3472 20.8828C40.7639 20.4609 41.2268 20.1563 41.7361 19.9688C42.2453 19.7813 42.7546 19.6875 43.2639 19.6875C43.8194 19.6875 44.3518 19.7934 44.8611 20.0053C45.3703 20.2172 45.8333 20.5331 46.25 20.9531L48.8194 23.5547C49.1898 23.9766 49.4796 24.4453 49.6889 24.9609C49.8981 25.4766 50.0018 25.9922 50 26.5078C49.9981 27.0234 49.9055 27.5513 49.7222 28.0912C49.5389 28.6313 49.2379 29.1112 48.8194 29.5312L33.5416 45H25ZM43.2639 29.25L45.8333 26.5078L43.2639 23.9062L40.625 26.5781L43.2639 29.25Z'
       fill='#F8F8F8'
      />
     </svg>
    </div>

    <h5 className='text-xl md:text-2xl xl:text-3xl text-white'>
     Edit Note({totalNote})
    </h5>
   </div>

   <Outlet />
  </div>
 )
}

export default EditNoteLayout
